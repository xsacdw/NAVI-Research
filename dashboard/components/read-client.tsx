"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/header";
import { useLocale } from "@/components/locale-provider";
import { translateType } from "@/lib/i18n";
import { sessions } from "@/lib/data";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface ReadClientProps {
  id: string;
  content: string | null;
  toc: TocItem[];
}

export function ReadClient({ id, content, toc }: ReadClientProps) {
  const { locale, t } = useLocale();
  const session = sessions.find((s) => s.id === id);
  if (!session) notFound();

  const loc = session[locale];

  // --- Reading progress ---
  const [progress, setProgress] = useState(0);
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const el = articleRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.scrollHeight - window.innerHeight;
      const scrolled = -rect.top;
      setProgress(Math.min(100, Math.max(0, (scrolled / total) * 100)));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- Active TOC tracking ---
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (toc.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 }
    );

    // Observe all heading elements
    const timer = setTimeout(() => {
      toc.forEach((item) => {
        const el = document.getElementById(item.id);
        if (el) observer.observe(el);
      });
    }, 300);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [toc]);

  // --- TOC sidebar state (mobile) ---
  const [tocOpen, setTocOpen] = useState(false);

  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setTocOpen(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header showBack />

      {/* Reading progress bar */}
      <div className="fixed top-14 left-0 right-0 z-40 h-0.5 bg-muted">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex gap-8">
          {/* --- TOC Sidebar (desktop) --- */}
          {toc.length > 0 && (
            <aside className="hidden xl:block w-64 shrink-0">
              <nav className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-lg border bg-card p-4">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {locale === "ko" ? "목차" : "Contents"}
                </h3>
                <ul className="space-y-1">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => scrollToSection(item.id)}
                        className={`block w-full text-left text-[13px] leading-snug py-1 px-2 rounded transition-colors ${
                          item.level === 2 ? "pl-2" : item.level === 3 ? "pl-5" : "pl-8"
                        } ${
                          activeId === item.id
                            ? "bg-indigo-500/10 text-indigo-400 font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        {item.text}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          )}

          {/* --- Main article --- */}
          <article ref={articleRef} className="min-w-0 max-w-3xl flex-1">
            {/* Header */}
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
                  {t.ptcs} {session.ptcs}%
                </Badge>
                <Badge variant="secondary">{translateType(session.type, t)}</Badge>
              </div>
            </header>

            {/* Abstract */}
            <blockquote className="mb-10 rounded-r-lg border-l-4 border-indigo-500 bg-indigo-500/5 px-5 py-4 text-sm italic text-muted-foreground">
              {loc.abstract}
            </blockquote>

            {/* Mobile TOC toggle */}
            {toc.length > 0 && (
              <div className="xl:hidden mb-8">
                <button
                  onClick={() => setTocOpen(!tocOpen)}
                  className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:border-indigo-500 hover:text-indigo-400 w-full"
                >
                  <span>📑</span>
                  <span>{locale === "ko" ? "목차 보기" : "Table of Contents"}</span>
                  <span className="ml-auto">{tocOpen ? "▲" : "▼"}</span>
                </button>
                {tocOpen && (
                  <nav className="mt-2 rounded-lg border bg-card p-4 animate-in slide-in-from-top-2">
                    <ul className="space-y-1">
                      {toc.map((item) => (
                        <li key={item.id}>
                          <button
                            onClick={() => scrollToSection(item.id)}
                            className={`block w-full text-left text-sm py-1.5 px-2 rounded transition-colors ${
                              item.level === 2 ? "pl-2 font-medium" : item.level === 3 ? "pl-5" : "pl-8"
                            } text-muted-foreground hover:text-foreground hover:bg-muted`}
                          >
                            {item.text}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}
              </div>
            )}

            {/* Markdown content */}
            {content ? (
              <div className="prose-academic">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children, ...props }) => {
                      const text = String(children);
                      const headingId = text
                        .toLowerCase()
                        .replace(/[^a-z0-9가-힣\s-]/g, "")
                        .replace(/\s+/g, "-")
                        .slice(0, 60);
                      return (
                        <h1 id={headingId} className="mt-12 mb-4 text-2xl font-bold tracking-tight scroll-mt-20" {...props}>
                          {children}
                        </h1>
                      );
                    },
                    h2: ({ children, ...props }) => {
                      const text = String(children);
                      const headingId = text
                        .toLowerCase()
                        .replace(/[^a-z0-9가-힣\s-]/g, "")
                        .replace(/\s+/g, "-")
                        .slice(0, 60);
                      return (
                        <h2 id={headingId} className="mt-10 mb-4 pb-2 border-b text-xl font-semibold tracking-tight scroll-mt-20" {...props}>
                          {children}
                        </h2>
                      );
                    },
                    h3: ({ children, ...props }) => {
                      const text = String(children);
                      const headingId = text
                        .toLowerCase()
                        .replace(/[^a-z0-9가-힣\s-]/g, "")
                        .replace(/\s+/g, "-")
                        .slice(0, 60);
                      return (
                        <h3 id={headingId} className="mt-8 mb-3 text-lg font-semibold scroll-mt-20" {...props}>
                          {children}
                        </h3>
                      );
                    },
                    h4: ({ children, ...props }) => {
                      const text = String(children);
                      const headingId = text
                        .toLowerCase()
                        .replace(/[^a-z0-9가-힣\s-]/g, "")
                        .replace(/\s+/g, "-")
                        .slice(0, 60);
                      return (
                        <h4 id={headingId} className="mt-6 mb-2 text-base font-semibold scroll-mt-20" {...props}>
                          {children}
                        </h4>
                      );
                    },
                    p: ({ children }) => (
                      <p className="mb-4 text-[15px] leading-[1.85] text-muted-foreground">
                        {children}
                      </p>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="my-6 rounded-r-lg border-l-4 border-indigo-500/50 bg-indigo-500/5 px-5 py-4 text-sm italic text-muted-foreground">
                        {children}
                      </blockquote>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-foreground">{children}</strong>
                    ),
                    ol: ({ children }) => (
                      <ol className="my-4 list-decimal space-y-2 pl-6 text-[15px] text-muted-foreground">
                        {children}
                      </ol>
                    ),
                    ul: ({ children }) => (
                      <ul className="my-4 list-disc space-y-2 pl-6 text-[15px] text-muted-foreground">
                        {children}
                      </ul>
                    ),
                    li: ({ children }) => (
                      <li className="leading-relaxed">{children}</li>
                    ),
                    table: ({ children }) => (
                      <div className="my-6 overflow-x-auto rounded-lg border">
                        <table className="w-full text-sm">{children}</table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-muted/50">{children}</thead>
                    ),
                    th: ({ children }) => (
                      <th className="px-4 py-2.5 text-left font-semibold text-foreground">{children}</th>
                    ),
                    td: ({ children }) => (
                      <td className="px-4 py-2.5 text-muted-foreground border-t">{children}</td>
                    ),
                    hr: () => <hr className="my-10 border-border" />,
                    img: ({ src, alt }) => (
                      <figure className="my-8">
                        <div className="overflow-hidden rounded-lg border bg-card">
                          <img src={src} alt={alt || ""} className="w-full" />
                        </div>
                        {alt && (
                          <figcaption className="mt-2 text-center text-sm italic text-muted-foreground">
                            {alt}
                          </figcaption>
                        )}
                      </figure>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 underline underline-offset-2 hover:text-indigo-300"
                      >
                        {children}
                      </a>
                    ),
                    code: ({ children, className }) => {
                      const isBlock = className?.includes("language-");
                      if (isBlock) {
                        return (
                          <code className="block my-4 p-4 rounded-lg bg-muted text-sm overflow-x-auto">
                            {children}
                          </code>
                        );
                      }
                      return (
                        <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-muted-foreground italic">
                {locale === "ko" ? "논문 원본 파일을 찾을 수 없습니다." : "Thesis file not found."}
              </p>
            )}

            {/* Back button */}
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
      </div>
    </div>
  );
}
