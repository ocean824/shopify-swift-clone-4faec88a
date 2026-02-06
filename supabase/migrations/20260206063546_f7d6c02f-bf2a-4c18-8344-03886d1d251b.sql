-- Email automation tables for tracking subscribers and sequences

-- Subscriber segments table
CREATE TABLE public.email_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  shopify_customer_id TEXT,
  segment TEXT NOT NULL DEFAULT 'cold_subscriber',
  first_name TEXT,
  last_name TEXT,
  total_orders INTEGER DEFAULT 0,
  total_spent NUMERIC(10,2) DEFAULT 0,
  last_order_at TIMESTAMP WITH TIME ZONE,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Email sequence tracking (what emails have been sent)
CREATE TABLE public.email_sequence_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subscriber_id UUID NOT NULL REFERENCES public.email_subscribers(id) ON DELETE CASCADE,
  sequence_name TEXT NOT NULL,
  current_step INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_email_sent_at TIMESTAMP WITH TIME ZONE,
  next_email_scheduled_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(subscriber_id, sequence_name)
);

-- Email send log (audit trail)
CREATE TABLE public.email_send_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subscriber_id UUID REFERENCES public.email_subscribers(id) ON DELETE SET NULL,
  email_to TEXT NOT NULL,
  sequence_name TEXT,
  email_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  resend_id TEXT,
  status TEXT DEFAULT 'sent',
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Shopify webhook events log
CREATE TABLE public.shopify_webhook_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  shopify_id TEXT,
  payload JSONB,
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Email templates storage
CREATE TABLE public.email_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  sequence_name TEXT NOT NULL,
  step_number INTEGER NOT NULL,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  delay_hours INTEGER DEFAULT 0,
  email_type TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_sequence_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_send_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopify_webhook_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- Service role policies (for edge functions)
CREATE POLICY "Service role full access on email_subscribers"
ON public.email_subscribers FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role full access on email_sequence_progress"
ON public.email_sequence_progress FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role full access on email_send_log"
ON public.email_send_log FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role full access on shopify_webhook_log"
ON public.shopify_webhook_log FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role full access on email_templates"
ON public.email_templates FOR ALL
USING (true)
WITH CHECK (true);

-- Admin read policies
CREATE POLICY "Admins can view email_subscribers"
ON public.email_subscribers FOR SELECT
USING (EXISTS (SELECT 1 FROM public.admin_accounts WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Admins can view email_sequence_progress"
ON public.email_sequence_progress FOR SELECT
USING (EXISTS (SELECT 1 FROM public.admin_accounts WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Admins can view email_send_log"
ON public.email_send_log FOR SELECT
USING (EXISTS (SELECT 1 FROM public.admin_accounts WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Admins can view email_templates"
ON public.email_templates FOR SELECT
USING (EXISTS (SELECT 1 FROM public.admin_accounts WHERE email = auth.jwt()->>'email'));

-- Indexes for performance
CREATE INDEX idx_email_subscribers_email ON public.email_subscribers(email);
CREATE INDEX idx_email_subscribers_segment ON public.email_subscribers(segment);
CREATE INDEX idx_email_subscribers_shopify_id ON public.email_subscribers(shopify_customer_id);
CREATE INDEX idx_email_sequence_progress_subscriber ON public.email_sequence_progress(subscriber_id);
CREATE INDEX idx_email_sequence_progress_next_scheduled ON public.email_sequence_progress(next_email_scheduled_at) WHERE is_active = true;
CREATE INDEX idx_email_send_log_subscriber ON public.email_send_log(subscriber_id);
CREATE INDEX idx_shopify_webhook_log_processed ON public.shopify_webhook_log(processed) WHERE processed = false;

-- Trigger for updated_at
CREATE TRIGGER update_email_subscribers_updated_at
BEFORE UPDATE ON public.email_subscribers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at
BEFORE UPDATE ON public.email_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();