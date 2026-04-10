"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HaloSphere } from "@/components/HaloSphere";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { user, signIn, loading } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      signIn(username);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background stars / ambient elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />
      
      <div className="z-10 text-center flex flex-col items-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40 mb-4 tracking-tighter"
        >
          Halo.bio
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-white/60 text-lg md:text-xl max-w-lg mb-12 tracking-wide"
        >
          Your ambient intelligence platform for personalized nutrition and physiological optimization.
        </motion.p>
        
        <HaloSphere />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <form onSubmit={handleLogin} className="flex flex-col items-center space-y-4">
            <input 
              type="text" 
              placeholder="Enter Commander Name..." 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-6 py-3 w-72 bg-black/50 border border-white/20 rounded-full text-center text-white focus:outline-none focus:border-[color:var(--color-halo-blue)] transition-colors"
              disabled={loading}
            />
            <button 
              type="submit"
              disabled={loading || !username.trim()}
              className="group relative flex items-center space-x-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all hover:border-[color:var(--color-halo-blue)] hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] disabled:opacity-50 cursor-pointer"
            >
              <LogIn size={20} className="text-[color:var(--color-halo-blue)]" />
              <span className="font-semibold tracking-wide text-white">
                {loading ? "Authenticating..." : "Initialize Session"}
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[color:var(--color-halo-blue)] to-[color:var(--color-halo-green)] opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
