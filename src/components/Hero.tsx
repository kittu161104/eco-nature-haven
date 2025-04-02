
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Leaf, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
      {/* Animated decorative leaves */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
        <div className="absolute -top-10 -left-10 w-40 h-40 border-r-2 border-b-2 border-eco-400 rounded-br-full animate-leaf-sway"></div>
        <div className="absolute top-1/4 right-1/3 w-60 h-60 border-l-2 border-t-2 border-eco-400 rounded-tl-full animate-leaf-sway" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/3 left-1/4 w-20 h-20 border-r-2 border-b-2 border-eco-400 rounded-br-full animate-leaf-sway" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 border-l-2 border-t-2 border-eco-400 rounded-tl-full animate-leaf-sway" style={{ animationDelay: '1.5s' }}></div>
      </div>
      
      <div className="eco-container relative z-10">
        <div className="py-20 md:py-24 lg:py-32">
          <div className={`max-w-3xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-eco-600/30 text-eco-100 mb-6">
              <Leaf className="h-4 w-4 mr-2 animate-leaf-sway" />
              <span className="text-sm font-medium">Sustainable & Eco-friendly Plants</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 leading-tight">
              <span className="shimmer-text">Natural Green Nursery</span>
            </h1>
            
            <p className="text-xl text-eco-100 mb-6 max-w-xl">
              Discover our handpicked collection of sustainable plants, gardening supplies, and eco-friendly decor to transform your living space.
            </p>
            
            <div className="inline-flex items-center text-eco-400 mb-8">
              <MapPin className="h-5 w-5 mr-2" />
              <span>Proudly serving Andhra Pradesh & Telangana</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-stagger">
              <Button 
                size="lg" 
                className="bg-eco-500 hover:bg-eco-600 text-gray-900 font-medium glow-on-hover"
                asChild
              >
                <Link to="/shop">
                  Shop Collection
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 glow-on-hover"
                asChild
              >
                <Link to="/about">
                  Our Story
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
