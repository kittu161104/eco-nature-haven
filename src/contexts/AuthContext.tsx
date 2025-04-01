
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  phoneNumber?: string;
  phoneVerified?: boolean;
  createdAt: string;
  lastLogin: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  updatePhoneNumber: (phoneNumber: string) => Promise<void>;
  needsPhoneVerification: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  isAdmin: false,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  updatePhoneNumber: async () => {},
  needsPhoneVerification: false,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [needsPhoneVerification, setNeedsPhoneVerification] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Compute isAdmin based on user role
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
      
      // Check if phone verification is needed
      if (parsedUser.email.endsWith('@gmail.com') && !parsedUser.phoneVerified) {
        setNeedsPhoneVerification(true);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simple validation
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    try {
      // In a real app, we would call an API here
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const foundUser = users.find((u: any) => u.email === email && u.password === password);

      if (!foundUser) {
        throw new Error("Invalid email or password");
      }

      // Create user object without password
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Add last login timestamp
      const updatedUser = {
        ...userWithoutPassword,
        lastLogin: new Date().toISOString()
      };
      
      // Update user in localStorage
      const updatedUsers = users.map((u: any) => 
        u.id === updatedUser.id ? { ...u, lastLogin: updatedUser.lastLogin } : u
      );
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      
      // Set auth state
      setUser(updatedUser);
      setIsAuthenticated(true);
      
      // Check if phone verification is needed
      if (updatedUser.email.endsWith('@gmail.com') && !updatedUser.phoneVerified) {
        setNeedsPhoneVerification(true);
      } else {
        setNeedsPhoneVerification(false);
      }
      
      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Show success toast
      toast({
        title: "Login successful",
        description: `Welcome back, ${updatedUser.name}!`,
      });
      
      // Redirect based on user role
      if (updatedUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      let message = "An unknown error occurred";
      if (error instanceof Error) message = error.message;
      
      toast({
        variant: "destructive",
        title: "Login failed",
        description: message,
      });
      
      throw new Error(message);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    // Simple validation
    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    try {
      // Get existing users
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      
      // Check if user already exists
      const userExists = users.some((u: any) => u.email === email);
      if (userExists) {
        throw new Error("Email already registered");
      }
      
      // Determine role based on email domain
      let role: "admin" | "customer" = "customer";
      if (email.endsWith("@nature.com")) {
        role = "admin";
      } else if (!email.endsWith("@gmail.com")) {
        throw new Error("Email must end with @gmail.com or @nature.com");
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        role,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        phoneVerified: false
      };
      
      // Save user
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      
      // Login the user automatically
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      
      // Check if phone verification is needed
      if (email.endsWith('@gmail.com')) {
        setNeedsPhoneVerification(true);
      }
      
      // Show success toast
      toast({
        title: "Registration successful",
        description: `Welcome, ${name}!`,
      });
      
      // Redirect based on role
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      let message = "An unknown error occurred";
      if (error instanceof Error) message = error.message;
      
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: message,
      });
      
      throw new Error(message);
    }
  };

  const updatePhoneNumber = async (phoneNumber: string) => {
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    try {
      // Update user in state
      const updatedUser = {
        ...user,
        phoneNumber,
        phoneVerified: true
      };
      
      setUser(updatedUser);
      setNeedsPhoneVerification(false);
      
      // Update user in localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Update in users array
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const updatedUsers = users.map((u: any) => 
        u.id === user.id 
          ? { ...u, phoneNumber, phoneVerified: true } 
          : u
      );
      
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      
      // Add to customers if not already there
      const customers = JSON.parse(localStorage.getItem("customers") || "[]");
      const existingCustomer = customers.find((c: any) => c.email === user.email);
      
      if (!existingCustomer && user.role === "customer") {
        const newCustomer = {
          id: parseInt(user.id),
          name: user.name,
          email: user.email,
          phone: phoneNumber,
          orders: 0,
          totalSpent: 0,
          lastOrder: null,
          status: "active"
        };
        
        customers.push(newCustomer);
        localStorage.setItem("customers", JSON.stringify(customers));
      } else if (existingCustomer) {
        const updatedCustomers = customers.map((c: any) => 
          c.email === user.email 
            ? { ...c, phone: phoneNumber } 
            : c
        );
        
        localStorage.setItem("customers", JSON.stringify(updatedCustomers));
      }
      
      toast({
        title: "Phone Verified",
        description: "Your phone number has been verified successfully",
      });
      
    } catch (error) {
      console.error("Error updating phone number:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Failed to update phone number. Please try again.",
      });
      
      throw new Error("Failed to update phone number");
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setNeedsPhoneVerification(false);
    localStorage.removeItem("user");
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      isAdmin, 
      login, 
      logout, 
      register, 
      updatePhoneNumber,
      needsPhoneVerification
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
