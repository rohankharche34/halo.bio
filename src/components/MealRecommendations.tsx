"use client";

import React, { useState, useEffect } from "react";
import { ChefHat, Clock, Flame, Zap, CheckCircle, X, Apple, Leaf, Fish, Beef } from "lucide-react";
import { motion } from "framer-motion";
import { logMeal, updateDietPreference, getCurrentUser } from "@/app/actions/auth";
import { getMealRecommendations, getPersonalizedAdvice, calculateStabilityScore } from "@/lib/contextAgent";

interface Meal {
  name: string;
  type: string;
  calories: number;
  prepTime: number;
  glycemicIndex: number;
  ingredients: string[];
  reason: string;
}

interface ContextScore {
  sleepScore: number;
  circadianScore: number;
  activityScore: number;
  mealConsistency: number;
  overallStability: number;
}

interface User {
  id: string;
  settings: string | null;
}

const dietIcons: Record<string, React.ElementType> = {
  none: Apple,
  keto: Beef,
  vegan: Leaf,
  paleo: Fish,
  balanced: Apple,
  mediterranean: Leaf,
};

const NON_VEG_INGREDIENTS = [
  "chicken", "beef", "pork", "salmon", "tuna", "shrimp", "egg", "turkey", "lamb", "bacon",
  "steak", "ground beef", "meat", "fish", "ham", "sausage", "duck", "veal", "prosciutto"
];

export const MealRecommendations = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [advice, setAdvice] = useState<string>("");
  const [scores, setScores] = useState<ContextScore>({ sleepScore: 0, circadianScore: 0, activityScore: 0, mealConsistency: 0, overallStability: 0 });
  const [loading, setLoading] = useState(true);
  const [logging, setLogging] = useState<string | null>(null);
  const [dietPref, setDietPref] = useState("none");
  const [user, setUser] = useState<User | null>(null);

  const loadDietPreference = async (): Promise<string> => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser?.settings) {
        const settings = JSON.parse(currentUser.settings);
        return settings.dietPreference || "none";
      }
    } catch {}
    return "none";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const diet = await loadDietPreference();
        setDietPref(diet);
        
        const [recs, adv, sc] = await Promise.all([
          getMealRecommendations(60, diet as any),
          getPersonalizedAdvice(),
          calculateStabilityScore(),
        ]);
        setMeals(recs);
        setAdvice(adv);
        setScores(sc);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogMeal = async (meal: Meal) => {
    setLogging(meal.name);
    try {
      await logMeal(meal.name, meal.calories, meal.glycemicIndex, meal.type);
      const [recs, sc] = await Promise.all([
        getMealRecommendations(60, dietPref as any),
        calculateStabilityScore()
      ]);
      setMeals(recs);
      setScores(sc);
    } catch (error) {
      console.error("Error logging meal:", error);
    }
    setLogging(null);
  };

  const handleDietChange = async (diet: string) => {
    setDietPref(diet);
    await updateDietPreference(diet);
    const recs = await getMealRecommendations(60, diet as any);
    setMeals(recs);
  };

  const isVegCompatible = (meal: Meal): boolean => {
    if (dietPref === "vegan") {
      const mealStr = `${meal.name} ${meal.ingredients.join(" ")}`.toLowerCase();
      return !NON_VEG_INGREDIENTS.some(ing => mealStr.includes(ing.toLowerCase()));
    }
    if (dietPref === "keto" || dietPref === "paleo") {
      return true;
    }
    return true;
  };

  const filteredMeals = meals.filter(meal => isVegCompatible(meal));

  const getMealIcon = (type: string) => {
    switch (type) {
      case "breakfast": return "🌅";
      case "lunch": return "☀️";
      case "dinner": return "🌙";
      case "snack": return "🍎";
      default: return "🍽️";
    }
  };

  if (loading) {
    return (
      <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-white/10 rounded w-1/3" />
          <div className="h-24 bg-white/5 rounded" />
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
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-2">
          <ChefHat size={18} className="text-[color:var(--color-halo-blue)]" />
          <h2 className="text-lg font-semibold text-white">Meal Recommendations</h2>
        </div>
        <div className="flex items-center space-x-1 px-2 py-1 bg-black/40 rounded-lg">
          <Zap size={12} className="text-yellow-400" />
          <span className="text-xs text-white/70">Stability: {scores.overallStability}%</span>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-black/20 mb-4">
        <div className="flex items-start space-x-2">
          <Zap size={14} className="text-[color:var(--color-halo-blue)] mt-0.5" />
          <p className="text-sm text-white/70">{advice}</p>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-xs text-zinc-500 block mb-2">Diet Preference</label>
        <div className="flex flex-wrap gap-2">
          {["none", "keto", "vegan", "paleo", "balanced"].map((diet) => {
            const Icon = dietIcons[diet];
            return (
              <button
                key={diet}
                onClick={() => handleDietChange(diet)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs capitalize transition-colors ${
                  dietPref === diet
                    ? "bg-[color:var(--color-halo-blue)] text-black"
                    : "bg-black/40 text-zinc-400 hover:text-white"
                }`}
              >
                <Icon size={12} />
                <span>{diet}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        {(filteredMeals.length > 0 ? filteredMeals : meals).map((meal, i) => {
          const vegOk = isVegCompatible(meal);
          return (
            <motion.div
              key={meal.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-4 rounded-xl bg-black/40 border ${!vegOk ? "border-red-500/30" : "border-white/5"}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getMealIcon(meal.type)}</span>
                    <p className="font-medium text-white">{meal.name}</p>
                    {!vegOk && <span className="text-xs text-red-400">⚠️</span>}
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">{meal.reason}</p>
                </div>
                <button
                  onClick={() => handleLogMeal(meal)}
                  disabled={logging === meal.name}
                  className={`p-2 rounded-lg transition-colors ${
                    logging === meal.name
                      ? "bg-green-500/20 text-green-400"
                      : "bg-[color:var(--color-halo-blue)]/20 text-[color:var(--color-halo-blue)] hover:bg-[color:var(--color-halo-blue)]/30"
                  }`}
                >
                  {logging === meal.name ? <CheckCircle size={16} /> : <X size={16} />}
                </button>
              </div>
              
              <div className="flex items-center space-x-4 text-xs text-zinc-500">
                <div className="flex items-center space-x-1">
                  <Flame size={12} />
                  <span>{meal.calories} cal</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock size={12} />
                  <span>{meal.prepTime} min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap size={12} />
                  <span>GI: {meal.glycemicIndex}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-3">
                {meal.ingredients.slice(0, 4).map((ing) => (
                  <span key={ing} className="px-2 py-0.5 rounded bg-white/5 text-xs text-zinc-400">
                    {ing}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};