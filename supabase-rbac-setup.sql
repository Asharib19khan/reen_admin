-- 1. Update the table constraint to remove 'employee'
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_role_check;
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_role_check CHECK (role IN ('super_admin', 'admin'));

-- 2. Update the trigger function to insert 'admin' by default
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_roles (id, email, role)
  VALUES (new.id, new.email, 'admin');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
