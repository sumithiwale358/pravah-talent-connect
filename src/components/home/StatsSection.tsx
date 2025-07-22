import { Card } from "@/components/ui/card";
import { Users, Building2, MapPin, CheckCircle } from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      value: "50,000+",
      label: "Job Seekers",
      description: "Professionals registered and actively seeking opportunities"
    },
    {
      icon: Building2,
      value: "2,500+",
      label: "Companies",
      description: "Verified employers posting quality job opportunities"
    },
    {
      icon: CheckCircle,
      value: "15,000+",
      label: "Successful Placements",
      description: "Lives transformed through meaningful career connections"
    },
    {
      icon: MapPin,
      value: "200+",
      label: "Cities Covered",
      description: "Opportunities available across major Indian cities"
    }
  ];

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