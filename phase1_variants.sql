-- Phase 1: Product Variants Table
-- Run this in your Supabase SQL Editor

-- 1. Create the product_variants table
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    color TEXT,
    size TEXT,
    quantity INTEGER DEFAULT 0 NOT NULL,
    sku TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Anyone can view variants
CREATE POLICY "Enable read access for all users on variants" 
ON public.product_variants FOR SELECT 
USING (true);

-- Only authenticated admins can insert/update/delete variants
CREATE POLICY "Enable insert for authenticated users on variants" 
ON public.product_variants FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users on variants" 
ON public.product_variants FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users on variants" 
ON public.product_variants FOR DELETE 
TO authenticated 
USING (true);

-- 4. Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);
