# Sample Society Email Automation - n8n Setup Guide

## Overview

This document explains how to set up the automated email sequences in n8n. The infrastructure is already built in your Lovable Cloud backend.

---

## Architecture

```
Shopify → Webhooks → shopify-webhook (Edge Function)
                          ↓
                   Database (tracks subscribers + sequences)
                          ↓
n8n (Scheduled) → process-scheduled-emails (Edge Function)
                          ↓
                   send-sequence-email (Edge Function) → Resend API → Customer Inbox
```

---

## Edge Functions Reference

Your project has these email automation functions deployed:

| Function | Purpose |
|----------|---------|
| `shopify-webhook` | Receives Shopify events (orders, customers), creates/updates subscribers, starts sequences |
| `send-sequence-email` | Sends a specific email in a sequence to a subscriber |
| `process-scheduled-emails` | Checks for due emails and sends them (run on schedule) |
| `n8n-trigger` | API for n8n to trigger actions (start sequence, send email, etc.) |
| `email-subscribe` | Website subscription form handler |
| `email-unsubscribe` | Unsubscribe handler |

---

## n8n Workflows to Create

### Workflow 1: Scheduled Email Processor (REQUIRED)

This workflow runs every 15 minutes to send due emails.

**Steps:**
1. Create new workflow in n8n
2. Add **Schedule Trigger** node:
   - Trigger every 15 minutes
3. Add **HTTP Request** node:
   - Method: `POST`
   - URL: `https://ghapdeffxpbzznxgfkoi.supabase.co/functions/v1/process-scheduled-emails`
   - Authentication: None (uses service key internally)
   - Headers:
     - `Content-Type`: `application/json`
   - Body: `{}`
4. Save and activate

### Workflow 2: Shopify Webhook Receiver (REQUIRED)

This workflow receives Shopify events and forwards them to your edge function.

**Steps:**
1. Create new workflow in n8n
2. Add **Webhook** node:
   - HTTP Method: POST
   - Path: `/shopify-events` (or any path you prefer)
   - Copy the webhook URL (you'll need this for Shopify)
3. Add **HTTP Request** node:
   - Method: `POST`
   - URL: `https://ghapdeffxpbzznxgfkoi.supabase.co/functions/v1/shopify-webhook`
   - Headers:
     - `Content-Type`: `application/json`
     - `x-shopify-topic`: `{{ $json.headers['x-shopify-topic'] }}`
   - Body: `{{ JSON.stringify($json.body) }}`
4. Save and activate

**Then configure Shopify webhooks:**
1. Go to Shopify Admin → Settings → Notifications → Webhooks
2. Add webhooks for these events pointing to your n8n webhook URL:
   - Customer creation
   - Customer update
   - Order creation
   - Order payment

### Workflow 3: Manual Sequence Trigger (OPTIONAL)

Allows you to manually start a sequence for any email.

**Steps:**
1. Add **Webhook** node with path `/start-sequence`
2. Add **HTTP Request** node:
   - Method: `POST`
   - URL: `https://ghapdeffxpbzznxgfkoi.supabase.co/functions/v1/n8n-trigger`
   - Body:
   ```json
   {
     "action": "start_sequence",
     "email": "{{ $json.body.email }}",
     "sequence_name": "{{ $json.body.sequence_name }}"
   }
   ```

---

## API Reference for n8n

### n8n-trigger Actions

**Start a sequence:**
```json
{
  "action": "start_sequence",
  "email": "customer@example.com",
  "sequence_name": "welcome_sequence"
}
```

**Send specific email:**
```json
{
  "action": "send_email",
  "subscriber_id": "uuid",
  "sequence_name": "welcome_sequence",
  "step": 0
}
```

**Update subscriber segment:**
```json
{
  "action": "update_segment",
  "email": "customer@example.com",
  "segment": "power_buyer",
  "tags": ["vip", "high-value"]
}
```

**Get subscriber info:**
```json
{
  "action": "get_subscriber",
  "email": "customer@example.com"
}
```

**List due emails:**
```json
{
  "action": "list_due_emails"
}
```

---

## Email Sequences

### Welcome Sequence (6 emails over 11 days)
| Step | Delay | Type | Subject |
|------|-------|------|---------|
| 0 | Immediate | Value | Welcome + Free Pack |
| 1 | 48 hours | Authority | The 808 trick |
| 2 | 96 hours | Story | Why we started |
| 3 | 168 hours | Value | Free workflow template |
| 4 | 240 hours | Soft Pitch | 40% off first kit |
| 5 | 264 hours | Hard Pitch | Last chance |

### Post-Purchase Sequence (5 emails over 14 days)
| Step | Delay | Type | Subject |
|------|-------|------|---------|
| 0 | Immediate | Value | How to use your kit |
| 1 | 72 hours | Authority | Advanced layering trick |
| 2 | 120 hours | Value | Bonus content unlocked |
| 3 | 240 hours | Soft Pitch | Complementary kits |
| 4 | 336 hours | Offer | Bundle deal (60% off) |

### Ascension Sequence (4 emails over 14 days)
| Step | Delay | Type | Subject |
|------|-------|------|---------|
| 0 | Immediate | Authority | You're top 10% |
| 1 | 72 hours | Offer | VIP 50% bundle |
| 2 | 168 hours | Ascension | The Pantheon explained |
| 3 | 336 hours | Hard Pitch | Limited Pantheon spots |

### Dormant Win-back Sequence (5 emails over 21 days)
| Step | Delay | Type | Subject |
|------|-------|------|---------|
| 0 | Immediate | Reactivation | You still producing? |
| 1 | 72 hours | Value | Free mini-pack gift |
| 2 | 168 hours | Story | We miss you |
| 3 | 336 hours | Hard Pitch | 50% comeback offer |
| 4 | 504 hours | Reactivation | Should we part ways? |

---

## Subscriber Segments

| Segment | Trigger |
|---------|---------|
| `cold_subscriber` | Signed up, no purchase |
| `first_time_buyer` | 1 order |
| `repeat_buyer` | 2-4 orders |
| `power_buyer` | 5+ orders |
| `pantheon_member` | Pantheon purchase |
| `dormant` | No activity 60+ days |

---

## Resend Configuration

Before emails will send, configure your domain in Resend:

1. Go to [resend.com/domains](https://resend.com/domains)
2. Add and verify your domain (e.g., `samplesociety.com`)
3. Update the `from` address in `send-sequence-email/index.ts` to use your verified domain

Current default: `Sample Society <hello@samplesociety.com>`

---

## Testing

### Test email subscription:
```bash
curl -X POST https://ghapdeffxpbzznxgfkoi.supabase.co/functions/v1/email-subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "first_name": "Test"}'
```

### Test n8n trigger:
```bash
curl -X POST https://ghapdeffxpbzznxgfkoi.supabase.co/functions/v1/n8n-trigger \
  -H "Content-Type: application/json" \
  -d '{"action": "get_subscriber", "email": "test@example.com"}'
```

---

## Customizing Email Content

Email templates are stored in two places:

1. **Default templates** - Hardcoded in `send-sequence-email/index.ts`
2. **Database templates** - In `email_templates` table (takes priority)

To customize via database:
```sql
INSERT INTO email_templates (name, sequence_name, step_number, subject, html_content, delay_hours, email_type)
VALUES (
  'custom_welcome_1',
  'welcome_sequence',
  0,
  'Your custom subject',
  '<html>Your custom HTML with {{first_name}} placeholder</html>',
  0,
  'value'
);
```

---

## Monitoring

View email automation data in your Lovable Cloud backend:
- `email_subscribers` - All subscribers with segments
- `email_sequence_progress` - Active sequences
- `email_send_log` - Sent email history
- `shopify_webhook_log` - Incoming Shopify events

