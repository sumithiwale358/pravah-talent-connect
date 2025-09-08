import { Card } from "@/components/ui/card";
import { Users, Building2, MapPin, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const StatsSection = () => {
  const [stats, setStats] = useState([
    {
      icon: Users,
      value: "0",
      label: "Job Seekers",
      description: "Professionals registered and actively seeking opportunities"
    },
    {
      icon: Building2,
      value: "0",
      label: "Companies",
      description: "Verified employers posting quality job opportunities"
    },
    {
      icon: CheckCircle,
      value: "0",
      label: "Successful Placements",
      description: "Lives transformed through meaningful career connections"
    },
    {
      icon: MapPin,
      value: "0",
      label: "Cities Covered",
      description: "Opportunities available across major Indian cities"
    }
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Use secure counting functions instead of direct table access
        const { data: jobSeekersCount } = await supabase.rpc('get_job_seeker_count');
        const { data: companiesCount } = await supabase.rpc('get_employer_count');
        const { data: jobsCount } = await supabase.rpc('get_active_jobs_count');

        // For successful placements, we'll count hired applications
        const { count: placementsCount } = await supabase
          .from('job_applications')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'hired');

        // Fetch unique cities count from active jobs only
        const { data: citiesData } = await supabase
          .from('jobs')
          .select('city')
          .eq('status', 'active')
          .not('city', 'is', null);

        const uniqueCities = new Set(citiesData?.map(job => job.city).filter(Boolean));
        const citiesCount = uniqueCities.size;

        setStats([
          {
            icon: Users,
            value: jobSeekersCount ? `${jobSeekersCount.toLocaleString()}+` : "0",
            label: "Job Seekers",
            description: "Professionals registered and actively seeking opportunities"
          },
          {
            icon: Building2,
            value: companiesCount ? `${companiesCount.toLocaleString()}+` : "0",
            label: "Companies",
            description: "Verified employers posting quality job opportunities"
          },
          {
            icon: CheckCircle,
            value: placementsCount ? `${placementsCount.toLocaleString()}+` : "0",
            label: "Successful Placements",
            description: "Lives transformed through meaningful career connections"
          },
          {
            icon: MapPin,
            value: citiesCount ? `${citiesCount}+` : "0",
            label: "Cities Covered",
            description: "Opportunities available across major Indian cities"
          }
        ]);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trusted by Thousands Across India
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join a growing community of job seekers and employers who have found success through Pravah Organisation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-elevation transition-shadow duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
              <div className="text-lg font-semibold text-foreground mb-2">{stat.label}</div>
              <p className="text-sm text-muted-foreground">{stat.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;