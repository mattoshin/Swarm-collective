"use client";

import { useActionState } from "react";
import { submitJoin, type JoinState } from "./actions";

const fieldClass = "term-input";
const labelClass = "term-label";

export function JoinForm({ code }: { code: string }) {
  const [state, action, pending] = useActionState<JoinState, FormData>(
    submitJoin,
    {},
  );

  if (state.success)
    return (
      <div role="status" className="term-success mt-8">
        {state.success}
      </div>
    );

  return (
    <form action={action} className="mt-8 space-y-4">
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
        <Field id="instagram_url" label="Instagram" placeholder="@handle" />
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
        <p role="alert" className="term-error">
          {state.error}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className="term-btn w-full">
        {pending ? "Joining…" : "Join the swarm"}
      </button>
    </form>
  );
}

function Field({id,label,placeholder,type="text"}:{id:string;label:string;placeholder:string;type?:string}){return <div><label className={labelClass} htmlFor={id}>{label}</label><input id={id} name={id} type={type} className={fieldClass} placeholder={placeholder}/></div>}
function TextArea({id,label,placeholder}:{id:string;label:string;placeholder:string}){return <div><label className={labelClass} htmlFor={id}>{label}</label><textarea id={id} name={id} rows={3} className={fieldClass} placeholder={placeholder}/></div>}
