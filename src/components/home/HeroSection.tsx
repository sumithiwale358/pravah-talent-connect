import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Search, Users, Building2, TrendingUp } from "lucide-react";
import JobCarousel from "./JobCarousel";

const HeroSection = () => {
  return (
    <section className="relative h-[600px] overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute inset-0">
        <JobCarousel />
      </div>
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-background/95 md:bg-gradient-to-r md:from-background/95 md:via-background/85 md:to-background/70" />
      
      {/* Hero Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-in bg-background/20 backdrop-blur-sm rounded-2xl p-8 md:p-12">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 drop-shadow-lg">
                Connecting Talent with
                <span className="block text-primary mt-2 drop-shadow-lg">Opportunity Across India</span>
              </h1>
              <p className="text-lg md:text-xl text-foreground/90 mb-8 max-w-2xl mx-auto drop-shadow-md">
                Pravah Organisation bridges the gap between skilled job seekers and forward-thinking employers.
                Start your journey today and discover unlimited possibilities.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 hover-scale shadow-lg">
                  <Link to="/job-seeker" className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    I'm Looking for Jobs
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-background/90 hover:bg-background hover-scale shadow-lg border-2">
                  <Link to="/employer" className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    I'm Hiring Talent
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureCards = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
          <Card className="p-6 hover:shadow-elevation transition-shadow duration-300">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Job Search</h3>
            <p className="text-muted-foreground">
              Advanced filters to find jobs that match your skills, location, and career goals.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-elevation transition-shadow duration-300">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Verified Employers</h3>
            <p className="text-muted-foreground">
              Connect with trusted companies and startups across India looking for talent like you.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-elevation transition-shadow duration-300">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Career Growth</h3>
            <p className="text-muted-foreground">
              Track your applications, build your profile, and accelerate your career journey.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
export { FeatureCards };