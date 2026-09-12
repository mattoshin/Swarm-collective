import { redirect } from "next/navigation";
import { AuthShell } from "@/components/terminal";
import { getCurrentMember } from "@/lib/session";
import { dismissBookmark } from "./actions";

const SHORTCUTS = [
  ["Mac", "press ⌘ D"],
  ["Windows", "press Ctrl D"],
  ["Mobile", "Share → Add to Home Screen"],
] as const;

export default async function Welcome() {
  const member = await getCurrentMember();
  if (!member) redirect("/enter");
  if (member.bookmark_prompt_seen) redirect("/directory");

  return (
    <AuthShell windowTitle="swarm@network:~$ bookmark --add">
      <p className="text-xs uppercase tracking-[.2em] text-term-green">One small thing</p>
      <h1 className="mt-3 font-heading text-5xl leading-none text-term-text">
        Keep Swarm within reach.
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-term-muted">
        Save this private community home so it doesn’t disappear into the group chat.
      </p>
      <dl className="mt-6 grid gap-2 text-sm">
        {SHORTCUTS.map(([device, keys]) => (
          <div key={device} className="flex items-center justify-between gap-4 border border-term-line px-3 py-2.5">
            <dt className="text-term-muted">{device}</dt>
            <dd className="text-right text-term-green">{keys}</dd>
          </div>
        ))}
      </dl>
      <form action={dismissBookmark} className="mt-6">
        <button className="term-btn w-full">I saved it</button>
        <button className="mt-3 w-full text-xs text-term-muted transition-colors hover:text-term-green">
          Skip for now
        </button>
      </form>
    </AuthShell>
  );
}
