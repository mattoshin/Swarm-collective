import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/session";
import { EnterForm } from "./enter-form";

export default async function EnterPage() {
  const member = await getCurrentMember();
  if (member) redirect("/directory");

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-white/50">
          No password. We’ll email you a secure, one-time link.
        </p>
        <EnterForm />
        <p className="mt-6 text-sm text-white/40">
          Not a member yet? You&apos;ll need an invite link from someone inside.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm text-white/40 transition hover:text-white/70"
        >
          ← Back home
        </Link>
      </div>
    </main>
  );
}
