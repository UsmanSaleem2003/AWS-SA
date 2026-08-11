# Event-Driven Notification & Observability Platform

Backend learning project for asynchronous notification processing, fault tolerance, and observability.

## Current Increment

The current increment creates the Express API foundation and persists accepted notification requests:

- `GET /health` for service health.
- `POST /notifications` for accepting email or Slack notification requests.
- `GET /notifications/:id` for reading the stored notification state.
- PostgreSQL storage for notification metadata and flexible channel payloads.
- Queue publishing through local log mode or AWS SQS.
- Structured JSON logging with Pino.
- Request validation with Zod.
- Strategy-style notification provider registry so more channels can be added later without changing the API route.

The API accepts, validates, stores, and queues requests right now. Lambda processing, retries, DLQ handling, Prometheus, and Grafana will be added incrementally.

## Run Locally

```bash
npm install
docker compose up -d
npm run db:migrate
npm run dev
```

Use local queue logging while learning the flow:

```env
QUEUE_PROVIDER=log
```

Use real AWS SQS when your AWS credentials are configured:

```env
QUEUE_PROVIDER=sqs
AWS_REGION=us-east-1
SQS_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/526167571294/notification-requests
```

Check SQS access:

```bash
npm run sqs:check
```

```bash
curl http://localhost:3000/health
```

Email request:

```bash
curl -X POST http://localhost:3000/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "email",
    "recipient": "user@example.com",
    "subject": "Welcome",
    "body": "Your notification platform is alive."
  }'
```

Slack request:

```bash
curl -X POST http://localhost:3000/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "slack",
    "webhookUrl": "https://hooks.slack.com/services/example",
    "message": "Your notification platform is alive."
  }'
```

Read a notification:

```bash
curl http://localhost:3000/notifications/<notification-id>
```

## Why This Step Exists

The API is the system boundary. It should validate requests quickly, return `202 Accepted`, and avoid doing delivery work directly. That keeps user-facing requests fast and prepares the system for the queue-based flow:

```text
Client -> API -> PostgreSQL -> SQS -> Lambda Worker -> Provider -> Status Update
```

## Next Recommended Step

Add the Lambda worker that consumes SQS messages. This moves the system from “accepted, stored, and queued” to true asynchronous processing.

## Database Choice

PostgreSQL is used because notification status is structured and queryable, while each channel payload can stay flexible in a `JSONB` column. DynamoDB would also work for a serverless-first design, but Postgres is easier to run locally, explain clearly, and query during this learning project.
