import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/terminal";
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
    <AuthShell
      windowTitle={code ? "swarm@network:~$ join --invite" : "swarm@network:~$ join"}
      wide={Boolean(code)}
    >
      {await renderBody(code)}
    </AuthShell>
  );
}

async function renderBody(code: string | undefined) {
  if (!code) {
    return (
      <>
        <h1 className="font-heading text-5xl leading-none text-term-text">
          Join Swarm Collective
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-term-muted">
          The swarm is invite-only. If a member sent you an invite link, open it to join — or
          paste your invite code below.
        </p>

        <form method="get" action="/join" className="mt-6 flex items-center gap-2">
          <label htmlFor="code" className="sr-only">
            Invite code
          </label>
          <input
            id="code"
            name="code"
            required
            placeholder="Paste invite code"
            className="term-input"
          />
          <button type="submit" className="term-btn shrink-0">
            Continue
          </button>
        </form>

        <div className="mt-6 space-y-3 border-t border-term-line pt-4 text-xs text-term-muted">
          <p>
            Already a member?{" "}
            <Link className="term-link" href="/enter">
              Sign in
            </Link>
            .
          </p>
          <Link href="/" className="term-link">
            ← Back home
          </Link>
        </div>
      </>
    );
  }

  const shared = process.env.SWARM_INVITE_TOKEN;
  const isShared = Boolean(shared && code === shared);
  const invite = isShared ? null : await getInviteByCode(code);
  if (!isShared && !invite) {
    return (
      <Notice title="Invite not found">
        This invite link isn&apos;t valid. Double-check it with whoever sent it.
      </Notice>
    );
  }
  if (invite && new Date(invite.expires_at) < new Date()) {
    return (
      <Notice title="Invite expired">
        This invite link has expired. Ask whoever sent it for a new one, or{" "}
        <Link className="term-link" href="/enter">
          sign in
        </Link>{" "}
        if you already joined.
      </Notice>
    );
  }

  const inviter = invite ? await getMemberById(invite.inviter_id) : null;

  return (
    <>
      <p className="text-xs uppercase tracking-[.2em] text-term-green">You&apos;re invited</p>
      <h1 className="mt-3 font-heading text-5xl leading-none text-term-text">
        Join Swarm Collective
      </h1>
      <p className="mt-3 text-sm text-term-muted">
        {inviter ? `${inviter.name} invited you in.` : "Your invite is valid."} Add your details
        to unlock the directory.
      </p>
      <JoinForm code={code} />
    </>
  );
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <h1 className="font-heading text-5xl leading-none text-term-text">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-term-muted">{children}</p>
      <Link href="/" className="term-link mt-6 inline-block text-xs">
        ← Back home
      </Link>
    </>
  );
}
