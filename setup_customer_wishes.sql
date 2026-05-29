-- Run in Supabase SQL Editor before using Admin → Customer Wishes or storefront wishlists.

CREATE TABLE IF NOT EXISTS public.customer_wishes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  visitor_id text NOT NULL,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (product_id, visitor_id)
);

CREATE INDEX IF NOT EXISTS customer_wishes_product_id_idx ON public.customer_wishes(product_id);
CREATE INDEX IF NOT EXISTS customer_wishes_visitor_id_idx ON public.customer_wishes(visitor_id);
CREATE INDEX IF NOT EXISTS customer_wishes_created_at_idx ON public.customer_wishes(created_at DESC);

ALTER TABLE public.customer_wishes ENABLE ROW LEVEL SECURITY;

-- Storefront (anonymous visitors) — upsert/delete filtered client-side by visitor_id
DROP POLICY IF EXISTS "Allow anon insert customer wishes" ON public.customer_wishes;
CREATE POLICY "Allow anon insert customer wishes"
  ON public.customer_wishes
  FOR INSERT
  TO anon
  WITH CHECK (
    visitor_id IS NOT NULL
    AND char_length(visitor_id) >= 8
    AND product_id IS NOT NULL
    AND customer_name IS NOT NULL
    AND customer_phone IS NOT NULL
  );

DROP POLICY IF EXISTS "Allow anon update customer wishes" ON public.customer_wishes;
CREATE POLICY "Allow anon update customer wishes"
  ON public.customer_wishes
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (visitor_id IS NOT NULL);

DROP POLICY IF EXISTS "Allow anon delete customer wishes" ON public.customer_wishes;
CREATE POLICY "Allow anon delete customer wishes"
  ON public.customer_wishes
  FOR DELETE
  TO anon
  USING (true);

-- Admin vault — catalog managers
DROP POLICY IF EXISTS "Allow admin full access to customer wishes" ON public.customer_wishes;
CREATE POLICY "Allow admin full access to customer wishes"
  ON public.customer_wishes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.id = auth.uid()
        AND ur.role IN ('super_admin', 'admin')
    )
  );
