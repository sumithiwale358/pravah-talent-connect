import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, MapPin, Download, Star, Briefcase, GraduationCap, Search, Filter, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JobSeekerProfile {
  id: string;
  first_name: string;
  last_name: string;
  skills: string[] | null;
  experience_level: string | null;
  education: string | null;
  designation: string | null;
  resume_url: string | null;
  created_at: string;
  profiles: {
    email: string;
    location: string | null;
    phone: string | null;
  } | null;
}

const BrowseCandidates = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [candidates, setCandidates] = useState<JobSeekerProfile[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<JobSeekerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const { data, error } = await supabase
          .from("job_seeker_profiles")
          .select(`
            id,
            first_name,
            last_name,
            skills,
            experience_level,
            education,
            designation,
            resume_url,
            created_at,
            profiles (
              email,
              location,
              phone
            )
          `)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setCandidates(data || []);
        setFilteredCandidates(data || []);
      } catch (error) {
        console.error("Error fetching candidates:", error);
        toast({
          title: "Error",
          description: "Failed to load candidates",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchCandidates();
    }
  }, [user, toast]);

  // Filter function
  useEffect(() => {
    let filtered = candidates;

    // Search by name, designation, education
    if (searchTerm) {
      filtered = filtered.filter(candidate =>
        `${candidate.first_name} ${candidate.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.education?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by experience level
    if (experienceFilter) {
      filtered = filtered.filter(candidate => candidate.experience_level === experienceFilter);
    }

    // Filter by location
    if (locationFilter) {
      filtered = filtered.filter(candidate =>
        candidate.profiles?.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Filter by skill
    if (skillFilter) {
      filtered = filtered.filter(candidate =>
        candidate.skills?.some(skill => 
          skill.toLowerCase().includes(skillFilter.toLowerCase())
        )
      );
    }

    setFilteredCandidates(filtered);
  }, [candidates, searchTerm, experienceFilter, locationFilter, skillFilter]);

  const clearAllFilters = () => {
    setSearchTerm("");
    setExperienceFilter("");
    setLocationFilter("");
    setSkillFilter("");
  };

  const handleViewResume = (resumeUrl: string | null) => {
    if (resumeUrl) {
      window.open(resumeUrl, "_blank");
    } else {
      toast({
        title: "No Resume",
        description: "This candidate hasn't uploaded a resume yet",
        variant: "default",
      });
    }
  };

  const handleContactCandidate = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  // Show loading while checking authentication
  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If not loading and no user, the useEffect will redirect
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Browse Candidates</h1>
          <p className="text-muted-foreground">
            Discover talented job seekers looking for opportunities
          </p>
        </div>

        {/* Search and Filter Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filter Candidates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search name, role, education..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Experience Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">Entry Level</SelectItem>
                  <SelectItem value="mid">Mid Level</SelectItem>
                  <SelectItem value="senior">Senior Level</SelectItem>
                  <SelectItem value="lead">Lead Level</SelectItem>
                </SelectContent>
              </Select>
              
              <Input
                placeholder="Location..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
              
              <Input
                placeholder="Skills..."
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
              />
            </div>
            
            {(searchTerm || experienceFilter || locationFilter || skillFilter) && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredCandidates.length} of {candidates.length} candidates
                </div>
                <Button variant="outline" size="sm" onClick={clearAllFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear All Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {candidates.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No candidates found</h3>
              <p className="text-muted-foreground">
                There are currently no job seekers registered on the platform.
              </p>
            </CardContent>
          </Card>
        ) : filteredCandidates.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No candidates match your filters</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria to find more candidates.
              </p>
              <Button variant="outline" onClick={clearAllFilters}>
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCandidates.map((candidate) => (
              <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {candidate.first_name} {candidate.last_name}
                  </CardTitle>
                  {candidate.profiles?.location && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{candidate.profiles.location}</span>
                    </div>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {candidate.designation && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{candidate.designation}</span>
                      </div>
                    )}
                    
                    {candidate.education && (
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{candidate.education}</span>
                      </div>
                    )}
                    
                    {candidate.experience_level && (
                      <div>
                        <Badge variant="secondary">
                          <Star className="h-3 w-3 mr-1" />
                          {candidate.experience_level}
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  {candidate.skills && candidate.skills.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.slice(0, 4).map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {candidate.skills.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{candidate.skills.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewResume(candidate.resume_url)}
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Resume
                    </Button>
                    
                    <Button
                      size="sm"
                      onClick={() => handleContactCandidate(candidate.profiles?.email || '')}
                      className="flex-1"
                      disabled={!candidate.profiles?.email}
                    >
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default BrowseCandidates;