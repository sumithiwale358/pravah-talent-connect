import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Target, Heart, Users, Globe, Award, TrendingUp } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Passion for People",
      description: "We believe every person deserves meaningful work that aligns with their skills and aspirations."
    },
    {
      icon: Target,
      title: "Excellence First",
      description: "We maintain the highest standards in matching candidates with employers for mutual success."
    },
    {
      icon: Globe,
      title: "Inclusive Growth",
      description: "We're committed to creating opportunities across all regions and communities in India."
    }
  ];

  const team = [
    {
      name: "Dr. Rajesh Gupta",
      role: "Founder & CEO",
      initials: "RG",
      description: "20+ years in HR consulting and workforce development across India"
    },
    {
      name: "Priya Sharma",
      role: "Head of Technology",
      initials: "PS",
      description: "Former tech lead at major Indian startups, passionate about job matching algorithms"
    },
    {
      name: "Arjun Mehta",
      role: "Head of Operations",
      initials: "AM",
      description: "Expert in scaling recruitment operations and building employer relationships"
    }
  ];

  const milestones = [
    {
      year: "2019",
      title: "Founded",
      description: "Pravah Organisation launched with a vision to transform job placement in India"
    },
    {
      year: "2020",
      title: "10K Users",
      description: "Reached our first 10,000 registered job seekers and 500 employer partners"
    },
    {
      year: "2022",
      title: "Pan-India",
      description: "Expanded operations to cover 200+ cities across all states in India"
    },
    {
      year: "2024",
      title: "50K+ Placements",
      description: "Celebrated 50,000 successful job placements and growing strong"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                About Pravah Organisation
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                We're on a mission to bridge the gap between talent and opportunity, 
                creating a more inclusive and prosperous workforce across India.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <Card className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To democratize access to quality employment opportunities across India by creating 
                  a transparent, efficient, and inclusive job placement ecosystem that connects the 
                  right talent with the right opportunities.
                </p>
              </Card>

              <Card className="p-8">
                <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                  <TrendingUp className="w-8 h-8 text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To become India's most trusted job placement platform, where every skilled 
                  individual can find meaningful work and every organization can discover 
                  exceptional talent to drive their growth.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do at Pravah Organisation
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="p-6 text-center hover:shadow-elevation transition-shadow duration-300">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Meet Our Team</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Experienced professionals passionate about transforming careers and businesses
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {team.map((member, index) => (
                <Card key={index} className="p-6 text-center hover:shadow-elevation transition-shadow duration-300">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{member.name}</h3>
                  <div className="text-primary font-medium mb-3">{member.role}</div>
                  <p className="text-sm text-muted-foreground">{member.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Milestones */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Journey</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Key milestones that mark our growth and impact in the Indian job market
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid gap-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                        <Award className="w-8 h-8 text-primary-foreground" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-2xl font-bold text-primary">{milestone.year}</div>
                        <div className="text-xl font-semibold text-foreground">{milestone.title}</div>
                      </div>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">50,000+</div>
                <div className="text-muted-foreground">Job Seekers</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">2,500+</div>
                <div className="text-muted-foreground">Partner Companies</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">200+</div>
                <div className="text-muted-foreground">Cities Covered</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">15,000+</div>
                <div className="text-muted-foreground">Successful Placements</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;