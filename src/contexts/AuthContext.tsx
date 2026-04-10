"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, signIn as serverSignIn, signUp as serverSignUp, signOut as serverSignOut } from "@/app/actions/auth";

interface User {
  id: string;
  username: string;
  displayName: string;
  bioGoals: string | null;
  settings: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  requireOnboarding: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setOnboardingComplete: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  requireOnboarding: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  setOnboardingComplete: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [requireOnboarding, setRequireOnboarding] = useState(false);

  const fetchUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      if (currentUser && !currentUser.bioGoals) {
        setRequireOnboarding(true);
      } else {
        setRequireOnboarding(false);
      }
    } catch (error) {
      console.error("Error fetching user", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const signIn = async (username: string, password: string) => {
    setLoading(true);
    try {
      await serverSignIn(username, password);
      await fetchUser();
    } catch (error) {
      console.error("Error signing in", error);
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (username: string, password: string) => {
    setLoading(true);
    try {
      await serverSignUp(username, password);
      await fetchUser();
    } catch (error) {
      console.error("Error signing up", error);
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    await serverSignOut();
    setUser(null);
    setRequireOnboarding(false);
  };

  const setOnboardingComplete = () => {
    setRequireOnboarding(false);
    fetchUser(); // Refetch to get updated bioGoals
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        requireOnboarding,
        signIn,
        signUp,
        signOut,
        setOnboardingComplete,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
