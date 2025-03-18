
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      // For demo purposes, we'll use a mock login
      // In a real app, this would be an API call
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simple validation
      if (!email.trim() || !password.trim()) {
        toast({
          title: "Login Failed",
          description: "Please enter both email and password",
          variant: "destructive",
        });
        return false;
      }
      
      // Mock user data
      const mockUser = {
        id: '123456',
        name: email.split('@')[0],
        email
      };
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "An error occurred during login",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      // For demo purposes, we'll use a mock registration
      // In a real app, this would be an API call
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simple validation
      if (!name.trim() || !email.trim() || !password.trim()) {
        toast({
          title: "Registration Failed",
          description: "Please fill in all fields",
          variant: "destructive",
        });
        return false;
      }
      
      // Mock user data
      const mockUser = {
        id: '123456',
        name,
        email
      };
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created",
      });
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "An error occurred during registration",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('bmiData');
    localStorage.removeItem('dietaryPreferences');
    setUser(null);
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
