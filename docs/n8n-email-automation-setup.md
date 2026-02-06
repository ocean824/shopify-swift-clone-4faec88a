# Sample Society Automation Suite - n8n Setup Guide

## Overview

This document explains how to set up automated email sequences AND social media posting in n8n. The infrastructure is already built in your Lovable Cloud backend.

---

## Architecture

### Email Automation
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

---

# SOCIAL MEDIA AUTOMATION

## Overview

All social media platforms (Instagram, Twitter/X, YouTube, TikTok) are controlled through **OnlySocial** via n8n. This provides a single integration point for:
- Scheduled content posts
- New product announcements
- Engagement automation
- Social listening/monitoring

---

## Architecture

```
                              ┌─────────────────────────────┐
                              │        OnlySocial           │
                              │  (All accounts connected)   │
                              │  Instagram | Twitter/X      │
                              │  YouTube | TikTok           │
                              └──────────────┬──────────────┘
                                             │
                                             ▼
┌──────────────────┐    ┌───────────────────────────────────┐
│  Shopify Product │───▶│  new-product-announcement         │
│  (Webhook)       │    │  (Generates captions)             │
└──────────────────┘    └─────────────┬─────────────────────┘
                                      │
                                      ▼
                        ┌─────────────────────────────────────┐
                        │          n8n Workflows              │
                        │  • Product announcements            │
                        │  • Scheduled content queue          │
                        │  • Engagement automation            │
                        └─────────────┬───────────────────────┘
                                      │
                                      ▼
                        ┌─────────────────────────────────────┐
                        │   onlysocial-trigger (Edge Func)    │
                        │   Controls all platforms at once    │
                        └─────────────────────────────────────┘
```

---

## Social Media Edge Functions

| Function | Purpose |
|----------|---------|
| `new-product-announcement` | Receives new product webhooks, generates IG captions in your brand voice |
| `onlysocial-trigger` | Unified API to control all social platforms via OnlySocial |
| `manychat-trigger` | Triggers ManyChat flows for Instagram DM automation |

---

## OnlySocial API Reference

### List Connected Accounts
```json
{
  "action": "list_accounts"
}
```
Returns all connected social accounts (Instagram, Twitter, YouTube, TikTok).

### Create a Post (Draft)
```json
{
  "action": "create_post",
  "post": {
    "body": "🔥 NEW DROP: Stained Glass Vol. 2\n\nThese sounds hit DIFFERENT...\n\n💰 $29 | Link in bio",
    "accounts": ["account-uuid-1", "account-uuid-2"],
    "media_uuids": ["media-uuid-1"]
  }
}
```

### Schedule a Post
```json
{
  "action": "schedule_post",
  "post_uuid": "post-uuid-from-create",
  "post": {
    "date": "2025-02-07",
    "time": "14:00"
  }
}
```

### Add Post to Queue
```json
{
  "action": "add_to_queue",
  "post_uuid": "post-uuid"
}
```
Uses your OnlySocial queue settings for automatic scheduling.

### List All Posts
```json
{
  "action": "list_posts",
  "page": 1,
  "limit": 20
}
```

### List Media Files
```json
{
  "action": "list_media",
  "page": 1,
  "limit": 20
}
```

---

## n8n Workflows for Social Media

### Workflow 4: Product Announcement Pipeline (REQUIRED)

Automatically posts to all platforms when you add a new Shopify product.

**Steps:**

1. Add **Webhook** node:
   - HTTP Method: POST
   - Path: `/new-product`

2. Add **HTTP Request** node (Generate Caption):
   - Method: `POST`
   - URL: `https://ghapdeffxpbzznxgfkoi.supabase.co/functions/v1/new-product-announcement`
   - Body:
   ```json
   {
     "product": {
       "title": "{{ $json.body.title }}",
       "description": "{{ $json.body.description }}",
       "price": "{{ $json.body.price }}",
       "image_url": "{{ $json.body.image_url }}",
       "handle": "{{ $json.body.handle }}"
     }
   }
   ```

3. Add **HTTP Request** node (Get Accounts):
   - Method: `POST`
   - URL: `https://ghapdeffxpbzznxgfkoi.supabase.co/functions/v1/onlysocial-trigger`
   - Body: `{"action": "list_accounts"}`

4. Add **HTTP Request** node (Create Post):
   - Method: `POST`
   - URL: `https://ghapdeffxpbzznxgfkoi.supabase.co/functions/v1/onlysocial-trigger`
   - Body:
   ```json
   {
     "action": "create_post",
     "post": {
       "body": "{{ $('Generate Caption').item.json.generated_caption }}",
       "accounts": ["{{ $json.data[0].uuid }}", "{{ $json.data[1].uuid }}"]
     }
   }
   ```

5. Add **HTTP Request** node (Add to Queue):
   - Method: `POST`
   - URL: `https://ghapdeffxpbzznxgfkoi.supabase.co/functions/v1/onlysocial-trigger`
   - Body:
   ```json
   {
     "action": "add_to_queue",
     "post_uuid": "{{ $json.data.uuid }}"
   }
   ```

6. Save and activate

---

### Workflow 5: Scheduled Content Queue (OPTIONAL)

Weekly workflow to queue content from a spreadsheet or database.

**Steps:**

1. Add **Schedule Trigger** node:
   - Run every Sunday at 6 PM

2. Add **Google Sheets** node (or your content source):
   - Get this week's scheduled posts

3. Add **Loop** node:
   - For each content row

4. Add **HTTP Request** node (Create & Queue):
   - Create post and add to queue for each item

---

### Workflow 6: Engagement Automation (OPTIONAL)

Monitor mentions and auto-respond.

**Steps:**

1. Add **Schedule Trigger** node:
   - Run every hour

2. Add **HTTP Request** node (Check mentions via OnlySocial):
   - List recent posts/comments

3. Add **Filter** node:
   - Filter for posts needing response

4. Add **Slack/Discord** node (Optional):
   - Notify team of engagement opportunities

---

## ManyChat Integration (Instagram DMs)

ManyChat is used specifically for Instagram DM automation (separate from OnlySocial).

### ManyChat Trigger API

**Send a Flow:**
```json
{
  "action": "send_flow",
  "subscriber_id": "12345",
  "flow_ns": "your_flow_namespace"
}
```

**Send Product Content (DM):**
```json
{
  "action": "send_content",
  "subscriber_id": "12345",
  "product": {
    "title": "Stained Glass Vol. 2",
    "price": "$29",
    "image_url": "https://...",
    "handle": "stained-glass-vol-2"
  }
}
```

**Add Tag:**
```json
{
  "action": "add_tag",
  "subscriber_id": "12345",
  "tag_name": "new_product_interest"
}
```

---

## Caption Templates (Auto-Generated)

The `new-product-announcement` function generates captions in your brand voice:

### Sample Kit Style
```
🔥 NEW DROP: Stained Glass Vol. 2

Premium melody loops with vintage textures...

These sounds hit DIFFERENT. Grab yours before they're gone.

💰 $29
🔗 Link in bio

#producer #beatmaker #samplepack #musicproducer #beats
```

### MIDI Kit Style
```
🎹 MIDI ALERT: Haze MIDI Kit

Plug these progressions straight into your DAW...

💰 $19
🔗 Link in bio

#midi #chords #producer #musictheory #beatmaker
```

### Drum Kit Style
```
🥁 DRUMS JUST DROPPED: Moonlight Drumkit

Hard-hitting drums that cut through any mix...

💰 $24
🔗 Link in bio

#drums #drumkit #producer #808s #hihats
```

---

## Shopify Webhook Setup

Add these webhooks in Shopify Admin → Settings → Notifications → Webhooks:

| Event | URL |
|-------|-----|
| Product creation | `YOUR_N8N_WEBHOOK_URL/new-product` |

---

## Complete n8n Setup Checklist

### Email Automation
- [ ] Workflow 1: Scheduled Email Processor (every 15 mins)
- [ ] Workflow 2: Shopify Webhook Receiver
- [ ] Configure Shopify webhooks for customers/orders

### Social Media Automation
- [ ] Workflow 4: Product Announcement Pipeline
- [ ] Workflow 5: Scheduled Content Queue (optional)
- [ ] Workflow 6: Engagement Automation (optional)
- [ ] Configure Shopify webhook for product creation
- [ ] Test with a sample product

---

## Testing

### Test OnlySocial connection:
```bash
curl -X POST https://ghapdeffxpbzznxgfkoi.supabase.co/functions/v1/onlysocial-trigger \
  -H "Content-Type: application/json" \
  -d '{"action": "list_accounts"}'
```

### Test caption generation:
```bash
curl -X POST https://ghapdeffxpbzznxgfkoi.supabase.co/functions/v1/new-product-announcement \
  -H "Content-Type: application/json" \
  -d '{
    "product": {
      "title": "Test Sample Kit",
      "description": "Premium melody loops for producers",
      "price": "$29",
      "image_url": "https://example.com/image.jpg",
      "handle": "test-sample-kit"
    }
  }'
```

### Test create post:
```bash
curl -X POST https://ghapdeffxpbzznxgfkoi.supabase.co/functions/v1/onlysocial-trigger \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create_post",
    "post": {
      "body": "Test post from API",
      "accounts": ["YOUR_ACCOUNT_UUID"]
    }
  }'
```

