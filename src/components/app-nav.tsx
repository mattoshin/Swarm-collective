import { signOutAction } from "@/app/directory/actions";
import { InviteDialog } from "./invite-dialog";
import { NavTabs } from "./nav-tabs";
import { SwarmLogo } from "./swarm-logo";
import { Wordmark } from "./terminal";

export function AppNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-term-line bg-term-bg/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-5 py-3 sm:px-8">
        <div className="flex items-center gap-2">
          <SwarmLogo className="h-7 w-7 text-term-green drop-shadow-[0_0_6px_rgba(0,255,65,0.55)]" />
          <Wordmark className="text-4xl" />
        </div>
        <NavTabs />
        <div className="ml-auto flex items-center gap-2">
          <InviteDialog />
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
