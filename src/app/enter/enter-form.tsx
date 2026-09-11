"use client";

import { useActionState } from "react";
import { submitEnter, type EnterState } from "./actions";

export function EnterForm() {
  const [state, action, pending] = useActionState<EnterState, FormData>(
    submitEnter,
    {},
  );

  return (
    <form action={action} className="mt-6 space-y-4 text-left">
      <div>
        <label className="mb-1.5 block text-xs font-medium text-white/60" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoFocus
          className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-indigo-400/60 focus:bg-white/[0.05]"
          placeholder="you@example.com"
        />
      </div>

      {state.error ? (
        <p className="rounded-lg border border-red-400/20 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-200">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 w-full items-center justify-center rounded-full bg-white text-sm font-semibold text-black transition hover:bg-white/90 disabled:opacity-60"
      >
          {pending ? "Sending…" : "Email me a sign-in link"}
      </button>
      {state.success ? <p className="rounded-lg border-2 border-black bg-[#fff3a3] px-3.5 py-2.5 text-sm font-bold text-black">{state.success}</p> : null}
    </form>
  );
}
