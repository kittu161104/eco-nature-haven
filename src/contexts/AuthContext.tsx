
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  isAdmin: false,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
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
      
      // Set auth state
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      
      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      
      // Show success toast
      toast({
        title: "Login successful",
        description: `Welcome back, ${userWithoutPassword.name}!`,
      });
      
      // Redirect based on user role
      if (userWithoutPassword.role === "admin") {
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
      };
      
      // Save user
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      
      // Login the user automatically
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      
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

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isAdmin, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
