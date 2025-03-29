
import React, { useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  ShoppingBag,
  FileText,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Leaf,
} from "lucide-react";

const AdminLayout = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Redirect non-admin users
  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: "/admin",
    },
    {
      name: "Products",
      icon: <ShoppingBag className="h-5 w-5" />,
      path: "/admin/products",
    },
    {
      name: "Orders",
      icon: <ShoppingBag className="h-5 w-5" />,
      path: "/admin/orders",
    },
    {
      name: "Blog Posts",
      icon: <FileText className="h-5 w-5" />,
      path: "/admin/posts",
    },
    {
      name: "Customers",
      icon: <Users className="h-5 w-5" />,
      path: "/admin/customers",
    },
    {
      name: "Pages",
      icon: <FileText className="h-5 w-5" />,
      path: "/admin/pages",
    },
    {
      name: "Settings",
      icon: <Settings className="h-5 w-5" />,
      path: "/admin/settings",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="bg-white"
        >
          {isSidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="px-6 py-6 flex items-center border-b">
            <Leaf className="h-6 w-6 text-eco-600 mr-2" />
            <h1 className="text-xl font-bold text-eco-800">Admin Portal</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className="w-full justify-start text-left mb-1"
                onClick={() => navigate(item.path)}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Button>
            ))}
          </nav>

          {/* User info */}
          <div className="p-4 border-t">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-eco-100 flex items-center justify-center">
                  <span className="text-eco-600 font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full mt-4 text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 md:ml-64 p-8 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
