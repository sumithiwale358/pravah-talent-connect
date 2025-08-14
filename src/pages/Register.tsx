import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Users, Building2, Mail, Lock, Eye, EyeOff, User, Phone, MapPin, Upload, FileText, X } from "lucide-react";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState("jobseeker");
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [formData, setFormData] = useState({
    // Job Seeker fields
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    experienceLevel: "",
    designation: "",
    education: "",
    password: "",
    confirmPassword: "",
    // Employer fields
    companyName: "",
    contactPerson: "",
    companySize: "",
    // Common
    acceptTerms: false
  });

  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (userType === "jobseeker") {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword || !formData.experienceLevel) {
        toast({
          title: "Missing Fields",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return false;
      }
    } else {
      if (!formData.companyName || !formData.contactPerson || !formData.email || !formData.password || !formData.confirmPassword) {
        toast({
          title: "Missing Fields", 
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return false;
      }
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      return false;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.acceptTerms) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleResumeUpload = async (file: File, userId: string) => {
    setUploadingResume(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error: any) {
      toast({
        title: "Upload Error",
        description: error.message || "Failed to upload resume. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setUploadingResume(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF or Word document.",
          variant: "destructive"
        });
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload a file smaller than 5MB.",
          variant: "destructive"
        });
        return;
      }
      
      setResumeFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const userData = {
        userType,
        phone: formData.phone,
        location: formData.location,
        // Job seeker specific
        ...(userType === "jobseeker" && {
          firstName: formData.firstName,
          lastName: formData.lastName,
          experienceLevel: formData.experienceLevel,
          designation: formData.designation,
          education: formData.education
        }),
        // Employer specific
        ...(userType === "employer" && {
          companyName: formData.companyName,
          contactPerson: formData.contactPerson,
          designation: formData.designation,
          companySize: formData.companySize
        })
      };

      const result = await signUp(formData.email, formData.password, userData);
      
      // If job seeker registration is successful and resume file exists, upload it
      if (!result.error && userType === "jobseeker" && resumeFile) {
        // Wait a moment for the profile to be created
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const resumeUrl = await handleResumeUpload(resumeFile, user.id);
          if (resumeUrl) {
            // Update the job seeker profile with resume URL
            const { data: profile } = await supabase
              .from('profiles')
              .select('id')
              .eq('user_id', user.id)
              .single();
            
            if (profile) {
              await supabase
                .from('job_seeker_profiles')
                .update({ resume_url: resumeUrl })
                .eq('profile_id', profile.id);
            }
          }
        }
      }
      
      if (result.error) {
        toast({
          title: "Registration Failed",
          description: result.error.message || "An error occurred during registration.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Registration Successful!",
          description: "Welcome to Pravah! Your account has been created.",
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Join Pravah</h1>
            <p className="text-muted-foreground">Create your account and start your journey</p>
          </div>

          <Card className="p-6">
            <Tabs value={userType} onValueChange={setUserType} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="jobseeker" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Job Seeker
                </TabsTrigger>
                <TabsTrigger value="employer" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Employer
                </TabsTrigger>
              </TabsList>

              <TabsContent value="jobseeker" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="first-name"
                        placeholder="First name"
                        className="pl-10"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input
                      id="last-name"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="pl-10"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="Complete Address"
                      className="pl-10"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Level</Label>
                  <Select value={formData.experienceLevel} onValueChange={(value) => handleInputChange("experienceLevel", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                      <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                      <SelectItem value="senior">Senior Level (6-10 years)</SelectItem>
                      <SelectItem value="lead">Lead Level (10+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="designation">Current Designation</Label>
                  <Input
                    id="designation"
                    placeholder="e.g., Software Engineer, Marketing Manager"
                    value={formData.designation}
                    onChange={(e) => handleInputChange("designation", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="education">Education</Label>
                  <Input
                    id="education"
                    placeholder="e.g., B.Tech in Computer Science, MBA"
                    value={formData.education}
                    onChange={(e) => handleInputChange("education", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create password"
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      className="pl-10 pr-10"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resume">Upload Resume (Optional)</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="resume"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer bg-muted/10 hover:bg-muted/20 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload</span> your resume
                          </p>
                          <p className="text-xs text-muted-foreground">PDF, DOC, or DOCX (MAX. 5MB)</p>
                        </div>
                        <input
                          id="resume"
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                    {resumeFile && (
                      <div className="flex items-center gap-2 p-2 bg-muted/20 rounded-md">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="text-sm">{resumeFile.name}</span>
                        <button
                          type="button"
                          onClick={() => setResumeFile(null)}
                          className="ml-auto text-muted-foreground hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    {uploadingResume && (
                      <div className="text-sm text-muted-foreground">Uploading resume...</div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => handleInputChange("acceptTerms", checked)}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <Button className="w-full" onClick={handleSubmit} disabled={loading}>
                  {loading ? "Creating Account..." : "Create Job Seeker Account"}
                </Button>
              </TabsContent>

              <TabsContent value="employer" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="company-name"
                      placeholder="Your company name"
                      className="pl-10"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange("companyName", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company-email">Company Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="company-email"
                      type="email"
                      placeholder="hr@company.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Contact Person</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="contact-name"
                        placeholder="Your full name"
                        className="pl-10"
                        value={formData.contactPerson}
                        onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="designation">Designation</Label>
                    <Input
                      id="designation"
                      placeholder="HR Manager"
                      value={formData.designation}
                      onChange={(e) => handleInputChange("designation", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company-phone">Company Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="company-phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="pl-10"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company-location">Company Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="company-location"
                      placeholder="City, State"
                      className="pl-10"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company-size">Company Size</Label>
                  <Select value={formData.companySize} onValueChange={(value) => handleInputChange("companySize", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="startup">Startup (1-10 employees)</SelectItem>
                      <SelectItem value="small">Small (11-50 employees)</SelectItem>
                      <SelectItem value="medium">Medium (51-200 employees)</SelectItem>
                      <SelectItem value="large">Large (201-1000 employees)</SelectItem>
                      <SelectItem value="enterprise">Enterprise (1000+ employees)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="company-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create password"
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company-confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="company-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      className="pl-10 pr-10"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="employer-terms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => handleInputChange("acceptTerms", checked)}
                  />
                  <Label htmlFor="employer-terms" className="text-sm">
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <Button className="w-full" onClick={handleSubmit} disabled={loading}>
                  {loading ? "Creating Account..." : "Create Employer Account"}
                </Button>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Register;