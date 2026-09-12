import Link from "next/link";
import { BootLog, TerminalWindow, Wordmark } from "@/components/terminal";
import { getCurrentMember } from "@/lib/session";

export default async function Home() {
  const member = await getCurrentMember();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-5 sm:px-8 sm:py-7">
      <nav className="flex items-center justify-between gap-4 border-b border-term-line pb-4">
        <Wordmark className="text-4xl" />
        <div className="flex items-center gap-4">
          <span className="hidden text-xs uppercase tracking-[.16em] text-term-muted sm:block">
            AI-native · NYC + everywhere
          </span>
          <Link href={member ? "/directory" : "/enter"} className="term-btn-ghost">
            {member ? "Enter Swarm" : "Member sign in"}
          </Link>
        </div>
      </nav>

      <section className="grid gap-10 border-b border-term-line py-12 lg:grid-cols-[1.35fr_.65fr] lg:items-end lg:py-20">
        <div>
          <BootLog
            lines={[
              "connecting to swarm.network ... ok",
              "status: invite-only",
              "A working community, not a content feed",
            ]}
          />
          <h1 className="mt-6 font-heading text-[clamp(4rem,11vw,8.5rem)] leading-[.8] text-term-green term-glow">
            Build in
            <br />
            the open.<span aria-hidden className="term-cursor" />
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-term-text sm:text-xl">
            Young people doing real work with AI. We share what works, build together, and
            bring one person we want in the room.
          </p>
        </div>
        <TerminalWindow title="swarm@network:~$ cat ./about">
          <p className="text-sm font-bold uppercase tracking-[.16em] text-term-green">
            Free · optional · low ego
          </p>
          <p className="mt-3 text-sm leading-relaxed text-term-muted">
            Weekly rooms. Shared experiments. Group projects. Periodic meetups in New York.
          </p>
          <Link href="/join" className="term-btn mt-6 w-full">
            I have an invite →
          </Link>
        </TerminalWindow>
      </section>

      <section className="mt-10 grid gap-px border border-term-line bg-term-line md:grid-cols-3">
        <Pillar number="01" title="Show the work">
          Demo the weird thing you tried this week. Give people the useful version, not the
          polished LinkedIn version.
        </Pillar>
        <Pillar number="02" title="Build together">
          Ship small group projects to learn faster than any course, thread, or tutorial could
          teach you.
        </Pillar>
        <Pillar number="03" title="Grow with taste">
          Bring one motivated, curious person you would genuinely want contributing in the room.
        </Pillar>
      </section>

      <footer className="flex flex-col justify-between gap-2 py-8 text-xs uppercase tracking-[.14em] text-term-muted sm:flex-row">
        <span>Memory, agents, and what we’re building.</span>
        <span>Est. 2026 · New York</span>
      </footer>
    </main>
  );
}

function Pillar({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="bg-term-panel/90 p-6 sm:p-7">
      <span className="text-xs text-term-green">[{number}]</span>
      <h2 className="mt-6 font-heading text-4xl leading-none text-term-text">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-term-muted">{children}</p>
    </article>
  );
}
