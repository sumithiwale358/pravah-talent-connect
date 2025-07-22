import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Search, Users, Building2, TrendingUp } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-background via-background to-muted py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Hero Content */}
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Connecting Talent with
              <span className="block text-primary mt-2">Opportunity Across India</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Pravah Organisation bridges the gap between skilled job seekers and forward-thinking employers. 
              Start your journey today and discover unlimited possibilities.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button asChild size="lg" className="bg-primary hover:bg-primary-hover">
                <Link to="/job-seeker" className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  I'm Looking for Jobs
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/employer" className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  I'm Hiring Talent
                </Link>
              </Button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16 animate-slide-up">
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
      </div>

      {/* Background Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/5 rounded-full blur-xl"></div>
    </section>
  );
};

export default HeroSection;