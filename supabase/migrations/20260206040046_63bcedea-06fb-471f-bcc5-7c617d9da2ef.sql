-- Fix VIP Accounts Table - Add RLS Policies
-- Allow users to view their own VIP status
CREATE POLICY "Users can view their own VIP status"
  ON public.vip_accounts FOR SELECT
  USING (email = (auth.jwt() ->> 'email'));

-- Allow admins to manage VIP accounts
CREATE POLICY "Admins can manage VIP accounts"
  ON public.vip_accounts FOR ALL
  USING (is_admin((auth.jwt() ->> 'email')::text))
  WITH CHECK (is_admin((auth.jwt() ->> 'email')::text));

-- Fix Pantheon Content Table - Add write protection policies
CREATE POLICY "Admins can insert pantheon content"
  ON public.pantheon_content FOR INSERT
  WITH CHECK (is_admin((auth.jwt() ->> 'email')::text));

CREATE POLICY "Admins can update pantheon content"
  ON public.pantheon_content FOR UPDATE
  USING (is_admin((auth.jwt() ->> 'email')::text))
  WITH CHECK (is_admin((auth.jwt() ->> 'email')::text));

CREATE POLICY "Admins can delete pantheon content"
  ON public.pantheon_content FOR DELETE
  USING (is_admin((auth.jwt() ->> 'email')::text));

-- Fix Purchases Table - Add explicit restrictive policies for write operations
CREATE POLICY "Deny direct insert on purchases"
  ON public.purchases FOR INSERT
  WITH CHECK (false);

CREATE POLICY "Deny direct update on purchases"
  ON public.purchases FOR UPDATE
  USING (false);

CREATE POLICY "Deny direct delete on purchases"
  ON public.purchases FOR DELETE
  USING (false);