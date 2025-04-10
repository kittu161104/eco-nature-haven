
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

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItemCount(cart.reduce((total: number, item: any) => total + item.quantity, 0));
    };

    updateCartCount();

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
          ? "bg-green-900/90 backdrop-blur-lg shadow-lg"
          : "bg-green-900"
      }`}
    >
      <div className="eco-container">
        <div className={`flex h-16 items-center justify-between transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0 -translate-y-4'}`}>
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Leaf className="h-6 w-6 text-eco-500 animate-leaf-sway" />
              <h1 className="text-2xl font-bold">
                <span className="shimmer-text">Natural Green</span>
              </h1>
            </Link>
          </div>

          {!isMobile && (
            <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
              {navLinks.map((link, index) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`navbar-button px-3 py-1.5 rounded-md transition-all duration-300 text-sm font-medium
                    ${isActive(link.path) ? "bg-green-700/40 border-green-600/60" : ""}
                  `}
                  style={{ 
                    transitionDelay: `${index * 100}ms`,
                    animation: isLoaded ? `fadeInUp 0.5s ease ${index * 100 + 300}ms forwards` : 'none',
                    opacity: 0,
                    color: "white"
                  }}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-eco-400 rounded-full"></span>
                  )}
                </Link>
              ))}
              <Link
                to="/blog"
                className={`navbar-button px-3 py-1.5 rounded-md transition-all duration-300 text-sm font-medium
                  ${isActive("/blog") ? "bg-green-700/40 border-green-600/60" : ""}
                `}
                style={{ 
                  transitionDelay: `400ms`,
                  animation: isLoaded ? `fadeInUp 0.5s ease 700ms forwards` : 'none',
                  opacity: 0,
                  color: "white"
                }}
              >
                Blog
                {isActive("/blog") && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-eco-400 rounded-full"></span>
                )}
              </Link>
            </nav>
          )}

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-eco-400 hover:bg-green-800/40 transition-all duration-300"
              onClick={toggleSearch}
              style={{ 
                animation: isLoaded ? 'fadeInUp 0.5s ease 600ms forwards' : 'none',
                opacity: 0
              }}
            >
              <Search className="h-5 w-5 text-white" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-eco-400 hover:bg-green-800/40 transition-all duration-300 relative"
              onClick={toggleCart}
              style={{ 
                animation: isLoaded ? 'fadeInUp 0.5s ease 700ms forwards' : 'none',
                opacity: 0
              }}
            >
              <ShoppingCart className="h-5 w-5 text-white" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-eco-600">
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            <div style={{ 
              animation: isLoaded ? 'fadeInUp 0.5s ease 800ms forwards' : 'none',
              opacity: 0
            }}>
              <ProfileMenu />
            </div>

            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-eco-400 hover:bg-green-800/40 transition-all duration-300 ml-1"
                    style={{ 
                      animation: isLoaded ? 'fadeInUp 0.5s ease 900ms forwards' : 'none',
                      opacity: 0
                    }}
                  >
                    <Menu className="h-5 w-5 text-white" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-green-900 text-white border-green-800">
                  <div className="flex flex-col space-y-4 mt-8">
                    {navLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`text-white px-3 py-2 rounded-md ${
                          isActive(link.path)
                            ? "bg-green-700/40 font-semibold"
                            : ""
                        }`}
                      >
                        {link.name}
                      </Link>
                    ))}
                    <Link
                      to="/blog"
                      className={`text-white px-3 py-2 rounded-md ${
                        isActive("/blog")
                          ? "bg-green-700/40 font-semibold"
                          : ""
                      }`}
                    >
                      Blog
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={toggleSearch} />
      
      <CartModal isOpen={isCartOpen} onClose={toggleCart} />
    </header>
  );
};

export default Navbar;
