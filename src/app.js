import express from 'express';
import pinoHttp from 'pino-http';

import { healthRouter } from './modules/health/health.routes.js';
import { notificationsRouter } from './modules/notifications/notifications.routes.js';
import { errorHandler } from './shared/http/error-handler.js';
import { notFoundHandler } from './shared/http/not-found-handler.js';
import { logger } from './lib/logger.js';

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(pinoHttp({ logger }));

  // Feature routers keep app-level wiring easy to scan.
  app.use('/health', healthRouter);
  app.use('/notifications', notificationsRouter);

  // These stay last so matched routes get the first chance to respond.
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
