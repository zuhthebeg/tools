import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Env = {
  DB: D1Database;
  ASSETS: Fetcher;
};

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors());

// Projects
app.get('/api/projects', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
  return c.json(results);
});

app.post('/api/projects', async (c) => {
  const { name } = await c.req.json();
  await c.env.DB.prepare('INSERT INTO projects (name) VALUES (?)').bind(name).run();
  return c.json({ success: true }, 201);
});

app.delete('/api/projects/:id', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM ime_entries WHERE project_id = ?').bind(id).run();
  await c.env.DB.prepare('DELETE FROM projects WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

app.patch('/api/projects/:id/active', async (c) => {
  const id = c.req.param('id');
  const { is_active } = await c.req.json();
  await c.env.DB.prepare('UPDATE projects SET is_active = ? WHERE id = ?').bind(is_active ? 1 : 0, id).run();
  return c.json({ success: true });
});

// IME Entries
app.get('/api/ime', async (c) => {
  const projectId = c.req.query('projectId');
  let query = 'SELECT e.*, p.name as project_name FROM ime_entries e JOIN projects p ON e.project_id = p.id';
  const params: (string | number)[] = [];
  if (projectId) {
    query += ' WHERE e.project_id = ?';
    params.push(projectId);
  }
  query += ' ORDER BY e.created_at DESC';
  const { results } = await c.env.DB.prepare(query).bind(...params).all();
  return c.json(results);
});

app.post('/api/ime', async (c) => {
  const { project_id, original, bopomofo, short_form } = await c.req.json();
  // Duplicate check across all projects
  const existing = await c.env.DB.prepare(
    'SELECT p.name FROM ime_entries e JOIN projects p ON e.project_id = p.id WHERE e.original = ?'
  ).bind(original).all();
  const dupes = existing.results as { name: string }[];
  await c.env.DB.prepare(
    'INSERT INTO ime_entries (project_id, original, bopomofo, short_form) VALUES (?, ?, ?, ?)'
  ).bind(project_id, original, bopomofo || null, short_form || null).run();
  return c.json({
    success: true,
    duplicates: dupes.map(d => d.name),
  }, 201);
});

app.put('/api/ime/:id', async (c) => {
  const id = c.req.param('id');
  const { original, bopomofo, short_form } = await c.req.json();
  await c.env.DB.prepare(
    'UPDATE ime_entries SET original = ?, bopomofo = ?, short_form = ? WHERE id = ?'
  ).bind(original, bopomofo || null, short_form || null, id).run();
  return c.json({ success: true });
});

app.delete('/api/ime/:id', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM ime_entries WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

// Knowledge Base
app.get('/api/kb', async (c) => {
  const search = c.req.query('q');
  let query = 'SELECT * FROM kb_entries';
  const params: string[] = [];
  if (search) {
    query += ' WHERE ko LIKE ? OR zh_tw LIKE ? OR tags LIKE ? OR category LIKE ?';
    const like = `%${search}%`;
    params.push(like, like, like, like);
  }
  query += ' ORDER BY created_at DESC';
  const { results } = await c.env.DB.prepare(query).bind(...params).all();
  return c.json(results);
});

app.post('/api/kb', async (c) => {
  const { ko, zh_tw, category, tags, note } = await c.req.json();
  await c.env.DB.prepare(
    'INSERT INTO kb_entries (ko, zh_tw, category, tags, note) VALUES (?, ?, ?, ?, ?)'
  ).bind(ko, zh_tw, category || null, tags || null, note || null).run();
  return c.json({ success: true }, 201);
});

app.put('/api/kb/:id', async (c) => {
  const id = c.req.param('id');
  const { ko, zh_tw, category, tags, note } = await c.req.json();
  await c.env.DB.prepare(
    'UPDATE kb_entries SET ko = ?, zh_tw = ?, category = ?, tags = ?, note = ? WHERE id = ?'
  ).bind(ko, zh_tw, category || null, tags || null, note || null, id).run();
  return c.json({ success: true });
});

app.delete('/api/kb/:id', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM kb_entries WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

// Export: Microsoft Bopomofo TXT (UTF-8, tab-separated)
app.get('/api/export', async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT e.original, e.bopomofo
    FROM ime_entries e
    JOIN projects p ON e.project_id = p.id
    WHERE p.is_active = 1
    ORDER BY p.id, e.created_at ASC
  `).all() as { results: { original: string; bopomofo: string | null }[] };

  const lines = results.map(r => r.bopomofo ? `${r.original}\t${r.bopomofo}` : r.original);
  const content = lines.join('\r\n');

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': 'attachment; filename="ime_export.txt"',
    },
  });
});

export default app;
