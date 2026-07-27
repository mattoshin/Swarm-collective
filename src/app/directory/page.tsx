import { redirect } from "next/navigation";
import { listDirectory, listInvitesFor } from "@/lib/members";
import { getCurrentMember } from "@/lib/session";
import { signOutAction } from "./actions";
import { InvitePanel } from "./invite-panel";

export default async function DirectoryPage() {
  const member = await getCurrentMember();
  if (!member) redirect("/enter");

  const [rows, invites] = await Promise.all([
    listDirectory(),
    listInvitesFor(member.id),
  ]);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-indigo-300/70">
            The swarm
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
            Directory
          </h1>
          <p className="mt-1 text-sm text-white/50">
            {rows.length} {rows.length === 1 ? "member" : "members"} · signed in
            as {member.name}
          </p>
        </div>
        <form action={signOutAction}>
          <button
            type="submit"
            className="h-9 rounded-full border border-white/15 px-4 text-sm text-white/70 transition hover:border-white/30 hover:text-white"
          >
            Sign out
          </button>
        </form>
      </div>

      <div className="mt-8">
        <InvitePanel invites={invites} />
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-white/40">
                <Th>Name</Th>
                <Th>Career title</Th>
                <Th>Interests</Th>
                <Th>Email</Th>
                <Th>Invited by</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const isSelf = row.id === member.id;
                return (
                  <tr
                    key={row.id}
                    className={`border-b border-white/5 last:border-0 ${
                      isSelf ? "bg-indigo-500/[0.06]" : ""
                    }`}
                  >
                    <Td>
                      <span className="font-medium text-white">{row.name}</span>
                      {isSelf ? (
                        <span className="ml-2 rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs text-indigo-200">
                          You
                        </span>
                      ) : null}
                    </Td>
                    <Td>{row.career_title ?? "—"}</Td>
                    <Td>{row.interests ?? "—"}</Td>
                    <Td>
                      <a
                        href={`mailto:${row.email}`}
                        className="text-indigo-300 transition hover:text-indigo-200"
                      >
                        {row.email}
                      </a>
                    </Td>
                    <Td>{row.invited_by_name ?? "—"}</Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 font-medium">{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 align-middle text-white/70">{children}</td>;
}
