"use client";

import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

export const HaloSphere = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const controls = useAnimation();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate offset from center
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

  return (
    <div className="relative flex items-center justify-center w-64 h-64 md:w-96 md:h-96">
      <motion.div
        animate={controls}
        className="absolute w-full h-full rounded-full blur-2xl opacity-60 mix-blend-screen"
        style={{
          background: "radial-gradient(circle, var(--color-halo-blue) 0%, transparent 70%)",
        }}
      />
      
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="relative w-3/4 h-3/4 rounded-full border border-white/10 backdrop-blur-md shadow-[0_0_50px_rgba(0,212,255,0.4)]"
        style={{
          background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1), transparent)",
        }}
      />
    </div>
  );
};
