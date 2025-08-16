-- Fix the employer_profile_id references in jobs table
-- Update jobs to use the correct employer_profile_id
UPDATE jobs 
SET employer_profile_id = ep.id
FROM employer_profiles ep
WHERE jobs.employer_profile_id = ep.profile_id;