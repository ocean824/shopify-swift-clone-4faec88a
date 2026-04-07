
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
      SELECT 1 FROM public.purchases
      WHERE purchases.email = (auth.jwt() ->> 'email'::text)
        AND purchases.product_name ILIKE '%pantheon%'
    )
  )
);
