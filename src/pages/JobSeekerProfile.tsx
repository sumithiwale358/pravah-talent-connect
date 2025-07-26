import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Upload, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const JobSeekerProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    designation: "",
    experienceLevel: "",
    education: "",
    location: "",
    phone: "",
    resumeUrl: ""
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills(prev => [...prev, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(skill => skill !== skillToRemove));
  };

  const handleResumeUpload = async (file: File) => {
    if (!user) return null;

    setUploadingResume(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      let resumeUrl = formData.resumeUrl;
      
      // Upload resume if a new file is selected
      if (resumeFile) {
        const uploadedUrl = await handleResumeUpload(resumeFile);
        if (uploadedUrl) {
          resumeUrl = uploadedUrl;
        } else {
          // Upload failed, don't proceed
          setLoading(false);
          return;
        }
      }

      // First create/update profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          email: user.email,
          user_type: 'jobseeker',
          location: formData.location,
          phone: formData.phone
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Then create job seeker profile
      const { error: jobSeekerError } = await supabase
        .from('job_seeker_profiles')
        .upsert({
          profile_id: profileData.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          designation: formData.designation,
          experience_level: formData.experienceLevel as any,
          education: formData.education,
          skills: skills,
          resume_url: resumeUrl
        });

      if (jobSeekerError) throw jobSeekerError;

      toast({
        title: "Profile Created Successfully!",
        description: "Your job seeker profile has been created. You can now start applying for jobs.",
      });

      navigate('/job-seeker');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Create Your Job Seeker Profile</CardTitle>
                <CardDescription>
                  Complete your profile to get discovered by top employers and apply for jobs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="designation">Current Designation</Label>
                    <Input
                      id="designation"
                      value={formData.designation}
                      onChange={(e) => handleInputChange('designation', e.target.value)}
                      placeholder="e.g., Software Engineer, Marketing Manager"
                    />
                  </div>

                  <div>
                    <Label htmlFor="experienceLevel">Experience Level</Label>
                    <Select onValueChange={(value) => handleInputChange('experienceLevel', value)}>
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

                  <div>
                    <Label htmlFor="education">Education</Label>
                    <Input
                      id="education"
                      value={formData.education}
                      onChange={(e) => handleInputChange('education', e.target.value)}
                      placeholder="e.g., B.Tech in Computer Science, MBA"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="e.g., Mumbai, India"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <Label htmlFor="skills">Skills</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        id="skills"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        placeholder="Add a skill"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      />
                      <Button type="button" onClick={addSkill} variant="outline">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="resume">Upload Resume</Label>
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

                  <div className="flex gap-4">
                    <Button type="submit" disabled={loading} className="flex-1">
                      {loading ? "Creating Profile..." : "Create Profile"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => navigate('/job-seeker')}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JobSeekerProfile;