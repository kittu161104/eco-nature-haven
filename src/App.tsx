
import { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import "./styles/theme-overrides.css";
import SafeSonner from "./components/SafeSonner";
import { AnimatePresence } from "framer-motion";

// Eager load critical components
import Index from "./pages/Index";
import AdminLayout from "./components/AdminLayout";

// Lazy load non-critical components
const Shop = lazy(() => import("./pages/Shop"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Products = lazy(() => import("./pages/admin/Products"));
const Posts = lazy(() => import("./pages/admin/Posts"));
const Pages = lazy(() => import("./pages/admin/Pages"));
const Orders = lazy(() => import("./pages/admin/Orders"));
const Customers = lazy(() => import("./pages/admin/Customers"));
const Settings = lazy(() => import("./pages/admin/Settings"));
const Account = lazy(() => import("./pages/Account"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const UserOrders = lazy(() => import("./pages/UserOrders"));
const Payment = lazy(() => import("./pages/Payment"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));

// Create enhanced query client with retry logic and error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-pulse flex flex-col items-center">
      <div className="h-16 w-16 bg-green-600 rounded-full opacity-70 mb-4"></div>
      <div className="h-4 w-24 bg-green-900/40 rounded mb-2.5"></div>
      <div className="h-3 w-36 bg-green-900/30 rounded"></div>
    </div>
  </div>
);

const applyStoredSettings = () => {
  try {
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
  } catch (error) {
    console.error("Error applying settings:", error);
    // Fallback to default settings in case of error
  }
};

// Throttled initialization function to prevent excessive writes
const initializeStoreDataOnce = () => {
  if (window.storeInitialized) return;
  window.storeInitialized = true;
  
  // Use a try-catch block for all localStorage operations
  try {
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
  } catch (error) {
    console.error("Error initializing store data:", error);
    // If initialization fails, we'll fall back to default empty values when needed
  }
};

const InitializeStoreData = () => {
  useEffect(() => {
    initializeStoreDataOnce();
  }, []);
  
  return null;
};

const AppContent = () => {
  useEffect(() => {
    try {
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
    } catch (error) {
      console.error("Failed to initialize app settings:", error);
      // Continue rendering the app even if settings fail
    }
  }, []);
  
  return (
    <>
      <InitializeStoreData />
      <AnimatePresence mode="wait">
        <Suspense fallback={<LoadingFallback />}>
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
            <Route path="/account/:id" element={<UserProfile />} />
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
        </Suspense>
      </AnimatePresence>
    </>
  );
};

// Add type definition for window to support our custom property
declare global {
  interface Window {
    storeInitialized?: boolean;
  }
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <ErrorBoundary>
            <Toaster />
            <ErrorBoundary fallback={<div className="p-4 text-green-400 bg-black/80">Failed to load toast notifications</div>}>
              <SafeSonner />
            </ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
