import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { getMemberById, type Member } from "./members";

const COOKIE_NAME = "swarm_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function secret(): string {
  const value = process.env.SWARM_SESSION_SECRET;
  if (!value) throw new Error("Missing SWARM_SESSION_SECRET environment variable.");
  return value;
}

function sign(memberId: string): string {
  const mac = crypto.createHmac("sha256", secret()).update(memberId).digest("hex");
  return `${memberId}.${mac}`;
}

function verify(token: string): string | null {
  const dot = token.lastIndexOf(".");
  if (dot === -1) return null;
  const memberId = token.slice(0, dot);
  const mac = token.slice(dot + 1);
  const expected = crypto.createHmac("sha256", secret()).update(memberId).digest("hex");
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return memberId;
}

export async function setSession(memberId: string): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE_NAME, sign(memberId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

/**
 * The cookie only proves the browser holds a signed member id. Membership,
 * name, and everything else is always re-derived from the DB — never trusted
 * from the cookie.
 */
export async function getCurrentMember(): Promise<Member | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const memberId = verify(token);
  if (!memberId) return null;
  const member = await getMemberById(memberId);
  return member?.email_verified_at ? member : null;
}
