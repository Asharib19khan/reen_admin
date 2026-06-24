-- Phase 3: Promo Codes Table
-- Run this in your Supabase SQL Editor

-- 1. Create the promo_codes table
CREATE TABLE IF NOT EXISTS public.promo_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC NOT NULL CHECK (discount_value > 0),
    min_order_value NUMERIC DEFAULT 0,
    max_uses INTEGER DEFAULT NULL,
    current_uses INTEGER DEFAULT 0,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Anyone can READ active promo codes (needed for checkout validation)
CREATE POLICY "Enable read access for all users on active promo codes" 
ON public.promo_codes FOR SELECT 
USING (is_active = true);

-- Only authenticated admins can insert/update/delete promo codes
CREATE POLICY "Enable insert for authenticated users on promo codes" 
ON public.promo_codes FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users on promo codes" 
ON public.promo_codes FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users on promo codes" 
ON public.promo_codes FOR DELETE 
TO authenticated 
USING (true);

-- 4. Create an index for faster lookups during checkout
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON public.promo_codes(code);
