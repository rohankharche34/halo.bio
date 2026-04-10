"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Camera, MapPin, ChefHat, ArrowLeft, Utensils, Leaf } from "lucide-react";
import { PantryVision } from "@/components/PantryVision";
import { NearbyHealthy } from "@/components/NearbyHealthy";
import { MealRecommendations } from "@/components/MealRecommendations";

export default function FoodPage() {
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <MealRecommendations />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PantryVision />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <NearbyHealthy />
        </motion.div>
      </div>
    </div>
  );
}