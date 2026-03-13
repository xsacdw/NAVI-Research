"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/header";
import { useLocale } from "@/components/locale-provider";
import { sessions, sessionDetails } from "@/lib/data";

export function ReadClient({ id }: { id: string }) {
  const { locale, t } = useLocale();
  const session = sessionDetails[id] || sessions.find((s) => s.id === id);
  if (!session) notFound();

  const loc = session[locale];

  return (
    <div className="min-h-screen bg-background">
      <Header showBack />

      <article className="mx-auto max-w-3xl px-4 py-10">
        <header className="mb-10 border-b pb-8">
          <h1 className="mb-2 text-3xl font-bold leading-tight tracking-tight">
            {loc.title}
          </h1>
          {loc.subtitle && (
            <p className="mb-4 text-lg text-muted-foreground">
              {loc.subtitle}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>📅 {session.date}</span>
            <Separator orientation="vertical" className="h-4" />
            <span>{session.words.toLocaleString()} {t.words}</span>
            <Separator orientation="vertical" className="h-4" />
            <span>📚 {session.citations} {t.citations}</span>
            <Separator orientation="vertical" className="h-4" />
            <Badge
              className={
                session.ptcs >= 80
                  ? "bg-green-500/15 text-green-400"
                  : "bg-amber-500/15 text-amber-400"
              }
            >
              PTCS {session.ptcs}%
            </Badge>
            <Badge variant="secondary">{session.type}</Badge>
          </div>
        </header>

        <blockquote className="mb-10 rounded-r-lg border-l-4 border-indigo-500 bg-indigo-500/5 px-5 py-4 text-sm italic text-muted-foreground">
          {loc.abstract}
        </blockquote>

        <div className="prose-custom space-y-8">
          {loc.sections?.map((sec, i) => (
            <section key={i}>
              <h2 className="mb-4 border-b pb-2 text-xl font-semibold tracking-tight">
                {sec.heading}
              </h2>
              {sec.content.split("\n\n").map((paragraph, j) => (
                <p key={j} className="mb-4 text-[15px] leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
              {loc.figures
                ?.filter((f) => f.afterSection === i)
                .map((fig, fi) => (
                  <figure key={fi} className="my-8">
                    <div className="overflow-hidden rounded-lg border bg-card">
                      <img src={fig.src} alt={fig.caption} className="w-full" />
                    </div>
                    <figcaption className="mt-2 text-center text-sm italic text-muted-foreground">
                      {fig.caption}
                    </figcaption>
                  </figure>
                ))}
            </section>
          ))}
        </div>

        {(loc.references?.length ?? 0) > 0 && (
          <section className="mt-12 border-t pt-8">
            <h2 className="mb-4 text-lg font-semibold">{t.references}</h2>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
              {loc.references?.map((ref, i) => (
                <li key={i} className="leading-relaxed">{ref}</li>
              ))}
            </ol>
          </section>
        )}

        <div className="mt-16 flex justify-center">
          <Link
            href="/"
            className="rounded-md border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-indigo-500 hover:text-indigo-400"
          >
            {t.backToListFull}
          </Link>
        </div>
      </article>
    </div>
  );
}
