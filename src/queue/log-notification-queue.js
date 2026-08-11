import { logger } from '../lib/logger.js';

export async function publishNotificationJobToLog(job) {
  logger.info({ job }, 'notification job queued locally');

  return {
    provider: 'log',
    messageId: `local-${job.notificationId}`
  };
}
