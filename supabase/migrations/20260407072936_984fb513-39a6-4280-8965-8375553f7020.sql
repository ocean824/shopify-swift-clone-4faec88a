
-- Create subscription_status table
CREATE TABLE public.subscription_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  stripe_customer_id text,
  stripe_subscription_id text UNIQUE,
  status text NOT NULL DEFAULT 'active',
  current_period_end timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_subscription_status_email ON public.subscription_status(email);
CREATE INDEX idx_subscription_status_stripe_sub ON public.subscription_status(stripe_subscription_id);

ALTER TABLE public.subscription_status ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscription status
CREATE POLICY "Users can view own subscription status"
ON public.subscription_status
FOR SELECT
TO authenticated
USING (email = (auth.jwt() ->> 'email'::text));

-- Admins can view all
CREATE POLICY "Admins can view all subscription status"
ON public.subscription_status
FOR SELECT
TO authenticated
USING (is_admin((auth.jwt() ->> 'email'::text)));

-- Deny all client writes
CREATE POLICY "Deny direct insert on subscription_status"
ON public.subscription_status FOR INSERT TO public
WITH CHECK (false);

CREATE POLICY "Deny direct update on subscription_status"
ON public.subscription_status FOR UPDATE TO public
USING (false);

CREATE POLICY "Deny direct delete on subscription_status"
ON public.subscription_status FOR DELETE TO public
USING (false);

-- Update pantheon_content policy to use subscription_status
DROP POLICY IF EXISTS "Entitled users can view active pantheon content" ON public.pantheon_content;

CREATE POLICY "Entitled users can view active pantheon content"
ON public.pantheon_content
FOR SELECT
TO authenticated
USING (
  is_active = true
  AND (
    is_admin((auth.jwt() ->> 'email'::text))
    OR EXISTS (
      SELECT 1 FROM public.vip_accounts
      WHERE vip_accounts.email = (auth.jwt() ->> 'email'::text)
        AND vip_accounts.has_lifetime_pantheon = true
    )
    OR EXISTS (
      SELECT 1 FROM public.lifetime_access_codes
      WHERE lifetime_access_codes.email = (auth.jwt() ->> 'email'::text)
        AND lifetime_access_codes.is_revoked = false
    )
    OR EXISTS (
      SELECT 1 FROM public.subscription_status
      WHERE subscription_status.email = (auth.jwt() ->> 'email'::text)
        AND subscription_status.status IN ('active', 'trialing')
    )
  )
);

-- Add updated_at trigger
CREATE TRIGGER update_subscription_status_updated_at
  BEFORE UPDATE ON public.subscription_status
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
