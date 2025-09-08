import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('type') || 'jobseeker';

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          toast.error("Authentication failed: " + error.message);
          navigate("/login");
          return;
        }

        if (data.session?.user) {
          const user = data.session.user;
          
          // Check if user already has a profile
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('user_type')
            .eq('user_id', user.id)
            .single();

          if (existingProfile) {
            // User already exists, redirect based on their type
            if (existingProfile.user_type === 'jobseeker') {
              navigate("/job-seeker");
            } else if (existingProfile.user_type === 'employer') {
              navigate("/employer");
            } else {
              navigate("/");
            }
            return;
          }

          // Create new profile for OAuth user
          const profileData = {
            user_id: user.id,
            user_type: userType as 'jobseeker' | 'employer',
            email: user.email || '',
            phone: user.user_metadata?.phone || '',
            location: ''
          };

          const { error: profileError } = await supabase
            .from('profiles')
            .insert(profileData);

          if (profileError) {
            toast.error("Failed to create profile");
            navigate("/login");
            return;
          }

          // Get the created profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('user_id', user.id)
            .single();

          if (!profile) {
            toast.error("Failed to retrieve profile");
            navigate("/login");
            return;
          }

          // Create specific profile based on user type
          if (userType === 'jobseeker') {
            const { error: jsError } = await supabase
              .from('job_seeker_profiles')
              .insert({
                profile_id: profile.id,
                first_name: user.user_metadata?.full_name?.split(' ')[0] || user.user_metadata?.first_name || '',
                last_name: user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || user.user_metadata?.last_name || '',
                experience_level: 'fresher' as const // Default value
              });

            if (jsError) {
              console.error('Job seeker profile creation error:', jsError);
            }
          } else if (userType === 'employer') {
            const { error: empError } = await supabase
              .from('employer_profiles')
              .insert({
                profile_id: profile.id,
                company_name: user.user_metadata?.company || 'Company Name',
                contact_person: user.user_metadata?.full_name || user.user_metadata?.name || 'Contact Person',
                designation: '',
                company_size: 'small' as const // Default value
              });

            if (empError) {
              console.error('Employer profile creation error:', empError);
            }
          }

          toast.success("Successfully signed in!");
          
          // Redirect based on user type
          if (userType === 'jobseeker') {
            navigate("/job-seeker");
          } else {
            navigate("/employer");
          }
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        toast.error("Authentication failed");
        navigate("/login");
      }
    };

    handleOAuthCallback();
  }, [navigate, userType]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;