import { cookies } from "next/headers";
import { sql } from "./db";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar_url?: string;
  role_id: string;
  role_name?: string;
  status: string;
  email_verified: boolean;
  kyc_status: string;
  language: string;
  created_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
}

const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string, ipAddress?: string, userAgent?: string): Promise<string> {
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  await sql`
    INSERT INTO user_sessions (user_id, token, ip_address, user_agent, expires_at)
    VALUES (${userId}, ${token}, ${ipAddress || null}, ${userAgent || null}, ${expiresAt.toISOString()})
  `;

  const cookieStore = await cookies();
  cookieStore.set("session_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return token;
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (!token) return null;

  const sessions = await sql`
    SELECT * FROM user_sessions 
    WHERE token = ${token} AND expires_at > NOW()
  `;

  return sessions[0] as Session | null;
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  if (!session) return null;

  const users = await sql`
    SELECT u.*, r.name as role_name
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.id = ${session.user_id}
  `;

  return users[0] as User | null;
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireAdmin(): Promise<User> {
  const user = await requireAuth();
  if (!["super_admin", "admin", "manager"].includes(user.role_name || "")) {
    throw new Error("Forbidden");
  }
  return user;
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (token) {
    await sql`DELETE FROM user_sessions WHERE token = ${token}`;
  }

  cookieStore.delete("session_token");
}

export async function getUserPermissions(userId: string): Promise<string[]> {
  const permissions = await sql`
    SELECT DISTINCT p.name
    FROM permissions p
    JOIN role_permissions rp ON p.id = rp.permission_id
    JOIN roles r ON rp.role_id = r.id
    JOIN users u ON u.role_id = r.id
    WHERE u.id = ${userId}
  `;

  return permissions.map((p: { name: string }) => p.name);
}

export function hasPermission(permissions: string[], required: string): boolean {
  return permissions.includes(required);
}
