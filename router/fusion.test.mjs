// node --test router/fusion.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CLAUDE_TIERS, GPT_TIERS, HeuristicDecider, LLMDecider, ClaudeSession, GPTSession, MockBedrockRuntime, MockOpenAI,
  MockModel, PromptCacheSim, runScenario, wfPrompt,
} from './fusion.js';
import { SCENARIOS } from './scenarios.js';

const sc = (id) => SCENARIOS.find((s) => s.id === id);
const wf = sc('card-dispute').workflow;

test('workflow floor lifts a simple zero-shot request', () => {
  const d = new HeuristicDecider();
  assert.equal(d.decide({ text: '접수해 주세요', workflow: wf }, 2).rank, 1);
  assert.equal(d.decide({ text: '접수해 주세요', workflow: sc('faq').workflow }, 2).rank, 0);
});

test('LLM decider sees the workflow and cannot go below the floor', async () => {
  let seen = '';
  const d = new LLMDecider((s, u) => { seen = u; return '{"tier":0,"effort":"low","reason":"easy"}'; }, ['a', 'b', 'c']);
  const r = await d.decide({ text: 'hi', workflow: wf }, 2);
  assert.match(seen, /judge_eligibility \[plan, risk=high, min_tier=1\]/);
  assert.deepEqual([r.rank, r.effort, r.source], [1, 'medium', 'llm']);
  assert.equal((await new LLMDecider(() => 'nope', ['a']).decide({ text: '분석해줘' }, 2)).source, 'heuristic');
  assert.ok(wfPrompt(wf).startsWith('Workflow: card-dispute'));
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

test('Claude: consecutive tool errors escalate medium -> large and the task succeeds', async () => {
  const r = await runScenario(sc('card-dispute'), { family: 'claude' });
  const [t1, t2] = r.tasks;
  assert.equal(t1.decision.rank, 1);
  assert.equal(t2.status, 'ok');
  const esc = r.session.state.history.filter((h) => h.source === 'escalate');
  assert.equal(esc.length, 1);
  assert.equal(esc[0].modelId, 'global.anthropic.claude-opus-5-5');
  assert.equal(r.summary.toolErrors, 2);
});

test('without the workflow floor, the first task wastes calls on the small tier', async () => {
  const withWf = await runScenario(sc('card-dispute'), { family: 'claude' });
  const noWf = await runScenario(sc('card-dispute'), { family: 'claude', useWorkflow: false });
  assert.equal(noWf.tasks[0].decision.rank, 0);
  assert.ok(noWf.summary.toolErrors > withWf.summary.toolErrors);
});

test('LLM decider anticipates the hard follow-up and avoids failed calls', async () => {
  const r = await runScenario(sc('card-dispute'), { family: 'gpt', decider: 'llm' });
  assert.equal(r.tasks[1].decision.rank, 2);
  assert.equal(r.summary.toolErrors, 0);
  assert.ok(r.summary.deciderCost > 0);
});

test('cold cache allows a downgrade for Claude (5m) but GPT (30m) keeps the tier', async () => {
  const c = await runScenario(sc('faq'), { family: 'claude' });
  const g = await runScenario(sc('faq'), { family: 'gpt' });
  assert.deepEqual(c.tasks.map((t) => t.decision.rank), [0, 1, 0]);
  assert.deepEqual(g.tasks.map((t) => t.decision.rank), [0, 1, 1]);
  assert.match(g.tasks[2].decision.reason, /cache warm/);
});

test('refusal escalates and retries; fixed tiers fail or cost more', async () => {
  const r = await runScenario(sc('loan-review'), { family: 'gpt' });
  assert.equal(r.summary.tasksOk, 2);
  assert.equal(r.session.state.history.at(-1).reason, 'refusal');
  const small = await runScenario(sc('loan-review'), { family: 'gpt', fixedRank: 0 });
  const top = await runScenario(sc('loan-review'), { family: 'gpt', fixedRank: 3 });
  assert.ok(small.summary.tasksOk < 2);
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
