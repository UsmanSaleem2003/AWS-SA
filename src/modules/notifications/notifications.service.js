import { NotificationStatus } from './notification-status.js';
import { getNotificationProvider } from './providers/notification-provider-registry.js';
import { findNotificationById, saveNotification, updateNotificationStatus } from './notifications.db.js';
import { HttpError } from '../../shared/http/http-error.js';
import { publishNotificationJob } from '../../queue/notification-queue.js';

export async function createNotification(payload) {
  const provider = getNotificationProvider(payload.channel);
  await provider.validatePayload(payload);

  // Persistence happens before queueing so the request can be tracked later.
  const notification = await saveNotification({
    channel: payload.channel,
    status: NotificationStatus.RECEIVED,
    payload
  });

  await publishNotificationJob({
    notificationId: notification.id,
    channel: notification.channel
  });

  return updateNotificationStatus(notification.id, NotificationStatus.QUEUED);
}

export async function getNotification(id) {
  const notification = await findNotificationById(id);

  if (!notification) {
    throw new HttpError(404, 'Notification not found');
  }

  return notification;
}
