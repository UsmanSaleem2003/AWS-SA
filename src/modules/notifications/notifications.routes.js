import { Router } from 'express';
import { z } from 'zod';

import { createNotificationSchema } from './notification.schema.js';
import { createNotification, getNotification } from './notifications.service.js';

export const notificationsRouter = Router();

const notificationIdSchema = z.string().uuid();

notificationsRouter.post('/', async (req, res, next) => {
  try {
    const payload = createNotificationSchema.parse(req.body);
    const notification = await createNotification(payload);

    return res.status(202).json({
      data: notification
    });
  } catch (error) {
    return next(error);
  }
});

notificationsRouter.get('/:id', async (req, res, next) => {
  try {
    const id = notificationIdSchema.parse(req.params.id);
    const notification = await getNotification(id);

    return res.status(200).json({
      data: notification
    });
  } catch (error) {
    return next(error);
  }
});
