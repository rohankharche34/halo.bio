"use server";

import db from "@/lib/db";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";

export async function signIn(username: string) {
  if (!username) throw new Error("Username required");

  const normalized = username.trim().toLowerCase();
  
  // Find user
  let user = db.prepare("SELECT * FROM users WHERE username = ?").get(normalized) as any;
  
  // Create if doesn't exist
  if (!user) {
    const id = randomUUID();
    db.prepare("INSERT INTO users (id, username, displayName) VALUES (?, ?, ?)").run(id, normalized, username.trim());
    user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  }

  // Set session cookie
  const cookieStore = await cookies();
  cookieStore.set("halo_session", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
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

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(sessionId) as any;
  return user || null;
}

export async function updateBioGoal(goal: string) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("halo_session")?.value;
  
  if (!sessionId) throw new Error("Unauthorized");

  db.prepare("UPDATE users SET bioGoals = ? WHERE id = ?").run(goal, sessionId);
  return { success: true };
}
