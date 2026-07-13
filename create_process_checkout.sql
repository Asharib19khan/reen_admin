-- RUN THIS IN YOUR SUPABASE SQL EDITOR TO FIX THE CHECKOUT

-- Drop the old one just in case the signature was different
DROP FUNCTION IF EXISTS public.process_checkout(text, text, text, numeric, jsonb);

CREATE OR REPLACE FUNCTION public.process_checkout(
  p_customer_name text,
  p_customer_phone text,
  p_customer_address text,
  p_total_amount numeric,
  p_cart_items jsonb
) RETURNS uuid AS $$
DECLARE
  v_order_id uuid;
  v_item jsonb;
BEGIN
  -- Insert into orders table
  INSERT INTO public.orders (
    customer_name,
    customer_phone,
    customer_address,
    total_amount,
    status
  ) VALUES (
    p_customer_name,
    p_customer_phone,
    p_customer_address,
    p_total_amount,
    'pending'
  ) RETURNING id INTO v_order_id;

  -- Iterate over JSON array of cart items
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_cart_items)
  LOOP
    INSERT INTO public.order_items (
      order_id,
      product_id,
      quantity,
      price_at_purchase,
      selected_color,
      selected_size,
      custom_measurement,
      selected_addon
    ) VALUES (
      v_order_id,
      (v_item->>'product_id')::uuid,
      (v_item->>'quantity')::numeric,
      (v_item->>'price_at_purchase')::numeric,
      v_item->>'selected_color',
      v_item->>'selected_size',
      v_item->>'custom_measurement',
      v_item->>'selected_addon'
    );
    
    -- Reduce master inventory quantity for the product
    UPDATE public.products
    SET quantity = GREATEST(0, quantity - (v_item->>'quantity')::numeric)
    WHERE id = (v_item->>'product_id')::uuid;
  END LOOP;

  RETURN v_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
