import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Clock, Bookmark, Filter, Users, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const JobSeekerPortal = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('jobs')
        .select(`
          id,
          title,
          description,
          country,
          min_salary,
          max_salary,
          hide_salary,
          min_experience,
          max_experience,
          openings,
          created_at,
          status,
          employer_profiles (
            company_name,
            company_description
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Find Your Dream Job in India
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Discover thousands of opportunities from top companies across the country
              </p>

              {/* Search Bar */}
              <div className="bg-background rounded-lg shadow-elevation p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Job title or keywords"
                      className="pl-10"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Location"
                      className="pl-10"
                    />
                  </div>
                  <Button className="w-full">
                    Search Jobs
                  </Button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">5,000+</div>
                  <div className="text-muted-foreground">Active Jobs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">2,500+</div>
                  <div className="text-muted-foreground">Companies Hiring</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">50,000+</div>
                  <div className="text-muted-foreground">Job Seekers</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Jobs */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-foreground">Featured Jobs</h2>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>

            <div className="grid gap-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground">Loading jobs...</div>
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground">No jobs found. Check back later!</div>
                </div>
              ) : (
                jobs.map((job) => (
                  <Card key={job.id} className="p-6 hover:shadow-elevation transition-shadow duration-300">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-semibold text-foreground">{job.title}</h3>
                          <Button variant="ghost" size="icon">
                            <Bookmark className="w-5 h-5" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-4 text-muted-foreground mb-3">
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
                            {job.country || "India"}
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

                        <div className="text-lg font-semibold text-primary">{formatSalary(job)}</div>
                      </div>

                      <div className="mt-4 md:mt-0 md:ml-6">
                        <Button className="w-full md:w-auto">
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>

            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                View All Jobs
              </Button>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create your profile today and get discovered by top employers. Upload your resume, 
              showcase your skills, and take the next step in your career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                Create Profile
              </Button>
              <Button variant="outline" size="lg">
                Upload Resume
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default JobSeekerPortal;