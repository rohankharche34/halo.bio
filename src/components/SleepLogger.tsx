"use client";

import React, { useState } from "react";
import { Moon, Sun, Save, Bed, Zap, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { logSleep } from "@/app/actions/auth";

interface SleepLoggerProps {
  onLogged?: () => void;
}

export const SleepLogger = ({ onLogged }: SleepLoggerProps) => {
  const [sleepTime, setSleepTime] = useState("22:30");
  const [wakeTime, setWakeTime] = useState("06:30");
  const [quality, setQuality] = useState(7);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const calculateSleepHours = () => {
    const [sleepH, sleepM] = sleepTime.split(":").map(Number);
    const [wakeH, wakeM] = wakeTime.split(":").map(Number);
    let hours = wakeH + (wakeM / 60) - (sleepH + (sleepM / 60));
    if (hours < 0) hours += 24;
    return hours.toFixed(1);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await logSleep(sleepTime, wakeTime, quality, notes);
      setSaved(true);
      onLogged?.();
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Error logging sleep:", error);
    }
    setSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]"
    >
      <div className="flex items-center space-x-2 mb-5">
        <Moon size={18} className="text-[color:var(--color-halo-blue)]" />
        <h2 className="text-lg font-semibold text-white">Log Sleep</h2>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-zinc-500 block mb-2">Bedtime</label>
            <div className="flex items-center space-x-2">
              <Bed size={16} className="text-indigo-400" />
              <input
                type="time"
                value={sleepTime}
                onChange={(e) => setSleepTime(e.target.value)}
                className="flex-1 px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[color:var(--color-halo-blue)] transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-zinc-500 block mb-2">Wake Time</label>
            <div className="flex items-center space-x-2">
              <Sun size={16} className="text-yellow-400" />
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="flex-1 px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[color:var(--color-halo-blue)] transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-black/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zinc-500">Sleep Duration</span>
            <div className="flex items-center space-x-1">
              <Zap size={14} className="text-[color:var(--color-halo-blue)]" />
              <span className="text-white font-medium">{calculateSleepHours()}h</span>
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm text-zinc-500 block mb-2">Sleep Quality (1-10)</label>
          <div className="flex items-center space-x-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((q) => (
              <button
                key={q}
                onClick={() => setQuality(q)}
                className={`w-8 h-8 rounded-lg text-sm transition-colors ${
                  quality === q
                    ? "bg-[color:var(--color-halo-blue)] text-black"
                    : "bg-black/40 text-zinc-500 hover:text-white"
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm text-zinc-500 block mb-2">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Dreams, interruptions, etc..."
            className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-[color:var(--color-halo-blue)] transition-colors resize-none"
            rows={2}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium text-black bg-[color:var(--color-halo-blue)] hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : saved ? (
            <>
              <CheckCircle size={18} />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Save size={18} />
              <span>Log Sleep</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};