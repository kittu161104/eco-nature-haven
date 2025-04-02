
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import CTASection from "@/components/CTASection";
import { Leaf, Calendar, MapPin, Truck, Info } from "lucide-react";

interface CompanyInfo {
  companyName: string;
  foundedYear: string;
  founderName: string;
  mission: string;
  vision: string;
}

interface ServiceRegions {
  primaryRegions: string;
  cities: string;
  deliveryInfo: string;
}

const About = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [serviceRegions, setServiceRegions] = useState<ServiceRegions | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Load content from localStorage if available
  useEffect(() => {
    const savedCompanyInfo = localStorage.getItem('about_company_info');
    const savedServiceRegions = localStorage.getItem('about_service_regions');
    
    if (savedCompanyInfo) {
      setCompanyInfo(JSON.parse(savedCompanyInfo));
    } else {
      // Default values if not set in admin
      setCompanyInfo({
        companyName: "Natural Green Nursery",
        foundedYear: "2015",
        founderName: "Emily Johnson",
        mission: "To inspire and enable sustainable living through plants. We believe that every plant we sell has the potential to make homes healthier, gardens more vibrant, and our planet a little greener.",
        vision: "We envision a world where sustainable gardening is accessible to everyone, contributing to a greener and healthier planet for future generations."
      });
    }
    
    if (savedServiceRegions) {
      setServiceRegions(JSON.parse(savedServiceRegions));
    } else {
      // Default values if not set in admin
      setServiceRegions({
        primaryRegions: "Andhra Pradesh & Telangana",
        cities: "Hyderabad, Visakhapatnam, Vijayawada, Warangal, Guntur",
        deliveryInfo: "Free delivery for orders above ₹500 within city limits. Nominal charges apply for other areas."
      });
    }
    
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  const values = [
    {
      icon: Leaf,
      title: "Sustainability",
      description: "We're committed to environmental stewardship through sustainable growing practices, eco-friendly packaging, and reduced carbon footprint."
    },
    {
      icon: Truck,
      title: "Local First",
      description: "We prioritize serving our local communities in Andhra Pradesh and Telangana, reducing transportation emissions and supporting regional biodiversity."
    },
    {
      icon: Info,
      title: "Education",
      description: "We provide extensive knowledge about plant care and sustainable gardening practices to empower our customers."
    }
  ];
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* About Hero */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
          <div className="eco-container">
            <div className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                Our <span className="shimmer-text">Story</span>
              </h1>
              <p className="text-xl text-eco-100">
                We're on a mission to make sustainable gardening accessible and enjoyable for everyone while promoting a healthier planet.
              </p>
            </div>
          </div>
        </div>
        
        {/* Our Mission */}
        <section className="py-16">
          <div className="eco-container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className={`space-y-6 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-eco-500" />
                  <p className="text-eco-500 font-medium">
                    Established in {companyInfo?.foundedYear} by {companyInfo?.founderName}
                  </p>
                </div>
                
                <h2 className="section-title">Our Mission</h2>
                <p className="text-gray-300 leading-relaxed">
                  {companyInfo?.mission}
                </p>
                
                <h3 className="text-xl font-serif font-bold text-eco-400 mt-8">Our Vision</h3>
                <p className="text-gray-300 leading-relaxed">
                  {companyInfo?.vision}
                </p>
              </div>
              
              <div className={`rounded-lg overflow-hidden shadow-lg transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                <img 
                  src="https://images.unsplash.com/photo-1466692476655-ab0c26c69cbf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                  alt="Nursery greenhouse with various plants"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Values */}
        <section className="py-16 bg-gray-900/50">
          <div className="eco-container">
            <div className={`text-center mb-12 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="section-title">Our Values</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                These core principles guide everything we do at {companyInfo?.companyName}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-stagger">
              {values.map((value, index) => (
                <div key={index} className={`bg-gray-800/70 backdrop-blur-md p-6 rounded-lg shadow-md border border-gray-700 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-lg hover:shadow-eco-900/20 hover:border-eco-700/30`}>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-eco-800/70 text-eco-400 rounded-full mb-4">
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-eco-400 mb-2">{value.title}</h3>
                  <p className="text-gray-300">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Service Regions */}
        <section className="py-16">
          <div className="eco-container">
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1529832393073-e362750f78b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                  alt="Map of Andhra Pradesh and Telangana"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-6">
                <h2 className="section-title">Our Service Areas</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-eco-500 mt-1" />
                    <div>
                      <h3 className="font-medium text-eco-400">Primary Regions</h3>
                      <p className="text-gray-300">{serviceRegions?.primaryRegions}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-eco-500 mt-1" />
                    <div>
                      <h3 className="font-medium text-eco-400">Major Cities</h3>
                      <p className="text-gray-300">{serviceRegions?.cities}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-eco-500 mt-1" />
                    <div>
                      <h3 className="font-medium text-eco-400">Delivery Information</h3>
                      <p className="text-gray-300">{serviceRegions?.deliveryInfo}</p>
                    </div>
                  </div>
                </div>
                
                <Button asChild className="bg-eco-600 hover:bg-eco-700 mt-4">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default About;
