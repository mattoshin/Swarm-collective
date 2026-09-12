import { signOutAction } from "@/app/directory/actions";
import { listInvitesFor, type Member } from "@/lib/members";
import { InviteDialog } from "./invite-dialog";
import { NavTabs } from "./nav-tabs";
import { Wordmark } from "./terminal";

export async function AppNav({ member }: { member: Member }) {
  const invites = await listInvitesFor(member.id);

  return (
    <header className="sticky top-0 z-30 border-b border-term-line bg-term-bg/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-5 py-3 sm:px-8">
        <Wordmark className="text-4xl" />
        <NavTabs />
        <div className="ml-auto flex items-center gap-2">
          <InviteDialog invites={invites} />
          <form action={signOutAction}>
            <button type="submit" className="term-btn-ghost h-9 px-3">
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
