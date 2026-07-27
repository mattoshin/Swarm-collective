"use client";

import { useActionState } from "react";
import { submitJoin, type JoinState } from "./actions";

const fieldClass =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-indigo-400/60 focus:bg-white/[0.05]";
const labelClass = "mb-1.5 block text-xs font-medium text-white/60";

export function JoinForm({ code }: { code: string }) {
  const [state, action, pending] = useActionState<JoinState, FormData>(
    submitJoin,
    {},
  );

  return (
    <form action={action} className="mt-8 space-y-4 text-left">
      <input type="hidden" name="code" value={code} />

      <div>
        <label className={labelClass} htmlFor="name">
          Full name
        </label>
        <input id="name" name="name" required className={fieldClass} placeholder="Jane Rivera" />
      </div>

      <div>
        <label className={labelClass} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className={fieldClass}
          placeholder="jane@example.com"
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="career_title">
          Career title
        </label>
        <input
          id="career_title"
          name="career_title"
          className={fieldClass}
          placeholder="Product Designer"
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="interests">
          Interests
        </label>
        <input
          id="interests"
          name="interests"
          className={fieldClass}
          placeholder="Type design, climbing, generative art"
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
        {pending ? "Joining…" : "Join the swarm"}
      </button>
    </form>
  );
}
