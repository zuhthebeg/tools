// node --test router/fusion.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CLAUDE_TIERS, GPT_TIERS, HeuristicDecider, LLMDecider, ClaudeSession, GPTSession, MockBedrockRuntime, MockOpenAI,
  MockModel, PromptCacheSim, runScenario, wfPrompt,
} from './fusion.js';
import { SCENARIOS } from './scenarios.js';

const sc = (id) => SCENARIOS.find((s) => s.id === id);
const wf = sc('meeting-notes').workflow;

test('workflow floor lifts a simple zero-shot request', () => {
  const d = new HeuristicDecider();
  assert.equal(d.decide({ text: '공지해 줘', workflow: wf }, 2).rank, 1);
  assert.equal(d.decide({ text: '공지해 줘', workflow: sc('policy-qa').workflow }, 2).rank, 0);
});

test('LLM decider sees the workflow and cannot go below the floor', async () => {
  let seen = '';
  const d = new LLMDecider((s, u) => { seen = u; return '{"tier":0,"effort":"low","reason":"easy"}'; }, ['a', 'b', 'c']);
  const r = await d.decide({ text: 'hi', workflow: wf }, 2);
  assert.match(seen, /extract_actions \[plan, risk=low, min_tier=1\]/);
  assert.deepEqual([r.rank, r.effort, r.source], [1, 'medium', 'llm']);
  assert.equal((await new LLMDecider(() => 'nope', ['a']).decide({ text: '분석해줘' }, 2)).source, 'heuristic');
  assert.ok(wfPrompt(wf).startsWith('Workflow: meeting-notes'));
});

test('prompt cache is per model and reads the previous prefix', () => {
  const c = new PromptCacheSim();
  const segs = [{ text: 'x'.repeat(300), point: true }, { text: 'y'.repeat(30), point: true }];
  assert.equal(c.apply('m1', segs, 300, 0).read, 0);
  assert.equal(c.apply('m1', [...segs, { text: 'z', point: true }], 300, 10).read, 110);
  assert.equal(c.apply('m2', segs, 300, 20).read, 0);
  assert.equal(c.apply('m1', segs, 300, 1000).read, 0);
});

test('mock Converse validates like Bedrock', async () => {
  const clock = { now: 0, advance(s) { this.now += s; } };
  const m = new MockBedrockRuntime({ model: new MockModel(CLAUDE_TIERS), clock });
  await assert.rejects(m.converse({ modelId: 'nope', messages: [{ role: 'user', content: [{ text: 'a' }] }] }), /model identifier/);
  await assert.rejects(m.converse({ modelId: CLAUDE_TIERS[0].modelId, messages: [{ role: 'user', content: [{ toolResult: { toolUseId: 'x', content: [] } }] }] }), /no matching toolUse/);
});

test('misjudged request: tool errors escalate small -> medium and the task succeeds', async () => {
  const r = await runScenario(sc('assistant-mix'), { family: 'claude' });
  const t5 = r.tasks[4];
  assert.equal(t5.decision.rank, 0);
  assert.equal(t5.status, 'ok');
  const esc = r.session.state.history.filter((h) => h.source === 'escalate');
  assert.ok(esc.some((h) => h.modelId === 'global.anthropic.claude-sonnet-5-5'));
  assert.equal(r.tasks[3].decision.rank, 1, 'easy request with a "hard" keyword is over-routed');
});

test('without the workflow floor, the first task wastes calls on the small tier', async () => {
  const withWf = await runScenario(sc('meeting-notes'), { family: 'claude' });
  const noWf = await runScenario(sc('meeting-notes'), { family: 'claude', useWorkflow: false });
  assert.equal(noWf.tasks[0].decision.rank, 0);
  assert.ok(noWf.summary.toolErrors > withWf.summary.toolErrors);
});

test('when the floor already decides, a router is never cheaper than the fixed model', async () => {
  for (const [id, family, rank] of [['incident-report', 'claude', 2], ['meeting-notes', 'gpt', 1], ['weekly-report', 'gpt', 0]]) {
    const r = await runScenario(sc(id), { family });
    const f = await runScenario(sc(id), { family, fixedRank: rank });
    assert.equal(r.summary.tasksOk, r.summary.tasks);
    assert.ok(r.summary.cost >= f.summary.cost - 1e-12, id);
  }
  const llm = await runScenario(sc('weekly-report'), { family: 'gpt', decider: 'llm' });
  const luna = await runScenario(sc('weekly-report'), { family: 'gpt', fixedRank: 0 });
  assert.ok(llm.summary.cost + llm.summary.deciderCost > luna.summary.cost, 'decider cost makes it worse than Luna');
});

test('cold cache allows a downgrade for Claude (5m) but GPT (30m) keeps the tier', async () => {
  const c = await runScenario(sc('policy-qa'), { family: 'claude' });
  const g = await runScenario(sc('policy-qa'), { family: 'gpt' });
  assert.deepEqual(c.tasks.map((t) => t.decision.rank), [0, 1, 0]);
  assert.deepEqual(g.tasks.map((t) => t.decision.rank), [0, 1, 1]);
  assert.match(g.tasks[2].decision.reason, /cache warm/);
});

test('arbitrary switching rewrites caches, drops Claude thinking and costs more', async () => {
  const pinned = await runScenario(sc('meeting-notes'), { family: 'claude' });
  const rnd = await runScenario(sc('meeting-notes'), { family: 'claude', mode: 'random' });
  assert.equal(pinned.summary.switches, 0);
  assert.ok(rnd.summary.switches > 0 && rnd.summary.rewriteTokens > 0);
  assert.ok(rnd.summary.droppedThinking > 0 && rnd.summary.redoCalls > 0);
  assert.ok(rnd.summary.cacheHit < pinned.summary.cacheHit);
  assert.ok(rnd.summary.cost > pinned.summary.cost);
  const g = await runScenario(sc('meeting-notes'), { family: 'gpt', mode: 'random' });
  assert.equal(g.summary.droppedThinking, 0, 'GPT reasoning loss is not modelled');
});

test('per-turn routing drops to the small tier on tool-result turns and loses tasks', async () => {
  const r = await runScenario(sc('assistant-mix'), { family: 'claude', mode: 'turn' });
  assert.ok(r.session.state.history.some((h) => h.source === 'turn' && h.rank === 0));
  assert.ok(r.summary.tasksOk < r.summary.tasks);
});

test('Claude thinking blocks survive an upgrade but are dropped on a downgrade', async () => {
  const clock = { now: 0, advance(s) { this.now += s; } };
  const model = new MockModel(CLAUDE_TIERS);
  model.task = { text: 'x', steps: [{ tool: 'a' }, { tool: 'b' }] };
  const m = new MockBedrockRuntime({ model, clock });
  const msgs = [{ role: 'user', content: [{ text: 'x' }] }];
  const r1 = await m.converse({ modelId: CLAUDE_TIERS[2].modelId, messages: msgs });
  assert.ok(r1.output.message.content[0].reasoningContent);
  const use = r1.output.message.content.find((b) => b.toolUse).toolUse;
  msgs.push(r1.output.message, { role: 'user', content: [{ toolResult: { toolUseId: use.toolUseId, content: [{ json: {} }], status: 'success' } }] });
  const up = await m.converse({ modelId: CLAUDE_TIERS[2].modelId, messages: msgs });
  assert.equal(up.$mock.droppedThinkingTokens, 0);
  const down = await m.converse({ modelId: CLAUDE_TIERS[0].modelId, messages: msgs });
  assert.ok(down.$mock.droppedThinkingTokens > 0);
  assert.equal(down.$mock.redo, true);
  assert.equal(down.output.message.content.find((b) => b.toolUse).toolUse.name, 'a');
});

test('refusal escalates and retries; fixed tiers fail or cost more', async () => {
  const s0 = {
    id: 'r', system: 'sys', workflow: { name: 'r', steps: [{ name: 'search', kind: 'observe' }] },
    tools: [{ name: 'search', description: 's', resultChars: 600 }],
    tasks: [{ text: '분석해줘', steps: [{ tool: 'search', refuseBelow: 2 }] }],
  };
  const r = await runScenario(s0, { family: 'gpt' });
  assert.equal(r.summary.tasksOk, 1);
  assert.equal(r.session.state.history.at(-1).reason, 'refusal');
  const small = await runScenario(s0, { family: 'gpt', fixedRank: 0 });
  const top = await runScenario(s0, { family: 'gpt', fixedRank: 3 });
  assert.equal(small.summary.tasksOk, 0);
  assert.ok(top.summary.cost > r.summary.cost);
});

test('refusal detection handles both response shapes', async () => {
  const { isRefusal } = await import('./fusion.js');
  assert.equal(isRefusal({ output: { message: { content: [] } }, stopReason: 'content_filtered' }), true);
  assert.equal(isRefusal({ output: { message: { content: [] } }, stopReason: 'end_turn' }), false);
  assert.equal(isRefusal({ output: [{ type: 'message', content: [{ type: 'refusal', refusal: 'no' }] }] }), true);
});

test('GPT request carries Responses-native routing fields', async () => {
  const clock = { now: 0, advance(s) { this.now += s; } };
  const s = new GPTSession(new MockOpenAI({ model: new MockModel(GPT_TIERS), clock }), { clock: () => clock.now });
  await s.create({ input: [{ role: 'developer', content: 'sys' }, { role: 'user', content: '요약해줘' }] });
  const req = s.state.calls[0].request;
  assert.equal(req.model, 'global.openai.gpt-6-luna');
  assert.equal(req.store, false);
  assert.equal(req.reasoning.effort, 'low');
  assert.deepEqual(req.input[0].content[0].prompt_cache_breakpoint, { mode: 'explicit' });
  assert.equal(req.prompt_cache_options.ttl, '30m');
});

test('Claude request carries Converse-native routing fields', async () => {
  const clock = { now: 0, advance(s) { this.now += s; } };
  const s = new ClaudeSession(new MockBedrockRuntime({ model: new MockModel(CLAUDE_TIERS), clock }), { clock: () => clock.now });
  await s.converse({ system: [{ text: 'sys' }], messages: [{ role: 'user', content: [{ text: '분석해줘' }] }] });
  const req = s.state.calls[0].request;
  assert.equal(req.modelId, 'global.anthropic.claude-sonnet-5-5');
  assert.equal(req.additionalModelRequestFields.output_config.effort, 'medium');
  assert.ok(req.system.at(-1).cachePoint && req.messages[0].content.at(-1).cachePoint);
});
