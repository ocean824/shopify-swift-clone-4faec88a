
-- 1. Drop "Service role full access" policies on all 5 tables
DROP POLICY IF EXISTS "Service role full access on email_subscribers" ON public.email_subscribers;
DROP POLICY IF EXISTS "Service role full access on email_send_log" ON public.email_send_log;
DROP POLICY IF EXISTS "Service role full access on email_sequence_progress" ON public.email_sequence_progress;
DROP POLICY IF EXISTS "Service role full access on email_templates" ON public.email_templates;
DROP POLICY IF EXISTS "Service role full access on shopify_webhook_log" ON public.shopify_webhook_log;

-- 2. Drop the existing pantheon_content SELECT policy and replace with entitlement-checked version
DROP POLICY IF EXISTS "Authenticated users can view active pantheon content" ON public.pantheon_content;

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
  )
);
