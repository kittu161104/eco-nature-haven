
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
import { User, LogOut, Settings, UserPlus, LogIn, Package } from "lucide-react";

interface ProfileMenuProps {
  onClick?: () => void;
}

const ProfileMenu = ({ onClick }: ProfileMenuProps) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      if (onClick) onClick();
      navigate("/");
    } catch (error) {
      console.error('Logout error:', error);
    }
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
    navigate("/account");
  };

  const handleOrders = () => {
    if (onClick) onClick();
    navigate("/orders");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="navbar-button text-green-500 hover:text-green-400"
        >
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-64 glass border-green-800/40 z-[9999]"
      >
        {isAuthenticated ? (
          <>
            <DropdownMenuLabel className="text-green-400">
              <div className="flex flex-col">
                <span className="font-medium">{user?.name || 'User'}</span>
                <span className="text-xs text-green-300">
                  {user?.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-green-800/30" />
            
            {user?.is_admin && (
              <DropdownMenuItem 
                onClick={handleAdminDashboard} 
                className="hover:bg-green-900/30 text-green-400 cursor-pointer"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Admin Dashboard</span>
              </DropdownMenuItem>
            )}
            
            <DropdownMenuItem 
              onClick={handleUserProfile} 
              className="hover:bg-green-900/30 text-green-400 cursor-pointer"
            >
              <User className="mr-2 h-4 w-4" />
              <span>My Account</span>
            </DropdownMenuItem>

            <DropdownMenuItem 
              onClick={handleOrders} 
              className="hover:bg-green-900/30 text-green-400 cursor-pointer"
            >
              <Package className="mr-2 h-4 w-4" />
              <span>My Orders</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-green-800/30" />
            
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="hover:bg-red-900/30 text-green-400 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem 
              onClick={handleLogin} 
              className="hover:bg-green-900/30 text-green-400 cursor-pointer"
            >
              <LogIn className="mr-2 h-4 w-4" />
              <span>Log in</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={handleRegister} 
              className="hover:bg-green-900/30 text-green-400 cursor-pointer"
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
