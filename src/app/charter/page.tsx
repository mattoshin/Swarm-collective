import { redirect } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { PageHeader } from "@/components/terminal";
import { getCurrentMember } from "@/lib/session";

const ARTICLES: { title: string; body: React.ReactNode }[] = [
  {
    title: "Who we are",
    body: (
      <>
        <p>
          A working community of AI-native professionals. Early-career, and AI is core to
          what you do: shipping it, evaluating it, getting pitched it, figuring it out in
          real time.
        </p>
        <p className="mt-3">
          You want sharper peers, not louder feeds. You show up, you share, you pay it
          forward. No fees. Show up because you want to.
        </p>
      </>
    ),
  },
  {
    title: "How it started",
    body: (
      <p>
        Three of us got a room together: Ian, Max, Matthew. That&apos;s the whole founding
        story. Leadership isn&apos;t fixed here. Anyone can pick something up and run with
        it. We started it. You shape it.
      </p>
    ),
  },
  {
    title: "Why it exists",
    body: (
      <p>
        AI moves too fast to track alone. The best way to learn is still the oldest one:
        talking to people doing the real work, about what&apos;s actually working and what
        isn&apos;t. Not another feed, not another newsletter. A room.
      </p>
    ),
  },
  {
    title: "How it runs",
    body: (
      <p>
        Weekly, roughly 30 minutes structured plus open floor after. Someone demos a tool
        or shares what they built. Group projects when something&apos;s worth building
        together. Periodic meetups in New York, mixed in with the actual conversation.
      </p>
    ),
  },
  {
    title: "How it grows",
    body: (
      <p>
        Slow, on purpose. Each member brings in people they&apos;d genuinely want in the
        room, not just anyone. Quality over headcount: add one person you&apos;d vouch
        for, not ten you wouldn&apos;t.
      </p>
    ),
  },
  {
    title: "The culture",
    body: (
      <ul className="list-none space-y-2">
        {[
          "Show the real version of what you tried, not the LinkedIn version.",
          "Honest takes on tools beat hype, every time.",
          "Low ego. What you bring to the room matters more than your title.",
          "No hard commitments. Show up when you can, skip when you can't.",
        ].map((line) => (
          <li key={line} className="flex gap-2">
            <span aria-hidden className="text-term-green">
              &gt;
            </span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    title: "The long game",
    body: (
      <p>
        Every industry is going to need someone who actually gets AI. Swarm is where that
        person gets sharper: a network for the people who end up being that person inside
        their own company, not a chat that goes quiet after a month.
      </p>
    ),
  },
];

export default async function CharterPage() {
  const member = await getCurrentMember();
  if (!member) redirect("/enter");

  return (
    <>
      <AppNav member={member} />
      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-10 sm:px-8">
        <PageHeader
          command="cat ./the-charter"
          title="The Charter"
          meta="Why Swarm exists, and how it runs. Founded by Ian, Max, and Matthew."
        />

        <div className="mt-8 divide-y divide-term-line border border-term-line">
          {ARTICLES.map((article, i) => (
            <article key={article.title} className="grid gap-4 p-6 sm:grid-cols-[auto_1fr] sm:gap-8 sm:p-8">
              <div className="flex items-start gap-3 sm:block sm:w-40">
                <span className="text-xs text-term-green">
                  [{String(i + 1).padStart(2, "0")}]
                </span>
                <h2 className="font-heading text-2xl leading-none text-term-text sm:mt-2 sm:text-3xl">
                  {article.title}
                </h2>
              </div>
              <div className="text-sm leading-relaxed text-term-muted">{article.body}</div>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
