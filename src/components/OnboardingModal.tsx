"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { updateBioGoal } from "@/app/actions/auth";

export const OnboardingModal = () => {
  const { user, requireOnboarding, setOnboardingComplete } = useAuth();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!requireOnboarding || !user) return null;

  const goals = [
    { id: "performance", title: "Performance", desc: "Maximize output and cognition" },
    { id: "longevity", title: "Longevity", desc: "Optimize healthspan and aging" },
    { id: "recovery", title: "Recovery", desc: "Prioritize healing and stress reduction" }
  ];

  const handleSave = async () => {
    if (!selectedGoal) return;
    setLoading(true);
    try {
      await updateBioGoal(selectedGoal);
      setOnboardingComplete();
    } catch (error) {
      console.error("Error setting bio-goal", error);
    }
    setLoading(false);
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-zinc-950 border border-white/10 rounded-3xl p-8"
      >
        <h2 className="text-2xl font-bold text-white mb-2">Biological Setup</h2>
        <p className="text-zinc-400 mb-6">Select your primary bio-goal to calibrate Halo.</p>
        
        <div className="space-y-3 mb-8">
          {goals.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGoal(g.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedGoal === g.id 
                  ? "border-[color:var(--color-halo-blue)] bg-[color:var(--color-halo-blue)]/10 shadow-[0_0_15px_rgba(0,212,255,0.2)] text-white" 
                  : "border-white/5 bg-white/5 text-zinc-300 hover:bg-white/10"
              }`}
            >
              <div className="font-semibold">{g.title}</div>
              <div className="text-sm opacity-70">{g.desc}</div>
            </button>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={!selectedGoal || loading}
          className="w-full py-4 rounded-xl font-bold text-black bg-[color:var(--color-halo-blue)] hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? "Calibrating..." : "Initialize Profile"}
        </button>
      </motion.div>
    </div>
  );
};
