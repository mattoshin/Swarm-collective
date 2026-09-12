import { redirect } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { PageHeader } from "@/components/terminal";
import { getCollaborateDoc } from "@/lib/collaborate";
import { getCurrentMember } from "@/lib/session";
import { DocEditor } from "./doc-editor";

export default async function CollaboratePage() {
  const member = await getCurrentMember();
  if (!member) redirect("/enter");

  const doc = await getCollaborateDoc();
  const lastEdited = doc.updatedByName
    ? `Last edited by ${doc.updatedByName} · ${new Date(doc.updatedAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })}`
    : "Nobody's written anything yet.";

  return (
    <>
      <AppNav />
      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-10 sm:px-8">
        <PageHeader
          command="vim ./collaborate"
          title="Collaborate"
          meta={`One shared space, editable by every member. ${lastEdited}`}
        />
        <div className="mt-8">
          <DocEditor content={doc.content} />
        </div>
      </main>
    </>
  );
}
