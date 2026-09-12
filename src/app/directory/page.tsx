import { redirect } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { PageHeader } from "@/components/terminal";
import { listDirectory } from "@/lib/members";
import { getCurrentMember } from "@/lib/session";

export default async function DirectoryPage() {
  const member = await getCurrentMember();
  if (!member) redirect("/enter");

  const rows = await listDirectory();

  return (
    <>
      <AppNav member={member} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8">
        <PageHeader
          command="ls ./members"
          title="Directory"
          meta={`${rows.length} ${rows.length === 1 ? "member" : "members"} · signed in as ${member.name}`}
        />

        <div className="term-panel mt-8 overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-term-line text-[11px] uppercase tracking-[.1em] text-term-muted">
                <Th>Name</Th>
                <Th>Career title</Th>
                <Th>Interests</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th>Location</Th>
                <Th>Invited by</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const isSelf = row.id === member.id;
                return (
                  <tr
                    key={row.id}
                    className={`border-b border-term-line/50 transition-colors last:border-0 hover:bg-term-green/[0.04] ${
                      isSelf ? "bg-term-green/[0.06]" : ""
                    }`}
                  >
                    <Td>
                      <span className="whitespace-nowrap font-bold text-term-text">{row.name}</span>
                      {isSelf ? (
                        <span className="ml-2 border border-term-green px-1.5 py-0.5 text-[10px] uppercase tracking-[.1em] text-term-green">
                          You
                        </span>
                      ) : null}
                    </Td>
                    <Td>{row.career_title ?? "—"}</Td>
                    <Td>{row.interests ?? "—"}</Td>
                    <Td>
                      <a href={`mailto:${row.email}`} className="text-term-green hover:underline">
                        {row.email}
                      </a>
                    </Td>
                    <Td>
                      {row.phone ? (
                        <a href={`tel:${row.phone}`} className="hover:text-term-green">
                          {row.phone}
                        </a>
                      ) : (
                        "—"
                      )}
                    </Td>
                    <Td>{row.location ?? "—"}</Td>
                    <Td>{row.invited_by_name ?? "—"}</Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 font-medium">{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 align-middle text-term-muted">{children}</td>;
}
