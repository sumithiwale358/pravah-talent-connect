-- Add RLS policy to allow employers to view job seeker profile data
CREATE POLICY "Employers can view job seeker profile data" 
ON public.profiles 
FOR SELECT 
USING (
  user_type = 'jobseeker' 
  AND EXISTS (
    SELECT 1
    FROM profiles employer_profile
    WHERE employer_profile.user_id = auth.uid() 
    AND employer_profile.user_type = 'employer'
  )
);