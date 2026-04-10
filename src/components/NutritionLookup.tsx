"use client";

import React, { useState } from "react";
import { Search, Loader2, AlertCircle, Flame, Coffee, Beef, Droplets, Wheat, X } from "lucide-react";
import { motion } from "framer-motion";

interface NutritionInfo {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  serving: string;
}

export const NutritionLookup = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NutritionInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const searchFood = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/nutrition/lookup?q=" + encodeURIComponent(query));
      const data = await response.json();
      
      if (data.nutrition) {
        setResult(data.nutrition);
        if (!history.includes(query.toLowerCase())) {
          setHistory(prev => [query.toLowerCase(), ...prev.slice(0, 4)]);
        }
      } else if (data.error) {
        setError(data.error);
      } else {
        setError("No nutrition data found for this food");
      }
    } catch (err) {
      setError("Failed to fetch nutrition data");
    }
    
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      searchFood();
    }
  };

  const quickSearch = (term: string) => {
    setQuery(term);
    setTimeout(searchFood, 100);
  };

  return (
    <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
      <div className="flex items-center space-x-2 mb-5">
        <Search size={18} className="text-purple-400" />
        <h2 className="text-lg font-semibold text-white">Nutrition Lookup</h2>
      </div>

      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="Enter food name (e.g., banana, chicken breast)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-400"
        />
        <button
          onClick={searchFood}
          disabled={loading || !query.trim()}
          className="px-6 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 disabled:opacity-50"
        >
          Search
        </button>
      </div>

      {history.length > 0 && !result && (
        <div className="mb-4">
          <p className="text-xs text-zinc-500 mb-2">Recent searches:</p>
          <div className="flex flex-wrap gap-2">
            {history.map((term) => (
              <button
                key={term}
                onClick={() => quickSearch(term)}
                className="px-3 py-1 rounded-lg bg-black/40 text-sm text-zinc-400 hover:text-white"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="py-12 text-center">
          <Loader2 size={40} className="mx-auto animate-spin text-purple-400 mb-4" />
          <p className="text-zinc-400">Looking up nutrition info...</p>
        </div>
      )}

      {error && !loading && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
          <div className="flex items-center space-x-2 text-red-400">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        </div>
      )}

      {result && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">{result.name}</h3>
            <span className="text-sm text-zinc-500">{result.serving}</span>
          </div>

          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <div className="flex items-center space-x-2 mb-2">
              <Flame size={18} className="text-orange-400" />
              <span className="text-lg font-bold text-white">{result.calories}</span>
              <span className="text-zinc-500">calories</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-black/40">
              <div className="flex items-center space-x-2 mb-1">
                <Beef size={14} className="text-red-400" />
                <span className="text-xs text-zinc-500">Protein</span>
              </div>
              <span className="text-lg font-bold text-white">{result.protein}g</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40">
              <div className="flex items-center space-x-2 mb-1">
                <Wheat size={14} className="text-yellow-400" />
                <span className="text-xs text-zinc-500">Carbs</span>
              </div>
              <span className="text-lg font-bold text-white">{result.carbs}g</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40">
              <div className="flex items-center space-x-2 mb-1">
                <Droplets size={14} className="text-blue-400" />
                <span className="text-xs text-zinc-500">Fat</span>
              </div>
              <span className="text-lg font-bold text-white">{result.fat}g</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40">
              <div className="flex items-center space-x-2 mb-1">
                <Coffee size={14} className="text-green-400" />
                <span className="text-xs text-zinc-500">Fiber</span>
              </div>
              <span className="text-lg font-bold text-white">{result.fiber}g</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-black/40 flex justify-between text-sm">
            <span className="text-zinc-500">Sugar</span>
            <span className="text-white">{result.sugar}g</span>
          </div>
        </motion.div>
      )}

      {!result && !loading && !error && (
        <div className="py-8 text-center text-zinc-500">
          <Search size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">Search for any food to see its nutritional breakdown</p>
          <p className="text-xs mt-2">Powered by Gemini AI</p>
        </div>
      )}
    </div>
  );
};