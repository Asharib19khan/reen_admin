-- 1. Add new columns to the products table for categorization
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS is_new_arrival boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_best_selling boolean DEFAULT false;

-- 2. Update existing products to have a default category (Optional, but safe)
UPDATE public.products 
SET category = 'Uncategorized' 
WHERE category IS NULL;

-- Note: You do not need to update RLS policies because the existing policies on `products` cover all columns.
