"use client";

import React from "react";
import Link from "next/link";
import { Activity, Database, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const Sidebar = () => {
  const { signOut } = useAuth();
  
  const nav = [
    { name: "Bio-Status", href: "/dashboard", icon: Activity },
    { name: "Nutrient Vault", href: "#", icon: Database },
    { name: "Settings", href: "#", icon: Settings },
  ];

  return (
    <div className="w-64 h-full border-r border-white/10 bg-zinc-950/50 backdrop-blur-xl flex flex-col p-6">
      <div className="flex items-center space-x-3 mb-10">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[color:var(--color-halo-blue)] to-[color:var(--color-halo-green)]" />
        <span className="text-xl font-bold text-white tracking-widest uppercase">Halo.bio</span>
      </div>

      <nav className="flex-1 space-y-2">
        {nav.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href} className="flex items-center space-x-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
              <Icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <button onClick={signOut} className="flex items-center space-x-3 px-4 py-3 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors mt-auto">
        <LogOut size={20} />
        <span className="font-medium">Disconnect</span>
      </button>
    </div>
  );
};
