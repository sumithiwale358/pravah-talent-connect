import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Edit, 
  Users, 
  Clock, 
  MapPin, 
  Building2,
  DollarSign,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId, user]);

  const fetchJobDetails = async () => {
    setLoading(true);
    
    // First get the job data
    const { data: jobData, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load job details",
        variant: "destructive"
      });
      navigate('/employer');
      return;
    }

    // Then get employer profile data
    const { data: employerProfile } = await supabase
      .from('employer_profiles')
      .select('company_name, company_description, website, profile_id')
      .eq('id', jobData.employer_profile_id)
      .single();

    // Check if current user owns this job
    if (user && employerProfile) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('id', employerProfile.profile_id)
        .single();
        
      if (profile?.user_id === user.id) {
        setIsOwner(true);
      }
    }

    // Combine the data
    const jobWithEmployer = {
      ...jobData,
      employer_profiles: employerProfile
    };

    setJob(jobWithEmployer);
    setLoading(false);
  };

  const handleEdit = () => {
    navigate(`/post-job?edit=${jobId}`);
  };

  const handleBack = () => {
    navigate('/employer');
  };

  const formatSalary = (min: number, max: number, hide: boolean) => {
    if (hide) return "Salary not disclosed";
    if (min && max) return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
    if (min) return `₹${min.toLocaleString()}+`;
    return "Salary negotiable";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Job not found</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            
            {isOwner && (
              <Button onClick={handleEdit} className="ml-auto">
                <Edit className="w-4 h-4 mr-2" />
                Edit Job
              </Button>
            )}
          </div>

          {/* Job Header */}
          <Card className="p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-foreground">{job.title}</h1>
                  <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                    {job.status === 'active' ? 'Active' : job.status}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-lg text-muted-foreground mb-4">
                  <Building2 className="w-5 h-5" />
                  {job.employer_profiles?.company_name}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{job.applications_count || 0} Applications</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Posted {formatDate(job.created_at)}</span>
                  </div>
                  
                  {job.city && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{job.city}, {job.country}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Job Details */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Job Description</h2>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{job.description}</p>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Job Info */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Job Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Salary</div>
                      <div className="font-medium">
                        {formatSalary(job.min_salary, job.max_salary, job.hide_salary)}
                      </div>
                    </div>
                  </div>

                  {job.openings && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Openings</div>
                        <div className="font-medium">{job.openings}</div>
                      </div>
                    </div>
                  )}

                  {(job.min_experience || job.max_experience) && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Experience</div>
                        <div className="font-medium">
                          {job.min_experience && job.max_experience 
                            ? `${job.min_experience} - ${job.max_experience} years`
                            : job.min_experience 
                            ? `${job.min_experience}+ years`
                            : `Up to ${job.max_experience} years`}
                        </div>
                      </div>
                    </div>
                  )}

                  {job.expires_at && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Expires</div>
                        <div className="font-medium">{formatDate(job.expires_at)}</div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Company Info */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">About Company</h3>
                <div className="space-y-3">
                  <h4 className="font-medium">{job.employer_profiles?.company_name}</h4>
                  {job.employer_profiles?.company_description && (
                    <p className="text-sm text-muted-foreground">
                      {job.employer_profiles.company_description}
                    </p>
                  )}
                  {job.employer_profiles?.website && (
                    <a 
                      href={job.employer_profiles.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Visit Company Website
                    </a>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JobDetails;