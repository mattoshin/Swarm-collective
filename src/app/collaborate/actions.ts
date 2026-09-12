"use server";

import { revalidatePath } from "next/cache";
import { getCurrentMember } from "@/lib/session";
import { saveCollaborateDoc } from "@/lib/collaborate";

export interface SaveDocState {
  error?: string;
  success?: string;
}

export async function saveDocAction(
  _prev: SaveDocState,
  formData: FormData,
): Promise<SaveDocState> {
  const actor = await getCurrentMember();
  if (!actor) return { error: "Your session expired. Sign in again." };

  const content = String(formData.get("content") ?? "");
  const result = await saveCollaborateDoc(actor.id, content);
  if (!result.ok) return { error: result.error };

  revalidatePath("/collaborate");
  return { success: "Saved." };
}
