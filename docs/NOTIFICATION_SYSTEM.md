# Notification System Documentation

## Overview
The EventHub notification system sends ticket information to an AI service for RSVP confirmations and event reminders.

## Features
- **RSVP Notifications**: Sent immediately when a user claims a ticket (free or paid)
- **Reminder Notifications**: Sent the day before an event
- **Automatic Processing**: Integrated into checkout and webhook flows
- **Manual Triggers**: API endpoints for testing and manual sending

## API Endpoints

### AI Webhook URL
```
POST https://karanja-kariuki.app.n8n.cloud/webhook/90d9afd1-e9e1-4f79-ae14-aa3cde1d1247
```

### Headers Required
```
Content-Type: application/json
KK_ACCESS_PASS: [Your Access Pass]
```

### Data Format
```json
{
  "name": "string",
  "email": "string", 
  "event_title": "string",
  "event_date": "string",
  "event_time": "string",
  "event_place": "string",
  "reminder_type": "rsvp|reminder"
}
```

## Implementation

### 1. RSVP Notifications
- **Trigger**: When user claims a free ticket or completes paid ticket purchase
- **Location**: `lib/actions/order.actions.ts` and `app/api/webhooks/stripe/route.ts`
- **Type**: `reminder_type: "rsvp"`

### 2. Reminder Notifications
- **Trigger**: Daily cron job checks for events happening tomorrow
- **Location**: `app/api/cron/reminders/route.ts`
- **Type**: `reminder_type: "reminder"`

### 3. Manual Testing
- **Endpoint**: `POST /api/reminders/send`
- **Body**: `{ "eventId": "string", "userId": "string" }`

## Environment Variables
```env
KK_ACCESS_PASS=your-access-pass-here
CRON_SECRET=your-cron-secret-here
```

## Cron Job Setup
Set up a daily cron job to call:
```
GET https://your-domain.com/api/cron/reminders
Authorization: Bearer your-cron-secret
```

## Testing
Run the test script:
```bash
node scripts/test-notifications.js
```

## Error Handling
- Notifications are sent asynchronously
- Failures don't affect the main checkout flow
- Errors are logged for debugging
- Retry logic can be added if needed

## Data Flow
1. User claims ticket → Order created → RSVP notification sent
2. Daily cron job → Finds tomorrow's events → Sends reminder notifications
3. All notifications include user and event details in the specified format
