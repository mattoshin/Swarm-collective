import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Swarm Collective home"
      className={cn("inline-block font-heading leading-none text-term-green term-glow", className)}
    >
      SWARM<span aria-hidden className="term-cursor" />
    </Link>
  );
}

export function WindowBar({ title, className }: { title: string; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 border-b border-term-line px-4 py-2.5", className)}>
      <span aria-hidden className="flex gap-1.5">
        <span className="size-2.5 bg-term-green/80" />
        <span className="size-2.5 bg-term-green/45" />
        <span className="size-2.5 bg-term-green/20" />
      </span>
      <span className="truncate text-xs text-term-muted">{title}</span>
    </div>
  );
}

export function TerminalWindow({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("term-panel", className)}>
      <WindowBar title={title} />
      <div className="p-6 sm:p-8">{children}</div>
    </section>
  );
}

export function AuthShell({
  windowTitle,
  wide = false,
  children,
}: {
  windowTitle: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-5 py-14">
      <div className={cn("w-full", wide ? "max-w-2xl" : "max-w-md")}>
        <header className="mb-8 text-center">
          <Wordmark className="text-7xl sm:text-8xl" />
          <p className="mt-3 text-xs uppercase tracking-[.2em] text-term-muted">
            Build in the open.
          </p>
        </header>
        <TerminalWindow title={windowTitle}>{children}</TerminalWindow>
      </div>
    </main>
  );
}

export function PageHeader({
  command,
  title,
  meta,
}: {
  command: string;
  title: string;
  meta?: string;
}) {
  return (
    <div>
      <p className="text-xs text-term-green">
        <span aria-hidden>&gt; </span>
        {command}
      </p>
      <h1 className="mt-2 font-heading text-5xl leading-none text-term-text sm:text-6xl">{title}</h1>
      {meta ? <p className="mt-2 text-sm text-term-muted">{meta}</p> : null}
    </div>
  );
}

export function BootLog({ lines, className }: { lines: string[]; className?: string }) {
  return (
    <div className={cn("term-boot space-y-1 text-xs text-term-muted sm:text-sm", className)}>
      {lines.map((line, i) => (
        <p key={line} style={{ "--i": i } as CSSProperties}>
          <span aria-hidden className="text-term-green">
            &gt;{" "}
          </span>
          {line}
        </p>
      ))}
    </div>
  );
}
