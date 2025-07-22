-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for user types
CREATE TYPE public.user_type AS ENUM ('jobseeker', 'employer');

-- Create enum for experience levels
CREATE TYPE public.experience_level AS ENUM ('fresher', 'junior', 'mid', 'senior');

-- Create enum for company sizes
CREATE TYPE public.company_size AS ENUM ('startup', 'small', 'medium', 'large', 'enterprise');

-- Create profiles table to store additional user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  user_type user_type NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create job seeker profiles table
CREATE TABLE public.job_seeker_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  experience_level experience_level,
  skills TEXT[],
  resume_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create employer profiles table
CREATE TABLE public.employer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  designation TEXT,
  company_size company_size,
  company_description TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_seeker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employer_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles table
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for job seeker profiles
CREATE POLICY "Job seekers can view their own profile" 
ON public.job_seeker_profiles 
FOR SELECT 
USING (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = profile_id));

CREATE POLICY "Job seekers can create their own profile" 
ON public.job_seeker_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = profile_id));

CREATE POLICY "Job seekers can update their own profile" 
ON public.job_seeker_profiles 
FOR UPDATE 
USING (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = profile_id));

CREATE POLICY "Employers can view job seeker profiles" 
ON public.job_seeker_profiles 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.user_id = auth.uid() AND p.user_type = 'employer'
));

-- Create RLS policies for employer profiles
CREATE POLICY "Employers can view their own profile" 
ON public.employer_profiles 
FOR SELECT 
USING (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = profile_id));

CREATE POLICY "Employers can create their own profile" 
ON public.employer_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = profile_id));

CREATE POLICY "Employers can update their own profile" 
ON public.employer_profiles 
FOR UPDATE 
USING (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = profile_id));

CREATE POLICY "Job seekers can view employer profiles" 
ON public.employer_profiles 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.user_id = auth.uid() AND p.user_type = 'jobseeker'
));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_seeker_profiles_updated_at
  BEFORE UPDATE ON public.job_seeker_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_employer_profiles_updated_at
  BEFORE UPDATE ON public.employer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();