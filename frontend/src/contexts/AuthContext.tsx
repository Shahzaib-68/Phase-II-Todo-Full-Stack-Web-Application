'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authClient } from '@/lib/auth-client'; // Yeh file baseURL ke saath updated honi chahiye

interface User {
  id: string;
  email: string;
  name?: string;
  // Agar better-auth mein extra fields hain (jaise image, emailVerified), to yahan add kar dena
  // image?: string | null;
  // emailVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // better-auth ka getSession() yeh return karta hai: { data: { user, session } | null, ... }
        const response = await authClient.getSession();

        if (response?.data?.user) {
          setUser({
            id: response.data.user.id,
            email: response.data.user.email,
            name: response.data.user.name,
            // Agar extra fields chahiye:
            // image: response.data.user.image ?? undefined,
            // emailVerified: response.data.user.emailVerified,
          });
        } else {
          handleAuthClear();
        }
      } catch (error) {
        console.error('Session check failed:', error);
        handleAuthClear();
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Optional: Har 5-10 min mein session refresh kar sakte ho agar zaroorat ho
    // const interval = setInterval(checkSession, 5 * 60 * 1000);
    // return () => clearInterval(interval);
  }, []);

  const handleAuthClear = () => {
    setUser(null);
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-id');
    // Clear better-auth specific cookies
    document.cookie = 'auth-token=; Max-Age=0; path=/;';
    document.cookie = 'better-auth.session_token=; Max-Age=0; path=/;';
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await authClient.signIn.email({
        email,
        password,
        callbackURL: '/dashboard', // Adjust if needed
      });

      if (result.error) {
        throw new Error(result.error.message || 'Sign in failed');
      }

      // Session auto-update ho jayegi better-auth se (useEffect refresh karega)
    } catch (error: any) {
      console.error("Sign-in Error:", error.message);
      throw error;
    }
  };

  const getToken = async (): Promise<string | null> => {
    if (typeof window === 'undefined') return null;

    const response = await authClient.getSession();
    // Token usually session mein hota hai
    return response?.data?.session?.token || null;
  };

  const signOut = async () => {
    try {
      await authClient.signOut(); // better-auth ka built-in signOut
    } catch (err) {
      console.error('Sign out failed:', err);
    }
    handleAuthClear();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}