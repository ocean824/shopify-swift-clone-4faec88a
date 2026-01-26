-- Create table to track lifetime access granted via discount codes
CREATE TABLE public.lifetime_access_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  code_used TEXT NOT NULL, -- The discount code they used
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  granted_by TEXT, -- Admin who verified
  purchase_verified BOOLEAN DEFAULT false, -- Has their purchase been verified?
  is_revoked BOOLEAN DEFAULT false, -- Can be revoked if they share the code
  revoked_at TIMESTAMP WITH TIME ZONE,
  revoked_reason TEXT,
  notes TEXT
);

-- Enable RLS
ALTER TABLE public.lifetime_access_codes ENABLE ROW LEVEL SECURITY;

-- Users can check their own access status
CREATE POLICY "Users can view their own lifetime access"
ON public.lifetime_access_codes
FOR SELECT
TO authenticated
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));