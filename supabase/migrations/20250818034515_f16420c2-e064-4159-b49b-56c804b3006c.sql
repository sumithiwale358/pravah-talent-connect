-- Allow public read access for counting job seeker profiles
CREATE POLICY "Public can count job seeker profiles" 
ON public.job_seeker_profiles 
FOR SELECT 
USING (true);

-- Allow public read access for counting employer profiles  
CREATE POLICY "Public can count employer profiles"
ON public.employer_profiles 
FOR SELECT 
USING (true);

-- Allow public read access for counting job applications
CREATE POLICY "Public can count job applications"
ON public.job_applications 
FOR SELECT 
USING (true);