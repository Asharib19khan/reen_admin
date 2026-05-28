-- Run in Supabase SQL Editor after deploying storefront/admin changes.
-- Adds variant columns on order_items and updates process_checkout to persist them.

ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS selected_color text,
  ADD COLUMN IF NOT EXISTS selected_size text,
  ADD COLUMN IF NOT EXISTS custom_measurement text,
  ADD COLUMN IF NOT EXISTS selected_addon text;

CREATE OR REPLACE FUNCTION public.process_checkout(
  p_customer_name text,
  p_customer_phone text,
  p_customer_address text,
  p_total_amount numeric,
  p_cart_items jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_id uuid;
  v_item jsonb;
  v_product_id uuid;
  v_qty integer;
  v_price numeric;
BEGIN
  INSERT INTO public.orders (
    customer_name,
    customer_phone,
    customer_address,
    total_amount,
    status
  )
  VALUES (
    p_customer_name,
    p_customer_phone,
    p_customer_address,
    p_total_amount,
    'Pending'
  )
  RETURNING id INTO v_order_id;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_cart_items)
  LOOP
    v_product_id := (v_item->>'product_id')::uuid;
    v_qty := COALESCE((v_item->>'quantity')::integer, 1);
    v_price := (v_item->>'price_at_purchase')::numeric;

    INSERT INTO public.order_items (
      order_id,
      product_id,
      quantity,
      price_at_purchase,
      selected_color,
      selected_size,
      custom_measurement,
      selected_addon
    )
    VALUES (
      v_order_id,
      v_product_id,
      v_qty,
      v_price,
      NULLIF(TRIM(v_item->>'selected_color'), ''),
      NULLIF(TRIM(v_item->>'selected_size'), ''),
      NULLIF(TRIM(v_item->>'custom_measurement'), ''),
      NULLIF(TRIM(v_item->>'selected_addon'), '')
    );

    UPDATE public.products
    SET quantity = GREATEST(0, quantity - v_qty)
    WHERE id = v_product_id;
  END LOOP;

  RETURN v_order_id;
END;
$$;
