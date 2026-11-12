// JS port of the bedrock_fusion Python SDK: family-specific, sticky, cache-aware
// routing for Claude 5.5 (Bedrock Converse) and GPT-6 (Responses on bedrock-runtime),
// plus mock Bedrock clients that mimic the request/response shapes for offline demos.

export const EFFORTS = ['none', 'low', 'medium', 'high', 'xhigh', 'max'];

const price = (input, cacheWrite, cacheRead, output, assumed = false) => ({ input, cacheWrite, cacheRead, output, assumed });
const tier = (name, rank, modelId, label, efforts, defaultEffort, cacheTtlS, p) =>
  Object.freeze({ name, rank, modelId, label, efforts, defaultEffort, cacheTtlS, price: p });

// Claude 5.5 prices are not on the Bedrock model cards; these are placeholders for the demo.
export const CLAUDE_TIERS = Object.freeze([
  tier('small', 0, 'global.anthropic.claude-haiku-5-5', 'Haiku 5.5', EFFORTS.slice(1), 'medium', 300, price(1, 1.25, 0.1, 5, true)),
  tier('medium', 1, 'global.anthropic.claude-sonnet-5-5', 'Sonnet 5.5', EFFORTS.slice(1), 'high', 300, price(3, 3.75, 0.3, 15, true)),
  tier('large', 2, 'global.anthropic.claude-opus-5-5', 'Opus 5.5', EFFORTS.slice(1), 'medium', 300, price(5, 6.25, 0.5, 25, true)),
]);

export const GPT_TIERS = Object.freeze([
  tier('small', 0, 'global.openai.gpt-6-luna', 'GPT-6 Luna', EFFORTS, 'medium', 1800, price(0.1, 0.125, 0.01, 0.5)),
  tier('medium', 1, 'global.openai.gpt-6.1-terra', 'GPT-6.1 Terra', EFFORTS, 'medium', 1800, price(1, 1.25, 0.05, 5)),
  tier('large', 2, 'us.openai.gpt-6.1-sol', 'GPT-6.1 Sol', EFFORTS, 'medium', 1800, price(2.2, 2.75, 0.11, 11)),
  tier('xlarge', 3, 'global.openai.gpt-6-astra', 'GPT-6 Astra', EFFORTS, 'medium', 1800, price(10, 12.5, 1, 50)),
]);

export const clampTier = (tiers, rank) => tiers[Math.max(0, Math.min(rank, tiers.length - 1))];

// ---------------------------------------------------------------- decisions

export const decision = (rank, effort, reason, source) => ({ rank, effort, reason, source });

export const wfFloor = (wf) => Math.max(0, ...(wf?.steps || []).map((s) => s.minTier || 0));
export const wfNeedsReasoning = (wf) => (wf?.steps || []).some((s) => s.kind === 'plan' || s.risk === 'high');
export function wfPrompt(wf) {
  const lines = [`Workflow: ${wf.name}`, wf.description || ''];
  for (const s of wf.steps || []) {
    lines.push(`- ${s.name} [${s.kind || 'observe'}, risk=${s.risk || 'low'}, min_tier=${s.minTier || 0}] ${s.description || ''}`.trim());
  }
  return lines.filter(Boolean).join('\n');
}

export const HARD = /(분석|비교|설계|전략|검토|추론|계획|원인|왜|증명|리서치|보고서|analy[sz]e|compare|design|strategy|plan|root cause|why|prove|research|report)/i;
const SIMPLE = /(요약|번역|추출|분류|변환|포맷|맞춤법|summari[sz]e|translate|extract|classify|convert|format)/i;
const LOW_EFFORTS = ['low', 'medium', 'high'];

/** Workflow constraints are floors set by the agent owner; deciders only raise them. */
export function applyWorkflow(d, wf, maxRank) {
  if (!wf) return d;
  let { rank, effort } = d;
  const notes = [];
  if (wf.defaultTier != null && d.source === 'heuristic' && rank < wf.defaultTier) { rank = wf.defaultTier; notes.push(`workflow default ${wf.defaultTier}`); }
  const floor = wfFloor(wf);
  if (floor > rank) { rank = floor; notes.push(`workflow floor ${floor}`); }
  if (wfNeedsReasoning(wf) && LOW_EFFORTS.indexOf(LOW_EFFORTS.includes(effort) ? effort : 'medium') < 1) { effort = 'medium'; notes.push('workflow needs reasoning'); }
  if (!notes.length) return d;
  return decision(Math.max(0, Math.min(rank, maxRank)), effort, [d.reason, ...notes].join('; '), d.source);
}

export class HeuristicDecider {
  decide(req, maxRank) { return applyWorkflow(this._decide(req, maxRank), req.workflow, maxRank); }

  _decide(req, maxRank) {
    if (req.hint === 'fast' || req.hint === 'cheap') return decision(0, 'low', 'hint', 'heuristic');
    if (req.hint === 'best' || req.hint === 'deep') return decision(maxRank, 'high', 'hint', 'heuristic');
    let score = 0;
    const reasons = [];
    const text = req.text || '';
    if (HARD.test(text)) { score += 2; reasons.push('reasoning keywords'); }
    if (SIMPLE.test(text) && score === 0) { score -= 1; reasons.push('transform task'); }
    if (text.length > 4000) { score += 1; reasons.push('long instruction'); }
    if ((req.toolCount || 0) >= 8) { score += 1; reasons.push('many tools'); }
    if ((req.contextTokens || 0) > 200000) { score += 1; reasons.push('large context'); }
    if (score <= 0) return decision(0, 'low', reasons.join(', ') || 'short/simple', 'heuristic');
    if (score <= 2) return decision(Math.min(1, maxRank), 'medium', reasons.join(', '), 'heuristic');
    return decision(Math.min(2, maxRank), 'high', reasons.join(', '), 'heuristic');
  }
}

export const LLM_PROMPT = `You route requests for a general-purpose assistant.
Pick the cheapest tier that will very likely solve the whole task, including
every workflow step listed, without escalation.
Tiers: {tiers}. Efforts: low, medium, high.
Reply with JSON only: {"tier": <int>, "effort": "<effort>", "reason": "<short>"}`;

/** Asks a cheap model (GPT-6 Luna / Claude Haiku 5.5) to classify. `complete(system, user)` may be async. */
export class LLMDecider {
  constructor(complete, tierNames, { fallback = new HeuristicDecider(), maxChars = 6000 } = {}) {
    Object.assign(this, { complete, tierNames, fallback, maxChars, last: null });
  }

  async decide(req, maxRank) {
    const tiers = this.tierNames.map((n, i) => `${i}=${n}`).join(', ');
    const system = LLM_PROMPT.replace('{tiers}', tiers);
    let user = (req.text || '').slice(0, this.maxChars);
    if (req.workflow) user = `${wfPrompt(req.workflow)}\n\nFirst user request:\n${user}`;
    this.last = { system, user, raw: null };
    try {
      const raw = await this.complete(system, user);
      this.last.raw = raw;
      const data = JSON.parse(raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1));
      const rank = Math.max(0, Math.min(parseInt(data.tier, 10), maxRank));
      if (Number.isNaN(rank)) throw new Error('bad tier');
      const effort = LOW_EFFORTS.includes(data.effort) ? data.effort : 'medium';
      return applyWorkflow(decision(rank, effort, String(data.reason || '').slice(0, 200), 'llm'), req.workflow, maxRank);
    } catch {
      return this.fallback.decide(req, maxRank);
    }
  }
}

/** Slot for a managed routing/decision endpoint (not yet on Bedrock). `call(req)` -> [rank, effort, reason]. */
export class ExternalDecider {
  constructor(call, { fallback = new HeuristicDecider() } = {}) { Object.assign(this, { call, fallback }); }

  async decide(req, maxRank) {
    try {
      const [rank, effort, reason] = await this.call(req);
      return applyWorkflow(decision(Math.max(0, Math.min(rank, maxRank)), effort, reason, 'external'), req.workflow, maxRank);
    } catch {
      return this.fallback.decide(req, maxRank);
    }
  }
}

/** Baseline: always the same tier, no workflow floor. */
export class FixedDecider {
  constructor(rank, effort = 'medium') { Object.assign(this, { rank, effort }); }
  decide(req, maxRank) { return decision(Math.min(this.rank, maxRank), this.effort, 'fixed', 'fixed'); }
}

// ---------------------------------------------------------------- session

export const emptyUsage = () => ({ input: 0, cacheRead: 0, cacheWrite: 0, output: 0 });

export function costOf(p, u) {
  if (!p) return null;
  return (u.input * p.input + u.cacheWrite * p.cacheWrite + u.cacheRead * p.cacheRead + u.output * p.output) / 1e6;
}

/**
 * Prompt caches and Claude thinking blocks are bound to a single model, so a session pins one
 * tier per task and only changes it at the start of a task once the cache is cold, or upward on
 * escalation (refusal, repeated tool failures).
 */
export class RoutedSession {
  constructor(tiers, { decider = new HeuristicDecider(), maxRank = null, allowWarmDowngrade = false,
    clock = () => Date.now() / 1000, workflow = null, failuresToEscalate = 2 } = {}) {
    Object.assign(this, { tiers, decider, allowWarmDowngrade, clock, workflow, failuresToEscalate });
    this.maxRank = maxRank == null ? tiers.length - 1 : maxRank;
    this.state = { tier: null, effort: 'medium', lastCall: 0, usageByModel: {}, history: [], calls: [] };
    this._failures = 0;
  }

  get tier() {
    if (!this.state.tier) throw new Error('no task started; call newTask() first');
    return this.state.tier;
  }

  cacheWarm() {
    const st = this.state;
    return st.tier != null && this.clock() - st.lastCall < st.tier.cacheTtlS;
  }

  async newTask(req) {
    this._failures = 0;
    if (!req.workflow && this.workflow) req = { ...req, workflow: this.workflow };
    let d = await this.decider.decide(req, this.maxRank);
    const cur = this.state.tier;
    if (cur && this.cacheWarm() && d.rank < cur.rank && !this.allowWarmDowngrade) {
      d = decision(cur.rank, d.effort, `kept ${cur.name}: cache warm (${d.reason})`, d.source);
    }
    this._pin(clampTier(this.tiers, d.rank), d.effort, d.reason, d.source);
    return d;
  }

  /** One lever at a time: move up a tier keeping effort; only at the top tier raise effort. */
  escalate(reason, effort = null) {
    const cur = this.tier;
    if (cur.rank >= this.maxRank) {
      const target = effort || 'high';
      if (this.state.effort !== target) { this._pin(cur, target, reason, 'escalate'); return true; }
      return false;
    }
    this._pin(clampTier(this.tiers, cur.rank + 1), effort || this.state.effort, reason, 'escalate');
    return true;
  }

  /** Runtime signal: consecutive tool failures escalate one tier. Returns true if escalated. */
  observeToolResult(ok, detail = '') {
    if (ok) { this._failures = 0; return false; }
    this._failures += 1;
    if (this._failures < this.failuresToEscalate) return false;
    this._failures = 0;
    return this.escalate(`${this.failuresToEscalate} consecutive tool failures ${detail}`.trim());
  }

  record(tier, usage, request, response) {
    const st = this.state;
    st.lastCall = this.clock();
    const acc = (st.usageByModel[tier.modelId] ||= emptyUsage());
    for (const k of Object.keys(acc)) acc[k] += usage[k];
    const routes = st.history.slice(st.calls.length ? st.calls[st.calls.length - 1].historyLen : 0);
    st.calls.push({ at: st.lastCall, tier, effort: st.effort, usage, cost: costOf(tier.price, usage), request, response, routes, historyLen: st.history.length });
  }

  estimatedCost() {
    let total = 0;
    for (const [id, u] of Object.entries(this.state.usageByModel)) {
      const c = costOf(this.tiers.find((t) => t.modelId === id)?.price, u);
      if (c == null) return null;
      total += c;
    }
    return total;
  }

  _pin(tier, effort, reason, source) {
    if (!tier.efforts.includes(effort)) effort = tier.defaultEffort;
    this.state.tier = tier;
    this.state.effort = effort;
    this.state.history.push({ at: this.clock(), modelId: tier.modelId, rank: tier.rank, effort, reason, source });
  }
}

// ---------------------------------------------------------------- Claude / Converse

const clone = (v) => (v === undefined ? v : JSON.parse(JSON.stringify(v)));
const cachePoint = (ttl) => ({ cachePoint: ttl ? { type: 'default', ttl } : { type: 'default' } });

/** tools -> system -> last message, the order Bedrock evaluates them in. */
export function addCachePoints(req, ttl = null) {
  const out = clone(req);
  const tools = out.toolConfig?.tools;
  if (tools?.length && !('cachePoint' in tools[tools.length - 1])) tools.push(cachePoint(ttl));
  const sys = out.system;
  if (sys?.length && !('cachePoint' in sys[sys.length - 1])) sys.push(cachePoint(ttl));
  const msgs = out.messages || [];
  if (msgs.length) {
    const content = (msgs[msgs.length - 1].content ||= []);
    if (!content.length || !('cachePoint' in content[content.length - 1])) content.push(cachePoint(ttl));
  }
  return out;
}

const textOf = (messages = []) => {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'user') return (messages[i].content || []).filter((b) => 'text' in b).map((b) => b.text).join('\n');
  }
  return '';
};

const claudeToolStatuses = (messages = []) => {
  const last = messages[messages.length - 1];
  if (!last || last.role !== 'user') return [];
  return (last.content || []).filter((b) => b.toolResult).map((b) => b.toolResult.status || 'success');
};

const claudeRefusal = (resp) => (resp.stopReason === 'content_filtered' ? 'refusal' : null);

export class ClaudeSession extends RoutedSession {
  /** client: anything with async converse(req), e.g. { converse: (r) => sdk.send(new ConverseCommand(r)) } */
  constructor(client, { cacheTtl = null, escalateOn = claudeRefusal, ...kw } = {}) {
    super(CLAUDE_TIERS, kw);
    Object.assign(this, { client, cacheTtl, escalateOn });
  }

  async converse(req, { newTask = false, hint = null, workflow = null } = {}) {
    const msgs = req.messages || [];
    if (newTask || !this.state.tier) {
      await this.newTask({ text: textOf(msgs), toolCount: (req.toolConfig?.tools || []).length, hint, workflow });
    } else {
      for (const status of claudeToolStatuses(msgs)) this.observeToolResult(status !== 'error');
    }
    let resp = await this._call(req);
    const reason = this.escalateOn(resp);
    if (reason && this.escalate(reason)) resp = await this._call(req);
    return resp;
  }

  async _call(req) {
    const tier = this.tier;
    const r = addCachePoints(req, this.cacheTtl);
    r.modelId = tier.modelId;
    const extra = (r.additionalModelRequestFields ||= {});
    extra.thinking ||= { type: 'adaptive' };
    (extra.output_config ||= {}).effort = this.state.effort;
    const resp = await this.client.converse(r);
    const u = resp.usage || {};
    this.record(tier, { input: u.inputTokens || 0, cacheRead: u.cacheReadInputTokens || 0, cacheWrite: u.cacheWriteInputTokens || 0, output: u.outputTokens || 0 }, r, resp);
    (resp.$metadata ||= {}).fusion = { modelId: tier.modelId, effort: this.state.effort };
    return resp;
  }
}

// ---------------------------------------------------------------- GPT / Responses

/** Explicit breakpoint after the leading system/developer messages (stable shared prefix). */
export function markStablePrefix(input) {
  if (!Array.isArray(input)) return input;
  const items = clone(input);
  let lastStable = null;
  for (const it of items) {
    if (it.role === 'system' || it.role === 'developer') lastStable = it; else break;
  }
  if (lastStable) {
    if (typeof lastStable.content === 'string') lastStable.content = [{ type: 'input_text', text: lastStable.content }];
    const texts = (lastStable.content || []).filter((b) => b.type === 'input_text');
    if (texts.length) texts[texts.length - 1].prompt_cache_breakpoint = { mode: 'explicit' };
  }
  return items;
}

const userTextOf = (input) => {
  if (typeof input === 'string') return input;
  for (let i = (input || []).length - 1; i >= 0; i--) {
    const it = input[i];
    if (it.role === 'user') return typeof it.content === 'string' ? it.content : (it.content || []).map((b) => b.text || '').join('\n');
  }
  return '';
};

/** Trailing function_call_output items whose JSON output carries an `error` key count as failures. */
const gptToolStatuses = (input) => {
  if (!Array.isArray(input)) return [];
  const out = [];
  for (let i = input.length - 1; i >= 0 && input[i].type === 'function_call_output'; i--) {
    let err = false;
    try { const o = JSON.parse(input[i].output); err = !!(o && typeof o === 'object' && 'error' in o); } catch { err = /^error\b/i.test(String(input[i].output)); }
    out.unshift(err ? 'error' : 'success');
  }
  return out;
};

const gptUsage = (resp) => {
  const u = resp.usage || {};
  const d = u.input_tokens_details || {};
  const cached = d.cached_tokens || 0;
  const written = d.cache_write_tokens || 0;
  return { input: Math.max((u.input_tokens || 0) - cached - written, 0), cacheRead: cached, cacheWrite: written, output: u.output_tokens || 0 };
};

const gptRefusal = (resp) => (Array.isArray(resp.output) && resp.output.some((it) => (it.content || []).some((c) => c.type === 'refusal')) ? 'refusal' : null);

export class GPTSession extends RoutedSession {
  /** client: an OpenAI JS SDK client with baseURL https://bedrock-runtime.<region>.amazonaws.com/openai/v1 */
  constructor(client, { store = false, cacheTtl = '30m', escalateOn = gptRefusal, ...kw } = {}) {
    super(GPT_TIERS, kw);
    Object.assign(this, { client, store, cacheTtl, escalateOn });
  }

  async create(req, { newTask = false, hint = null, workflow = null } = {}) {
    if (newTask || !this.state.tier) {
      await this.newTask({ text: userTextOf(req.input), toolCount: (req.tools || []).length, hint, workflow });
    } else {
      for (const status of gptToolStatuses(req.input)) this.observeToolResult(status !== 'error');
    }
    let resp = await this._call(req);
    const reason = this.escalateOn(resp);
    if (reason && this.escalate(reason)) resp = await this._call(req);
    return resp;
  }

  async _call(req) {
    const tier = this.tier;
    const r = { ...clone(req), input: markStablePrefix(req.input), model: tier.modelId };
    r.store ??= this.store;
    r.reasoning = { ...(r.reasoning || {}), effort: this.state.effort };
    r.prompt_cache_options ||= { mode: 'implicit', ttl: this.cacheTtl };
    const resp = await this.client.responses.create(r);
    this.record(tier, gptUsage(resp), r, resp);
    return resp;
  }
}

// ---------------------------------------------------------------- mock Bedrock

export const estTokens = (v) => Math.ceil((typeof v === 'string' ? v : JSON.stringify(v ?? '')).length / 3);
const hashStr = (s, h) => { for (let i = 0; i < s.length; i++) h = (Math.imul(h, 33) ^ s.charCodeAt(i)) >>> 0; return h; };
const ttlSeconds = (ttl, dflt) => {
  const m = /^(\d+)([smh])$/.exec(ttl || '');
  return m ? +m[1] * { s: 1, m: 60, h: 3600 }[m[2]] : dflt;
};

/** Per-model prefix cache: reads the longest cached prefix, writes up to the last cache point. */
export class PromptCacheSim {
  constructor() { this.byModel = new Map(); }

  apply(modelId, segments, ttlS, now) {
    if (!this.byModel.has(modelId)) this.byModel.set(modelId, new Map());
    const store = this.byModel.get(modelId);
    for (const [k, exp] of store) if (exp <= now) store.delete(k);
    let h = 5381, tok = 0, read = 0, lastPoint = 0;
    const bounds = segments.map((s) => {
      h = hashStr(s.text, h);
      tok += estTokens(s.text);
      return { key: `${h}:${tok}`, tok, point: s.point };
    });
    for (const b of bounds) {
      if (store.has(b.key)) read = Math.max(read, b.tok);
      if (b.point) lastPoint = b.tok;
    }
    for (const b of bounds) if (b.point || store.has(b.key)) store.set(b.key, now + ttlS);
    const write = Math.max(0, lastPoint - read);
    return { read, write, uncached: tok - read - write, total: tok };
  }
}

/**
 * Scripted agent model shared by both mock clients. `task.steps` lists the tools the task
 * needs in order; a model below `needs` emits a call with missing arguments, and a model below
 * `refuseBelow` refuses.
 */
export class MockModel {
  constructor(tiers) { this.tiers = tiers; this.task = null; }

  rankOf(modelId) {
    const t = this.tiers.find((x) => x.modelId === modelId);
    if (!t) throw mockError('ValidationException', `The provided model identifier is invalid: ${modelId}`);
    return t.rank;
  }

  next(rank, done) {
    const step = (this.task?.steps || []).find((s) => !done.has(s.tool));
    if (!step) return { kind: 'final' };
    if (step.refuseBelow != null && rank < step.refuseBelow) return { kind: 'refuse', step };
    return { kind: 'tool', step, valid: rank >= (step.needs || 0) };
  }

  outputTokens(kind, effort) {
    const mult = { none: 1, low: 1, medium: 1.4, high: 2, xhigh: 2.6, max: 3.2 }[effort] || 1.4;
    return Math.round((kind === 'final' ? 220 : kind === 'refuse' ? 30 : 60) * mult);
  }

  answer(task) { return task?.answer || '요청하신 작업을 처리했어요.'; }
}

function mockError(name, message) {
  const e = new Error(message);
  e.name = name;
  e.$metadata = { httpStatusCode: 400 };
  return e;
}

const stripCachePoints = (blocks) => (blocks || []).filter((b) => !('cachePoint' in b));
const hasCachePoint = (blocks) => (blocks || []).some((b) => 'cachePoint' in b);
const cachePointTtl = (req) => {
  for (const b of [...(req.system || []), ...(req.toolConfig?.tools || []), ...(req.messages || []).flatMap((m) => m.content || [])]) {
    if (b.cachePoint?.ttl) return b.cachePoint.ttl;
  }
  return null;
};

/** Mimics BedrockRuntime Converse (request/response shape of the AWS SDK). */
export class MockBedrockRuntime {
  constructor({ model, clock, cache = new PromptCacheSim() }) {
    Object.assign(this, { model, clock, cache, seq: 0 });
  }

  async converse(req) {
    validateConverse(req);
    const rank = this.model.rankOf(req.modelId);
    const effort = req.additionalModelRequestFields?.output_config?.effort || 'medium';
    const segs = [];
    const tools = req.toolConfig?.tools;
    if (tools?.length) segs.push({ text: JSON.stringify(stripCachePoints(tools)), point: hasCachePoint(tools) });
    if (req.system?.length) segs.push({ text: JSON.stringify(stripCachePoints(req.system)), point: hasCachePoint(req.system) });
    req.messages.forEach((m, i) => {
      // Changing thinking/effort invalidates cached message blocks (tools/system survive).
      const text = (i === 0 ? `effort=${effort}|` : '') + JSON.stringify({ role: m.role, content: stripCachePoints(m.content) });
      segs.push({ text, point: hasCachePoint(m.content) });
    });
    const c = this.cache.apply(req.modelId, segs, ttlSeconds(cachePointTtl(req), 300), this.clock.now);

    const act = this.model.next(rank, claudeDoneTools(req.messages));
    let content = [], stopReason = 'end_turn';
    if (act.kind === 'refuse') {
      stopReason = 'content_filtered';
    } else if (act.kind === 'tool') {
      const id = `tooluse_${(++this.seq).toString(36).padStart(6, '0')}`;
      const input = act.valid ? { query: this.model.task?.text?.slice(0, 40) || '' } : {};
      content = [{ text: `${act.step.tool} 도구를 호출할게요.` }, { toolUse: { toolUseId: id, name: act.step.tool, input } }];
      stopReason = 'tool_use';
    } else {
      content = [{ text: this.model.answer(this.model.task) }];
    }
    const out = this.model.outputTokens(act.kind, effort);
    const latencyMs = 900 + out * 6;
    this.clock.advance(latencyMs / 1000);
    return {
      $metadata: { httpStatusCode: 200, requestId: `mock-${this.seq}` },
      output: { message: { role: 'assistant', content } },
      stopReason,
      usage: { inputTokens: c.uncached, outputTokens: out, totalTokens: c.total + out, cacheReadInputTokens: c.read, cacheWriteInputTokens: c.write },
      metrics: { latencyMs },
    };
  }
}

function validateConverse(req) {
  if (!req?.modelId) throw mockError('ValidationException', 'modelId is required');
  if (!Array.isArray(req.messages) || !req.messages.length) throw mockError('ValidationException', 'messages must not be empty');
  if (req.messages[0].role !== 'user') throw mockError('ValidationException', 'A conversation must start with a user message.');
  const ids = new Set();
  req.messages.forEach((m, i) => {
    if (i && m.role === req.messages[i - 1].role) throw mockError('ValidationException', 'A conversation must alternate between user and assistant roles.');
    for (const b of m.content || []) {
      if (b.toolUse) ids.add(b.toolUse.toolUseId);
      if (b.toolResult && !ids.has(b.toolResult.toolUseId)) throw mockError('ValidationException', `toolResult ${b.toolResult.toolUseId} has no matching toolUse`);
    }
  });
}

function claudeDoneTools(messages) {
  let start = 0;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'user' && (messages[i].content || []).some((b) => 'text' in b)) { start = i; break; }
  }
  const names = {}, done = new Set();
  for (const m of messages.slice(start)) {
    for (const b of m.content || []) {
      if (b.toolUse) names[b.toolUse.toolUseId] = b.toolUse.name;
      if (b.toolResult && b.toolResult.status !== 'error') done.add(names[b.toolResult.toolUseId]);
    }
  }
  return done;
}

/** Mimics `openai.responses.create` against bedrock-runtime. */
export class MockOpenAI {
  constructor({ model, clock, cache = new PromptCacheSim() }) {
    Object.assign(this, { model, clock, cache, seq: 0 });
    this.responses = { create: (req) => this._create(req) };
  }

  async _create(req) {
    validateResponses(req);
    const rank = this.model.rankOf(req.model);
    const effort = req.reasoning?.effort || 'medium';
    const input = typeof req.input === 'string' ? [{ role: 'user', content: req.input }] : req.input;
    const segs = [];
    if (req.tools?.length) segs.push({ text: JSON.stringify(req.tools), point: false });
    if (req.instructions) segs.push({ text: req.instructions, point: false });
    const implicit = (req.prompt_cache_options?.mode || 'implicit') === 'implicit';
    input.forEach((it, i) => {
      const blocks = Array.isArray(it.content) ? it.content : [];
      const explicit = blocks.some((b) => b.prompt_cache_breakpoint);
      const text = JSON.stringify(it, (k, v) => (k === 'prompt_cache_breakpoint' ? undefined : v));
      segs.push({ text, point: explicit || (implicit && i === input.length - 1) });
    });
    const c = this.cache.apply(req.model, segs, ttlSeconds(req.prompt_cache_options?.ttl, 300), this.clock.now);

    const act = this.model.next(rank, gptDoneTools(input));
    const id = (p) => `${p}_${(++this.seq).toString(36).padStart(8, '0')}`;
    let output;
    if (act.kind === 'refuse') {
      output = [{ id: id('msg'), type: 'message', role: 'assistant', status: 'completed', content: [{ type: 'refusal', refusal: '이 요청은 도와드릴 수 없어요.' }] }];
    } else if (act.kind === 'tool') {
      const args = act.valid ? { query: this.model.task?.text?.slice(0, 40) || '' } : {};
      output = [{ id: id('fc'), type: 'function_call', call_id: id('call'), name: act.step.tool, arguments: JSON.stringify(args), status: 'completed' }];
    } else {
      output = [{ id: id('msg'), type: 'message', role: 'assistant', status: 'completed', content: [{ type: 'output_text', text: this.model.answer(this.model.task), annotations: [] }] }];
    }
    const out = this.model.outputTokens(act.kind, effort);
    this.clock.advance((700 + out * 4) / 1000);
    return {
      id: id('resp'), object: 'response', created_at: Math.floor(this.clock.now), status: 'completed', model: req.model,
      output, store: req.store ?? true,
      usage: {
        input_tokens: c.total, input_tokens_details: { cached_tokens: c.read, cache_write_tokens: c.write },
        output_tokens: out, output_tokens_details: { reasoning_tokens: Math.round(out * 0.6) }, total_tokens: c.total + out,
      },
    };
  }
}

function validateResponses(req) {
  if (!req?.model) throw mockError('BadRequestError', 'model is required');
  if (req.input == null || (Array.isArray(req.input) && !req.input.length)) throw mockError('BadRequestError', 'input is required');
  if (!Array.isArray(req.input)) return;
  const calls = new Set();
  for (const it of req.input) {
    if (it.type === 'function_call') calls.add(it.call_id);
    if (it.type === 'function_call_output' && !calls.has(it.call_id)) throw mockError('BadRequestError', `No tool call found for function call output with call_id ${it.call_id}.`);
  }
}

function gptDoneTools(input) {
  let start = 0;
  for (let i = input.length - 1; i >= 0; i--) if (input[i].role === 'user') { start = i; break; }
  const names = {}, done = new Set();
  for (const it of input.slice(start)) {
    if (it.type === 'function_call') names[it.call_id] = it.name;
    if (it.type === 'function_call_output' && gptToolStatuses([it])[0] !== 'error') done.add(names[it.call_id]);
  }
  return done;
}

/** Mock classifier standing in for Luna/Haiku: reads the workflow and the first request. */
export function mockClassifier(system, user) {
  const req = user.split('First user request:\n').pop();
  const plan = /\[plan\b/.test(user);
  const hard = HARD.test(req);
  const tier = hard ? (plan ? 2 : 1) : 0;
  const effort = hard ? 'high' : plan ? 'medium' : 'low';
  const reason = hard ? (plan ? 'hard request + planning step' : 'hard request') : 'routine request';
  return JSON.stringify({ tier, effort, reason });
}

// ---------------------------------------------------------------- agent simulator

const filler = (n, tool) => ({
  ok: true, tool,
  items: Array.from({ length: Math.max(1, Math.round(n / 60)) }, (_, i) => ({ id: `R-${1000 + i}`, note: 'record field value sample' })),
});

function execTool(name, input, sc) {
  if (!input || !input.query) return { ok: false, body: { error: 'missing required field: query' } };
  const spec = (sc.tools || []).find((t) => t.name === name);
  return { ok: true, body: filler(spec?.resultChars || 600, name) };
}

const toolSpecsClaude = (sc) => (sc.tools || []).map((t) => ({
  toolSpec: { name: t.name, description: t.description, inputSchema: { json: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] } } },
}));
const toolSpecsGpt = (sc) => (sc.tools || []).map((t) => ({
  type: 'function', name: t.name, description: t.description,
  parameters: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'], additionalProperties: false }, strict: true,
}));

export function makeDecider(kind, tiers, overhead) {
  if (kind === 'llm') {
    return new LLMDecider((system, user) => {
      overhead.calls += 1;
      overhead.input += estTokens(system) + estTokens(user);
      overhead.output += 30;
      return mockClassifier(system, user);
    }, tiers.map((t) => t.label));
  }
  return new HeuristicDecider();
}

/**
 * Runs a scripted agent conversation through the routed session against the mock clients.
 * opts: { family: 'claude'|'gpt', decider: 'heuristic'|'llm', useWorkflow, fixedRank }
 */
export async function runScenario(sc, { family = 'claude', decider = 'heuristic', useWorkflow = true, fixedRank = null } = {}) {
  const clock = { now: 0, advance(s) { this.now += s; } };
  const tiers = family === 'gpt' ? GPT_TIERS : CLAUDE_TIERS;
  const model = new MockModel(tiers);
  const overhead = { calls: 0, input: 0, output: 0 };
  const kw = {
    clock: () => clock.now,
    workflow: useWorkflow && fixedRank == null ? sc.workflow : null,
    decider: fixedRank != null ? new FixedDecider(fixedRank) : makeDecider(decider, tiers, overhead),
  };
  if (fixedRank != null) Object.assign(kw, { failuresToEscalate: Infinity, escalateOn: () => null });
  const s = family === 'gpt'
    ? new GPTSession(new MockOpenAI({ model, clock }), kw)
    : new ClaudeSession(new MockBedrockRuntime({ model, clock }), kw);

  const tasks = [];
  const messages = [];
  const input = [{ role: 'developer', content: sc.system }];
  for (const [ti, task] of sc.tasks.entries()) {
    clock.advance(task.gapBefore || 0);
    model.task = task;
    const t = { index: ti, text: task.text, gapBefore: task.gapBefore || 0, status: 'ok', firstCall: s.state.calls.length, decision: null, toolErrors: 0 };
    const histBefore = s.state.history.length;
    if (family === 'gpt') input.push({ role: 'user', content: task.text });
    else if (messages.length && messages[messages.length - 1].role === 'user') messages[messages.length - 1].content.push({ text: task.text });
    else messages.push({ role: 'user', content: [{ text: task.text }] });

    const fails = {};
    for (let guard = 0, first = true; guard < 16; guard++, first = false) {
      const opts = first ? { newTask: true, hint: task.hint || null } : {};
      let uses;
      if (family === 'gpt') {
        const resp = await s.create({ input, tools: toolSpecsGpt(sc), parallel_tool_calls: false }, opts);
        if (gptRefusal(resp)) { t.status = 'refused'; break; }
        input.push(...resp.output);
        uses = resp.output.filter((o) => o.type === 'function_call').map((o) => ({ id: o.call_id, name: o.name, input: JSON.parse(o.arguments || '{}') }));
      } else {
        const resp = await s.converse({ system: [{ text: sc.system }], messages, toolConfig: { tools: toolSpecsClaude(sc) } }, opts);
        if (resp.stopReason === 'content_filtered') { t.status = 'refused'; break; }
        messages.push(resp.output.message);
        uses = resp.output.message.content.filter((b) => b.toolUse).map((b) => ({ id: b.toolUse.toolUseId, name: b.toolUse.name, input: b.toolUse.input }));
      }
      if (first) t.decision = s.state.history[histBefore];
      if (!uses.length) break;
      const results = uses.map((u) => ({ ...u, ...execTool(u.name, u.input, sc) }));
      if (family === 'gpt') {
        for (const r of results) input.push({ type: 'function_call_output', call_id: r.id, output: JSON.stringify(r.body) });
      } else {
        messages.push({ role: 'user', content: results.map((r) => ({ toolResult: { toolUseId: r.id, content: [{ json: r.body }], status: r.ok ? 'success' : 'error' } })) });
      }
      const failed = results.find((r) => !r.ok);
      t.toolErrors += results.filter((r) => !r.ok).length;
      if (failed) {
        fails[failed.name] = (fails[failed.name] || 0) + 1;
        if (fails[failed.name] >= 3) { t.status = 'failed'; break; }
      }
    }
    t.lastCall = s.state.calls.length;
    tasks.push(t);
  }
  return { session: s, tasks, tiers, overhead, summary: summarize(s, tasks, tiers, overhead) };
}

export function summarize(s, tasks, tiers, overhead = { calls: 0, input: 0, output: 0 }) {
  const u = emptyUsage();
  for (const c of s.state.calls) for (const k of Object.keys(u)) u[k] += c.usage[k];
  const prompt = u.input + u.cacheRead + u.cacheWrite;
  const deciderCost = costOf(tiers[0].price, { input: overhead.input, cacheRead: 0, cacheWrite: 0, output: overhead.output }) || 0;
  return {
    calls: s.state.calls.length,
    cost: s.estimatedCost(),
    deciderCost,
    usage: u,
    cacheHit: prompt ? u.cacheRead / prompt : 0,
    escalations: s.state.history.filter((h) => h.source === 'escalate').length,
    toolErrors: tasks.reduce((n, t) => n + (t.toolErrors || 0), 0),
    tasksOk: tasks.filter((t) => t.status === 'ok').length,
    tasks: tasks.length,
  };
}

/** Number of tool results with error status carried by a request (Converse or Responses). */
export function requestToolErrors(req) {
  const st = req.messages ? claudeToolStatuses(req.messages) : gptToolStatuses(req.input);
  return st.filter((x) => x === 'error').length;
}

export const isRefusal = (resp) => claudeRefusal(resp) === 'refusal' || gptRefusal(resp) === 'refusal';
