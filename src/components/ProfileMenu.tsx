
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, LogOut, ShoppingCart, Settings, UserPlus, LogIn, Heart, Package, RotateCcw } from "lucide-react";

interface ProfileMenuProps {
  onClick?: () => void;
}

const ProfileMenu = ({ onClick }: ProfileMenuProps) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    if (onClick) onClick();
    navigate("/");
  };

  const handleLogin = () => {
    if (onClick) onClick();
    navigate("/login");
  };

  const handleRegister = () => {
    if (onClick) onClick();
    navigate("/register");
  };

  const handleAdminDashboard = () => {
    if (onClick) onClick();
    navigate("/admin");
  };

  const handleUserProfile = () => {
    if (onClick) onClick();
    navigate(`/account/${user?.id}`);
  };

  const handleWishlist = () => {
    if (onClick) onClick();
    navigate("/wishlist");
  };

  const handleOrderTracking = () => {
    if (onClick) onClick();
    navigate("/orders");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="navbar-button"
          style={{ color: "#22c55e" }}
        >
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-64 profile-menu"
        style={{
          background: "rgba(0, 0, 0, 0.95)",
          backdropFilter: "blur(25px) saturate(180%)",
          border: "1px solid rgba(22, 163, 74, 0.4)",
          color: "#22c55e"
        }}
      >
        {isAuthenticated ? (
          <>
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium" style={{ color: "#22c55e" }}>{user?.name}</span>
                <span className="text-xs" style={{ color: "#16a34a" }}>
                  {user?.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator style={{ backgroundColor: "rgba(22, 163, 74, 0.3)" }} />
            
            {isAdmin && (
              <DropdownMenuItem 
                onClick={handleAdminDashboard} 
                className="hover:bg-green-900/30"
                style={{ color: "#22c55e" }}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Admin Dashboard</span>
              </DropdownMenuItem>
            )}
            
            <DropdownMenuItem 
              onClick={handleUserProfile} 
              className="hover:bg-green-900/30"
              style={{ color: "#22c55e" }}
            >
              <User className="mr-2 h-4 w-4" />
              <span>My Account</span>
            </DropdownMenuItem>

            <DropdownMenuItem 
              onClick={handleWishlist} 
              className="hover:bg-green-900/30"
              style={{ color: "#22c55e" }}
            >
              <Heart className="mr-2 h-4 w-4" />
              <span>Wishlist</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={handleOrderTracking} 
              className="hover:bg-green-900/30"
              style={{ color: "#22c55e" }}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              <span>My Orders</span>
            </DropdownMenuItem>

            <DropdownMenuItem 
              onClick={handleOrderTracking} 
              className="hover:bg-green-900/30"
              style={{ color: "#22c55e" }}
            >
              <Package className="mr-2 h-4 w-4" />
              <span>Order Tracking</span>
            </DropdownMenuItem>

            <DropdownMenuItem 
              onClick={handleOrderTracking} 
              className="hover:bg-green-900/30"
              style={{ color: "#22c55e" }}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              <span>Returns & Refunds</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator style={{ backgroundColor: "rgba(22, 163, 74, 0.3)" }} />
            
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="hover:bg-red-900/30"
              style={{ color: "#22c55e" }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem 
              onClick={handleLogin} 
              className="hover:bg-green-900/30"
              style={{ color: "#22c55e" }}
            >
              <LogIn className="mr-2 h-4 w-4" />
              <span>Log in</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={handleRegister} 
              className="hover:bg-green-900/30"
              style={{ color: "#22c55e" }}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              <span>Register</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
