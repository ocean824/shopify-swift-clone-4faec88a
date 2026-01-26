-- Create admin accounts table
CREATE TABLE public.admin_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add you as admin
INSERT INTO public.admin_accounts (email) VALUES ('ocean824@gmail.com');

-- Enable RLS
ALTER TABLE public.admin_accounts ENABLE ROW LEVEL SECURITY;

-- Admins can view admin list
CREATE POLICY "Admins can view admin accounts"
ON public.admin_accounts
FOR SELECT
TO authenticated
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Create discount codes table
CREATE TABLE public.discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  
  -- Discount settings
  discount_type TEXT NOT NULL DEFAULT 'percentage', -- 'percentage', 'fixed', 'free'
  discount_value NUMERIC DEFAULT 0, -- percentage (0-100) or fixed amount
  
  -- Usage limits
  max_uses INTEGER, -- null = unlimited
  current_uses INTEGER DEFAULT 0,
  
  -- What it grants
  grants_pantheon_lifetime BOOLEAN DEFAULT false,
  applies_to TEXT DEFAULT 'all', -- 'all', 'subscription', 'products'
  specific_products TEXT[], -- array of product handles if applies_to = 'products'
  
  -- Validity
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  
  -- Tracking
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by TEXT
);

-- Enable RLS
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;

-- Security definer function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_accounts WHERE email = user_email
  )
$$;

-- Admins can manage discount codes
CREATE POLICY "Admins can view all discount codes"
ON public.discount_codes
FOR SELECT
TO authenticated
USING (public.is_admin((SELECT email FROM auth.users WHERE id = auth.uid())));

CREATE POLICY "Admins can create discount codes"
ON public.discount_codes
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin((SELECT email FROM auth.users WHERE id = auth.uid())));

CREATE POLICY "Admins can update discount codes"
ON public.discount_codes
FOR UPDATE
TO authenticated
USING (public.is_admin((SELECT email FROM auth.users WHERE id = auth.uid())));

CREATE POLICY "Admins can delete discount codes"
ON public.discount_codes
FOR DELETE
TO authenticated
USING (public.is_admin((SELECT email FROM auth.users WHERE id = auth.uid())));

-- Track code redemptions
CREATE TABLE public.code_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code_id UUID REFERENCES public.discount_codes(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  purchase_verified BOOLEAN DEFAULT false,
  is_revoked BOOLEAN DEFAULT false,
  revoked_at TIMESTAMP WITH TIME ZONE,
  revoked_reason TEXT
);

-- Enable RLS
ALTER TABLE public.code_redemptions ENABLE ROW LEVEL SECURITY;

-- Users can see their own redemptions
CREATE POLICY "Users can view their own redemptions"
ON public.code_redemptions
FOR SELECT
TO authenticated
USING (user_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Admins can manage all redemptions
CREATE POLICY "Admins can view all redemptions"
ON public.code_redemptions
FOR SELECT
TO authenticated
USING (public.is_admin((SELECT email FROM auth.users WHERE id = auth.uid())));

CREATE POLICY "Admins can update redemptions"
ON public.code_redemptions
FOR UPDATE
TO authenticated
USING (public.is_admin((SELECT email FROM auth.users WHERE id = auth.uid())));

CREATE POLICY "Admins can delete redemptions"
ON public.code_redemptions
FOR DELETE
TO authenticated
USING (public.is_admin((SELECT email FROM auth.users WHERE id = auth.uid())));