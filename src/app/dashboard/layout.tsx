"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { OnboardingModal } from "@/components/OnboardingModal";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="w-16 h-16 border-4 border-[color:var(--color-halo-blue)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#050505] overflow-hidden relative">
      {/* Dynamic ambient gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#050505] via-[#050505] to-[color:var(--color-halo-blue)]/5 opacity-50 pointer-events-none" />
      
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative z-10 p-8">
        {children}
      </main>
      
      <OnboardingModal />
    </div>
  );
}
