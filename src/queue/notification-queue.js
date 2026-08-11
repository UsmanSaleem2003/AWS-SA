import { env } from '../config/env.js';
import { publishNotificationJobToLog } from './log-notification-queue.js';
import { publishNotificationJobToSqs } from './sqs-notification-queue.js';

export async function publishNotificationJob(job) {
  if (env.QUEUE_PROVIDER === 'sqs') {
    return publishNotificationJobToSqs(job);
  }

  return publishNotificationJobToLog(job);
}
