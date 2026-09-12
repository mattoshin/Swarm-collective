import Link from "next/link";
import { redirect } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { PageHeader } from "@/components/terminal";
import { getMemberById } from "@/lib/members";
import { getCurrentMember } from "@/lib/session";
import { ProfileEditForm } from "../profile-edit-form";

export default async function EditProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const actor = await getCurrentMember();
  if (!actor) redirect("/enter");

  const { id } = await params;
  if (actor.id !== id) redirect(`/directory/${id}`);

  const member = await getMemberById(id);
  if (!member) redirect("/directory");

  return (
    <>
      <AppNav />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:px-8">
        <Link href={`/directory/${member.id}`} className="term-link text-xs">
          ← Back to profile
        </Link>
        <div className="mt-4">
          <PageHeader command="vim ./profile" title="Edit your info" />
        </div>
        <div className="mt-8">
          <ProfileEditForm member={member} />
        </div>
      </main>
    </>
  );
}
