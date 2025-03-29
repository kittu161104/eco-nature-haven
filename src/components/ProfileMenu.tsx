
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-eco-800 hover:text-eco-600 hover:bg-eco-50"
        >
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {isAuthenticated ? (
          <>
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium">{user?.name}</span>
                <span className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {isAdmin && (
              <DropdownMenuItem onClick={handleAdminDashboard}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Admin Dashboard</span>
              </DropdownMenuItem>
            )}
            
            <DropdownMenuItem asChild>
              <Link to="/account" onClick={onClick}>
                <User className="mr-2 h-4 w-4" />
                <span>My Account</span>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link to="/orders" onClick={onClick}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                <span>My Orders</span>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onClick={handleLogin}>
              <LogIn className="mr-2 h-4 w-4" />
              <span>Log in</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={handleRegister}>
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
