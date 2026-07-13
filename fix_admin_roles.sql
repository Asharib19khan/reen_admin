-- SECURITY PATCH: Remove automatic 'admin' assignment for all new signups
-- Run this in your Supabase SQL Editor.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- We no longer automatically grant 'admin' to everyone who signs up.
  -- The user_roles table will be updated manually by the Super Admin via the Team page.
  -- This prevents malicious actors from gaining admin access via public signup.
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
