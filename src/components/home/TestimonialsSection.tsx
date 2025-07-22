import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer",
      company: "Tech Innovations Pvt Ltd",
      content: "Pravah Organisation helped me find my dream job in just 2 weeks! The platform is intuitive and the job matches were perfect for my skills.",
      rating: 5,
      initials: "PS"
    },
    {
      name: "Rajesh Kumar",
      role: "HR Manager",
      company: "Global Solutions Inc",
      content: "As an employer, I've found exceptional talent through Pravah. The quality of candidates and the ease of posting jobs is outstanding.",
      rating: 5,
      initials: "RK"
    },
    {
      name: "Anita Verma",
      role: "Marketing Specialist",
      company: "Digital Marketing Pro",
      content: "The career guidance and job search tools on Pravah are excellent. I successfully transitioned to my desired field with their help.",
      rating: 5,
      initials: "AV"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Success Stories from Our Community
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from job seekers and employers who have transformed their careers and businesses with Pravah Organisation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 hover:shadow-elevation transition-shadow duration-300">
              {/* Rating Stars */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>

              {/* Testimonial Content */}
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {testimonial.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;