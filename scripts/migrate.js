import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { pool } from '../src/db/pool.js';
import { logger } from '../src/lib/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationPath = path.join(__dirname, '..', 'db', 'migrations', '001_create_notifications.sql');

try {
  const sql = await readFile(migrationPath, 'utf8');
  await pool.query(sql);
  logger.info({ migration: path.basename(migrationPath) }, 'database migration completed');
} catch (error) {
  logger.error({ error }, 'database migration failed');
  process.exitCode = 1;
} finally {
  await pool.end();
}
