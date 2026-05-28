-- Create Customer Reviews Table
CREATE TABLE IF NOT EXISTS public.customer_reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text NOT NULL,
  is_approved boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Setup RLS
ALTER TABLE public.customer_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to approved reviews" ON public.customer_reviews
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Allow admin full access to reviews" ON public.customer_reviews
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- Insert dummy featured data for initial load
INSERT INTO public.customer_reviews (customer_name, rating, review_text, is_approved, is_featured)
VALUES 
('Zara A.', 5, 'The permanent bracelet kit is literally the best thing ever. So seamless and beautiful! I haven''t taken it off since I got it.', true, true),
('Hina F.', 5, 'I bought the Fuchsia Corset Set for a dinner party and the fit is absolutely breathtaking. The cotton lawn is so breathable but looks so expensive.', true, true),
('Mariam K.', 5, 'My favorite place to shop for modern fusion wear. The quality of the traditional jhumkas perfectly matches their aesthetic clothing line.', true, true);
