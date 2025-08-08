import express from 'express';
import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware } from '../services/auth.js';
import { readJsonSafe, writeJsonSafe } from '../services/storage.js';

const router = express.Router();

const projectSchema = Joi.object({
  name: Joi.string().min(1).required(),
  files: Joi.array().items(Joi.object({ path: Joi.string().required(), content: Joi.string().allow('') })).required(),
});

router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const db = await readJsonSafe('projects');
    const mine = db.projects.filter(p => p.userId === req.user.id);
    res.json(mine);
  } catch (err) { next(err); }
});

router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { error, value } = projectSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const db = await readJsonSafe('projects');
    const project = {
      id: uuidv4(),
      userId: req.user.id,
      name: value.name,
      files: value.files,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.projects.push(project);
    await writeJsonSafe('projects', db);
    res.status(201).json(project);
  } catch (err) { next(err); }
});

router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const db = await readJsonSafe('projects');
    const project = db.projects.find(p => p.id === req.params.id && p.userId === req.user.id);
    if (!project) return res.status(404).json({ error: 'Not found' });
    res.json(project);
  } catch (err) { next(err); }
});

router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { error, value } = projectSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const db = await readJsonSafe('projects');
    const idx = db.projects.findIndex(p => p.id === req.params.id && p.userId === req.user.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });

    db.projects[idx] = { ...db.projects[idx], ...value, updatedAt: new Date().toISOString() };
    await writeJsonSafe('projects', db);
    res.json(db.projects[idx]);
  } catch (err) { next(err); }
});

router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const db = await readJsonSafe('projects');
    const before = db.projects.length;
    db.projects = db.projects.filter(p => !(p.id === req.params.id && p.userId === req.user.id));
    if (db.projects.length === before) return res.status(404).json({ error: 'Not found' });
    await writeJsonSafe('projects', db);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

export default router;