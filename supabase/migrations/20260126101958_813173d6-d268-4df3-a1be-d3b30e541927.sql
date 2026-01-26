-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can check their own admin status" ON public.admin_accounts;

-- Create a new policy that uses auth.jwt() to get email from JWT token
CREATE POLICY "Users can check their own admin status"
ON public.admin_accounts
FOR SELECT
TO authenticated
USING (email = (auth.jwt() ->> 'email')::text);