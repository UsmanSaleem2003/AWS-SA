CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel TEXT NOT NULL CHECK (channel IN ('email', 'slack')),
  status TEXT NOT NULL CHECK (status IN ('received', 'queued', 'processing', 'sent', 'failed', 'dead_lettered')),
  payload JSONB NOT NULL,
  retry_count INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_status_created_at
  ON notifications (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_channel_created_at
  ON notifications (channel, created_at DESC);
