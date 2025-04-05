
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Leaf, Mail, Home, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { safelyParseJSON } from "@/lib/utils";

const Footer = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const [footerData, setFooterData] = useState({
    companyName: "Natural Green Nursery",
    address: "123 Green Avenue, Eco City, EC 12345",
    phone: "+91 9876543210",
    email: "info@naturalgreennursery.com",
    description: "Your one-stop destination for all eco-friendly plants, gardening tools, and expert advice for a greener home and planet.",
    socialLinks: [
      { name: "facebook", url: "#" },
      { name: "instagram", url: "#" },
      { name: "pinterest", url: "#" }
    ],
    quickLinks: [
      { name: "Shop Plants", url: "/shop" },
      { name: "Gardening Blog", url: "/blog" },
      { name: "About Us", url: "/about" },
      { name: "Sustainability", url: "/sustainability" }
    ],
    newsletterText: "Subscribe to our newsletter for gardening tips, new arrivals, and exclusive offers."
  });

  useEffect(() => {
    // Get footer data from localStorage (saved in admin settings)
    const savedFooterData = localStorage.getItem("footerSettings");
    if (savedFooterData) {
      setFooterData(safelyParseJSON(savedFooterData, footerData));
    }
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Subscription successful!",
      description: "Thank you for subscribing to our newsletter.",
    });
    setEmail("");
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="eco-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Leaf className="h-6 w-6 text-eco-400" />
              <span className="font-serif font-bold text-xl">
                <span className="bg-gradient-to-r from-eco-400 to-eco-500 text-transparent bg-clip-text">{footerData.companyName}</span>
              </span>
            </Link>
            <p className="text-gray-300 text-sm">
              {footerData.description}
            </p>
            <div className="flex space-x-4">
              {footerData.socialLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.url} 
                  className="text-gray-400 hover:text-eco-400 transition-colors"
                  aria-label={link.name}
                >
                  {link.name === "facebook" && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  )}
                  {link.name === "instagram" && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  )}
                  {link.name === "pinterest" && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <path d="M8 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0z"></path>
                      <path d="M12 2v2"></path>
                      <path d="M12 20v2"></path>
                      <path d="M20 12h2"></path>
                      <path d="M2 12h2"></path>
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif font-bold text-lg mb-4 text-eco-400">Quick Links</h3>
            <ul className="space-y-2">
              {footerData.quickLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.url} className="text-gray-300 hover:text-eco-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif font-bold text-lg mb-4 text-eco-400">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Home className="h-5 w-5 text-eco-400 shrink-0 mt-0.5" />
                <span className="text-gray-300">
                  {footerData.address}
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-eco-400 shrink-0" />
                <span className="text-gray-300">{footerData.phone}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-eco-400 shrink-0" />
                <span className="text-gray-300">{footerData.email}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-serif font-bold text-lg mb-4 text-eco-400">Newsletter</h3>
            <p className="text-gray-300 text-sm mb-4">
              {footerData.newsletterText}
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button 
                type="submit" 
                className="w-full bg-eco-500 hover:bg-eco-600 text-gray-900"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} {footerData.companyName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
