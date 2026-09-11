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

  if (state.success) return <div className="mt-8 rounded-xl border-2 border-black bg-[#fff3a3] p-5 text-sm font-bold leading-relaxed text-black">{state.success}</div>;

  return (
    <form action={action} className="mt-8 space-y-4 text-left">
      <input type="hidden" name="code" value={code} />

      <div>
        <label className={labelClass} htmlFor="name">
          Full name
        </label>
        <input id="name" name="name" required className={fieldClass} placeholder="Jane Rivera" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field id="phone" label="Phone" placeholder="(212) 555-0123" type="tel" />
        <Field id="location" label="Location" placeholder="New York, NY" />
        <Field id="company" label="Company" placeholder="Company or project" />
        <Field id="college" label="College" placeholder="University" />
        <Field id="linkedin_url" label="LinkedIn" placeholder="https://linkedin.com/in/..." type="url" />
        <Field id="website_url" label="Website" placeholder="https://..." type="url" />
      </div>

      <TextArea id="bio" label="Short bio" placeholder="What are you building, learning, or looking for?" />
      <TextArea id="public_notes" label="Anything else to share" placeholder="What should another member ask you about?" />

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

function Field({id,label,placeholder,type="text"}:{id:string;label:string;placeholder:string;type?:string}){return <div><label className={labelClass} htmlFor={id}>{label}</label><input id={id} name={id} type={type} className={fieldClass} placeholder={placeholder}/></div>}
function TextArea({id,label,placeholder}:{id:string;label:string;placeholder:string}){return <div><label className={labelClass} htmlFor={id}>{label}</label><textarea id={id} name={id} rows={3} className={fieldClass} placeholder={placeholder}/></div>}
