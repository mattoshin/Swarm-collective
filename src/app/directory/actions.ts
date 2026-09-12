"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createInvite } from "@/lib/members";
import { clearSession, getCurrentMember } from "@/lib/session";

export interface CreateInviteState {
  code?: string;
  error?: string;
}

export async function createInviteAction(
  _prev: CreateInviteState,
  _formData: FormData,
): Promise<CreateInviteState> {
  void _prev;
  void _formData;
  const member = await getCurrentMember();
  if (!member) return { error: "Your session expired. Sign in again." };

  try {
    const invite = await createInvite(member.id);
    revalidatePath("/", "layout");
    return { code: invite.code };
  } catch {
    return { error: "Couldn't create an invite. Please try again." };
  }
}

export async function signOutAction(): Promise<void> {
  await clearSession();
  redirect("/");
}
