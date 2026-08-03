import { HttpError } from '../../../shared/http/http-error.js';
import { EmailProvider } from './email.provider.js';
import { SlackProvider } from './slack.provider.js';

const providers = [new EmailProvider(), new SlackProvider()];

// New channels should be added here without changing the route layer.
export function getNotificationProvider(channel) {
  const provider = providers.find((candidate) => candidate.channel === channel);

  if (!provider) {
    throw new HttpError(400, `Unsupported notification channel: ${channel}`);
  }

  return provider;
}
