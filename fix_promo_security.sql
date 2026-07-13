-- Security Patch: Run this in your Supabase SQL Editor
-- This function securely increments a promo code's usage count, bypassing RLS limitations for guest users.

CREATE OR REPLACE FUNCTION increment_promo_usage(p_promo_code TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_promo record;
BEGIN
    SELECT * INTO v_promo FROM promo_codes WHERE code = p_promo_code AND is_active = true FOR UPDATE;
    
    IF v_promo IS NULL THEN
        RAISE EXCEPTION 'Invalid or inactive promo code.';
    END IF;

    IF v_promo.valid_until IS NOT NULL AND v_promo.valid_until < NOW() THEN
        RAISE EXCEPTION 'Promo code has expired.';
    END IF;

    IF v_promo.max_uses IS NOT NULL AND v_promo.current_uses >= v_promo.max_uses THEN
        RAISE EXCEPTION 'Promo code usage limit reached.';
    END IF;

    UPDATE promo_codes SET current_uses = current_uses + 1 WHERE id = v_promo.id;
    
    RETURN TRUE;
END;
$$;
