"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon, Sunrise, Sunset, Clock, TrendingUp, Zap, Bed } from "lucide-react";
import { motion } from "framer-motion";

interface CircadianData {
  phase: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  text: string;
  desc: string;
  accent: string;
  sleepNeed: number;
  activity: string;
}

export const CircadianGuide = ({ circadianScore = 0 }: { circadianScore?: number }) => {
  const [timeState, setTimeState] = useState<CircadianData | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");

  const phases: Record<string, CircadianData> = {
    morning: { 
      phase: "Morning", 
      icon: Sunrise, 
      color: "text-cyan-400", 
      bg: "bg-cyan-950/30", 
      text: "Morning Peak", 
      desc: "Cortisol awakening response - ideal for deep work",
      accent: "#00d4ff",
      sleepNeed: 0,
      activity: "High-focus tasks"
    },
    day: { 
      phase: "Day", 
      icon: Sun, 
      color: "text-yellow-400", 
      bg: "bg-yellow-950/30", 
      text: "Active Phase", 
      desc: "Peak body temperature - maintain energy output",
      accent: "#facc15",
      sleepNeed: 20,
      activity: "Productive work"
    },
    evening: { 
      phase: "Evening", 
      icon: Sunset, 
      color: "text-orange-400", 
      bg: "bg-orange-950/30", 
      text: "Wind Down", 
      desc: "Melatonin rising - prepare for recovery",
      accent: "#fb923c",
      sleepNeed: 40,
      activity: "Light movement"
    },
    night: { 
      phase: "Night", 
      icon: Moon, 
      color: "text-indigo-400", 
      bg: "bg-indigo-950/30", 
      text: "Rest Phase", 
      desc: "Deep sleep & tissue repair",
      accent: "#818cf8",
      sleepNeed: 100,
      activity: "Sleep"
    },
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
      
      const hour = now.getHours();
      let phase: string;
      
      if (hour >= 5 && hour < 10) phase = "morning";
      else if (hour >= 10 && hour < 17) phase = "day";
      else if (hour >= 17 && hour < 21) phase = "evening";
      else phase = "night";
      
      setTimeState(phases[phase]);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!timeState) return null;

  const Icon = timeState.icon;
  const safeCircadianScore = Number.isFinite(circadianScore) ? Math.max(0, Math.min(100, Math.round(circadianScore))) : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-5 rounded-2xl border border-white/5 backdrop-blur-sm flex items-center space-x-4 ${timeState.bg}`}
        >
          <div className={`p-3 rounded-xl bg-black/40 ${timeState.color}`}>
            <Icon size={28} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-white/60 uppercase tracking-widest">Current Phase</h3>
              <span className="text-xs font-mono text-white/40">{currentTime}</span>
            </div>
            <p className={`text-xl font-semibold ${timeState.color} mt-1`}>{timeState.text}</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-white/60 uppercase tracking-widest">Circadian Score</h3>
            <TrendingUp size={16} className="text-green-400" />
          </div>
          <div className="flex items-end space-x-3">
            <span className="text-4xl font-bold text-white">{safeCircadianScore}</span>
            <span className="text-sm text-white/40 mb-2">/ 100</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full mt-3 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${safeCircadianScore}%` }}
              transition={{ delay: 0.3, duration: 1 }}
              className="h-full bg-gradient-to-r from-[color:var(--color-halo-blue)] to-[color:var(--color-halo-green)]"
            />
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Zap size={18} className="text-[color:var(--color-halo-blue)]" />
            <div>
              <p className="text-sm text-white/60">Recommended Activity</p>
              <p className="text-white font-medium">{timeState.activity}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Bed size={18} className="text-[color:var(--color-halo-green)]" />
            <div className="text-right">
              <p className="text-sm text-white/60">Sleep Need</p>
              <p className="text-white font-medium">{timeState.sleepNeed}%</p>
            </div>
          </div>
        </div>
        <p className="text-sm text-white/50 mt-4 pt-4 border-t border-white/5">{timeState.desc}</p>
      </motion.div>
    </div>
  );
};