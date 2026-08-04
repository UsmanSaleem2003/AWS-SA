import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info({ port: env.PORT }, 'notification api started');
});

const shutdown = (signal) => {
  logger.info({ signal }, 'shutting down notification api');
  server.close(() => {
    logger.info('notification api stopped');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
