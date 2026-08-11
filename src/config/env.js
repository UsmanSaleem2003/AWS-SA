import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  DATABASE_URL: z.string().url().default('postgres://notification_user:notification_password@localhost:5432/notifications'),
  QUEUE_PROVIDER: z.enum(['log', 'sqs']).default('log'),
  AWS_REGION: z.string().min(1).default('us-east-1'),
  SQS_QUEUE_URL: z.string().url().optional()
});

export const env = envSchema.parse(process.env);
