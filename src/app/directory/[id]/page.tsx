import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { PageHeader } from "@/components/terminal";
import { getMemberById } from "@/lib/members";
import { getCurrentMember } from "@/lib/session";
import { ProfileEditForm } from "./profile-edit-form";
import { saveAdminNoteAction } from "./actions";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-term-line/50 py-2.5 last:border-0 sm:flex-row sm:justify-between sm:gap-4">
      <span className="text-xs uppercase tracking-[.1em] text-term-muted">{label}</span>
      <span className="text-sm text-term-text">{children}</span>
    </div>
  );
}

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const actor = await getCurrentMember();
  if (!actor) redirect("/enter");

  const { id } = await params;
  const member = await getMemberById(id);
  if (!member) notFound();

  const isSelf = actor.id === member.id;
  const isAdmin = actor.role === "admin";
  const links = [
    ["LinkedIn", member.linkedin_url],
    ["Website", member.website_url],
    ["Instagram", member.instagram_url],
  ].filter((l): l is [string, string] => Boolean(l[1]));

  return (
    <>
      <AppNav member={actor} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:px-8">
        <Link href="/directory" className="term-link text-xs">
          ← Directory
        </Link>
        <div className="mt-4">
          <PageHeader
            command={`cat ./directory/${member.name.toLowerCase().replace(/\s+/g, "-")}`}
            title={member.name}
            meta={[member.career_title, member.company ? `at ${member.company}` : null]
              .filter(Boolean)
              .join(" ") || "Member"}
          />
        </div>

        <div className="term-panel mt-8 p-6 sm:p-8">
          <Row label="Email">
            <a href={`mailto:${member.email}`} className="text-term-green hover:underline">
              {member.email}
            </a>
          </Row>
          {member.phone ? (
            <Row label="Phone">
              <a href={`tel:${member.phone}`} className="hover:text-term-green">
                {member.phone}
              </a>
            </Row>
          ) : null}
          {member.location ? <Row label="Location">{member.location}</Row> : null}
          {member.college ? <Row label="College">{member.college}</Row> : null}
          {member.interests ? <Row label="Interests">{member.interests}</Row> : null}
          {links.length ? (
            <Row label="Links">
              <span className="flex flex-wrap justify-end gap-x-3">
                {links.map(([label, href]) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" className="term-link">
                    {label}
                  </a>
                ))}
              </span>
            </Row>
          ) : null}
          <Row label="Joined">
            {new Date(member.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Row>

          {member.bio ? (
            <div className="mt-4 border-t border-term-line pt-4">
              <p className="term-label">Bio</p>
              <p className="text-sm leading-relaxed text-term-muted">{member.bio}</p>
            </div>
          ) : null}
          {member.public_notes ? (
            <div className="mt-4 border-t border-term-line pt-4">
              <p className="term-label">Notes</p>
              <p className="text-sm italic leading-relaxed text-term-muted">
                “{member.public_notes}”
              </p>
            </div>
          ) : null}
        </div>

        {isSelf ? (
          <div className="mt-8">
            <PageHeader command="vim ./profile" title="Edit your info" />
            <div className="mt-4">
              <ProfileEditForm member={member} />
            </div>
          </div>
        ) : null}

        {isAdmin ? (
          <div className="mt-8">
            <PageHeader command="cat ./private-notes" title="Private notes" meta="Visible to admins only." />
            <form action={saveAdminNoteAction.bind(null, member.id)} className="term-panel mt-4 space-y-3 p-6">
              <textarea
                name="admin_notes"
                defaultValue={member.admin_notes ?? ""}
                rows={3}
                className="term-input"
              />
              <button className="term-btn-ghost h-9 px-4 text-xs">Save note</button>
            </form>
          </div>
        ) : null}
      </main>
    </>
  );
}
