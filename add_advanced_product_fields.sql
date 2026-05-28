-- Advanced E-Commerce Product Architecture Schema
-- Adds the exact fields from the Copywriting Manifest

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS hero_image_concept text,
ADD COLUMN IF NOT EXISTS view_360_url text,
ADD COLUMN IF NOT EXISTS video_url text,
ADD COLUMN IF NOT EXISTS color_options text,
ADD COLUMN IF NOT EXISTS size_matrix text,
ADD COLUMN IF NOT EXISTS has_custom_measurement boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS interactive_addons text,
ADD COLUMN IF NOT EXISTS hook_text text,
ADD COLUMN IF NOT EXISTS deep_dive_description text,
ADD COLUMN IF NOT EXISTS fabric_care text,
ADD COLUMN IF NOT EXISTS sizing_note text;

-- RLS policies on the 'products' table already exist and cover these new columns.
