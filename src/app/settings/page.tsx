"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { updateSettings } from "@/app/actions/auth";
import { 
  User, Clock, Moon, Sun, Bell, Shield, Database, 
  Save, ArrowLeft, Zap, Target, AlertTriangle
} from "lucide-react";

interface UserSettings {
  displayName: string;
  sleepTime: string;
  wakeTime: string;
  targetSleepHours: number;
  focusWindowStart: string;
  focusWindowEnd: string;
  enableNotifications: boolean;
  darkModeAuto: boolean;
  circadianReminders: boolean;
  lightExposureGoal: number;
}

const defaultSettings: UserSettings = {
  displayName: "",
  sleepTime: "22:30",
  wakeTime: "06:30",
  targetSleepHours: 8,
  focusWindowStart: "10:00",
  focusWindowEnd: "14:00",
  enableNotifications: true,
  darkModeAuto: true,
  circadianReminders: true,
  lightExposureGoal: 30,
};

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  useEffect(() => {
    if (user?.displayName) {
      setSettings(prev => ({ ...prev, displayName: user.displayName }));
    }
  }, [user]);

  useEffect(() => {
    if (user?.settings) {
      try {
        const parsed = JSON.parse(user.settings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to parse settings:", e);
      }
    }
  }, [user?.settings]);

  const handleChange = (key: keyof UserSettings, value: string | number | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const settingsJson = JSON.stringify(settings);
      await updateSettings(settingsJson);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
    setSaving(false);
  };

  const handleExport = () => {
    const data = {
      user: user,
      settings: settings,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `halo-bio-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = async () => {
    if (confirm("Are you sure you want to clear all your local data? This cannot be undone.")) {
      try {
        const cookieStore = await import("@/app/actions/auth").then(m => m.signOut());
        window.location.href = "/";
      } catch (error) {
        console.error("Error clearing data:", error);
      }
    }
  };

  const profileFields = [
    { key: "displayName", label: "Display Name", type: "text", placeholder: "Your name" },
  ];

  const sleepFields = [
    { key: "sleepTime", label: "Bedtime", type: "time" },
    { key: "wakeTime", label: "Wake Time", type: "time" },
    { key: "targetSleepHours", label: "Target Sleep Hours", type: "number", min: 5, max: 12 },
  ];

  const focusFields = [
    { key: "focusWindowStart", label: "Window Start", type: "time" },
    { key: "focusWindowEnd", label: "Window End", type: "time" },
  ];

  const goalsFields = [
    { key: "lightExposureGoal", label: "Daily Light Exposure (min)", type: "number", min: 5, max: 120 },
  ];

  const toggles = [
    { key: "circadianReminders", label: "Circadian Reminders", desc: "Get notified to optimize your light exposure", icon: Sun },
    { key: "enableNotifications", label: "Push Notifications", desc: "Receive updates and insights", icon: Bell },
    { key: "darkModeAuto", label: "Auto Dark Mode", desc: "Sync display with circadian rhythm", icon: Moon },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-4 mb-8"
      >
        <button 
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <ArrowLeft size={20} className="text-zinc-400" />
        </button>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
      </motion.div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]"
        >
          <div className="flex items-center space-x-2 mb-5">
            <User size={18} className="text-[color:var(--color-halo-blue)]" />
            <h2 className="text-lg font-semibold text-white">Profile</h2>
          </div>
          <div className="space-y-4">
            {profileFields.map((field) => (
              <div key={field.key} className="grid grid-cols-2 gap-4">
                <label className="text-sm text-zinc-400 self-center">{field.label}</label>
                <input
                  type={field.type}
                  value={(settings as any)[field.key]}
                  onChange={(e) => handleChange(field.key as keyof UserSettings, e.target.value)}
                  className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[color:var(--color-halo-blue)] transition-colors"
                />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]"
        >
          <div className="flex items-center space-x-2 mb-5">
            <Moon size={18} className="text-[color:var(--color-halo-blue)]" />
            <h2 className="text-lg font-semibold text-white">Sleep Schedule</h2>
          </div>
          <div className="space-y-4">
            {sleepFields.map((field) => (
              <div key={field.key} className="grid grid-cols-2 gap-4">
                <label className="text-sm text-zinc-400 self-center">{field.label}</label>
                <input
                  type={field.type}
                  value={(settings as any)[field.key]}
                  onChange={(e) => handleChange(field.key as keyof UserSettings, field.type === "number" ? parseInt(e.target.value) : e.target.value)}
                  className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[color:var(--color-halo-blue)] transition-colors"
                />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]"
        >
          <div className="flex items-center space-x-2 mb-5">
            <Target size={18} className="text-[color:var(--color-halo-blue)]" />
            <h2 className="text-lg font-semibold text-white">Focus Windows</h2>
          </div>
          <div className="space-y-4">
            {focusFields.map((field) => (
              <div key={field.key} className="grid grid-cols-2 gap-4">
                <label className="text-sm text-zinc-400 self-center">{field.label}</label>
                <input
                  type={field.type}
                  value={(settings as any)[field.key]}
                  onChange={(e) => handleChange(field.key as keyof UserSettings, e.target.value)}
                  className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[color:var(--color-halo-blue)] transition-colors"
                />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]"
        >
          <div className="flex items-center space-x-2 mb-5">
            <Zap size={18} className="text-[color:var(--color-halo-blue)]" />
            <h2 className="text-lg font-semibold text-white">Goals</h2>
          </div>
          <div className="space-y-4">
            {goalsFields.map((field) => (
              <div key={field.key} className="grid grid-cols-2 gap-4">
                <label className="text-sm text-zinc-400 self-center">{field.label}</label>
                <input
                  type={field.type}
                  value={(settings as any)[field.key]}
                  onChange={(e) => handleChange(field.key as keyof UserSettings, parseInt(e.target.value))}
                  className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[color:var(--color-halo-blue)] transition-colors"
                />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]"
        >
          <div className="flex items-center space-x-2 mb-5">
            <Bell size={18} className="text-[color:var(--color-halo-blue)]" />
            <h2 className="text-lg font-semibold text-white">Notifications</h2>
          </div>
          <div className="space-y-3">
            {toggles.map((toggle) => {
              const Icon = toggle.icon;
              return (
                <div key={toggle.key} className="flex items-center justify-between p-3 rounded-lg bg-black/20">
                  <div className="flex items-center space-x-3">
                    <Icon size={18} className="text-zinc-500" />
                    <div>
                      <p className="text-sm text-white">{toggle.label}</p>
                      <p className="text-xs text-zinc-500">{toggle.desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleChange(toggle.key as keyof UserSettings, !(settings as any)[toggle.key])}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      (settings as any)[toggle.key] 
                        ? "bg-[color:var(--color-halo-blue)]" 
                        : "bg-white/10"
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      (settings as any)[toggle.key] ? "translate-x-6" : "translate-x-0.5"
                    }`} />
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/5"
        >
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle size={18} className="text-yellow-400" />
            <h2 className="text-lg font-semibold text-yellow-400">Data Management</h2>
          </div>
          <p className="text-sm text-zinc-400 mb-4">
            Your data is stored locally. Export your data or clear all local storage.
          </p>
          <div className="flex space-x-3">
            <button 
              onClick={handleExport}
              className="px-4 py-2 rounded-lg bg-white/5 text-white text-sm hover:bg-white/10 transition-colors"
            >
              Export Data
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-end"
        >
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl font-medium text-black bg-[color:var(--color-halo-blue)] hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : saved ? (
              <>
                <Save size={18} />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
}