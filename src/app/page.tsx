import Link from "next/link";
import { getCurrentMember } from "@/lib/session";

export default async function Home() {
  const member = await getCurrentMember();
  return <main className="swarm-grid min-h-screen px-5 py-5 sm:px-8 sm:py-7">
    <nav className="mx-auto flex max-w-7xl items-center justify-between border-b-2 border-black pb-5">
      <Link href="/" className="text-sm font-black uppercase tracking-[.24em]">Swarm Collective</Link>
      <div className="flex items-center gap-2">
        <span className="hidden text-xs font-semibold uppercase tracking-[.18em] sm:block">AI-native · NYC + everywhere</span>
        <Link href={member?"/directory":"/enter"} className="rounded-full bg-black px-5 py-2.5 text-sm font-bold text-[#ffd400]">{member?"Enter Swarm":"Member sign in"}</Link>
      </div>
    </nav>
    <section className="mx-auto grid max-w-7xl border-b-2 border-black py-12 lg:grid-cols-[1.4fr_.6fr] lg:py-20">
      <div><p className="text-xs font-black uppercase tracking-[.28em]">A working community, not a content feed</p><h1 className="mt-6 max-w-5xl text-[clamp(4.5rem,12vw,10rem)] font-black uppercase leading-[.76] tracking-[-.075em]">Build in<br/>the open.</h1><p className="mt-8 max-w-2xl text-xl font-medium leading-snug sm:text-2xl">Young people doing real work with AI. We share what works, build together, and bring one person we want in the room.</p></div>
      <div className="mt-10 flex flex-col justify-end border-t-2 border-black pt-6 lg:mt-0 lg:border-l-2 lg:border-t-0 lg:pl-8 lg:pt-0"><p className="text-6xl">✳</p><p className="mt-6 text-sm font-bold uppercase tracking-[.2em]">Free · optional · low ego</p><p className="mt-3 text-base leading-relaxed">Weekly rooms. Shared experiments. Group projects. Periodic meetups in New York.</p><Link href="/join" className="swarm-shadow mt-7 inline-flex w-fit border-2 border-black bg-[#fffdf2] px-6 py-4 font-black uppercase tracking-wide">I have an invite →</Link></div>
    </section>
    <section className="mx-auto grid max-w-7xl border-b-2 border-black md:grid-cols-3">
      <Pillar number="01" title="Show the work">Demo the weird thing you tried this week. Give people the useful version, not the polished LinkedIn version.</Pillar>
      <Pillar number="02" title="Build together">Ship small group projects to learn faster than any course, thread, or tutorial could teach you.</Pillar>
      <Pillar number="03" title="Grow with taste">Bring one motivated, curious person you would genuinely want contributing in the room.</Pillar>
    </section>
    <footer className="mx-auto flex max-w-7xl flex-col justify-between gap-6 py-8 text-sm font-bold uppercase tracking-[.15em] sm:flex-row"><span>Memory, agents, and what we’re building.</span><span>Est. 2026 · New York</span></footer>
  </main>;
}

function Pillar({number,title,children}:{number:string;title:string;children:React.ReactNode}) {
  return <article className="border-b-2 border-black py-8 md:border-b-0 md:border-r-2 md:px-7 md:first:pl-0 md:last:border-r-0"><span className="font-mono text-xs font-bold">{number}</span><h2 className="mt-8 text-3xl font-black uppercase tracking-[-.04em]">{title}</h2><p className="mt-4 max-w-sm leading-relaxed">{children}</p></article>;
}
