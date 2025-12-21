
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Address } from '../constants';

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  photoUrl?: string;
  themePreference?: 'light' | 'dark';
  addresses: Address[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, name?: string) => void;
  signup: (name: string, email: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check localStorage on load
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user data", error);
    }
  }, []);

  // Apply theme side effect
  useEffect(() => {
    const html = document.documentElement;
    if (user?.themePreference === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [user?.themePreference]);

  const login = (email: string, name: string = 'Demo User') => {
    // In a real app, fetch this from backend. Here we mock or retrieve existing if matches.
    const storedUserStr = localStorage.getItem('user');
    let userData: User;

    if (storedUserStr) {
        const stored = JSON.parse(storedUserStr);
        if(stored.email === email) {
            userData = stored;
        } else {
             // Mock login for demo if email doesn't match stored (resets for demo purposes)
             userData = { id: '1', name, email, themePreference: 'light', addresses: [] };
        }
    } else {
        userData = { id: '1', name, email, themePreference: 'light', addresses: [] };
    }
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const signup = (name: string, email: string) => {
    const newUser: User = { 
        id: Date.now().toString(), 
        name, 
        email, 
        themePreference: 'light',
        addresses: []
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    document.documentElement.classList.remove('dark');
  };

  const updateProfile = (data: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, ...data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const addAddress = (newAddressData: Omit<Address, 'id'>) => {
      setUser((prevUser) => {
          if (!prevUser) return null;
          
          const newAddress: Address = {
              id: Date.now().toString(),
              ...newAddressData
          };

          // If this is default, make others not default
          let updatedAddresses = [...prevUser.addresses];
          if (newAddress.isDefault) {
              updatedAddresses = updatedAddresses.map(a => ({ ...a, isDefault: false }));
          }
          // If it's the first address, force it to be default
          if (updatedAddresses.length === 0) {
              newAddress.isDefault = true;
          }

          updatedAddresses.push(newAddress);

          const updatedUser = { ...prevUser, addresses: updatedAddresses };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          return updatedUser;
      });
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, addAddress, isAuthenticated: !!user }}>
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
