
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: any;
  preferences?: any;
  is_admin?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string, adminCode?: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<UserProfile>) => Promise<void>;
  updateAdminCode: (masterCode: string, newAdminCode: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          setUser(profile);
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setUser(profile);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string, adminCode?: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    if (data.user) {
      const profile = await fetchProfile(data.user.id);
      
      // If admin code is provided, verify it
      if (adminCode && profile?.is_admin) {
        const { data: adminSettings } = await supabase
          .from('admin_settings')
          .select('value')
          .eq('key', 'admin_code')
          .single();
        
        const storedAdminCode = adminSettings?.value;
        if (storedAdminCode !== adminCode) {
          await supabase.auth.signOut();
          throw new Error('Invalid admin code');
        }
      }
      
      setUser(profile);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });

    if (error) {
      throw error;
    }

    if (data.user) {
      // Profile will be created automatically by the trigger
      const profile = await fetchProfile(data.user.id);
      setUser(profile);
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    setUser(null);
    setSession(null);
  };

  const updateUser = async (userData: Partial<UserProfile>) => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update(userData)
      .eq('id', user.id);

    if (error) {
      throw error;
    }

    setUser({ ...user, ...userData });
  };

  const updateAdminCode = async (masterCode: string, newAdminCode: string) => {
    // For now, use a simple master code check - in production this should be more secure
    if (masterCode !== 'master123') {
      throw new Error('Invalid master code');
    }

    const { error } = await supabase
      .from('admin_settings')
      .upsert({
        key: 'admin_code',
        value: newAdminCode,
        updated_at: new Date().toISOString()
      });

    if (error) {
      throw error;
    }
  };

  const value = {
    user,
    session,
    isAuthenticated: !!session,
    isAdmin: user?.is_admin || false,
    login,
    register,
    logout,
    updateUser,
    updateAdminCode,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-green-500 text-xl">Loading...</div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
