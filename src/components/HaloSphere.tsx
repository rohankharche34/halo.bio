"use client";

import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { calculateStabilityScore } from "@/lib/contextAgent";

interface StabilityScore {
  sleepScore: number;
  circadianScore: number;
  activityScore: number;
  mealConsistency: number;
  overallStability: number;
}

export const HaloSphere = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scores, setScores] = useState<StabilityScore | null>(null);
  const controls = useAnimation();

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const stabilityScores = await calculateStabilityScore();
        setScores(stabilityScores);
      } catch (error) {
        console.error("Error fetching stability score:", error);
      }
    };
    fetchScores();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 40;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    controls.start({
      x: mousePosition.x,
      y: mousePosition.y,
      transition: { type: "spring", stiffness: 50, damping: 20 },
    });
  }, [mousePosition, controls]);

  const getAuraColors = (score: number): { primary: string; glow: string } => {
    if (score >= 80) {
      return {
        primary: "#39ff14",
        glow: "rgba(57, 255, 20, 0.6)",
      };
    }
    if (score >= 60) {
      return {
        primary: "#00d4ff",
        glow: "rgba(0, 212, 255, 0.6)",
      };
    }
    if (score >= 40) {
      return {
        primary: "#facc15",
        glow: "rgba(250, 204, 21, 0.6)",
      };
    }
    return {
      primary: "#f97316",
      glow: "rgba(249, 115, 22, 0.6)",
    };
  };

  const stability = scores?.overallStability ?? 0;
  const colors = getAuraColors(stability);

  return (
    <div className="relative flex items-center justify-center w-64 h-64 md:w-96 md:h-96">
      <motion.div
        animate={controls}
        className="absolute w-full h-full rounded-full blur-3xl opacity-70 mix-blend-screen"
        style={{
          background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)`,
        }}
      />
      
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="relative w-3/4 h-3/4 rounded-full border backdrop-blur-md"
        style={{
          borderColor: `${colors.primary}20`,
          background: `radial-gradient(circle at 30% 30%, ${colors.primary}15, transparent)`,
          boxShadow: `0 0 50px ${colors.glow}`,
        }}
      />
      
      {scores && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute -bottom-8 flex items-center space-x-1"
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: colors.primary }}
          />
          <span className="text-xs text-white/50">{stability}% stability</span>
        </motion.div>
      )}
    </div>
  );
};