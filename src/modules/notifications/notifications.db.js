import { pool } from '../../db/pool.js';

function mapNotificationRow(row) {
  // Keep API responses in JavaScript naming, even though SQL uses snake_case.
  return {
    id: row.id,
    channel: row.channel,
    status: row.status,
    payload: row.payload,
    retryCount: row.retry_count,
    lastError: row.last_error,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString()
  };
}

export async function saveNotification({ channel, status, payload }) {
  const result = await pool.query(
    `INSERT INTO notifications (channel, status, payload)
     VALUES ($1, $2, $3)
     RETURNING id, channel, status, payload, retry_count, last_error, created_at, updated_at`,
    [channel, status, payload]
  );

  return mapNotificationRow(result.rows[0]);
}

export async function findNotificationById(id) {
  const result = await pool.query(
    `SELECT id, channel, status, payload, retry_count, last_error, created_at, updated_at
     FROM notifications
     WHERE id = $1`,
    [id]
  );

  if (!result.rows[0]) {
    return null;
  }

  return mapNotificationRow(result.rows[0]);
}

export async function updateNotificationStatus(id, status) {
  const result = await pool.query(
    `UPDATE notifications
     SET status = $2, updated_at = NOW()
     WHERE id = $1
     RETURNING id, channel, status, payload, retry_count, last_error, created_at, updated_at`,
    [id, status]
  );

  return mapNotificationRow(result.rows[0]);
}
