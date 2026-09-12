"use server";

import { revalidatePath } from "next/cache";
import { getCurrentMember } from "@/lib/session";
import { getServiceClient } from "@/lib/supabase";
import { updateOwnProfile } from "@/lib/members";

export interface UpdateProfileState {
  error?: string;
  success?: string;
}

export async function updateProfileAction(
  memberId: string,
  _prev: UpdateProfileState,
  formData: FormData,
): Promise<UpdateProfileState> {
  const actor = await getCurrentMember();
  if (!actor || actor.id !== memberId) return { error: "You can only edit your own profile." };

  const result = await updateOwnProfile(memberId, {
    name: String(formData.get("name") ?? ""),
    interests: String(formData.get("interests") ?? ""),
    careerTitle: String(formData.get("career_title") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    company: String(formData.get("company") ?? ""),
    college: String(formData.get("college") ?? ""),
    location: String(formData.get("location") ?? ""),
    bio: String(formData.get("bio") ?? ""),
    linkedinUrl: String(formData.get("linkedin_url") ?? ""),
    websiteUrl: String(formData.get("website_url") ?? ""),
    instagramUrl: String(formData.get("instagram_url") ?? ""),
    publicNotes: String(formData.get("public_notes") ?? ""),
  });

  if (!result.ok) return { error: result.error };
  revalidatePath(`/directory/${memberId}`);
  revalidatePath("/directory");
  return { success: "Saved." };
}

export async function saveAdminNoteAction(memberId: string, form: FormData): Promise<void> {
  const actor = await getCurrentMember();
  if (!actor || actor.role !== "admin") throw new Error("Unauthorized");

  await getServiceClient()
    .from("swarm_members")
    .update({
      admin_notes: String(form.get("admin_notes") || "").slice(0, 2000),
      updated_at: new Date().toISOString(),
    })
    .eq("id", memberId);

  revalidatePath(`/directory/${memberId}`);
}
