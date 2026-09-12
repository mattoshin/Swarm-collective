import "server-only";
import crypto from "node:crypto";
import { getServiceClient } from "./supabase";
import { normalizeHttpUrl, normalizeInstagram } from "./links";

export interface Member {
  id: string;
  name: string;
  email: string;
  interests: string | null;
  career_title: string | null;
  phone: string | null;
  company: string | null;
  role_title: string | null;
  college: string | null;
  location: string | null;
  bio: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  instagram_url: string | null;
  public_notes: string | null;
  admin_notes: string | null;
  role: "member" | "admin";
  email_verified_at: string | null;
  bookmark_prompt_seen: boolean;
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
  expires_at: string;
  redemption_count: number;
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
 * Redeem an invite and create the new member in one flow. Invites are
 * multi-use until they expire, so there's no claim race to guard against;
 * the unique email index is what stops the same person joining twice.
 */
export async function acceptInvite(params: {
  code: string;
  name: string;
  email: string;
  interests?: string | null;
  careerTitle?: string | null;
  phone?: string | null;
  company?: string | null;
  college?: string | null;
  location?: string | null;
  bio?: string | null;
  linkedinUrl?: string | null;
  websiteUrl?: string | null;
  instagramUrl?: string | null;
  publicNotes?: string | null;
}): Promise<AcceptResult> {
  const supabase = getServiceClient();
  const name = params.name.trim();
  const email = normalizeEmail(params.email);

  if (!name) return { ok: false, error: "Please enter your name." };
  if (!EMAIL_RE.test(email)) return { ok: false, error: "Please enter a valid email." };

  const links = {
    linkedin_url: normalizeHttpUrl(params.linkedinUrl),
    website_url: normalizeHttpUrl(params.websiteUrl),
    instagram_url: normalizeInstagram(params.instagramUrl),
  };
  const badLink =
    (params.linkedinUrl?.trim() && !links.linkedin_url) ||
    (params.websiteUrl?.trim() && !links.website_url) ||
    (params.instagramUrl?.trim() && !links.instagram_url);
  if (badLink) {
    return { ok: false, error: "One of your links doesn't look right. Use a full link, or an @handle for Instagram." };
  }

  const shared = process.env.SWARM_INVITE_TOKEN;
  const sharedValid = Boolean(shared && params.code.length === shared.length && crypto.timingSafeEqual(Buffer.from(params.code), Buffer.from(shared)));
  const invite = sharedValid ? null : await getInviteByCode(params.code);
  if (!sharedValid && !invite) return { ok: false, error: "This invite link isn't valid." };
  if (invite && new Date(invite.expires_at) < new Date()) {
    return { ok: false, error: "This invite link has expired." };
  }

  const existing = await getMemberByEmail(email);
  if (existing) {
    return { ok: false, error: "You're already a member — head to the sign-in page." };
  }

  const { data: member, error: insertError } = await supabase
    .from("swarm_members")
    .insert({
      name,
      full_name: name,
      email,
      interests: params.interests?.trim() || null,
      career_title: params.careerTitle?.trim() || null,
      invited_by: invite?.inviter_id ?? null,
      phone: params.phone?.trim() || null,
      company: params.company?.trim() || null,
      role_title: params.careerTitle?.trim() || null,
      college: params.college?.trim() || null,
      location: params.location?.trim() || null,
      bio: params.bio?.trim() || null,
      ...links,
      public_notes: params.publicNotes?.trim() || null,
      role: (process.env.SWARM_ADMIN_EMAILS || "").split(",").map(v=>v.trim().toLowerCase()).includes(email) ? "admin" : "member",
    })
    .select("id")
    .single();
  if (insertError || !member) {
    return { ok: false, error: "You're already a member — head to the sign-in page." };
  }
  const memberId = (member as { id: string }).id;

  if (!invite) return { ok: true, memberId };
  await supabase
    .from("swarm_invites")
    .update({
      accepted_by: memberId,
      accepted_at: new Date().toISOString(),
      redemption_count: invite.redemption_count + 1,
    })
    .eq("id", invite.id);

  return { ok: true, memberId };
}

export interface UpdateProfileResult {
  ok: boolean;
  error?: string;
}

/** Fields a member may edit on their own profile. Email, role, and admin_notes are out of scope here. */
export async function updateOwnProfile(
  memberId: string,
  params: {
    name: string;
    interests?: string | null;
    careerTitle?: string | null;
    phone?: string | null;
    company?: string | null;
    college?: string | null;
    location?: string | null;
    bio?: string | null;
    linkedinUrl?: string | null;
    websiteUrl?: string | null;
    instagramUrl?: string | null;
    publicNotes?: string | null;
  },
): Promise<UpdateProfileResult> {
  const name = params.name.trim();
  if (!name) return { ok: false, error: "Name can't be empty." };

  const links = {
    linkedin_url: normalizeHttpUrl(params.linkedinUrl),
    website_url: normalizeHttpUrl(params.websiteUrl),
    instagram_url: normalizeInstagram(params.instagramUrl),
  };
  const badLink =
    (params.linkedinUrl?.trim() && !links.linkedin_url) ||
    (params.websiteUrl?.trim() && !links.website_url) ||
    (params.instagramUrl?.trim() && !links.instagram_url);
  if (badLink) {
    return { ok: false, error: "One of your links doesn't look right. Use a full link, or an @handle for Instagram." };
  }

  const supabase = getServiceClient();
  const { error } = await supabase
    .from("swarm_members")
    .update({
      name,
      full_name: name,
      interests: params.interests?.trim() || null,
      career_title: params.careerTitle?.trim() || null,
      role_title: params.careerTitle?.trim() || null,
      phone: params.phone?.trim() || null,
      company: params.company?.trim() || null,
      college: params.college?.trim() || null,
      location: params.location?.trim() || null,
      bio: params.bio?.trim() || null,
      ...links,
      public_notes: params.publicNotes?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", memberId);

  if (error) return { ok: false, error: "Couldn't save your changes. Please try again." };
  return { ok: true };
}
