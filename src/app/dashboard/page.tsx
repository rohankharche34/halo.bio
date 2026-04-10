"use client";

import React from "react";
import { CircadianGuide } from "@/components/CircadianGuide";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-12">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold text-white mb-2"
        >
          Welcome Sequence, {user?.displayName ? user.displayName.split(" ")[0] : "Commander"}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-zinc-400"
        >
          System vitals are nominal. Analyzing optimal vectors for today.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-1 lg:col-span-2 space-y-8">
          {/* Circadian Guide */}
          <section>
            <h2 className="text-xl font-semibold text-white/80 mb-4 px-2">Temporal State</h2>
            <CircadianGuide />
          </section>

          {/* Core Insights Placeholder */}
          <section className="p-8 rounded-3xl border border-white/5 bg-white/[0.02]">
            <h2 className="text-xl font-semibold text-white/80 mb-4">Core Insights</h2>
            <div className="h-48 border border-dashed border-white/10 rounded-2xl flex items-center justify-center text-zinc-500">
              [Telemetry Module Offline - Waiting for Input]
            </div>
          </section>
        </div>

        {/* Right Sidebar Placeholder for Bio-metrics */}
        <div className="col-span-1 border border-white/5 bg-white/[0.02] rounded-3xl p-6">
          <h2 className="text-lg font-semibold text-white/80 mb-6">Bio-metrics</h2>
          <div className="space-y-4">
            {["Energy Potential", "Recovery Index", "Cognitive Load"].map((metric, i) => (
              <div key={metric} className="p-4 rounded-xl bg-black/40">
                <div className="text-sm text-zinc-500 mb-2">{metric}</div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.random() * 40 + 40}%` }}
                    transition={{ delay: i * 0.2 + 0.5, duration: 1 }}
                    className="h-full bg-[color:var(--color-halo-blue)] shadow-[0_0_10px_rgba(0,212,255,0.8)]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
