import "server-only";
import crypto from "node:crypto";
import { getServiceClient } from "./supabase";

export interface Member {
  id: string;
  name: string;
  email: string;
  interests: string | null;
  career_title: string | null;
  invited_by: string | null;
  created_at: string;
}

export interface Invite {
  id: string;
  code: string;
  inviter_id: string;
  invited_email: string | null;
  accepted_by: string | null;
  created_at: string;
  accepted_at: string | null;
}

export interface DirectoryRow extends Member {
  invited_by_name: string | null;
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function getMemberById(id: string): Promise<Member | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("swarm_members")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as Member | null) ?? null;
}

export async function getMemberByEmail(email: string): Promise<Member | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("swarm_members")
    .select("*")
    .eq("email", normalizeEmail(email))
    .maybeSingle();
  if (error) throw error;
  return (data as Member | null) ?? null;
}

export async function listDirectory(): Promise<DirectoryRow[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("swarm_members")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;

  const members = (data as Member[] | null) ?? [];
  const nameById = new Map(members.map((m) => [m.id, m.name]));
  return members.map((m) => ({
    ...m,
    invited_by_name: m.invited_by ? nameById.get(m.invited_by) ?? null : null,
  }));
}

export async function getInviteByCode(code: string): Promise<Invite | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("swarm_invites")
    .select("*")
    .eq("code", code)
    .maybeSingle();
  if (error) throw error;
  return (data as Invite | null) ?? null;
}

export async function listInvitesFor(inviterId: string): Promise<Invite[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("swarm_invites")
    .select("*")
    .eq("inviter_id", inviterId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as Invite[] | null) ?? [];
}

export async function createInvite(
  inviterId: string,
  invitedEmail?: string | null,
): Promise<Invite> {
  const supabase = getServiceClient();
  const code = crypto.randomBytes(12).toString("base64url");
  const email = invitedEmail?.trim() ? normalizeEmail(invitedEmail) : null;

  const { data, error } = await supabase
    .from("swarm_invites")
    .insert({ code, inviter_id: inviterId, invited_email: email })
    .select("*")
    .single();
  if (error) throw error;
  return data as Invite;
}

export interface AcceptResult {
  ok: boolean;
  error?: string;
  memberId?: string;
}

/**
 * Redeem an invite and create the new member in one flow. Not a DB transaction
 * (service client can't open one), so the invite claim is guarded with a
 * conditional update and the member insert is rolled back if the claim loses a
 * race. Volume is low; the unique email index is the real backstop.
 */
export async function acceptInvite(params: {
  code: string;
  name: string;
  email: string;
  interests?: string | null;
  careerTitle?: string | null;
}): Promise<AcceptResult> {
  const supabase = getServiceClient();
  const name = params.name.trim();
  const email = normalizeEmail(params.email);

  if (!name) return { ok: false, error: "Please enter your name." };
  if (!EMAIL_RE.test(email)) return { ok: false, error: "Please enter a valid email." };

  const invite = await getInviteByCode(params.code);
  if (!invite) return { ok: false, error: "This invite link isn't valid." };
  if (invite.accepted_by) return { ok: false, error: "This invite has already been used." };

  const existing = await getMemberByEmail(email);
  if (existing) {
    return { ok: false, error: "You're already a member — head to the sign-in page." };
  }

  const { data: member, error: insertError } = await supabase
    .from("swarm_members")
    .insert({
      name,
      email,
      interests: params.interests?.trim() || null,
      career_title: params.careerTitle?.trim() || null,
      invited_by: invite.inviter_id,
    })
    .select("id")
    .single();
  if (insertError || !member) {
    return { ok: false, error: "You're already a member — head to the sign-in page." };
  }
  const memberId = (member as { id: string }).id;

  const { data: claimed, error: claimError } = await supabase
    .from("swarm_invites")
    .update({ accepted_by: memberId, accepted_at: new Date().toISOString() })
    .eq("id", invite.id)
    .is("accepted_by", null)
    .select("id");
  if (claimError || !claimed || claimed.length === 0) {
    await supabase.from("swarm_members").delete().eq("id", memberId);
    return { ok: false, error: "This invite was just used by someone else." };
  }

  return { ok: true, memberId };
}
