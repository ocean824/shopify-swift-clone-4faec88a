-- Drop the restrictive policy and create a permissive one
DROP POLICY IF EXISTS "Admins can view admin accounts" ON public.admin_accounts;

CREATE POLICY "Users can check their own admin status"
ON public.admin_accounts
FOR SELECT
TO authenticated
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid())::text);