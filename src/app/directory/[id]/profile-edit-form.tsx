"use client";

import { useActionState } from "react";
import type { Member } from "@/lib/members";
import { updateProfileAction, type UpdateProfileState } from "./actions";

const fieldClass = "term-input";
const labelClass = "term-label";

export function ProfileEditForm({ member }: { member: Member }) {
  const action = updateProfileAction.bind(null, member.id);
  const [state, formAction, pending] = useActionState<UpdateProfileState, FormData>(action, {});

  return (
    <form action={formAction} className="term-panel space-y-4 p-6 sm:p-8">
      <div>
        <label className={labelClass} htmlFor="name">
          Full name
        </label>
        <input id="name" name="name" required defaultValue={member.name} className={fieldClass} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field id="career_title" label="Career title" defaultValue={member.career_title} />
        <Field id="company" label="Company" defaultValue={member.company} />
        <Field id="college" label="College" defaultValue={member.college} />
        <Field id="location" label="Location" defaultValue={member.location} />
        <Field id="phone" label="Phone" type="tel" defaultValue={member.phone} />
        <Field id="linkedin_url" label="LinkedIn" type="url" defaultValue={member.linkedin_url} />
        <Field id="website_url" label="Website" type="url" defaultValue={member.website_url} />
        <Field id="instagram_url" label="Instagram" defaultValue={member.instagram_url} />
      </div>

      <div>
        <label className={labelClass} htmlFor="interests">
          Interests
        </label>
        <input
          id="interests"
          name="interests"
          defaultValue={member.interests ?? ""}
          className={fieldClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="bio">
          Short bio
        </label>
        <textarea id="bio" name="bio" rows={3} defaultValue={member.bio ?? ""} className={fieldClass} />
      </div>

      <div>
        <label className={labelClass} htmlFor="public_notes">
          Anything else to share
        </label>
        <textarea
          id="public_notes"
          name="public_notes"
          rows={2}
          defaultValue={member.public_notes ?? ""}
          className={fieldClass}
        />
      </div>

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
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  defaultValue,
  type = "text",
}: {
  id: string;
  label: string;
  defaultValue: string | null;
  type?: string;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <input id={id} name={id} type={type} defaultValue={defaultValue ?? ""} className={fieldClass} />
    </div>
  );
}
