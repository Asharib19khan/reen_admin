-- 1. Create the user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email text NOT NULL,
    role text NOT NULL DEFAULT 'employee' CHECK (role IN ('super_admin', 'admin', 'employee')),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS) on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own role
CREATE POLICY "Users can read own role" 
ON public.user_roles FOR SELECT 
USING (auth.uid() = id);

-- Allow super_admins to read all roles
CREATE POLICY "Super admins can read all roles" 
ON public.user_roles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.id = auth.uid() AND ur.role = 'super_admin'
  )
);

-- Allow super_admins to update roles
CREATE POLICY "Super admins can update roles" 
ON public.user_roles FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.id = auth.uid() AND ur.role = 'super_admin'
  )
);

-- 3. Create a trigger to auto-insert a role when a new user is created in Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_roles (id, email, role)
  VALUES (new.id, new.email, 'employee');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists (for safe re-running)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- =========================================================================
-- RUN THIS COMMAND *AFTER* YOU MANUALLY CREATE Yeezus196@gmail.com IN AUTH
-- =========================================================================
-- UPDATE public.user_roles SET role = 'super_admin' WHERE email = 'Yeezus196@gmail.com';
