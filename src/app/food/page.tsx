"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Camera, MapPin, ChefHat, ArrowLeft, UtensilsCrossed, Search, Loader2, AlertCircle } from "lucide-react";
import { NearbyHealthy } from "@/components/NearbyHealthy";
import { MealRecommendations } from "@/components/MealRecommendations";
import { NutritionLookup } from "@/components/NutritionLookup";

export default function FoodPage() {
  const [activeTab, setActiveTab] = useState<"recommend" | "nutrition" | "nearby">("recommend");

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-4 mb-8"
      >
        <Link 
          href="/dashboard"
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <ArrowLeft size={20} className="text-zinc-400" />
        </Link>
        <h1 className="text-3xl font-bold text-white">Food & Nutrition</h1>
      </motion.div>

      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setActiveTab("recommend")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            activeTab === "recommend" 
              ? "bg-[color:var(--color-halo-blue)] text-black" 
              : "bg-white/5 text-zinc-400 hover:text-white"
          }`}
        >
          <ChefHat size={16} className="inline mr-2" />
          Recommend
        </button>
        <button
          onClick={() => setActiveTab("nutrition")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            activeTab === "nutrition" 
              ? "bg-[color:var(--color-halo-blue)] text-black" 
              : "bg-white/5 text-zinc-400 hover:text-white"
          }`}
        >
          <Search size={16} className="inline mr-2" />
          Nutrition Lookup
        </button>
        <button
          onClick={() => setActiveTab("nearby")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            activeTab === "nearby" 
              ? "bg-[color:var(--color-halo-blue)] text-black" 
              : "bg-white/5 text-zinc-400 hover:text-white"
          }`}
        >
          <MapPin size={16} className="inline mr-2" />
          Nearby
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeTab === "recommend" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <MealRecommendations />
          </motion.div>
        )}

        {activeTab === "nutrition" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <NutritionLookup />
          </motion.div>
        )}

        {activeTab === "nearby" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <NearbyHealthy />
          </motion.div>
        )}
      </div>
    </div>
  );
}