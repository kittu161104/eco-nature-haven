
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  avatar?: string;
  preferences?: {
    marketing: boolean;
    notifications: boolean;
    theme: 'light' | 'dark';
  };
  createdAt: string;
  lastLogin: string;
  updatedAt?: string;
  isAdmin?: boolean; // Add this for convenience in templates
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}
