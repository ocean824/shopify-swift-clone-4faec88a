-- Create purchases table to track user purchases
CREATE TABLE public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_id TEXT,
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  stripe_session_id TEXT,
  purchase_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Users can view purchases linked to their email or user_id
CREATE POLICY "Users can view their own purchases by email"
ON public.purchases FOR SELECT
USING (
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
  OR user_id = auth.uid()
);

-- Create index for faster lookups
CREATE INDEX idx_purchases_email ON public.purchases(email);
CREATE INDEX idx_purchases_user_id ON public.purchases(user_id);