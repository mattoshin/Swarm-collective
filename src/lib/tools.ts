import "server-only";
import { getServiceClient } from "./supabase";

export interface ToolRow {
  id: string;
  name: string;
  description: string;
  added_by: string;
  added_by_name: string;
  created_at: string;
  score: number;
  myVote: 1 | -1 | 0;
}

interface ToolRecord {
  id: string;
  name: string;
  description: string;
  added_by: string;
  created_at: string;
}

export async function listTools(viewerId: string): Promise<ToolRow[]> {
  const supabase = getServiceClient();

  const [{ data: tools, error: toolsError }, { data: members, error: membersError }] =
    await Promise.all([
      supabase
        .from("swarm_tools")
        .select("*")
        .order("created_at", { ascending: true }),
      supabase.from("swarm_members").select("id,name"),
    ]);
  if (toolsError) throw toolsError;
  if (membersError) throw membersError;

  const rows = (tools as ToolRecord[] | null) ?? [];
  if (rows.length === 0) return [];

  const nameById = new Map((members as { id: string; name: string }[] | null)?.map((m) => [m.id, m.name]));

  const { data: votes, error: votesError } = await supabase
    .from("swarm_tool_votes")
    .select("tool_id,member_id,value")
    .in("tool_id", rows.map((t) => t.id));
  if (votesError) throw votesError;

  const scoreByTool = new Map<string, number>();
  const myVoteByTool = new Map<string, 1 | -1>();
  for (const v of (votes as { tool_id: string; member_id: string; value: 1 | -1 }[] | null) ?? []) {
    scoreByTool.set(v.tool_id, (scoreByTool.get(v.tool_id) ?? 0) + v.value);
    if (v.member_id === viewerId) myVoteByTool.set(v.tool_id, v.value);
  }

  const withVotes: ToolRow[] = rows.map((t) => ({
    ...t,
    added_by_name: nameById.get(t.added_by) ?? "Unknown",
    score: scoreByTool.get(t.id) ?? 0,
    myVote: myVoteByTool.get(t.id) ?? 0,
  }));

  return withVotes.sort(
    (a, b) => b.score - a.score || a.created_at.localeCompare(b.created_at),
  );
}

export interface AddToolResult {
  ok: boolean;
  error?: string;
}

export async function addTool(
  addedBy: string,
  params: { name: string; description: string },
): Promise<AddToolResult> {
  const name = params.name.trim().slice(0, 120);
  const description = params.description.trim().slice(0, 2000);
  if (!name) return { ok: false, error: "Give the tool a name." };
  if (!description) return { ok: false, error: "Add a line on how to use it." };

  const supabase = getServiceClient();
  const { error } = await supabase.from("swarm_tools").insert({ name, description, added_by: addedBy });
  if (error) return { ok: false, error: "Couldn't add that tool. Please try again." };
  return { ok: true };
}

export async function voteTool(memberId: string, toolId: string, value: 1 | -1): Promise<void> {
  const supabase = getServiceClient();
  const { data: existing } = await supabase
    .from("swarm_tool_votes")
    .select("id,value")
    .eq("tool_id", toolId)
    .eq("member_id", memberId)
    .maybeSingle();

  if (existing && (existing as { value: number }).value === value) {
    await supabase.from("swarm_tool_votes").delete().eq("id", (existing as { id: string }).id);
    return;
  }

  await supabase
    .from("swarm_tool_votes")
    .upsert({ tool_id: toolId, member_id: memberId, value }, { onConflict: "tool_id,member_id" });
}
