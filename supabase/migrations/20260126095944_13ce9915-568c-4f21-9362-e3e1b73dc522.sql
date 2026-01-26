-- Create storage bucket for pantheon content
INSERT INTO storage.buckets (id, name, public)
VALUES ('pantheon-content', 'pantheon-content', false);

-- Create table to track pantheon exclusive content
CREATE TABLE public.pantheon_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL, -- 'Beats', 'Samples', 'CST', 'VST', 'Collab', 'New', etc.
  description TEXT,
  file_path TEXT NOT NULL, -- Path in storage bucket
  external_url TEXT, -- Optional external URL (Dropbox, WeTransfer, etc.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE public.pantheon_content ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view active content (they still need subscription check in app)
CREATE POLICY "Authenticated users can view active pantheon content"
ON public.pantheon_content
FOR SELECT
TO authenticated
USING (is_active = true);

-- Storage policies - only authenticated users can download
CREATE POLICY "Authenticated users can download pantheon content"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'pantheon-content');

-- Add trigger for updated_at
CREATE TRIGGER update_pantheon_content_updated_at
BEFORE UPDATE ON public.pantheon_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();