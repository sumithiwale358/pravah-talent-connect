-- Add city field to jobs table
ALTER TABLE public.jobs 
ADD COLUMN city text;