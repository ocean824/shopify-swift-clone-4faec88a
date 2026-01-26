-- Create VIP accounts table for special access
CREATE TABLE public.vip_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  has_lifetime_pantheon BOOLEAN NOT NULL DEFAULT true,
  has_all_products BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS (admin-only table, no public access)
ALTER TABLE public.vip_accounts ENABLE ROW LEVEL SECURITY;

-- No public policies - only accessible via service role in edge functions