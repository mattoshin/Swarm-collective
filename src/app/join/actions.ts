"use server";

import { redirect } from "next/navigation";
import { acceptInvite } from "@/lib/members";
import { setSession } from "@/lib/session";

export interface JoinState {
  error?: string;
}

export async function submitJoin(
  _prev: JoinState,
  formData: FormData,
): Promise<JoinState> {
  const code = String(formData.get("code") ?? "");
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const interests = String(formData.get("interests") ?? "");
  const careerTitle = String(formData.get("career_title") ?? "");

  const result = await acceptInvite({ code, name, email, interests, careerTitle });
  if (!result.ok || !result.memberId) {
    return { error: result.error ?? "Something went wrong. Please try again." };
  }

  await setSession(result.memberId);
  redirect("/directory");
}
