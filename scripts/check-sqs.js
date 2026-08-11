import { GetQueueAttributesCommand, SQSClient } from '@aws-sdk/client-sqs';
import { env } from '../src/config/env.js';
import { logger } from '../src/lib/logger.js';

if (!env.SQS_QUEUE_URL) {
  logger.error('SQS_QUEUE_URL is required to check SQS access');
  process.exit(1);
}

const client = new SQSClient({
  region: env.AWS_REGION
});

try {
  const response = await client.send(
    new GetQueueAttributesCommand({
      QueueUrl: env.SQS_QUEUE_URL,
      AttributeNames: ['QueueArn', 'ApproximateNumberOfMessages']
    })
  );

  logger.info(
    {
      queueArn: response.Attributes.QueueArn,
      approximateMessages: response.Attributes.ApproximateNumberOfMessages
    },
    'sqs access verified'
  );
} catch (error) {
  logger.error({ error }, 'sqs access check failed');
  process.exit(1);
}
