"use client";

import React, { useState } from "react";
import { Sun, Save, CheckCircle, CloudSun } from "lucide-react";
import { motion } from "framer-motion";
import { updateCircadianScore } from "@/app/actions/auth";

interface LightExposureLoggerProps {
  onLogged?: () => void;
}

export const LightExposureLogger = ({ onLogged }: LightExposureLoggerProps) => {
  const [exposureMinutes, setExposureMinutes] = useState(30);
  const [lightType, setLightType] = useState<"sun" | "artificial">("sun");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const activityLevel = Math.min(100, exposureMinutes * 3);
      const score = Math.min(100, (exposureMinutes / 30) * 100);
      await updateCircadianScore(score, exposureMinutes, activityLevel);
      setSaved(true);
      onLogged?.();
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Error logging light exposure:", error);
    }
    setSaving(false);
  };

  const presets = [5, 10, 15, 30, 45, 60];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]"
    >
      <div className="flex items-center space-x-2 mb-5">
        <Sun size={18} className="text-yellow-400" />
        <h2 className="text-lg font-semibold text-white">Log Light Exposure</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-zinc-500 block mb-2">Light Type</label>
          <div className="flex space-x-2">
            <button
              onClick={() => setLightType("sun")}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg transition-colors ${
                lightType === "sun"
                  ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400/50"
                  : "bg-black/40 text-zinc-500 border border-white/10"
              }`}
            >
              <Sun size={16} />
              <span className="text-sm">Sunlight</span>
            </button>
            <button
              onClick={() => setLightType("artificial")}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg transition-colors ${
                lightType === "artificial"
                  ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/50"
                  : "bg-black/40 text-zinc-500 border border-white/10"
              }`}
            >
              <CloudSun size={16} />
              <span className="text-sm">Artificial</span>
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm text-zinc-500 block mb-2">Duration (minutes)</label>
          <div className="grid grid-cols-6 gap-2">
            {presets.map((mins) => (
              <button
                key={mins}
                onClick={() => setExposureMinutes(mins)}
                className={`py-2 rounded-lg text-sm transition-colors ${
                  exposureMinutes === mins
                    ? "bg-yellow-400 text-black"
                    : "bg-black/40 text-zinc-500 hover:text-white"
                }`}
              >
                {mins}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-black/20">
          <span className="text-sm text-zinc-500">Selected</span>
          <span className="text-white font-medium">{exposureMinutes} min</span>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium text-black bg-yellow-400 hover:shadow-[0_0_20px_rgba(250,204,21,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
              <span>Log Exposure</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};