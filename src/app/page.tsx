"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HaloSphere } from "@/components/HaloSphere";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, Sun, Moon, Zap, Heart, Brain, Activity } from "lucide-react";
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

  const benefits = [
    { icon: Sun, title: "Light Optimization", desc: "Strategic light exposure timing" },
    { icon: Moon, title: "Sleep Recovery", desc: "Deep sleep tracking & scoring" },
    { icon: Zap, title: "Energy Peaks", desc: "Identify your productive windows" },
    { icon: Heart, title: "HRV Analysis", desc: "Heart rate variability insights" },
    { icon: Brain, title: "Cognitive Windows", desc: "Mental performance timing" },
    { icon: Activity, title: "Movement Sync", desc: "Exercise alignment" },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />
      
      <div className="z-10 text-center flex flex-col items-center max-w-4xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2"
        >
          <span className="px-3 py-1 text-xs font-medium tracking-[0.2em] uppercase bg-white/5 border border-white/10 rounded-full text-[color:var(--color-halo-blue)]">
            Circadian Intelligence
          </span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40 mb-4 tracking-tighter"
        >
          Halo.bio
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white/60 text-lg md:text-xl max-w-xl mb-8 tracking-wide leading-relaxed"
        >
          Optimize your biology. Track circadian rhythms, align behaviors with your natural clock, and unlock peak performance through personalized chronobiology.
        </motion.p>
        
        <HaloSphere />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-10 mb-12"
        >
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              className="flex items-center space-x-2 text-left px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5"
            >
              <b.icon size={14} className="text-[color:var(--color-halo-blue)]" />
              <span className="text-xs text-white/70">{b.title}</span>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4"
        >
          <form onSubmit={handleLogin} className="flex flex-col items-center space-y-4">
            <input 
              type="text" 
              placeholder="Enter your name..." 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-6 py-3 w-72 bg-black/50 border border-white/20 rounded-full text-center text-white placeholder:text-zinc-600 focus:outline-none focus:border-[color:var(--color-halo-blue)] transition-colors"
              disabled={loading}
            />
            <button 
              type="submit"
              disabled={loading || !username.trim()}
              className="group relative flex items-center space-x-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all hover:border-[color:var(--color-halo-blue)] hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] disabled:opacity-50 cursor-pointer"
            >
              <LogIn size={20} className="text-[color:var(--color-halo-blue)]" />
              <span className="font-semibold tracking-wide text-white">
                {loading ? "Authenticating..." : "Begin Journey"}
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[color:var(--color-halo-blue)] to-[color:var(--color-halo-green)] opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
          </form>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-zinc-600 text-xs mt-6"
        >
          Local-first. Your data stays on your device.
        </motion.p>
      </div>
    </main>
  );
}
