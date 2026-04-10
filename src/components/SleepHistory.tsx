"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun, TrendingUp, Target, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { getSleepLogs } from "@/app/actions/auth";

interface SleepLog {
  id: number;
  sleepTime: string;
  wakeTime: string;
  quality: number;
  notes: string | null;
  date: string;
}

interface SleepHistoryProps {
  days?: number;
}

export const SleepHistory = ({ days = 7 }: SleepHistoryProps) => {
  const [logs, setLogs] = useState<SleepLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getSleepLogs(days);
        setLogs(data);
      } catch (error) {
        console.error("Error fetching sleep logs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [days]);

  const calculateDuration = (sleepTime: string, wakeTime: string) => {
    const [sleepH, sleepM] = sleepTime.split(":").map(Number);
    const [wakeH, wakeM] = wakeTime.split(":").map(Number);
    let hours = wakeH + (wakeM / 60) - (sleepH + (sleepM / 60));
    if (hours < 0) hours += 24;
    return hours.toFixed(1);
  };

  const averageQuality = logs.length 
    ? (logs.reduce((sum, l) => sum + l.quality, 0) / logs.length).toFixed(1)
    : "0";
  
  const averageDuration = logs.length
    ? (logs.reduce((sum, l) => sum + parseFloat(calculateDuration(l.sleepTime, l.wakeTime)), 0) / logs.length).toFixed(1)
    : "0";

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (dateStr === today.toISOString().split("T")[0]) return "Today";
    if (dateStr === yesterday.toISOString().split("T")[0]) return "Yesterday";
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-white/10 rounded w-1/4" />
          <div className="h-20 bg-white/5 rounded" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]"
    >
      <div className="flex items-center space-x-2 mb-5">
        <Calendar size={18} className="text-[color:var(--color-halo-blue)]" />
        <h2 className="text-lg font-semibold text-white">Sleep History</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="p-3 rounded-lg bg-black/20">
          <div className="flex items-center space-x-2 mb-1">
            <Moon size={14} className="text-indigo-400" />
            <span className="text-xs text-zinc-500">Avg Duration</span>
          </div>
          <span className="text-xl font-bold text-white">{averageDuration}h</span>
        </div>
        <div className="p-3 rounded-lg bg-black/20">
          <div className="flex items-center space-x-2 mb-1">
            <Target size={14} className="text-green-400" />
            <span className="text-xs text-zinc-500">Avg Quality</span>
          </div>
          <span className="text-xl font-bold text-white">{averageQuality}</span>
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-8 text-zinc-500">
          <Moon size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">No sleep logs yet</p>
          <p className="text-xs mt-1">Log your sleep above to track your rest</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-3 rounded-lg bg-black/20"
            >
              <div>
                <p className="text-sm text-white">{formatDate(log.date)}</p>
                <p className="text-xs text-zinc-500">
                  {log.sleepTime} → {log.wakeTime}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white font-medium">
                  {calculateDuration(log.sleepTime, log.wakeTime)}h
                </p>
                <p className="text-xs text-zinc-500">Quality: {log.quality}/10</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};