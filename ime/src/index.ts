import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', cors())

// Static files
app.get('/*', serveStatic({ root: './public' }))

// Projects API
app.get('/api/projects', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM projects ORDER BY created_at DESC').all()
  return c.json(results)
})

app.post('/api/projects', async (c) => {
  const { name } = await c.req.json()
  await c.env.DB.prepare('INSERT INTO projects (name) VALUES (?)').bind(name).run()
  return c.json({ success: true }, 201)
})

app.patch('/api/projects/:id/active', async (c) => {
  const id = c.req.param('id')
  const { is_active } = await c.req.json()
  await c.env.DB.prepare('UPDATE projects SET is_active = ? WHERE id = ?').bind(is_active ? 1 : 0, id).run()
  return c.json({ success: true })
})

// IME Entries API
app.get('/api/ime', async (c) => {
  const projectId = c.req.query('projectId')
  let query = 'SELECT * FROM ime_entries'
  let params = []
  
  if (projectId) {
    query += ' WHERE project_id = ?'
    params.push(projectId)
  }
  
  query += ' ORDER BY created_at DESC'
  const { results } = await c.env.DB.prepare(query).bind(...params).all()
  return c.json(results)
})

app.post('/api/ime', async (c) => {
  const { project_id, original, bopomofo, short_form } = await c.req.json()
  await c.env.DB.prepare(
    'INSERT INTO ime_entries (project_id, original, bopomofo, short_form) VALUES (?, ?, ?, ?)'
  ).bind(project_id, original, bopomofo, short_form).run()
  return c.json({ success: true }, 201)
})

// KB Entries API
app.get('/api/kb', async (c) => {
  const search = c.req.query('q')
  let query = 'SELECT * FROM kb_entries'
  let params = []

  if (search) {
    query += ' WHERE ko LIKE ? OR zh_tw LIKE ? OR tags LIKE ?'
    const likeParam = `%${search}%`
    params.push(likeParam, likeParam, likeParam)
  }

  query += ' ORDER BY created_at DESC'
  const { results } = await c.env.DB.prepare(query).bind(...params).all()
  return c.json(results)
})

app.post('/api/kb', async (c) => {
  const { ko, zh_tw, category, tags, note } = await c.req.json()
  await c.env.DB.prepare(
    'INSERT INTO kb_entries (ko, zh_tw, category, tags, note) VALUES (?, ?, ?, ?, ?)'
  ).bind(ko, zh_tw, category, tags, note).run()
  return c.json({ success: true }, 201)
})

// Export for Microsoft Bopomofo
app.get('/api/export', async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT e.original, e.bopomofo 
    FROM ime_entries e
    JOIN projects p ON e.project_id = p.id
    WHERE p.is_active = 1
  `).all()

  // Format: Original [Space] Bopomofo
  // Microsoft Bopomofo format usually expects a specific structure.
  // We'll generate a simple UTF-8 text file as requested.
  const content = results.map((row: any) => `${row.original}\t${row.bopomofo}`).join('\r\n')
  
  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': 'attachment; filename="ime_export.txt"'
    }
  })
})

export default app
