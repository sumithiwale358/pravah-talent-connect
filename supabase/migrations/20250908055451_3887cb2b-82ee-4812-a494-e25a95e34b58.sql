-- Remove the overly permissive public access policy
DROP POLICY IF EXISTS "Public can count job seeker profiles" ON public.job_seeker_profiles;

-- Create a secure function for counting job seeker profiles that doesn't expose personal data
CREATE OR REPLACE FUNCTION public.get_job_seeker_count()
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COUNT(*) FROM job_seeker_profiles;
$$;

-- Create a secure function for counting employer profiles that doesn't expose personal data
CREATE OR REPLACE FUNCTION public.get_employer_count()
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COUNT(*) FROM employer_profiles;
$$;

-- Create a secure function for counting active jobs that doesn't expose sensitive data
CREATE OR REPLACE FUNCTION public.get_active_jobs_count()
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COUNT(*) FROM jobs WHERE status = 'active';
$$;

-- Grant execute permissions to anonymous users for these counting functions
GRANT EXECUTE ON FUNCTION public.get_job_seeker_count() TO anon;
GRANT EXECUTE ON FUNCTION public.get_employer_count() TO anon;
GRANT EXECUTE ON FUNCTION public.get_active_jobs_count() TO anon;

-- Remove similar overly permissive policies from other tables if they exist
DROP POLICY IF EXISTS "Public can count employer profiles" ON public.employer_profiles;
DROP POLICY IF EXISTS "Public can count job applications" ON public.job_applications;