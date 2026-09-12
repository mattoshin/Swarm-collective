import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/terminal";
import { getCurrentMember } from "@/lib/session";
import { EnterForm } from "./enter-form";

export default async function EnterPage() {
  const member = await getCurrentMember();
  if (member) redirect("/directory");

  return (
    <AuthShell windowTitle="swarm@network:~$ login">
      <h1 className="font-heading text-5xl leading-none text-term-text">Welcome back</h1>
      <p className="mt-3 text-sm text-term-muted">
        No password. We’ll email you a secure, one-time link.
      </p>
      <EnterForm />
      <div className="mt-6 space-y-3 border-t border-term-line pt-4 text-xs text-term-muted">
        <p>Not a member yet? You&apos;ll need an invite link from someone inside.</p>
        <Link href="/" className="term-link">
          ← Back home
        </Link>
      </div>
    </AuthShell>
  );
}
