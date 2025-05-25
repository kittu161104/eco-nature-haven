
import React, { useState } from "react";
import { Navigate, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  LogOut,
  Menu,
  X,
  Leaf,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";

const AdminLayout = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
      name: "Customers",
      icon: <Users className="h-5 w-5" />,
      path: "/admin/customers",
    },
    {
      name: "Pages",
      icon: <FileText className="h-5 w-5" />,
      path: "/admin/pages",
    },
  ];

  return (
    <div className="flex h-screen" style={{ background: "#000000" }}>
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="glass border-green-800"
        >
          {isSidebarOpen ? (
            <X className="h-5 w-5" style={{ color: "#22c55e" }} />
          ) : (
            <Menu className="h-5 w-5" style={{ color: "#22c55e" }} />
          )}
        </Button>
      </div>

      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed inset-y-0 left-0 z-40 w-64 glass-heavy transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          <div className="px-6 py-6 flex items-center border-b border-green-900/50">
            <Leaf className="h-6 w-6 text-green-500 animate-leaf-sway" />
            <h1 className="text-xl font-bold ml-2" style={{ color: "#22c55e" }}>Admin Portal</h1>
          </div>

          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start text-left mb-1 transition-all duration-300 
                    ${isActive 
                      ? "bg-green-700/30 border-l-4 border-green-500" 
                      : "hover:bg-green-900/20"
                    }`}
                  style={{ color: "#22c55e" }}
                  onClick={() => navigate(item.path)}
                >
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center"
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </motion.div>
                </Button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-green-900/50 glass">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-green-900/30 flex items-center justify-center border border-green-800/50">
                  <span className="text-green-500 font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium" style={{ color: "#22c55e" }}>{user.name}</p>
                <p className="text-xs" style={{ color: "#16a34a" }}>{user.email}</p>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full mt-4 glass border-red-900/50 hover:bg-red-900/20"
              style={{ color: "#22c55e" }}
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </motion.aside>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 md:ml-64 p-8 overflow-y-auto"
        style={{ background: "#000000" }}
      >
        <Outlet />
      </motion.div>
    </div>
  );
};

export default AdminLayout;
