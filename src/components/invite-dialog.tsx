"use client";

import { useActionState, useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createInviteAction, type CreateInviteState } from "@/app/directory/actions";
import type { Invite } from "@/lib/members";
import { cn } from "@/lib/utils";
import { WindowBar } from "./terminal";

function inviteUrl(code: string): string {
  if (typeof window === "undefined") return `/join?code=${code}`;
  return `${window.location.origin}/join?code=${code}`;
}

export function InviteDialog({ invites }: { invites: Invite[] }) {
  const [state, action, pending] = useActionState<CreateInviteState, FormData>(
    createInviteAction,
    {},
  );

  const activeCount = invites.filter((i) => new Date(i.expires_at) > new Date()).length;

  return (
    <Dialog>
      <DialogTrigger className="term-btn h-9 px-4">
        <Plus className="size-4" aria-hidden />
        Invite
      </DialogTrigger>
      <DialogContent className="term-panel block p-0 text-term-text ring-0 sm:max-w-lg">
        <WindowBar title="swarm@network:~$ invite --create" className="pr-12" />
        <div className="space-y-5 p-6">
          <DialogHeader>
            <DialogTitle className="font-heading text-4xl font-normal leading-none text-term-green term-glow">
              Bring someone in
            </DialogTitle>
            <DialogDescription className="leading-relaxed text-term-muted">
              Generate a link and share it however you like. It works for 6 months and
              everyone who joins through it lands in the directory under you.
            </DialogDescription>
          </DialogHeader>

          <form action={action}>
            <button type="submit" disabled={pending} className="term-btn w-full">
              {pending ? "Creating…" : "Create invite link"}
            </button>
          </form>

          {state.error ? (
            <p role="alert" className="term-error">
              {state.error}
            </p>
          ) : null}

          {state.code ? <FreshInvite code={state.code} /> : null}

          {invites.length > 0 ? (
            <div>
              <p className="term-label">Your invites · {activeCount} active</p>
              <ul className="max-h-56 divide-y divide-term-line overflow-y-auto border border-term-line">
                {invites.map((invite) => (
                  <InviteRow key={invite.id} invite={invite} />
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FreshInvite({ code }: { code: string }) {
  const url = inviteUrl(code);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 1500);
    } catch {
      setCopyState("failed");
    }
  }

  return (
    <div className="term-success" role="status">
      <p className="text-xs uppercase tracking-[.1em] text-term-green">
        New invite link — good for 6 months, anyone can use it
      </p>
      <div className="mt-2 flex items-center gap-2">
        <input
          readOnly
          aria-label="Invite link"
          value={url}
          onFocus={(e) => e.currentTarget.select()}
          className="term-input truncate text-xs"
        />
        <button type="button" onClick={copy} className="term-btn h-10 shrink-0 px-3">
          {copyState === "copied" ? "Copied" : "Copy"}
        </button>
      </div>
      {copyState === "failed" ? (
        <p role="alert" className="mt-2 text-xs text-term-red">
          Couldn&apos;t copy automatically. Select the link above and copy it manually.
        </p>
      ) : null}
    </div>
  );
}

function InviteRow({ invite }: { invite: Invite }) {
  const url = inviteUrl(invite.code);
  const expired = new Date(invite.expires_at) < new Date();
  const joinedLabel =
    invite.redemption_count === 0 ? "No one yet" : `${invite.redemption_count} joined`;

  return (
    <li className="flex items-center justify-between gap-3 px-3 py-2 text-xs">
      <span className="truncate text-term-muted">{url}</span>
      <div className="flex shrink-0 items-center gap-2">
        <span className="border border-term-line px-2 py-0.5 text-term-muted">{joinedLabel}</span>
        <span
          className={cn(
            "border px-2 py-0.5",
            expired ? "border-term-red/50 text-term-red" : "border-term-green/50 text-term-green",
          )}
        >
          {expired ? "Expired" : "Active"}
        </span>
      </div>
    </li>
  );
}
