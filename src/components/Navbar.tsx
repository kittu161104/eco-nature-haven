
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, Menu, X, Leaf, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchClick = () => {
    toast({
      title: "Search coming soon",
      description: "Our search functionality will be available in the next update.",
    });
  };

  const handleCartClick = () => {
    toast({
      title: "Shopping cart",
      description: "Your shopping cart is currently empty.",
    });
  };

  const handleProfileClick = () => {
    toast({
      title: "User profile",
      description: "Login and signup features coming soon.",
    });
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="eco-container">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="h-6 w-6 text-eco-600" />
            <span className="font-serif font-bold text-xl text-eco-800">
              Natural Green
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-eco-800 hover:text-eco-600 font-medium">
              Home
            </Link>
            <Link to="/shop" className="text-eco-800 hover:text-eco-600 font-medium">
              Shop
            </Link>
            <Link to="/blog" className="text-eco-800 hover:text-eco-600 font-medium">
              Blog
            </Link>
            <Link to="/about" className="text-eco-800 hover:text-eco-600 font-medium">
              About
            </Link>
            <Link to="/contact" className="text-eco-800 hover:text-eco-600 font-medium">
              Contact
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-eco-800 hover:text-eco-600 hover:bg-eco-50"
              onClick={handleSearchClick}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-eco-800 hover:text-eco-600 hover:bg-eco-50"
              onClick={handleCartClick}
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-eco-800 hover:text-eco-600 hover:bg-eco-50"
              onClick={handleProfileClick}
            >
              <User className="h-5 w-5" />
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-eco-800 hover:text-eco-600 hover:bg-eco-50"
              onClick={toggleMenu}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-fade-in-up">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-eco-800 hover:text-eco-600 font-medium px-2 py-1"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/shop" 
                className="text-eco-800 hover:text-eco-600 font-medium px-2 py-1"
                onClick={() => setIsOpen(false)}
              >
                Shop
              </Link>
              <Link 
                to="/blog" 
                className="text-eco-800 hover:text-eco-600 font-medium px-2 py-1"
                onClick={() => setIsOpen(false)}
              >
                Blog
              </Link>
              <Link 
                to="/about" 
                className="text-eco-800 hover:text-eco-600 font-medium px-2 py-1"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-eco-800 hover:text-eco-600 font-medium px-2 py-1"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
