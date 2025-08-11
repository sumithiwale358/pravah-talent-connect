import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MapPin, TrendingUp, Users, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import maharashtraJob1 from "@/assets/maharashtra-jobs-1.jpg";
import maharashtraJob2 from "@/assets/maharashtra-jobs-2.jpg";
import maharashtraJob3 from "@/assets/maharashtra-jobs-3.jpg";
import maharashtraJob4 from "@/assets/maharashtra-jobs-4.jpg";

const slides = [
  {
    id: 1,
    image: maharashtraJob1,
    title: "Diverse Career Opportunities in Mumbai",
    description: "Explore thousands of jobs across IT, finance, healthcare, and more in Maharashtra's financial capital.",
    stats: { jobs: "25,000+", companies: "2,500+", icon: Building },
    location: "Mumbai"
  },
  {
    id: 2,
    image: maharashtraJob2,
    title: "Tech Hub Jobs in Pune",
    description: "Join the thriving IT ecosystem with opportunities in software development, data science, and digital innovation.",
    stats: { jobs: "18,000+", companies: "1,800+", icon: TrendingUp },
    location: "Pune"
  },
  {
    id: 3,
    image: maharashtraJob3,
    title: "Manufacturing & Automotive Excellence",
    description: "Be part of Maharashtra's industrial backbone with careers in automotive, manufacturing, and engineering.",
    stats: { jobs: "12,000+", companies: "800+", icon: Users },
    location: "Aurangabad & Nashik"
  },
  {
    id: 4,
    image: maharashtraJob4,
    title: "Healthcare & Pharmaceutical Leadership",
    description: "Make a difference in healthcare with opportunities in hospitals, research, and pharmaceutical companies.",
    stats: { jobs: "8,000+", companies: "600+", icon: MapPin },
    location: "Pune & Mumbai"
  }
];

const JobCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative w-full h-[600px] overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
            </div>
            
            <div className="relative z-10 h-full flex items-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl">
                  <div className="animate-fade-in">
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                        {slide.location}
                      </span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                      {slide.title}
                    </h2>
                    
                    <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                      {slide.description}
                    </p>
                    
                    <div className="flex items-center gap-8 mb-8">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <slide.stats.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-foreground">
                            {slide.stats.jobs}
                          </div>
                          <div className="text-sm text-muted-foreground">Active Jobs</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-accent/10 rounded-lg">
                          <Building className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-foreground">
                            {slide.stats.companies}
                          </div>
                          <div className="text-sm text-muted-foreground">Companies</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <Button size="lg" className="hover-scale">
                        Explore Jobs
                      </Button>
                      <Button variant="outline" size="lg" className="hover-scale">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <Button
          variant="outline"
          size="icon"
          onClick={prevSlide}
          className="bg-background/80 hover:bg-background border-border/50 hover-scale"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      
      <div 
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <Button
          variant="outline"
          size="icon"
          onClick={nextSlide}
          className="bg-background/80 hover:bg-background border-border/50 hover-scale"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-primary w-8"
                  : "bg-background/50 hover:bg-background/80"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-background/20">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ 
            width: `${((currentSlide + 1) / slides.length) * 100}%`
          }}
        />
      </div>
    </section>
  );
};

export default JobCarousel;