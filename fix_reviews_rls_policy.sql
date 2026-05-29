-- Fix reviews admin policy (uses user_roles.id, not user_id).
-- ONLY run this if public.customer_reviews already exists.
-- If you got "relation customer_reviews does not exist", run setup_customer_reviews.sql instead.

DROP POLICY IF EXISTS "Allow admin full access to reviews" ON public.customer_reviews;
CREATE POLICY "Allow admin full access to reviews"
  ON public.customer_reviews
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.id = auth.uid()
        AND ur.role IN ('super_admin', 'admin')
    )
  );
