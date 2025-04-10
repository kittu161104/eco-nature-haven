
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
import { User, LogOut, ShoppingCart, Settings, UserPlus, LogIn } from "lucide-react";

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:text-green-400 hover:bg-green-800/40"
        >
          <User className="h-5 w-5 text-white" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-black/80 backdrop-blur-md border-green-800 text-white">
        {isAuthenticated ? (
          <>
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium text-white">{user?.name}</span>
                <span className="text-xs text-green-400 truncate">
                  {user?.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-green-900/50" />
            
            {isAdmin && (
              <DropdownMenuItem onClick={handleAdminDashboard} className="hover:bg-green-900/30 text-white">
                <Settings className="mr-2 h-4 w-4 text-white" />
                <span>Admin Dashboard</span>
              </DropdownMenuItem>
            )}
            
            <DropdownMenuItem onClick={handleUserProfile} className="hover:bg-green-900/30 text-white">
              <User className="mr-2 h-4 w-4 text-white" />
              <span>My Account</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link to="/orders" onClick={onClick} className="flex items-center hover:bg-green-900/30 text-white">
                <ShoppingCart className="mr-2 h-4 w-4 text-white" />
                <span>My Orders</span>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-green-900/50" />
            
            <DropdownMenuItem onClick={handleLogout} className="hover:bg-red-900/30 text-white">
              <LogOut className="mr-2 h-4 w-4 text-white" />
              <span>Log out</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onClick={handleLogin} className="hover:bg-green-900/30 text-white">
              <LogIn className="mr-2 h-4 w-4 text-white" />
              <span>Log in</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={handleRegister} className="hover:bg-green-900/30 text-white">
              <UserPlus className="mr-2 h-4 w-4 text-white" />
              <span>Register</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
