-- Allow admins to insert redemptions
CREATE POLICY "Admins can insert redemptions"
ON public.code_redemptions
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin((SELECT email FROM auth.users WHERE id = auth.uid())));