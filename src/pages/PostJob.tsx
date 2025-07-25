import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Building2, MapPin, Users, IndianRupee } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const PostJob = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: "",
    location: "",
    country: "India",
    minSalary: "",
    maxSalary: "",
    hideSalary: false,
    minExperience: "",
    maxExperience: "",
    openings: "",
    gender: "",
    expiresAt: ""
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!formData.title || !formData.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Get current user's employer profile
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Get employer profile ID
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) {
        throw new Error("Profile not found");
      }

      const { data: employerProfile } = await supabase
        .from('employer_profiles')
        .select('id')
        .eq('profile_id', profile.id)
        .single();

      if (!employerProfile) {
        throw new Error("Employer profile not found");
      }

      // Create job posting
      const jobData = {
        title: formData.title,
        description: formData.description,
        employer_profile_id: employerProfile.id,
        country: formData.country,
        min_salary: formData.minSalary ? parseInt(formData.minSalary) : null,
        max_salary: formData.maxSalary ? parseInt(formData.maxSalary) : null,
        hide_salary: formData.hideSalary,
        min_experience: formData.minExperience ? parseFloat(formData.minExperience) : null,
        max_experience: formData.maxExperience ? parseFloat(formData.maxExperience) : null,
        openings: formData.openings ? parseInt(formData.openings) : null,
        gender: formData.gender || null,
        expires_at: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
        status: 'active'
      };

      const { error } = await (supabase as any)
        .from('jobs')
        .insert([jobData]);

      if (error) throw error;
      
      toast({
        title: "Job Posted Successfully!",
        description: "Your job posting is now live and visible to candidates."
      });
      
      navigate("/employer");
    } catch (error) {
      console.error('Error posting job:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to post job. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/employer")}
              className="mb-4 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Employer Portal
            </Button>
            
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Post a New Job</h1>
            </div>
            <p className="text-muted-foreground">
              Fill out the details below to create your job posting and start attracting top talent.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Basic Information</h2>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Senior React Developer"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="department">Department</Label>
                  <Select onValueChange={(value) => handleInputChange("department", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Job Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the role, responsibilities, requirements, and what makes your company a great place to work..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="min-h-32"
                    required
                  />
                </div>
              </div>
            </Card>

            {/* Location & Compensation */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location & Compensation
              </h2>
              <div className="grid gap-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="location">City/Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g. Mumbai, Bangalore, Remote"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="minSalary">Minimum Salary (₹)</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="minSalary"
                        type="number"
                        placeholder="500000"
                        className="pl-10"
                        value={formData.minSalary}
                        onChange={(e) => handleInputChange("minSalary", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="maxSalary">Maximum Salary (₹)</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="maxSalary"
                        type="number"
                        placeholder="1500000"
                        className="pl-10"
                        value={formData.maxSalary}
                        onChange={(e) => handleInputChange("maxSalary", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hideSalary"
                    checked={formData.hideSalary}
                    onCheckedChange={(checked) => handleInputChange("hideSalary", checked as boolean)}
                  />
                  <Label htmlFor="hideSalary">Hide salary range from job seekers</Label>
                </div>
              </div>
            </Card>

            {/* Requirements */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Requirements
              </h2>
              <div className="grid gap-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="minExperience">Minimum Experience (years)</Label>
                    <Input
                      id="minExperience"
                      type="number"
                      placeholder="2"
                      step="0.5"
                      value={formData.minExperience}
                      onChange={(e) => handleInputChange("minExperience", e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="maxExperience">Maximum Experience (years)</Label>
                    <Input
                      id="maxExperience"
                      type="number"
                      placeholder="5"
                      step="0.5"
                      value={formData.maxExperience}
                      onChange={(e) => handleInputChange("maxExperience", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="openings">Number of Openings</Label>
                    <Input
                      id="openings"
                      type="number"
                      placeholder="1"
                      value={formData.openings}
                      onChange={(e) => handleInputChange("openings", e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="gender">Gender Preference</Label>
                    <Select onValueChange={(value) => handleInputChange("gender", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="expiresAt">Application Deadline</Label>
                  <Input
                    id="expiresAt"
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => handleInputChange("expiresAt", e.target.value)}
                  />
                </div>
              </div>
            </Card>

            {/* Submit Buttons */}
            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/employer")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Posting Job..." : "Post Job"}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PostJob;