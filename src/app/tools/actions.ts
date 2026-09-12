"use server";

import { revalidatePath } from "next/cache";
import { getCurrentMember } from "@/lib/session";
import { addTool, voteTool } from "@/lib/tools";

export interface AddToolState {
  error?: string;
}

export async function addToolAction(
  _prev: AddToolState,
  formData: FormData,
): Promise<AddToolState> {
  const actor = await getCurrentMember();
  if (!actor) return { error: "Your session expired. Sign in again." };

  const name = String(formData.get("name") ?? "");
  const description = String(formData.get("description") ?? "");
  const result = await addTool(actor.id, { name, description });
  if (!result.ok) return { error: result.error };

  revalidatePath("/tools");
  return {};
}

export async function voteToolAction(toolId: string, value: 1 | -1): Promise<void> {
  const actor = await getCurrentMember();
  if (!actor) throw new Error("Unauthorized");
  await voteTool(actor.id, toolId, value);
  revalidatePath("/tools");
}
