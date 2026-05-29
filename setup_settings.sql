-- Checkout payment instructions (Admin → Settings).

CREATE TABLE IF NOT EXISTS public.settings (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT ''
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read settings" ON public.settings;
CREATE POLICY "Allow public read settings"
  ON public.settings
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow admin manage settings" ON public.settings;
CREATE POLICY "Allow admin manage settings"
  ON public.settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.id = auth.uid()
        AND ur.role = 'super_admin'
    )
  );

INSERT INTO public.settings (key, value)
VALUES ('payment_details', 'Please complete your payment and share the transaction screenshot on WhatsApp.')
ON CONFLICT (key) DO NOTHING;
