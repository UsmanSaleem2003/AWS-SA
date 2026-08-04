import { z } from 'zod';

import { NotificationChannel } from './notification-channel.js';

// Each channel has its own required payload shape.
const emailPayloadSchema = z.object({
  channel: z.literal(NotificationChannel.EMAIL),
  recipient: z.string().email(),
  subject: z.string().min(1).max(120),
  body: z.string().min(1).max(5000)
});

const slackPayloadSchema = z.object({
  channel: z.literal(NotificationChannel.SLACK),
  webhookUrl: z.string().url(),
  message: z.string().min(1).max(3000)
});

export const createNotificationSchema = z.discriminatedUnion('channel', [
  emailPayloadSchema,
  slackPayloadSchema
]);
