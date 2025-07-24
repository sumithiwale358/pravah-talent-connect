import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, TrendingUp, Plus, Eye, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const EmployerPortal = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState<number | null>(null);

  const handlePostJob = () => {
    console.log("Navigating to post job page...");
    navigate("/post-job");
  };

  const handleBrowseCandidates = () => {
    toast({
      title: "Browse Candidates",
      description: "Loading candidate database...",
    });
    // In a real app, this would navigate to candidate browsing page
  };

  const handleViewAllJobs = () => {
    toast({
      title: "View All Jobs",
      description: "Loading complete job listings...",
    });
    // In a real app, this would navigate to all jobs page
  };

  const handleViewJob = (jobId: number) => {
    setSelectedJob(jobId);
    toast({
      title: "View Job Details",
      description: `Loading details for job ID: ${jobId}`,
    });
    // In a real app, this would navigate to job details page
  };

  const handleEditJob = (jobId: number) => {
    toast({
      title: "Edit Job",
      description: `Opening editor for job ID: ${jobId}`,
    });
    // In a real app, this would navigate to job editing form
  };

  const handleGetStarted = (plan: string) => {
    toast({
      title: `${plan} Plan`,
      description: "Redirecting to subscription page...",
    });
    // In a real app, this would navigate to subscription/payment page
  };

  const handleContactSales = () => {
    toast({
      title: "Contact Sales",
      description: "Opening contact form...",
    });
    // In a real app, this would open contact form or navigate to contact page
  };

  const features = [
    {
      icon: Users,
      title: "Access Top Talent",
      description: "Connect with skilled professionals across India ready to join your team"
    },
    {
      icon: TrendingUp,
      title: "Smart Matching",
      description: "Our AI-powered system matches the best candidates to your job requirements"
    },
    {
      icon: Building2,
      title: "Company Branding",
      description: "Showcase your company culture and values to attract the right candidates"
    }
  ];

  const recentPostings = [
    {
      id: 1,
      title: "Senior React Developer",
      department: "Engineering",
      applications: 45,
      status: "Active",
      posted: "2 days ago"
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      applications: 32,
      status: "Active",
      posted: "1 week ago"
    },
    {
      id: 3,
      title: "UX Designer",
      department: "Design",
      applications: 28,
      status: "Closed",
      posted: "2 weeks ago"
    }
  ];

  const stats = [
    { label: "Active Job Posts", value: "12", icon: Building2 },
    { label: "Total Applications", value: "234", icon: Users },
    { label: "Successful Hires", value: "18", icon: CheckCircle },
    { label: "Profile Views", value: "1.2K", icon: Eye }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-accent/5 via-background to-primary/5 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Hire the Best Talent in India
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Post jobs, find candidates, and build your dream team with Pravah Organisation
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button size="lg" className="flex items-center gap-2" onClick={handlePostJob}>
                  <Plus className="w-5 h-5" />
                  Post a Job
                </Button>
                <Button variant="outline" size="lg" onClick={handleBrowseCandidates}>
                  Browse Candidates
                </Button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <Card key={index} className="p-4 text-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Why Choose Pravah for Hiring?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Streamline your recruitment process with our powerful tools and extensive talent network
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="p-6 text-center hover:shadow-elevation transition-shadow duration-300">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Job Postings */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-foreground">Recent Job Postings</h2>
              <Button variant="outline" onClick={handleViewAllJobs}>View All</Button>
            </div>

            <div className="grid gap-4">
              {recentPostings.map((job) => (
                <Card key={job.id} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
                        <Badge variant={job.status === 'Active' ? 'default' : 'secondary'}>
                          {job.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{job.department}</span>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {job.applications} applications
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.posted}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 md:mt-0">
                      <Button variant="outline" size="sm" onClick={() => handleViewJob(job.id)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button size="sm" onClick={() => handleEditJob(job.id)}>
                        Edit
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-lg text-muted-foreground">
                Choose the plan that works best for your hiring needs
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {/* Starter Plan */}
              <Card className="p-6 text-center">
                <h3 className="text-xl font-semibold text-foreground mb-2">Starter</h3>
                <div className="text-3xl font-bold text-primary mb-4">₹4,999<span className="text-sm text-muted-foreground">/month</span></div>
                <ul className="text-left space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    Up to 5 job postings
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    Basic candidate search
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    Email support
                  </li>
                </ul>
                <Button variant="outline" className="w-full" onClick={() => handleGetStarted("Starter")}>Get Started</Button>
              </Card>

              {/* Professional Plan */}
              <Card className="p-6 text-center border-primary shadow-elevation">
                <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm mb-2">
                  Most Popular
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Professional</h3>
                <div className="text-3xl font-bold text-primary mb-4">₹9,999<span className="text-sm text-muted-foreground">/month</span></div>
                <ul className="text-left space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    Unlimited job postings
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    Advanced search & filters
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    Priority support
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    Analytics dashboard
                  </li>
                </ul>
                <Button className="w-full" onClick={() => handleGetStarted("Professional")}>Get Started</Button>
              </Card>

              {/* Enterprise Plan */}
              <Card className="p-6 text-center">
                <h3 className="text-xl font-semibold text-foreground mb-2">Enterprise</h3>
                <div className="text-3xl font-bold text-primary mb-4">Custom</div>
                <ul className="text-left space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    Everything in Professional
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    Dedicated account manager
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    Custom integrations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    SLA support
                  </li>
                </ul>
                <Button variant="outline" className="w-full" onClick={handleContactSales}>Contact Sales</Button>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default EmployerPortal;
