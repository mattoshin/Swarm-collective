"use client";

import { useActionState } from "react";
import { submitEnter, type EnterState } from "./actions";

export function EnterForm() {
  const [state, action, pending] = useActionState<EnterState, FormData>(
    submitEnter,
    {},
  );

  return (
    <form action={action} className="mt-6 space-y-4">
      <div>
        <label className="term-label" htmlFor="email">
          Email
        </label>
        <div className="relative">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-term-green"
          >
            &gt;
          </span>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoFocus
            className="term-input pl-7"
            placeholder="you@example.com"
          />
        </div>
      </div>

      {state.error ? (
        <p role="alert" className="term-error">
          {state.error}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className="term-btn w-full">
        {pending ? "Sending…" : "Email me a sign-in link"}
      </button>
      {state.success ? (
        <p role="status" className="term-success">
          {state.success}
        </p>
      ) : null}
    </form>
  );
}
