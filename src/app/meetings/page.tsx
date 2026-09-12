import { redirect } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { PageHeader } from "@/components/terminal";
import { getCurrentMember } from "@/lib/session";
import { getServiceClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { createMeeting, rsvp } from "./actions";

const RSVP_OPTIONS = ["going", "maybe", "declined"] as const;

export default async function Meetings() {
  const member = await getCurrentMember();
  if (!member) redirect("/enter");

  const db = getServiceClient();
  const [{ data: meetings }, { data: responses }] = await Promise.all([
    db.from("swarm_meetings").select("*").order("starts_at"),
    db.from("swarm_meeting_attendees").select("meeting_id,response").eq("member_id", member.id),
  ]);
  const map = new Map(responses?.map((r) => [r.meeting_id, r.response]));

  return (
    <>
      <AppNav member={member} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8">
        <PageHeader
          command="cal --upcoming"
          title="Meetings"
          meta="Invites and reminders arrive by email. Your RSVP stays here."
        />

        {member.role === "admin" ? (
          <details className="term-panel mt-8 p-6">
            <summary className="cursor-pointer text-sm font-bold uppercase tracking-[.12em] text-term-green">
              Schedule and email everyone
            </summary>
            <form action={createMeeting} className="mt-5 grid gap-4 sm:grid-cols-2">
              <Input name="title" label="Title" required />
              <Input name="starts_at" label="Date and time" type="datetime-local" required />
              <Input name="location" label="Location" />
              <Input name="meeting_url" label="Meeting link" type="url" />
              <Input name="duration" label="Minutes" type="number" value="60" />
              <label className="sm:col-span-2">
                <span className="term-label">Description</span>
                <textarea name="description" rows={3} className="term-input" />
              </label>
              <button className="term-btn sm:col-span-2">Create and email members</button>
            </form>
          </details>
        ) : null}

        <div className="mt-8 grid gap-4">
          {meetings?.length ? (
            meetings.map((m) => (
              <article key={m.id} className="term-panel p-6">
                <p className="text-xs uppercase tracking-[.14em] text-term-green">
                  {new Date(m.starts_at).toLocaleString("en-US", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                </p>
                <h2 className="mt-2 font-heading text-4xl leading-none text-term-text">{m.title}</h2>
                {m.description ? (
                  <p className="mt-3 text-sm text-term-muted">{m.description}</p>
                ) : null}
                <p className="mt-4 text-sm text-term-muted">
                  {m.location} · {m.duration_minutes} minutes{" "}
                  {m.meeting_url ? (
                    <a className="term-link" href={m.meeting_url}>
                      · Join link
                    </a>
                  ) : null}
                </p>
                <div className="mt-5 flex gap-2">
                  {RSVP_OPTIONS.map((v) => {
                    const selected = map.get(m.id) === v;
                    return (
                      <form action={rsvp.bind(null, m.id, v)} key={v}>
                        <button
                          aria-pressed={selected}
                          className={cn(
                            "border px-3 py-1.5 text-xs uppercase tracking-[.1em] transition-colors",
                            selected
                              ? "border-term-green bg-term-green text-term-ink"
                              : "border-term-line text-term-muted hover:border-term-green hover:text-term-green",
                          )}
                        >
                          {v}
                        </button>
                      </form>
                    );
                  })}
                </div>
              </article>
            ))
          ) : (
            <p className="term-panel p-6 text-sm text-term-muted">
              <span aria-hidden className="text-term-green">
                &gt;{" "}
              </span>
              No meetings scheduled yet.
            </p>
          )}
        </div>
      </main>
    </>
  );
}

function Input({
  label,
  value,
  ...input
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  value?: string;
}) {
  return (
    <label>
      <span className="term-label">{label}</span>
      <input {...input} defaultValue={value} className="term-input" />
    </label>
  );
}
