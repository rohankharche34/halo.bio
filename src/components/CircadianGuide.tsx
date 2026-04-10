"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon, Sunrise, Sunset } from "lucide-react";
import { motion } from "framer-motion";

export const CircadianGuide = () => {
  const [timeState, setTimeState] = useState("day");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) setTimeState("morning");
    else if (hour >= 10 && hour < 17) setTimeState("day");
    else if (hour >= 17 && hour < 21) setTimeState("evening");
    else setTimeState("night");
  }, []);

  const config = {
    morning: { icon: Sunrise, color: "text-cyan-400", bg: "bg-cyan-950/30", text: "Morning Peak: Optimize Focus", accent: "#00d4ff" },
    day: { icon: Sun, color: "text-yellow-400", bg: "bg-yellow-950/30", text: "Active Phase: Maintain Energy", accent: "#facc15" },
    evening: { icon: Sunset, color: "text-orange-400", bg: "bg-orange-950/30", text: "Evening Wind-down: Prepare for Recovery", accent: "#fb923c" },
    night: { icon: Moon, color: "text-indigo-400", bg: "bg-indigo-950/30", text: "Rest Phase: Deep Sleep & Repair", accent: "#818cf8" }
  };

  const current = config[timeState as keyof typeof config];
  const Icon = current.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-2xl border border-white/5 backdrop-blur-sm flex items-center space-x-4 ${current.bg}`}
    >
      <div className={`p-3 rounded-xl bg-black/40 ${current.color}`}>
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-sm font-medium text-white/60 uppercase tracking-widest">Circadian Status</h3>
        <p className={`text-lg font-semibold ${current.color}`}>{current.text}</p>
      </div>
    </motion.div>
  );
};
