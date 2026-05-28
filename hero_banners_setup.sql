-- Create a new table for hero banners
CREATE TABLE IF NOT EXISTS public.hero_banners (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  media_url text NOT NULL,
  media_type text CHECK (media_type IN ('image', 'video')) NOT NULL,
  is_active boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active banners
CREATE POLICY "Allow public read access on banners" 
  ON public.hero_banners
  FOR SELECT 
  USING (true);

-- Allow authenticated users full access
CREATE POLICY "Allow authenticated full access on banners"
  ON public.hero_banners
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Create a storage bucket for media if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for the media bucket
CREATE POLICY "Public Access" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'media');

CREATE POLICY "Authenticated users can upload media" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update media" 
  ON storage.objects FOR UPDATE 
  USING (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete media" 
  ON storage.objects FOR DELETE 
  USING (bucket_id = 'media' AND auth.role() = 'authenticated');
