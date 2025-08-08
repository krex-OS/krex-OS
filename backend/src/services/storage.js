import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../../data');

async function ensureDefaults(name) {
  await fs.ensureDir(DATA_DIR);
  const file = path.join(DATA_DIR, `${name}.json`);
  if (!(await fs.pathExists(file))) {
    const defaults = name === 'users' ? { users: [] } : { projects: [] };
    await fs.writeJson(file, defaults, { spaces: 2 });
  }
}

export async function readJsonSafe(name) {
  await ensureDefaults(name);
  const file = path.join(DATA_DIR, `${name}.json`);
  return fs.readJson(file);
}

export async function writeJsonSafe(name, data) {
  await ensureDefaults(name);
  const file = path.join(DATA_DIR, `${name}.json`);
  await fs.writeJson(file, data, { spaces: 2 });
}