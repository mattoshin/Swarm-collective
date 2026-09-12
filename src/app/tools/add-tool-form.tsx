"use client";

import { useActionState } from "react";
import { addToolAction, type AddToolState } from "./actions";

export function AddToolForm() {
  const [state, action, pending] = useActionState<AddToolState, FormData>(addToolAction, {});

  return (
    <form action={action} className="term-panel space-y-4 p-6">
      <div>
        <label className="term-label" htmlFor="tool-name">
          Tool name
        </label>
        <input
          id="tool-name"
          name="name"
          required
          maxLength={120}
          placeholder="Claude Code"
          className="term-input"
        />
      </div>
      <div>
        <label className="term-label" htmlFor="tool-description">
          What it is, and how to use it
        </label>
        <textarea
          id="tool-description"
          name="description"
          required
          rows={3}
          maxLength={2000}
          placeholder="What you use it for, and one tip for getting started."
          className="term-input"
        />
      </div>
      {state.error ? (
        <p role="alert" className="term-error">
          {state.error}
        </p>
      ) : null}
      <button type="submit" disabled={pending} className="term-btn w-full sm:w-auto">
        {pending ? "Adding…" : "Add tool"}
      </button>
    </form>
  );
}
