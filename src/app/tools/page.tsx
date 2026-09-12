import { redirect } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { PageHeader } from "@/components/terminal";
import { listTools } from "@/lib/tools";
import { getCurrentMember } from "@/lib/session";
import { cn } from "@/lib/utils";
import { AddToolForm } from "./add-tool-form";
import { voteToolAction } from "./actions";

export default async function ToolsPage() {
  const member = await getCurrentMember();
  if (!member) redirect("/enter");

  const tools = await listTools(member.id);

  return (
    <>
      <AppNav member={member} />
      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-10 sm:px-8">
        <PageHeader
          command="ls ./tools"
          title="Tools"
          meta="What the room actually uses, ranked by the room."
        />

        <div className="mt-8">
          <AddToolForm />
        </div>

        <div className="mt-6 divide-y divide-term-line border border-term-line">
          {tools.length ? (
            tools.map((tool) => (
              <article key={tool.id} className="flex gap-4 p-5 sm:p-6">
                <div className="flex shrink-0 flex-col items-center gap-1">
                  <form action={voteToolAction.bind(null, tool.id, 1)}>
                    <button
                      type="submit"
                      aria-label="Upvote"
                      aria-pressed={tool.myVote === 1}
                      className={cn(
                        "flex size-7 items-center justify-center border text-sm",
                        tool.myVote === 1
                          ? "border-term-green bg-term-green text-term-ink"
                          : "border-term-line text-term-muted hover:border-term-green hover:text-term-green",
                      )}
                    >
                      ▲
                    </button>
                  </form>
                  <span className="text-sm font-bold text-term-text">{tool.score}</span>
                  <form action={voteToolAction.bind(null, tool.id, -1)}>
                    <button
                      type="submit"
                      aria-label="Downvote"
                      aria-pressed={tool.myVote === -1}
                      className={cn(
                        "flex size-7 items-center justify-center border text-sm",
                        tool.myVote === -1
                          ? "border-term-red bg-term-red text-term-ink"
                          : "border-term-line text-term-muted hover:border-term-red hover:text-term-red",
                      )}
                    >
                      ▼
                    </button>
                  </form>
                </div>
                <div className="min-w-0">
                  <h2 className="font-heading text-2xl leading-none text-term-text">{tool.name}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-term-muted">{tool.description}</p>
                  <p className="mt-3 text-xs text-term-muted/70">Added by {tool.added_by_name}</p>
                </div>
              </article>
            ))
          ) : (
            <p className="p-6 text-sm text-term-muted">
              <span aria-hidden className="text-term-green">
                &gt;{" "}
              </span>
              No tools yet. Add the first one.
            </p>
          )}
        </div>
      </main>
    </>
  );
}
