
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Leaf, Mail, Home, Phone } from "lucide-react";
import { safelyParseJSON } from "@/lib/utils";

const Footer = () => {
  const [footerData, setFooterData] = useState({
    companyName: "Natural Green Nursery",
    address: "123 Green Avenue, Eco City, EC 12345",
    phone: "+91 9876543210",
    email: "info@naturalgreennursery.com",
    description: "Your one-stop destination for all eco-friendly plants, gardening tools, and expert advice for a greener home and planet.",
    socialLinks: [
      { name: "facebook", url: "" },
      { name: "instagram", url: "" },
      { name: "whatsapp", url: "" }
    ],
    quickLinks: [
      { name: "Shop Plants", url: "/shop" },
      { name: "About Us", url: "/about" },
      { name: "Contact", url: "/contact" }
    ]
  });

  useEffect(() => {
    // Get footer data from localStorage (saved in admin settings)
    const savedFooterData = localStorage.getItem("footerSettings");
    if (savedFooterData) {
      const parsedData = safelyParseJSON(savedFooterData, footerData);
      
      // Filter out any sustainability links if they exist
      if (parsedData.quickLinks) {
        parsedData.quickLinks = parsedData.quickLinks.filter(
          (link: {name: string, url: string}) => 
          !link.name.toLowerCase().includes('sustainability') && 
          !link.url.toLowerCase().includes('sustainability')
        );
      }
      
      setFooterData(parsedData);
    }
  }, []);

  return (
    <footer className="bg-gray-900 text-white">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <Leaf className="h-6 w-6 text-eco-400" />
              <span className="font-serif font-bold text-xl">
                <span className="bg-gradient-to-r from-eco-400 to-eco-500 text-transparent bg-clip-text">{footerData.companyName}</span>
              </span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed max-w-md">
              {footerData.description}
            </p>
            <div className="flex space-x-6">
              {footerData.socialLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.url || "#"} 
                  className="text-gray-400 hover:text-eco-400 transition-colors transform hover:scale-110 duration-300"
                  aria-label={link.name}
                >
                  {link.name === "facebook" && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  )}
                  {link.name === "instagram" && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  )}
                  {link.name === "whatsapp" && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="font-serif font-bold text-lg text-eco-400">Quick Links</h3>
            <ul className="space-y-3">
              {footerData.quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.url} 
                    className="text-gray-300 hover:text-eco-400 transition-colors duration-300 inline-block hover:translate-x-1 transform"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="font-serif font-bold text-lg text-eco-400">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 group">
                <Home className="h-5 w-5 text-eco-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-gray-300 text-sm leading-relaxed">
                  {footerData.address}
                </span>
              </li>
              <li className="flex items-center space-x-3 group">
                <Phone className="h-5 w-5 text-eco-400 shrink-0 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-gray-300">{footerData.phone}</span>
              </li>
              <li className="flex items-center space-x-3 group">
                <Mail className="h-5 w-5 text-eco-400 shrink-0 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-gray-300">{footerData.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} {footerData.companyName}. All rights reserved. | 
            <span className="ml-2 text-eco-400">Crafted with 🌱 for a greener future</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
