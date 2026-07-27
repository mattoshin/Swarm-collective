"use server";

import { redirect } from "next/navigation";
import { getMemberByEmail } from "@/lib/members";
import { setSession } from "@/lib/session";

export interface EnterState {
  error?: string;
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

  await setSession(member.id);
  redirect("/directory");
}
