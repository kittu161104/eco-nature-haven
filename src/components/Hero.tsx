
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
      {/* Decorative leaves */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
        <div className="absolute -top-10 -left-10 w-40 h-40 border-r-2 border-b-2 border-eco-400 rounded-br-full"></div>
        <div className="absolute top-1/4 right-1/3 w-60 h-60 border-l-2 border-t-2 border-eco-400 rounded-tl-full"></div>
        <div className="absolute bottom-1/3 left-1/4 w-20 h-20 border-r-2 border-b-2 border-eco-400 rounded-br-full"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 border-l-2 border-t-2 border-eco-400 rounded-tl-full"></div>
      </div>
      
      <div className="eco-container relative z-10">
        <div className="py-20 md:py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-eco-600/30 text-eco-100 mb-6">
              <Leaf className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Sustainable & Eco-friendly Plants</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-r from-eco-400 to-eco-500 text-transparent bg-clip-text">Natural Green Nursery</span>
            </h1>
            
            <p className="text-xl text-eco-100 mb-8 max-w-xl">
              Discover our handpicked collection of sustainable plants, gardening supplies, and eco-friendly decor to transform your living space.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-eco-500 hover:bg-eco-600 text-gray-900 font-medium"
                asChild
              >
                <Link to="/shop">
                  Shop Collection
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
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
