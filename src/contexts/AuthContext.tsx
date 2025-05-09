
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types/user";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  isAdmin: false,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  updateUser: () => {},
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

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData, updatedAt: new Date().toISOString() };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    // If this is a customer, also update the customers collection
    if (user.role === "customer") {
      try {
        const customers = JSON.parse(localStorage.getItem("customers") || "[]");
        const updatedCustomers = customers.map((c: any) => 
          c.id === parseInt(user.id) ? { ...c, name: updatedUser.name, email: updatedUser.email } : c
        );
        localStorage.setItem("customers", JSON.stringify(updatedCustomers));
      } catch (error) {
        console.error("Error updating customer data:", error);
      }
    }
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated.",
    });
  };

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
      
      // Add to customers if role is customer
      if (role === "customer") {
        const customers = JSON.parse(localStorage.getItem("customers") || "[]");
        const newCustomer = {
          id: parseInt(newUser.id),
          name: newUser.name,
          email: newUser.email,
          orders: 0,
          totalSpent: 0,
          lastOrder: null,
          status: "active"
        };
        
        customers.push(newCustomer);
        localStorage.setItem("customers", JSON.stringify(customers));
      }
      
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
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      isAdmin, 
      login, 
      logout, 
      register,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
