import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { sessions, sessionDetails } from "@/lib/data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ReadPage({ params }: PageProps) {
  const { id } = await params;
  const session = sessionDetails[id] || sessions.find((s) => s.id === id);
  if (!session) notFound();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧭</span>
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-lg font-bold text-transparent">
              NAVI Research
            </span>
          </div>
          <Link
            href="/"
            className="rounded-md border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-indigo-500 hover:text-indigo-400"
          >
            ← 목록으로
          </Link>
        </div>
      </header>

      {/* Article */}
      <article className="mx-auto max-w-3xl px-4 py-10">
        {/* Title */}
        <header className="mb-10 border-b pb-8">
          <h1 className="mb-2 text-3xl font-bold leading-tight tracking-tight">
            {session.title}
          </h1>
          {session.subtitle && (
            <p className="mb-4 text-lg text-muted-foreground">
              {session.subtitle}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>📅 {session.date}</span>
            <Separator orientation="vertical" className="h-4" />
            <span>{session.words.toLocaleString()} words</span>
            <Separator orientation="vertical" className="h-4" />
            <span>📚 {session.citations} citations</span>
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
            <Badge variant="outline">{session.lang}</Badge>
          </div>
        </header>

        {/* Abstract */}
        <blockquote className="mb-10 rounded-r-lg border-l-4 border-indigo-500 bg-indigo-500/5 px-5 py-4 text-sm italic text-muted-foreground">
          {session.abstract}
        </blockquote>

        {/* Sections */}
        <div className="prose-custom space-y-8">
          {session.sections?.map((sec, i) => (
            <section key={i}>
              <h2 className="mb-4 border-b pb-2 text-xl font-semibold tracking-tight">
                {sec.heading}
              </h2>
              {sec.content.split("\n\n").map((paragraph, j) => (
                <p
                  key={j}
                  className="mb-4 text-[15px] leading-relaxed text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        {/* References */}
        {(session.references?.length ?? 0) > 0 && (
          <section className="mt-12 border-t pt-8">
            <h2 className="mb-4 text-lg font-semibold">참고문헌</h2>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
              {session.references?.map((ref, i) => (
                <li key={i} className="leading-relaxed">
                  {ref}
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Footer */}
        <div className="mt-16 flex justify-center">
          <Link
            href="/"
            className="rounded-md border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-indigo-500 hover:text-indigo-400"
          >
            ← 목록으로 돌아가기
          </Link>
        </div>
      </article>
    </div>
  );
}

export function generateStaticParams() {
  return sessions.map((s) => ({ id: s.id }));
}
