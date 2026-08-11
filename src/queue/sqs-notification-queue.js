import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { env } from '../config/env.js';
import { HttpError } from '../shared/http/http-error.js';

const sqsClient = new SQSClient({
  region: env.AWS_REGION
});

export async function publishNotificationJobToSqs(job) {
  if (!env.SQS_QUEUE_URL) {
    throw new HttpError(500, 'SQS_QUEUE_URL is required when QUEUE_PROVIDER=sqs');
  }

  const command = new SendMessageCommand({
    QueueUrl: env.SQS_QUEUE_URL,
    MessageBody: JSON.stringify(job),
    MessageAttributes: {
      notificationId: {
        DataType: 'String',
        StringValue: job.notificationId
      },
      channel: {
        DataType: 'String',
        StringValue: job.channel
      }
    }
  });

  const response = await sqsClient.send(command);

  return {
    provider: 'sqs',
    messageId: response.MessageId
  };
}
