"use server";

import db from "@/lib/db";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

export async function signUp(username: string, password: string) {
  if (!username || !password) throw new Error("Username and password required");
  if (password.length < 6) throw new Error("Password must be at least 6 characters");

  const normalized = username.trim().toLowerCase();
  
  const existing = await db.prepare("SELECT id FROM users WHERE username = ?").get(normalized);
  if (existing) throw new Error("Username already taken");

  const id = randomUUID();
  const passwordHash = await bcrypt.hash(password, 10);
  await db.prepare("INSERT INTO users (id, username, passwordHash, displayName) VALUES (?, ?, ?, ?)").run(id, normalized, passwordHash, username.trim());

  const cookieStore = await cookies();
  cookieStore.set("halo_session", id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return { success: true };
}

export async function signIn(username: string, password: string) {
  if (!username || !password) throw new Error("Username and password required");

  const normalized = username.trim().toLowerCase();
  const user = await db.prepare("SELECT * FROM users WHERE username = ?").get(normalized) as any;
  
  if (!user) throw new Error("Invalid username or password");

  if (!user.passwordHash) throw new Error("Please use passwordless login for this account");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error("Invalid username or password");

  const cookieStore = await cookies();
  cookieStore.set("halo_session", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return { success: true, user };
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("halo_session");
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("halo_session")?.value;
  
  if (!sessionId) return null;

  const user = await db.prepare("SELECT * FROM users WHERE id = ?").get(sessionId) as any;
  return user || null;
}

export async function updateBioGoal(goal: string) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("halo_session")?.value;
  
  if (!sessionId) throw new Error("Unauthorized");

  await db.prepare("UPDATE users SET bioGoals = ? WHERE id = ?").run(goal, sessionId);
  return { success: true };
}

export async function logSleep(sleepTime: string, wakeTime: string, quality: number, notes?: string) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("halo_session")?.value;
  
  if (!sessionId) throw new Error("Unauthorized");

  const today = new Date().toISOString().split("T")[0];
  
  await db.prepare(`
    INSERT INTO sleep_logs (userId, sleepTime, wakeTime, quality, notes, date)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(sessionId, sleepTime, wakeTime, quality, notes || null, today);
  
  return { success: true };
}

export async function getSleepLogs(days: number = 7) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("halo_session")?.value;
  
  if (!sessionId) return [];

  const logs = await db.prepare(`
    SELECT * FROM sleep_logs 
    WHERE userId = ? 
    ORDER BY date DESC 
    LIMIT ?
  `).all(sessionId, days) as any[];
  
  return logs;
}

export async function updateCircadianScore(score: number, lightExposure: number, activityLevel: number) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("halo_session")?.value;
  
  if (!sessionId) throw new Error("Unauthorized");

  const today = new Date().toISOString().split("T")[0];
  
  await db.prepare(`
    INSERT INTO circadian_logs (userId, score, lightExposure, activityLevel, date)
    VALUES (?, ?, ?, ?, ?)
  `).run(sessionId, score, lightExposure, activityLevel, today);
  
  return { success: true };
}

export async function getCircadianHistory(days: number = 7) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("halo_session")?.value;
  
  if (!sessionId) return [];

  const logs = await db.prepare(`
    SELECT * FROM circadian_logs 
    WHERE userId = ? 
    ORDER BY date DESC 
    LIMIT ?
  `).all(sessionId, days) as any[];
  
  return logs;
}

export async function updateSettings(settings: string) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("halo_session")?.value;
  
  if (!sessionId) throw new Error("Unauthorized");

  await db.prepare("UPDATE users SET settings = ? WHERE id = ?").run(settings, sessionId);
  return { success: true };
}

export async function logMeal(mealName: string, calories: number, glycemicIndex: number, type: string) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("halo_session")?.value;
  
  if (!sessionId) throw new Error("Unauthorized");

  const today = new Date().toISOString().split("T")[0];
  const now = new Date().toTimeString().split(" ")[0];
  
  await db.prepare(`
    INSERT INTO meal_logs (userId, mealName, calories, glycemicIndex, mealType, date, time)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(sessionId, mealName, calories, glycemicIndex, type, today, now);
  
  return { success: true };
}

export async function getMealLogs(days: number = 7) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("halo_session")?.value;
  
  if (!sessionId) return [];

  const logs = await db.prepare(`
    SELECT * FROM meal_logs 
    WHERE userId = ? 
    ORDER BY date DESC, time DESC
    LIMIT ?
  `).all(sessionId, days) as any[];
  
  return logs;
}

export async function updateDietPreference(diet: string) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("halo_session")?.value;
  
  if (!sessionId) throw new Error("Unauthorized");

  const currentSettings = await db.prepare("SELECT settings FROM users WHERE id = ?").get(sessionId) as any;
  let settings = currentSettings?.settings ? JSON.parse(currentSettings.settings) : {};
  settings.dietPreference = diet;
  
  await db.prepare("UPDATE users SET settings = ? WHERE id = ?").run(JSON.stringify(settings), sessionId);
  return { success: true };
}
