import "server-only";
import { getServiceClient } from "./supabase";

export interface CollaborateDoc {
  content: string;
  updatedByName: string | null;
  updatedAt: string;
}

const DOC_ID = "default";

export async function getCollaborateDoc(): Promise<CollaborateDoc> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("swarm_collaborate_doc")
    .select("content,updated_at,updated_by")
    .eq("id", DOC_ID)
    .maybeSingle();
  if (error) throw error;
  if (!data) return { content: "", updatedByName: null, updatedAt: new Date().toISOString() };

  const row = data as { content: string; updated_at: string; updated_by: string | null };
  let updatedByName: string | null = null;
  if (row.updated_by) {
    const { data: member } = await supabase
      .from("swarm_members")
      .select("name")
      .eq("id", row.updated_by)
      .maybeSingle();
    updatedByName = (member as { name: string } | null)?.name ?? null;
  }

  return { content: row.content, updatedByName, updatedAt: row.updated_at };
}

export interface SaveCollaborateResult {
  ok: boolean;
  error?: string;
}

export async function saveCollaborateDoc(
  memberId: string,
  content: string,
): Promise<SaveCollaborateResult> {
  const supabase = getServiceClient();
  const { error } = await supabase.from("swarm_collaborate_doc").upsert({
    id: DOC_ID,
    content: content.slice(0, 20000),
    updated_by: memberId,
    updated_at: new Date().toISOString(),
  });
  if (error) return { ok: false, error: "Couldn't save. Please try again." };
  return { ok: true };
}
