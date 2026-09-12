import { escapeHtml, sendEmail } from "@/lib/email";
import { listDirectory } from "@/lib/members";
import { generateDailyDigest, saveDigest, type NewsItem } from "@/lib/news";

function digestHtml(items: NewsItem[]): string {
  const rows = items
    .map(
      (item) => `
      <div style="margin:0 0 24px;padding-bottom:24px;border-bottom:1px solid #1e1e1d">
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#00ff41">${escapeHtml(item.category)}</p>
        <h2 style="margin:0 0 8px;font-size:18px;color:#fafafa">${escapeHtml(item.headline)}</h2>
        <p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:#c7c7c7">${escapeHtml(item.summary)}</p>
        ${item.source_url ? `<a href="${escapeHtml(item.source_url)}" style="font-size:13px;color:#00ff41">Read more →</a>` : ""}
      </div>`,
    )
    .join("");

  return `<!doctype html><html><body style="margin:0;background:#0a0a0b;font-family:ui-monospace,monospace;color:#fafafa"><div style="max-width:560px;margin:0 auto;padding:40px 20px"><p style="margin:0 0 4px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#00ff41">Swarm Collective</p><h1 style="margin:0 0 28px;font-size:28px">Today in AI</h1>${rows}<p style="margin:28px 0 0;font-size:12px;color:#6b7280">Sent to Swarm members daily. <a href="${process.env.NEXT_PUBLIC_SITE_URL}/news" style="color:#00ff41">View in the app</a></p></div></body></html>`;
}

export async function GET(request: Request) {
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await generateDailyDigest();
  const today = new Date().toISOString().slice(0, 10);
  await saveDigest(today, items);

  const members = await listDirectory();
  const html = digestHtml(items);
  let sent = 0;
  for (const member of members) {
    try {
      await sendEmail({ to: member.email, subject: "Swarm: Today in AI", html });
      sent += 1;
    } catch {
      // One bad address shouldn't sink the rest of the run.
    }
  }

  return Response.json({ items: items.length, sent });
}
