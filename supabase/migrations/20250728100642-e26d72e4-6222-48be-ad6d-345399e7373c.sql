-- Remove the problematic RLS policy that causes infinite recursion
DROP POLICY IF EXISTS "Employers can view job seeker profile data" ON public.profiles;

-- Create a simpler policy that allows employers to view job seeker profiles
-- This avoids recursion by not referencing the profiles table within the policy
CREATE POLICY "Employers can view job seeker profiles" 
ON public.profiles 
FOR SELECT 
USING (
  user_type = 'jobseeker' 
  AND auth.role() = 'authenticated'
);