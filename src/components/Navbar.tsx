
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
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
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
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
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        isScrolled ? "glass-heavy" : "glass"
      }`}
      style={{
        background: isScrolled 
          ? "rgba(0, 0, 0, 0.95)" 
          : "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(25px) saturate(180%)",
        borderBottom: "1px solid rgba(22, 163, 74, 0.3)"
      }}
    >
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 float-animation">
              <Leaf className="h-6 w-6 text-eco-500 glow-pulse" />
              <h1 className="text-2xl font-bold text-eco-500">
                Natural Green
              </h1>
            </Link>
          </div>

          {!isMobile && (
            <nav className="mx-6 flex items-center space-x-2 lg:space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-white hover:text-eco-400 px-4 py-2 rounded-lg text-sm font-medium relative transition-all duration-300 hover:scale-105 border border-transparent hover:border-green-500/30 hover:bg-green-700/20 ${
                    isActive(link.path) ? "bg-green-700/40 border-green-500/60 text-eco-400" : ""
                  }`}
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
              className="text-white hover:text-eco-400 hover:bg-green-700/20 border border-transparent hover:border-green-500/30 transition-all duration-300 hover:scale-110"
              onClick={toggleSearch}
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-eco-400 hover:bg-green-700/20 border border-transparent hover:border-green-500/30 transition-all duration-300 relative hover:scale-110"
              onClick={toggleCart}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-eco-600 text-black text-xs">
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-eco-400 hover:bg-green-700/20 border border-transparent hover:border-green-500/30 transition-all duration-300 hover:scale-110"
              onClick={handleProfileClick}
            >
              <User className="h-5 w-5" />
            </Button>

            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-eco-400 hover:bg-green-700/20 border border-transparent hover:border-green-500/30 transition-all duration-300 ml-1 hover:scale-110"
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
                        className={`px-3 py-2 rounded-md text-eco-500 hover:bg-green-700/40 transition-all ${
                          isActive(link.path) ? "bg-green-700/40 font-semibold" : ""
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

      <SearchModal isOpen={isSearchOpen} onClose={toggleSearch} />
      <CartModal isOpen={isCartOpen} onClose={toggleCart} />
    </header>
  );
};

export default Navbar;
