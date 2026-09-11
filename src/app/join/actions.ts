"use server";

import { acceptInvite } from "@/lib/members";
import { getMemberById } from "@/lib/members";
import { emailMagicLink } from "@/lib/magic-link";

export interface JoinState {
  error?: string;
  success?: string;
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
  const phone = String(formData.get("phone") ?? "");
  const company = String(formData.get("company") ?? "");
  const college = String(formData.get("college") ?? "");
  const location = String(formData.get("location") ?? "");
  const bio = String(formData.get("bio") ?? "");
  const linkedinUrl = String(formData.get("linkedin_url") ?? "");
  const websiteUrl = String(formData.get("website_url") ?? "");
  const instagramUrl = String(formData.get("instagram_url") ?? "");
  const publicNotes = String(formData.get("public_notes") ?? "");

  const result = await acceptInvite({ code, name, email, interests, careerTitle, phone, company, college, location, bio, linkedinUrl, websiteUrl, instagramUrl, publicNotes });
  if (!result.ok || !result.memberId) {
    return { error: result.error ?? "Something went wrong. Please try again." };
  }

  const member = await getMemberById(result.memberId);
  if (!member) return { error: "Your profile was saved, but sign-in could not start." };
  try { await emailMagicLink(member); } catch { return { error: "Your profile was saved, but the email could not be sent. Try signing in." }; }
  return { success: "Check your email for a private sign-in link. It expires in 15 minutes." };
}
