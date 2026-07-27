import Link from "next/link";
import { getCurrentMember } from "@/lib/session";

export default async function Home() {
  const member = await getCurrentMember();

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(120,119,255,0.18),transparent_70%)]"
      />
      <div className="mx-auto w-full max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-indigo-300/70">
          Invite only
        </p>
        <h1 className="mt-5 text-5xl font-semibold tracking-tight text-white sm:text-6xl">
          Swarm Collective
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/60">
          A private network that grows one introduction at a time. Every member
          can bring someone in — and being in the swarm unlocks the full
          directory of who&apos;s here, what they do, and what they&apos;re into.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {member ? (
            <Link
              href="/directory"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Enter the directory
            </Link>
          ) : (
            <>
              <Link
                href="/join"
                className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                Join the network
              </Link>
              <Link
                href="/enter"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 px-7 text-sm font-semibold text-white/80 transition hover:border-white/30 hover:text-white"
              >
                Sign in
              </Link>
            </>
          )}
        </div>

        {member ? (
          <p className="mt-8 text-sm text-white/40">Signed in as {member.name}.</p>
        ) : (
          <p className="mt-5 text-sm text-white/35">
            Joining is invite-only — you&apos;ll need a link from a member.
          </p>
        )}

        <div className="mx-auto mt-20 grid max-w-lg grid-cols-1 gap-6 text-left sm:grid-cols-3">
          <Step n="01" title="Get invited">
            A member sends you a one-time invite link.
          </Step>
          <Step n="02" title="Join the swarm">
            Add your name, role, and interests to the directory.
          </Step>
          <Step n="03" title="Bring others">
            Now you can invite people too. The network compounds.
          </Step>
        </div>
      </div>
    </main>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="text-xs font-semibold tracking-widest text-indigo-300/60">
        {n}
      </div>
      <div className="mt-2 text-sm font-semibold text-white">{title}</div>
      <p className="mt-1 text-sm leading-relaxed text-white/50">{children}</p>
    </div>
  );
}
