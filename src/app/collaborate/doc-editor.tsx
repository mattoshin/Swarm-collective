"use client";

import { useActionState } from "react";
import { saveDocAction, type SaveDocState } from "./actions";

export function DocEditor({ content }: { content: string }) {
  const [state, action, pending] = useActionState<SaveDocState, FormData>(saveDocAction, {});

  return (
    <form action={action} className="term-panel space-y-4 p-6 sm:p-8">
      <label className="sr-only" htmlFor="content">
        Shared notes
      </label>
      <textarea
        id="content"
        name="content"
        rows={20}
        defaultValue={content}
        placeholder="Drop shared notes, links, and running lists here. Anyone can edit."
        className="term-input min-h-[50vh] font-mono leading-relaxed"
      />

      {state.error ? (
        <p role="alert" className="term-error">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p role="status" className="term-success">
          {state.success}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className="term-btn w-full sm:w-auto">
        {pending ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
