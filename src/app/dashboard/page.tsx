"use client";

import React, { useState, useEffect } from "react";
import { CircadianGuide } from "@/components/CircadianGuide";
import { SleepLogger } from "@/components/SleepLogger";
import { LightExposureLogger } from "@/components/LightExposureLogger";
import { SleepHistory } from "@/components/SleepHistory";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Brain, Zap, Heart, Moon, Sun, TrendingUp, Activity, Clock, Target, Battery, Eye, Plus, ChevronDown, ChevronUp } from "lucide-react";

interface MetricCard {
  name: string;
  value: string;
  unit: string;
  icon: React.ElementType;
  trend: number;
  color: string;
}

const mockMetrics: MetricCard[] = [
  { name: "Energy Potential", value: "87", unit: "%", icon: Zap, trend: 5, color: "text-yellow-400" },
  { name: "Recovery Index", value: "92", unit: "%", icon: Heart, trend: 3, color: "text-green-400" },
  { name: "Cognitive Load", value: "64", unit: "%", icon: Brain, trend: -2, color: "text-blue-400" },
  { name: "Sleep Score", value: "8.2", unit: "h", icon: Moon, trend: 8, color: "text-indigo-400" },
  { name: "Focus Window", value: "4.5", unit: "h", icon: Target, trend: 12, color: "text-cyan-400" },
  { name: "Activity Level", value: "7200", unit: "steps", icon: Activity, trend: 15, color: "text-orange-400" },
];

const insights = [
  { type: "optimal", title: "Peak Performance Window", desc: "Your optimal focus window is 10AM-2PM. Schedule deep work then." },
  { type: "warning", title: "Light Exposure Low", desc: "You've had minimal bright light exposure today. Get 10+ minutes of sunlight." },
  { type: "success", title: "Sleep Consistency", desc: "Great job! Your sleep times have been consistent this week." },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.displayName ? user.displayName.split(" ")[0] : "Commander";
  const greetingHour = new Date().getHours();
  const greeting = greetingHour < 12 ? "Good morning" : greetingHour < 17 ? "Good afternoon" : "Good evening";
  
  const [showLoggers, setShowLoggers] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogged = () => {
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2 mb-2"
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-green-400/70 tracking-wider uppercase">System Online</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold text-white mb-2"
        >
          {greeting}, {firstName}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-zinc-400"
        >
          Your biological systems are operating at optimal capacity. Let's make today count.
        </motion.p>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <button
          onClick={() => setShowLoggers(!showLoggers)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
        >
          <Plus size={18} className="text-[color:var(--color-halo-blue)]" />
          <span className="font-medium">Log Today</span>
          {showLoggers ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </motion.div>

      {showLoggers && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
        >
          <SleepLogger onLogged={handleLogged} />
          <LightExposureLogger onLogged={handleLogged} />
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-white/80 mb-4 px-2 flex items-center space-x-2">
              <Clock size={18} />
              <span>Temporal State</span>
            </h2>
            <CircadianGuide key={refreshKey} />
          </section>

          <section className="p-6 rounded-3xl border border-white/5 bg-white/[0.02]">
            <h2 className="text-lg font-semibold text-white/80 mb-5 flex items-center space-x-2">
              <Brain size={18} />
              <span>Core Insights</span>
            </h2>
            <div className="space-y-3">
              {insights.map((insight, i) => (
                <motion.div
                  key={insight.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className={`p-4 rounded-xl border ${
                    insight.type === "optimal" ? "bg-cyan-950/20 border-cyan-500/20" :
                    insight.type === "warning" ? "bg-amber-950/20 border-amber-500/20" :
                    "bg-green-950/20 border-green-500/20"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`font-medium ${
                        insight.type === "optimal" ? "text-cyan-400" :
                        insight.type === "warning" ? "text-amber-400" :
                        "text-green-400"
                      }`}>{insight.title}</p>
                      <p className="text-sm text-white/60 mt-1">{insight.desc}</p>
                    </div>
                    {insight.type === "optimal" && <Zap size={16} className="text-cyan-400" />}
                    {insight.type === "warning" && <Eye size={16} className="text-amber-400" />}
                    {insight.type === "success" && <TrendingUp size={16} className="text-green-400" />}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white/80 mb-4 px-2 flex items-center space-x-2">
              <Moon size={18} />
              <span>Sleep Log</span>
            </h2>
            <SleepHistory key={refreshKey} days={7} />
          </section>
        </div>

        <div className="col-span-1 space-y-6">
          <div className="border border-white/5 bg-white/[0.02] rounded-3xl p-5">
            <h2 className="text-lg font-semibold text-white/80 mb-5 flex items-center space-x-2">
              <Activity size={18} />
              <span>Bio-metrics</span>
            </h2>
            <div className="space-y-4">
              {mockMetrics.slice(0, 4).map((metric, i) => {
                const Icon = metric.icon;
                return (
                  <motion.div 
                    key={metric.name}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="p-4 rounded-xl bg-black/40"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Icon size={14} className={metric.color} />
                        <span className="text-sm text-zinc-500">{metric.name}</span>
                      </div>
                      <span className={`text-xs ${metric.trend >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {metric.trend >= 0 ? "+" : ""}{metric.trend}%
                      </span>
                    </div>
                    <div className="flex items-end space-x-1">
                      <span className="text-2xl font-bold text-white">{metric.value}</span>
                      <span className="text-sm text-zinc-500 mb-1">{metric.unit}</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${parseInt(metric.value)}%` }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                        className={`h-full ${metric.color.replace("text-", "bg-")}`}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-5 rounded-3xl border border-white/5 bg-gradient-to-br from-[color:var(--color-halo-blue)]/10 to-transparent"
          >
            <div className="flex items-center space-x-2 mb-3">
              <Battery size={18} className="text-[color:var(--color-halo-blue)]" />
              <span className="font-medium text-white">Energy Forecast</span>
            </div>
            <div className="flex items-end justify-between text-xs">
              {[6, 8, 10, 12, 2, 4, 6, 8, 10].map((hour, i) => (
                <div key={hour} className="flex flex-col items-center">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.random() * 30 + 20}%` }}
                    transition={{ delay: 0.6 + i * 0.05, duration: 0.5 }}
                    className="w-3 bg-white/20 rounded-t"
                  />
                  <span className="text-zinc-600 mt-1">{hour}{hour >= 12 ? "p" : "a"}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}