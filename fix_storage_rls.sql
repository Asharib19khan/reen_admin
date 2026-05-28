-- =====================================================
-- MIGRATION: Add missing columns to products table
-- =====================================================

-- Add all the extended product columns if they don't already exist
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS color_options TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS size_matrix TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS has_custom_measurement BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS interactive_addons TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS hero_image_concept TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS view_360_url TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS video_url TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS hook_text TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS deep_dive_description TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS fabric_care TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS sizing_note TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS is_best_selling BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_new_arrival BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS image_urls TEXT[] DEFAULT '{}';

-- =====================================================
-- FIX: Products Table RLS Policies
-- =====================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read products" ON public.products;
CREATE POLICY "Public can read products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Auth users can insert products" ON public.products;
CREATE POLICY "Auth users can insert products" ON public.products FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Auth users can update products" ON public.products;
CREATE POLICY "Auth users can update products" ON public.products FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Auth users can delete products" ON public.products;
CREATE POLICY "Auth users can delete products" ON public.products FOR DELETE TO authenticated USING (true);

-- =====================================================
-- FIX: Storage Bucket (50MB limit + permissions)
-- =====================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('product-images', 'product-images', true, 52428800)
ON CONFLICT (id) DO UPDATE SET file_size_limit = 52428800, public = true;

DROP POLICY IF EXISTS "Public Access to product-images" ON storage.objects;
CREATE POLICY "Public Access to product-images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Auth Upload to product-images" ON storage.objects;
CREATE POLICY "Auth Upload to product-images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Auth Update to product-images" ON storage.objects;
CREATE POLICY "Auth Update to product-images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Auth Delete to product-images" ON storage.objects;
CREATE POLICY "Auth Delete to product-images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'product-images');
