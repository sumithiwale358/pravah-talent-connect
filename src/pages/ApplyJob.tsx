import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, Star, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const ApplyJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [jobSeekerProfile, setJobSeekerProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login?tab=jobseeker');
      return;
    }
    fetchJobDetails();
    fetchJobSeekerProfile();
  }, [jobId, user]);

  const fetchJobDetails = async () => {
    try {
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select(`
          id,
          title,
          description,
          country,
          city,
          min_salary,
          max_salary,
          hide_salary,
          min_experience,
          max_experience,
          openings,
          created_at,
          status,
          employer_profile_id
        `)
        .eq('id', jobId)
        .eq('status', 'active')
        .single();

      if (jobError) throw jobError;

      if (jobData) {
        // Fetch employer profile
        const { data: employerProfile, error: employerError } = await supabase
          .from('employer_profiles')
          .select('id, company_name, company_description')
          .eq('id', jobData.employer_profile_id)
          .single();

        if (employerError) throw employerError;

        setJob({
          ...jobData,
          employer_profiles: employerProfile
        });
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
      toast({
        title: "Error",
        description: "Failed to load job details",
        variant: "destructive",
      });
      navigate('/job-seeker');
    } finally {
      setLoading(false);
    }
  };

  const fetchJobSeekerProfile = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (profile) {
        const { data: jobSeekerData } = await supabase
          .from('job_seeker_profiles')
          .select('id')
          .eq('profile_id', profile.id)
          .single();

        setJobSeekerProfile(jobSeekerData);
      }
    } catch (error) {
      console.error('Error fetching job seeker profile:', error);
    }
  };

  const handleApply = async () => {
    if (!jobSeekerProfile) {
      toast({
        title: "Profile Required",
        description: "Please complete your profile before applying",
        variant: "destructive",
      });
      navigate('/job-seeker-profile');
      return;
    }

    setApplying(true);
    try {
      const { error } = await supabase
        .from('job_applications')
        .insert([
          {
            job_id: jobId,
            job_seeker_profile_id: jobSeekerProfile.id,
            cover_letter: coverLetter.trim() || null,
            status: 'pending'
          }
        ]);

      if (error) throw error;

      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully!",
      });
      navigate('/job-seeker');
    } catch (error: any) {
      console.error('Error applying for job:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit application",
        variant: "destructive",
      });
    } finally {
      setApplying(false);
    }
  };

  const formatSalary = (job: any) => {
    if (job.hide_salary) return "Salary not disclosed";
    if (job.min_salary && job.max_salary) {
      return `₹${(job.min_salary / 100000).toFixed(0)}-${(job.max_salary / 100000).toFixed(0)} LPA`;
    }
    if (job.min_salary) {
      return `₹${(job.min_salary / 100000).toFixed(0)}+ LPA`;
    }
    return "Salary not mentioned";
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Loading job details...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Job not found</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate('/job-seeker')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Details */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground mb-2">{job.title}</h1>
                
                <div className="flex items-center gap-4 text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {job.employer_profiles?.company_name || "Company"}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    4.0
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {job.city || job.country || "India"}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {getTimeAgo(job.created_at)}
                  </div>
                  <Badge variant="secondary">Full-time</Badge>
                </div>

                {job.min_experience && job.max_experience && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline">
                      {job.min_experience}-{job.max_experience} years exp
                    </Badge>
                    {job.openings && (
                      <Badge variant="outline">{job.openings} openings</Badge>
                    )}
                  </div>
                )}

                <div className="text-2xl font-semibold text-primary mb-6">{formatSalary(job)}</div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Job Description</h2>
                <div className="text-muted-foreground whitespace-pre-wrap">{job.description}</div>
              </div>
            </Card>
          </div>

          {/* Application Form */}
          <div>
            <Card className="p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Apply for this Job</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Cover Letter (Optional)</label>
                  <Textarea
                    placeholder="Tell the employer why you're the perfect fit for this role..."
                    rows={6}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                  />
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleApply}
                  disabled={applying}
                >
                  {applying ? "Submitting..." : "Submit Application"}
                </Button>

                <p className="text-xs text-muted-foreground">
                  By applying, you agree to our terms and conditions. Your profile information will be shared with the employer.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ApplyJob;