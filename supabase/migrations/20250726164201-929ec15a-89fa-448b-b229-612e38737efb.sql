-- Add education and designation fields to job_seeker_profiles table
ALTER TABLE public.job_seeker_profiles 
ADD COLUMN education TEXT,
ADD COLUMN designation TEXT;