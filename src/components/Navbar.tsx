
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import ProfileMenu from "@/components/ProfileMenu";
import CartModal from "@/components/CartModal";
import SearchModal from "@/components/SearchModal";
import { Menu, Search, ShoppingCart, X, Leaf, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "./ui/badge";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user } = useAuth();
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
      setIsScrolled(window.scrollY > 10);
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

  const isActive = (path: string) => location.pathname === path;

  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const handleProfileClick = () => {
    if (isAuthenticated && user) {
      navigate(`/account/${user.id}`);
    } else {
      navigate("/login");
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 glass ${
        isScrolled ? "glass-heavy" : ""
      }`}
      style={{
        background: isScrolled 
          ? "rgba(0, 0, 0, 0.95)" 
          : "rgba(0, 0, 0, 0.9)",
        backdropFilter: "blur(25px) saturate(180%)",
        borderBottom: "1px solid rgba(22, 163, 74, 0.2)"
      }}
    >
      <div className="eco-container">
        <div className={`flex h-16 items-center justify-between transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0 -translate-y-4'}`}>
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 float-animation">
              <Leaf className="h-6 w-6 text-eco-500 glow-pulse" />
              <h1 className="text-2xl font-bold" style={{ color: "#22c55e" }}>
                <span>Natural Green</span>
              </h1>
            </Link>
          </div>

          {!isMobile && (
            <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
              {navLinks.map((link, index) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`navbar-button px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium relative
                    ${isActive(link.path) ? "bg-green-800/30 border-green-500/60" : ""}
                  `}
                  style={{ 
                    transitionDelay: `${index * 100}ms`,
                    animation: isLoaded ? `fadeInUp 0.5s ease ${index * 100 + 300}ms forwards` : 'none',
                    opacity: 0,
                    color: "#22c55e",
                    background: "rgba(22, 163, 74, 0.1)",
                    border: "1px solid rgba(22, 163, 74, 0.3)",
                    backdropFilter: "blur(10px)"
                  }}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-eco-400 rounded-full glow-pulse"></span>
                  )}
                </Link>
              ))}
            </nav>
          )}

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="transition-all duration-300 navbar-button"
              onClick={toggleSearch}
              style={{ 
                animation: isLoaded ? 'fadeInUp 0.5s ease 600ms forwards' : 'none',
                opacity: 0,
                color: "#22c55e"
              }}
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="transition-all duration-300 relative navbar-button"
              onClick={toggleCart}
              style={{ 
                animation: isLoaded ? 'fadeInUp 0.5s ease 700ms forwards' : 'none',
                opacity: 0,
                color: "#22c55e"
              }}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-eco-600 text-black">
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="transition-all duration-300 navbar-button"
              onClick={handleProfileClick}
              style={{ 
                animation: isLoaded ? 'fadeInUp 0.5s ease 750ms forwards' : 'none',
                opacity: 0,
                color: "#22c55e"
              }}
            >
              <User className="h-5 w-5" />
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
                    className="transition-all duration-300 ml-1 navbar-button"
                    style={{ 
                      animation: isLoaded ? 'fadeInUp 0.5s ease 900ms forwards' : 'none',
                      opacity: 0,
                      color: "#22c55e"
                    }}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="glass-heavy border-green-800">
                  <div className="flex flex-col space-y-4 mt-8">
                    {navLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`px-3 py-2 rounded-md navbar-button ${
                          isActive(link.path) ? "bg-green-700/40 font-semibold" : ""
                        }`}
                        style={{ color: "#22c55e" }}
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

      <SearchModal isOpen={isSearchOpen} onClose={toggleSearch} />
      <CartModal isOpen={isCartOpen} onClose={toggleCart} />
    </header>
  );
};

export default Navbar;
