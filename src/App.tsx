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
import BlogDetail from "./pages/BlogDetail";
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
import Account from "./pages/Account";
import UserOrders from "./pages/UserOrders";
import Payment from "./pages/Payment";
import ProductDetail from "./pages/ProductDetail";

const queryClient = new QueryClient();

const applyStoredSettings = () => {
  const storedAppearanceSettings = localStorage.getItem("appearanceSettings");
  
  if (storedAppearanceSettings) {
    const appearanceSettings = JSON.parse(storedAppearanceSettings);
    
    if (appearanceSettings.backgroundImage) {
      document.documentElement.style.setProperty('--nursery-background', `url(${appearanceSettings.backgroundImage})`);
    }
    
    if (appearanceSettings.primaryColor) {
      document.documentElement.style.setProperty('--eco-600', appearanceSettings.primaryColor);
    }
    
    if (appearanceSettings.secondaryColor) {
      document.documentElement.style.setProperty('--eco-300', appearanceSettings.secondaryColor);
    }
  }
};

const InitializeStoreData = () => {
  useEffect(() => {
    if (!localStorage.getItem("products")) {
      localStorage.setItem("products", JSON.stringify([]));
    }
    
    if (!localStorage.getItem("posts")) {
      localStorage.setItem("posts", JSON.stringify([]));
    }
    
    if (!localStorage.getItem("orders")) {
      localStorage.setItem("orders", JSON.stringify([]));
    }
    
    if (!localStorage.getItem("customers")) {
      localStorage.setItem("customers", JSON.stringify([]));
    }
    
    if (!localStorage.getItem("aboutContent")) {
      localStorage.setItem("aboutContent", JSON.stringify({
        about: "Welcome to our nursery!",
        mission: "Our mission is to provide high-quality plants and gardening supplies.",
        values: "We value sustainability, quality, and customer satisfaction.",
        team: [
          {
            id: "1",
            name: "Admin",
            role: "Owner",
            bio: "Add team member details from the admin panel.",
            image: "/placeholder.svg"
          }
        ],
        visit: "Visit our nursery information. Edit from admin panel."
      }));
    }
  }, []);
  
  return null;
};

const AppContent = () => {
  useEffect(() => {
    applyStoredSettings();
    
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
    <>
      <InitializeStoreData />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account />} />
        <Route path="/orders" element={<UserOrders />} />
        <Route path="/payment" element={<Payment />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="posts" element={<Posts />} />
          <Route path="customers" element={<Customers />} />
          <Route path="pages" element={<Pages />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
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
