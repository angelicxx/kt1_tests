import express from 'express';
import { all, get, run } from '../db/index.js';
import { createTaskSchema, updateTaskSchema, validateBody } from '../middleware/validators.js';

const router = express.Router();

// Create a task
router.post('/', validateBody(createTaskSchema), async (req, res, next) => {
  try {
    const { title, description = '', completed = false } = req.validated;
    const result = await run(
      `INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)`,
      [title, description, completed ? 1 : 0]
    );
    const task = await get(`SELECT id, title, description, completed, created_at, updated_at FROM tasks WHERE id=?`, [result.id]);
    task.completed = !!task.completed;
    res.status(201).json(task);
  } catch (e) { next(e); }
});

// List tasks with optional ?completed=true|false
router.get('/', async (req, res, next) => {
  try {
    const { completed } = req.query;
    let rows;
    if (completed === undefined) {
      rows = await all(`SELECT id, title, description, completed, created_at, updated_at FROM tasks ORDER BY id ASC`);
    } else {
      if (!['true','false'].includes(String(completed))) {
        return res.status(400).json({ error: 'ValidationError', message: 'Query param completed must be true or false' });
      }
      const val = String(completed) === 'true' ? 1 : 0;
      rows = await all(`SELECT id, title, description, completed, created_at, updated_at FROM tasks WHERE completed=? ORDER BY id ASC`, [val]);
    }
    res.json(rows.map(r => ({ ...r, completed: !!r.completed })));
  } catch (e) { next(e); }
});

// Get one task
router.get('/:id', async (req, res, next) => {
  try {
    const row = await get(`SELECT id, title, description, completed, created_at, updated_at FROM tasks WHERE id=?`, [req.params.id]);
    if (!row) return res.status(404).json({ error: 'NotFound', message: 'Task not found' });
    row.completed = !!row.completed;
    res.json(row);
  } catch (e) { next(e); }
});

// Update task (PUT full/partial)
router.put('/:id', validateBody(updateTaskSchema), async (req, res, next) => {
  try {
    const existing = await get(`SELECT id FROM tasks WHERE id=?`, [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'NotFound', message: 'Task not found' });

    const fields = [];
    const params = [];
    if ('title' in req.validated) { fields.push('title = ?'); params.push(req.validated.title); }
    if ('description' in req.validated) { fields.push('description = ?'); params.push(req.validated.description ?? ''); }
    if ('completed' in req.validated) { fields.push('completed = ?'); params.push(req.validated.completed ? 1 : 0); }
    fields.push(`updated_at = datetime('now')`);
    params.push(req.params.id);

    await run(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`, params);
    const updated = await get(`SELECT id, title, description, completed, created_at, updated_at FROM tasks WHERE id=?`, [req.params.id]);
    updated.completed = !!updated.completed;
    res.json(updated);
  } catch (e) { next(e); }
});

// Delete task
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await run(`DELETE FROM tasks WHERE id=?`, [req.params.id]);
    if (result.changes === 0) return res.status(404).json({ error: 'NotFound', message: 'Task not found' });
    res.status(204).send();
  } catch (e) { next(e); }
});

export default router;
