import { Link } from "react-router-dom";
import { Users, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Pravah Organisation</span>
            </div>
            <p className="text-background/80 mb-6 max-w-md">
              Connecting talent with opportunity across India. We believe everyone deserves 
              a fulfilling career and every company deserves exceptional talent.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-background/80">
                <Mail className="w-4 h-4" />
                <span>contact@pravahorg.in</span>
              </div>
              <div className="flex items-center gap-2 text-background/80">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2 text-background/80">
                <MapPin className="w-4 h-4" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/job-seeker" className="text-background/80 hover:text-background transition-colors">
                  Job Seeker Portal
                </Link>
              </li>
              <li>
                <Link to="/employer" className="text-background/80 hover:text-background transition-colors">
                  Employer Portal
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-background/80 hover:text-background transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-background/80 hover:text-background transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-background/80 hover:text-background transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-background/80 hover:text-background transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-background/80 hover:text-background transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-background/80 hover:text-background transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/career-tips" className="text-background/80 hover:text-background transition-colors">
                  Career Tips
                </Link>
              </li>
              <li>
                <Link to="/salary-guide" className="text-background/80 hover:text-background transition-colors">
                  Salary Guide
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-background/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <Button variant="ghost" size="icon" className="text-background/80 hover:text-background">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-background/80 hover:text-background">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-background/80 hover:text-background">
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-background/80 hover:text-background">
                <Instagram className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-background/60 text-sm">
              © 2024 Pravah Organisation. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;