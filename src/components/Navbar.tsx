
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import ProfileMenu from "@/components/ProfileMenu";
import CartModal from "@/components/CartModal";
import SearchModal from "@/components/SearchModal";
import { Menu, Search, ShoppingCart, X, Leaf } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "./ui/badge";

const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, isAdmin } = useAuth();
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Update cart count whenever cart is updated
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItemCount(cart.reduce((total: number, item: any) => total + item.quantity, 0));
    };

    // Initial count
    updateCartCount();

    // Listen for cart updates
    window.addEventListener('cart-updated', updateCartCount);
    
    return () => {
      window.removeEventListener('cart-updated', updateCartCount);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    // Trigger load animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 200);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        isScrolled
          ? "bg-gray-900/90 backdrop-blur-lg shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="eco-container">
        <div className={`flex h-16 items-center justify-between transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0 -translate-y-4'}`}>
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Leaf className="h-6 w-6 text-eco-500 animate-leaf-sway" />
              <h1 className="text-2xl font-bold">
                <span className="shimmer-text">Natural Green</span>
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
              {navLinks.map((link, index) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`navbar-button px-3 py-1.5 rounded-md transition-all duration-300 text-sm font-medium text-white
                    ${isActive(link.path) ? "bg-green-700/40 border-green-600/60" : ""}
                  `}
                  style={{ 
                    transitionDelay: `${index * 100}ms`,
                    animation: isLoaded ? `fadeInUp 0.5s ease ${index * 100 + 300}ms forwards` : 'none',
                    opacity: 0
                  }}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-eco-400 rounded-full"></span>
                  )}
                </Link>
              ))}
            </nav>
          )}

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="navbar-button rounded-full hover:text-eco-400 transition-all duration-300 text-white"
              onClick={toggleSearch}
              style={{ 
                animation: isLoaded ? 'fadeInUp 0.5s ease 600ms forwards' : 'none',
                opacity: 0
              }}
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="navbar-button rounded-full relative transition-all duration-300 text-white"
              onClick={toggleCart}
              style={{ 
                animation: isLoaded ? 'fadeInUp 0.5s ease 700ms forwards' : 'none',
                opacity: 0
              }}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-eco-600">
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            {/* Profile Menu */}
            <div style={{ 
              animation: isLoaded ? 'fadeInUp 0.5s ease 800ms forwards' : 'none',
              opacity: 0
            }}>
              <ProfileMenu />
            </div>

            {/* Mobile Navigation */}
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="navbar-button rounded-full ml-1 text-white"
                    style={{ 
                      animation: isLoaded ? 'fadeInUp 0.5s ease 900ms forwards' : 'none',
                      opacity: 0
                    }}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-gray-900 text-white border-gray-800">
                  <div className="flex flex-col space-y-4 mt-8">
                    {navLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`navbar-button px-3 py-2 rounded-md ${
                          isActive(link.path)
                            ? "bg-green-700/40 text-eco-400 font-semibold"
                            : "text-white"
                        }`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={toggleSearch} />
      
      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={toggleCart} />
    </header>
  );
};

export default Navbar;
