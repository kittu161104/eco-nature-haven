
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useEffect } from "react";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Posts from "./pages/admin/Posts";
import Pages from "./pages/admin/Pages";
import Orders from "./pages/admin/Orders";
import Customers from "./pages/admin/Customers";
import Settings from "./pages/admin/Settings";

// Add CSS class for container
import "./index.css";

const queryClient = new QueryClient();

// Function to apply stored settings
const applyStoredSettings = () => {
  const storedAppearanceSettings = localStorage.getItem("appearanceSettings");
  
  if (storedAppearanceSettings) {
    const appearanceSettings = JSON.parse(storedAppearanceSettings);
    
    if (appearanceSettings.backgroundImage) {
      document.documentElement.style.setProperty('--nursery-background', `url(${appearanceSettings.backgroundImage})`);
    }
    
    // Apply other settings if needed
    if (appearanceSettings.primaryColor) {
      document.documentElement.style.setProperty('--eco-600', appearanceSettings.primaryColor);
    }
    
    if (appearanceSettings.secondaryColor) {
      document.documentElement.style.setProperty('--eco-300', appearanceSettings.secondaryColor);
    }
  }
};

const AppContent = () => {
  useEffect(() => {
    // Apply settings on initial load
    applyStoredSettings();
    
    // Listen for settings changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "appearanceSettings") {
        applyStoredSettings();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="posts" element={<Posts />} />
        <Route path="customers" element={<Customers />} />
        <Route path="pages" element={<Pages />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      
      {/* Catch-all Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
