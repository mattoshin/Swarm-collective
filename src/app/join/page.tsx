import Link from "next/link";
import { redirect } from "next/navigation";
import { getInviteByCode, getMemberById } from "@/lib/members";
import { getCurrentMember } from "@/lib/session";
import { JoinForm } from "./join-form";

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const member = await getCurrentMember();
  if (member) redirect("/directory");

  const { code } = await searchParams;

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
        {await renderBody(code)}
      </div>
    </main>
  );
}

async function renderBody(code: string | undefined) {
  if (!code) {
    return (
      <>
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Join Swarm Collective
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-white/50">
          The swarm is invite-only. If a member sent you an invite link, open it
          to join — or paste your invite code below.
        </p>

        <form method="get" action="/join" className="mt-6 flex items-center gap-2">
          <input
            name="code"
            required
            placeholder="Paste invite code"
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-indigo-400/60 focus:bg-white/[0.05]"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Continue
          </button>
        </form>

        <p className="mt-6 text-sm text-white/40">
          Already a member?{" "}
          <Link className="text-indigo-300 hover:text-indigo-200" href="/enter">
            Sign in
          </Link>
          .
        </p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm text-white/40 transition hover:text-white/70"
        >
          ← Back home
        </Link>
      </>
    );
  }

  const invite = await getInviteByCode(code);
  if (!invite) {
    return <Notice title="Invite not found">
      This invite link isn&apos;t valid. Double-check it with whoever sent it.
    </Notice>;
  }
  if (invite.accepted_by) {
    return <Notice title="Invite already used">
      This invite has already been redeemed. If that was you,{" "}
      <Link className="text-indigo-300 hover:text-indigo-200" href="/enter">
        sign in
      </Link>{" "}
      instead.
    </Notice>;
  }

  const inviter = await getMemberById(invite.inviter_id);

  return (
    <>
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-indigo-300/70">
        You&apos;re invited
      </p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white">
        Join Swarm Collective
      </h1>
      <p className="mt-2 text-sm text-white/50">
        {inviter ? `${inviter.name} invited you in.` : "Your invite is valid."}{" "}
        Add your details to unlock the directory.
      </p>
      <JoinForm code={code} />
    </>
  );
}

function Notice({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-white">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-white/50">{children}</p>
      <Link
        href="/"
        className="mt-6 inline-block text-sm text-white/40 transition hover:text-white/70"
      >
        ← Back home
      </Link>
    </>
  );
}
