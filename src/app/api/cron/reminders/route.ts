import { escapeHtml, sendEmail } from "@/lib/email";
import { getServiceClient } from "@/lib/supabase";

export async function GET(request: Request) {
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const database = getServiceClient();
  const now = Date.now();
  const { data } = await database
    .from("swarm_meeting_attendees")
    .select("meeting_id,member_id,swarm_meetings!inner(title,starts_at),swarm_members!inner(email,name)")
    .is("reminded_at", null)
    .neq("response", "declined");

  let sent = 0;
  for (const row of data || []) {
    const meeting = Array.isArray(row.swarm_meetings) ? row.swarm_meetings[0] : row.swarm_meetings;
    const member = Array.isArray(row.swarm_members) ? row.swarm_members[0] : row.swarm_members;
    if (!meeting || !member) continue;

    const startsAt = new Date(meeting.starts_at).getTime();
    if (startsAt < now || startsAt > now + 86_400_000) continue;

    await sendEmail({
      to: member.email,
      subject: `Tomorrow: ${meeting.title}`,
      html: `<p>Hi ${escapeHtml(member.name.split(" ")[0])},</p><p>A reminder that <strong>${escapeHtml(meeting.title)}</strong> is coming up.</p><p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/meetings">View meeting</a></p>`,
    });
    await database
      .from("swarm_meeting_attendees")
      .update({ reminded_at: new Date().toISOString() })
      .eq("meeting_id", row.meeting_id)
      .eq("member_id", row.member_id);
    sent += 1;
  }

  return Response.json({ sent });
}
