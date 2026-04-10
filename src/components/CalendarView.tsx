"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, Moon, Zap, MoonIcon, Clock, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { getSleepLogs, getCircadianHistory, getMealLogs } from "@/app/actions/auth";

interface SleepLog {
  id: number;
  sleepTime: string;
  wakeTime: string;
  quality: number;
  notes: string | null;
  date: string;
}

interface CircadianLog {
  id: number;
  score: number;
  lightExposure: number;
  activityLevel: number;
  date: string;
}

interface MealLog {
  id: number;
  mealName: string;
  calories: number;
  mealType: string;
  date: string;
  time: string;
}

export const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>([]);
  const [circadianLogs, setCircadianLogs] = useState<CircadianLog[]>([]);
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    fetchLogs();
  }, [currentDate]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const [sleep, circadian, meals] = await Promise.all([
        getSleepLogs(60),
        getCircadianHistory(60),
        getMealLogs(60),
      ]);
      setSleepLogs(sleep);
      setCircadianLogs(circadian);
      setMealLogs(meals);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
    setLoading(false);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];
    
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const getLogsForDate = (dateStr: string) => {
    const sleep = sleepLogs.find(l => l.date === dateStr);
    const circadian = circadianLogs.find(l => l.date === dateStr);
    const meals = mealLogs.filter(l => l.date === dateStr);
    return { sleep, circadian, meals };
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const days = getDaysInMonth(currentDate);

  const navigateMonth = (delta: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
  };

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getScoreColor = (score: number | undefined) => {
    if (!score) return "bg-zinc-800";
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-blue-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const selectedLogs = selectedDate ? getLogsForDate(selectedDate) : null;

  return (
    <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-2">
          <Calendar size={18} className="text-[color:var(--color-halo-blue)]" />
          <h2 className="text-lg font-semibold text-white">Calendar</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-1.5 rounded-lg hover:bg-white/10"
          >
            <ChevronLeft size={16} className="text-zinc-400" />
          </button>
          <span className="text-sm text-white min-w-[120px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button
            onClick={() => navigateMonth(1)}
            className="p-1.5 rounded-lg hover:bg-white/10"
          >
            <ChevronRight size={16} className="text-zinc-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs text-zinc-500 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          if (!day) {
            return <div key={i} className="h-10" />;
          }
          
          const dateKey = formatDateKey(day);
          const logs = getLogsForDate(dateKey);
          const hasData = logs.sleep || logs.circadian || logs.meals.length > 0;
          const isToday = formatDateKey(new Date()) === dateKey;
          const isSelected = selectedDate === dateKey;

          return (
            <button
              key={i}
              onClick={() => setSelectedDate(hasData ? dateKey : null)}
              disabled={!hasData}
              className={`h-10 rounded-lg text-xs flex flex-col items-center justify-center transition-colors ${
                isSelected 
                  ? "bg-[color:var(--color-halo-blue)] text-black" 
                  : isToday 
                    ? "border border-[color:var(--color-halo-blue)]"
                    : hasData 
                      ? "bg-zinc-800 hover:bg-zinc-700 text-white"
                      : "bg-zinc-900 text-zinc-600 cursor-not-allowed"
              }`}
            >
              <span>{day.getDate()}</span>
              {hasData && !isSelected && (
                <span className={`w-1.5 h-1.5 rounded-full ${getScoreColor(logs.circadian?.score)}`} />
              )}
            </button>
          );
        })}
      </div>

      {selectedLogs && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 rounded-xl bg-black/40 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-white">
              {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric"
              })}
            </h3>
            <button
              onClick={() => setSelectedDate(null)}
              className="text-zinc-500 hover:text-white"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            {selectedLogs.sleep && (
              <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <div className="flex items-center space-x-2 mb-2">
                  <MoonIcon size={14} className="text-indigo-400" />
                  <span className="text-sm font-medium text-indigo-400">Sleep</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-zinc-500">Bedtime:</span>
                    <span className="text-white ml-2">{selectedLogs.sleep.sleepTime}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Wake:</span>
                    <span className="text-white ml-2">{selectedLogs.sleep.wakeTime}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Quality:</span>
                    <span className="text-white ml-2">{selectedLogs.sleep.quality}/10</span>
                  </div>
                </div>
              </div>
            )}

            {selectedLogs.circadian && (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap size={14} className="text-green-400" />
                  <span className="text-sm font-medium text-green-400">Circadian</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-zinc-500">Score:</span>
                    <span className="text-white ml-2">{selectedLogs.circadian.score}%</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Light:</span>
                    <span className="text-white ml-2">{selectedLogs.circadian.lightExposure} min</span>
                  </div>
                </div>
              </div>
            )}

            {selectedLogs.meals.length > 0 && (
              <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity size={14} className="text-orange-400" />
                  <span className="text-sm font-medium text-orange-400">Meals ({selectedLogs.meals.length})</span>
                </div>
                <div className="space-y-1">
                  {selectedLogs.meals.map((meal, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-white">{meal.mealName}</span>
                      <span className="text-zinc-500">{meal.calories} cal</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!selectedLogs.sleep && !selectedLogs.circadian && selectedLogs.meals.length === 0 && (
              <p className="text-zinc-500 text-sm">No data logged for this date</p>
            )}
          </div>
        </motion.div>
      )}

      <div className="mt-4 flex items-center space-x-4 text-xs text-zinc-500">
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span>80%+</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span>60%+</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-yellow-500" />
          <span>40%+</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span>&lt;40%</span>
        </div>
      </div>
    </div>
  );
};