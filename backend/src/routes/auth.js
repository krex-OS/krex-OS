import express from 'express';
import Joi from 'joi';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { readJsonSafe, writeJsonSafe } from '../services/storage.js';
import { generateToken } from '../services/auth.js';

const router = express.Router();

const authSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

router.post('/register', async (req, res, next) => {
  try {
    const { error, value } = authSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const { email, password } = value;
    const db = await readJsonSafe('users');
    const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = { id: uuidv4(), email, passwordHash: hashed, createdAt: new Date().toISOString() };
    db.users.push(user);
    await writeJsonSafe('users', db);

    const token = generateToken({ id: user.id, email: user.email });
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { error, value } = authSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const { email, password } = value;
    const db = await readJsonSafe('users');
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken({ id: user.id, email: user.email });
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    next(err);
  }
});

export default router;