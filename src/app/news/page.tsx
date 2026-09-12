import { redirect } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { PageHeader } from "@/components/terminal";
import { listDigests } from "@/lib/news";
import { getCurrentMember } from "@/lib/session";

export default async function NewsPage() {
  const member = await getCurrentMember();
  if (!member) redirect("/enter");

  const digests = await listDigests();

  return (
    <>
      <AppNav />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:px-8">
        <PageHeader
          command="tail -f ./news"
          title="News"
          meta="An agent scans the web daily and curates what matters to builders. Also emailed each morning."
        />

        <div className="mt-8 space-y-10">
          {digests.length ? (
            digests.map((digest) => (
              <section key={digest.digestDate}>
                <p className="text-xs uppercase tracking-[.14em] text-term-green">
                  {new Date(`${digest.digestDate}T00:00:00`).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <div className="mt-4 divide-y divide-term-line border border-term-line">
                  {digest.items.map((item, i) => (
                    <article key={i} className="p-5 sm:p-6">
                      <p className="text-[11px] uppercase tracking-[.1em] text-term-green">
                        {item.category}
                      </p>
                      <h2 className="mt-1 font-heading text-2xl leading-none text-term-text">
                        {item.headline}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-term-muted">{item.summary}</p>
                      {item.source_url ? (
                        <a
                          href={item.source_url}
                          target="_blank"
                          rel="noreferrer"
                          className="term-link mt-2 inline-block text-xs"
                        >
                          Read more →
                        </a>
                      ) : null}
                    </article>
                  ))}
                </div>
              </section>
            ))
          ) : (
            <p className="term-panel p-6 text-sm text-term-muted">
              <span aria-hidden className="text-term-green">
                &gt;{" "}
              </span>
              No digest yet. The first one lands with tomorrow&apos;s run.
            </p>
          )}
        </div>
      </main>
    </>
  );
}
