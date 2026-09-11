"use server";

import { getMemberByEmail } from "@/lib/members";
import { emailMagicLink } from "@/lib/magic-link";

export interface EnterState {
  error?: string;
  success?: string;
}

export async function submitEnter(
  _prev: EnterState,
  formData: FormData,
): Promise<EnterState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Please enter your email." };

  const member = await getMemberByEmail(email);
  if (!member) {
    return {
      error: "No membership found for that email. You'll need an invite to join.",
    };
  }

  try { await emailMagicLink(member); } catch { return { error: "We couldn't send the sign-in email. Try again shortly." }; }
  return { success: "Check your email. Your one-time sign-in link expires in 15 minutes." };
}
