import { redirect } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { PageHeader } from "@/components/terminal";
import { listDirectory, type Member } from "@/lib/members";
import { getCurrentMember } from "@/lib/session";
import { saveAdminNote } from "./actions";

function LinkList({ m }: { m: Member }) {
  const links = [
    ["LinkedIn", m.linkedin_url],
    ["Website", m.website_url],
    ["Instagram", m.instagram_url],
  ].filter((l): l is [string, string] => Boolean(l[1] && /^https?:\/\//i.test(l[1])));

  return (
    <p className="mt-2 flex flex-wrap gap-x-3 text-xs">
      {links.length ? (
        links.map(([label, href]) => (
          <a key={label} className="term-link" href={href} target="_blank" rel="noreferrer">
            {label}
          </a>
        ))
      ) : (
        <span className="text-term-muted/60">No links</span>
      )}
    </p>
  );
}

export default async function Admin() {
  const actor = await getCurrentMember();
  if (!actor) redirect("/enter");
  if (actor.role !== "admin") redirect("/directory");

  const members = await listDirectory();

  return (
    <>
      <AppNav member={actor} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8">
        <PageHeader
          command="crm --private"
          title="The whole swarm, one place."
          meta="Contact details are member-visible. Notes below are admin-only."
        />
        <div className="mt-8 grid gap-4">
          {members.map((m) => (
            <article
              key={m.id}
              className="term-panel grid gap-5 p-5 lg:grid-cols-[1.2fr_1fr_1.5fr]"
            >
              <div>
                <h2 className="font-bold text-term-text">{m.name}</h2>
                <p className="text-sm text-term-muted">
                  {m.role_title || m.career_title || "No role"}
                  {m.company ? ` at ${m.company}` : ""}
                </p>
                <p className="mt-2 text-xs text-term-muted/80">
                  {m.location || "No location"} · {m.college || "No college"}
                </p>
                {m.public_notes ? (
                  <p className="mt-3 text-xs italic text-term-muted">“{m.public_notes}”</p>
                ) : null}
              </div>
              <div className="text-sm text-term-muted">
                <a className="block text-term-green hover:underline" href={`mailto:${m.email}`}>
                  {m.email}
                </a>
                {m.phone ? (
                  <a className="mt-1 block hover:text-term-green" href={`tel:${m.phone}`}>
                    {m.phone}
                  </a>
                ) : (
                  <p className="mt-1">No phone</p>
                )}
                <p className="mt-2 text-xs">
                  Joined{" "}
                  {new Date(m.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <LinkList m={m} />
              </div>
              <form action={saveAdminNote.bind(null, m.id)}>
                <label className="block">
                  <span className="term-label">Private notes</span>
                  <textarea
                    name="admin_notes"
                    defaultValue={m.admin_notes || ""}
                    rows={2}
                    className="term-input"
                  />
                </label>
                <button className="term-btn-ghost mt-2 h-8 px-3 text-[11px]">Save note</button>
              </form>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
