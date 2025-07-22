import { useState, useEffect, createContext, useContext } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) return { error };

      if (data.user) {
        // Create profile record
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            user_type: userData.userType,
            email: email,
            phone: userData.phone,
            location: userData.location
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          return { error: profileError };
        }

        // Create specific profile based on user type
        if (userData.userType === 'jobseeker') {
          const { error: jsError } = await supabase
            .from('job_seeker_profiles')
            .insert({
              profile_id: (await supabase
                .from('profiles')
                .select('id')
                .eq('user_id', data.user.id)
                .single()).data?.id,
              first_name: userData.firstName,
              last_name: userData.lastName,
              experience_level: userData.experienceLevel
            });

          if (jsError) {
            console.error('Job seeker profile creation error:', jsError);
            return { error: jsError };
          }
        } else if (userData.userType === 'employer') {
          const { error: empError } = await supabase
            .from('employer_profiles')
            .insert({
              profile_id: (await supabase
                .from('profiles')
                .select('id')
                .eq('user_id', data.user.id)
                .single()).data?.id,
              company_name: userData.companyName,
              contact_person: userData.contactPerson,
              designation: userData.designation,
              company_size: userData.companySize
            });

          if (empError) {
            console.error('Employer profile creation error:', empError);
            return { error: empError };
          }
        }
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};