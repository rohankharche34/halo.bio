"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, signIn as serverSignIn, signOut as serverSignOut } from "@/app/actions/auth";

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
  signIn: (username: string) => Promise<void>;
  signOut: () => Promise<void>;
  setOnboardingComplete: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  requireOnboarding: false,
  signIn: async () => {},
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

  const signIn = async (username: string) => {
    setLoading(true);
    try {
      await serverSignIn(username);
      await fetchUser();
    } catch (error) {
      console.error("Error signing in", error);
      setLoading(false);
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
        signOut,
        setOnboardingComplete,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
