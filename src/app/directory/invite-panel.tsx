"use client";

import { useActionState, useState } from "react";
import type { Invite } from "@/lib/members";
import { createInviteAction, type CreateInviteState } from "./actions";

function inviteUrl(code: string): string {
  if (typeof window === "undefined") return `/join?code=${code}`;
  return `${window.location.origin}/join?code=${code}`;
}

export function InvitePanel({ invites }: { invites: Invite[] }) {
  const [state, action, pending] = useActionState<CreateInviteState, FormData>(
    createInviteAction,
    {},
  );

  const activeCount = invites.filter((i) => new Date(i.expires_at) > new Date()).length;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-white">Bring someone in</h2>
          <p className="mt-1 text-sm text-white/50">
            Generate a link and share it however you like. It works for 6
            months and everyone who joins through it lands in the directory
            under you.
          </p>
        </div>
        <form action={action}>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-10 items-center justify-center rounded-full bg-amber-300 px-5 text-sm font-semibold text-black transition hover:bg-amber-200 disabled:opacity-60"
          >
            {pending ? "Creating…" : "Create invite link"}
          </button>
        </form>
      </div>

      {state.error ? (
        <p className="mt-4 rounded-lg border border-red-400/20 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-200">
          {state.error}
        </p>
      ) : null}

      {state.code ? <FreshInvite code={state.code} /> : null}

      {invites.length > 0 ? (
        <div className="mt-6">
          <div className="mb-2 text-xs font-medium uppercase tracking-wider text-white/40">
            Your invites · {activeCount} active
          </div>
          <ul className="divide-y divide-white/5 rounded-lg border border-white/10">
            {invites.map((invite) => (
              <InviteRow key={invite.id} invite={invite} />
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function FreshInvite({ code }: { code: string }) {
  const url = inviteUrl(code);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mt-4 rounded-lg border border-amber-300/30 bg-amber-300/10 p-3">
      <div className="text-xs font-medium text-amber-200/80">
        New invite link — good for 6 months, anyone can use it
      </div>
      <div className="mt-2 flex items-center gap-2">
        <input
          readOnly
          value={url}
          className="w-full truncate rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/80 outline-none"
        />
        <button
          type="button"
          onClick={copy}
          className="shrink-0 rounded-md bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

function InviteRow({ invite }: { invite: Invite }) {
  const url = inviteUrl(invite.code);
  const expired = new Date(invite.expires_at) < new Date();
  const joinedLabel =
    invite.redemption_count === 0
      ? "No one yet"
      : `${invite.redemption_count} joined`;

  return (
    <li className="flex items-center justify-between gap-3 px-3.5 py-2.5 text-sm">
      <span className="truncate font-mono text-xs text-white/50">{url}</span>
      <div className="flex shrink-0 items-center gap-2">
        <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white/60">
          {joinedLabel}
        </span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            expired
              ? "bg-red-500/15 text-red-300"
              : "bg-emerald-500/15 text-emerald-300"
          }`}
        >
          {expired ? "Expired" : "Active"}
        </span>
      </div>
    </li>
  );
}
