"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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

  // --- TOC sidebar toggle ---
  const [tocOpen, setTocOpen] = useState(false);

  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setTocOpen(false);
    }
  }, []);

  // --- Section navigation ---
  const h2Sections = toc.filter((item) => item.level === 2);
  const currentSectionIdx = h2Sections.findIndex((s) => s.id === activeId);
  const currentSection =
    currentSectionIdx >= 0
      ? h2Sections[currentSectionIdx]
      : h2Sections[0] || null;

  const goPrev = () => {
    if (currentSectionIdx > 0) {
      scrollToSection(h2Sections[currentSectionIdx - 1].id);
    }
  };

  const goNext = () => {
    if (currentSectionIdx < h2Sections.length - 1) {
      scrollToSection(h2Sections[currentSectionIdx + 1].id);
    }
  };

  // --- numbered TOC items grouping ---
  const groupedToc = (() => {
    const groups: { parent: TocItem; children: TocItem[] }[] = [];
    toc.forEach((item) => {
      if (item.level === 2) {
        groups.push({ parent: item, children: [] });
      } else if (groups.length > 0) {
        groups[groups.length - 1].children.push(item);
      }
    });
    return groups;
  })();

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b bg-white/90 dark:bg-background/90 backdrop-blur-md">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 h-14">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </Link>

          <div className="text-center flex-1 min-w-0 px-4">
            <h1 className="text-sm font-semibold truncate">
              {currentSection?.text || loc.title}
            </h1>
            {loc.subtitle && (
              <p className="text-xs text-muted-foreground truncate">
                {loc.subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTocOpen(!tocOpen)}
              className={`p-2 rounded-lg transition-colors ${
                tocOpen
                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
              aria-label="목차"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Reading progress bar */}
      <div className="fixed top-14 left-0 right-0 z-40 h-0.5 bg-gray-200 dark:bg-muted">
        <div
          className="h-full bg-indigo-500 transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex gap-8">
          {/* --- Main content --- */}
          <article ref={articleRef} className="min-w-0 flex-1 max-w-3xl mx-auto">
            {/* Meta header */}
            <header className="mb-8 text-center">
              <h1 className="mb-2 text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-foreground">
                {loc.title}
              </h1>
              {loc.subtitle && (
                <p className="mb-4 text-base text-gray-500 dark:text-muted-foreground">
                  {loc.subtitle}
                </p>
              )}
              <div className="flex flex-wrap justify-center items-center gap-3 text-sm text-gray-500 dark:text-muted-foreground">
                <span>📅 {session.date}</span>
                <Separator orientation="vertical" className="h-4" />
                <span>{session.words.toLocaleString()} {t.words}</span>
                <Separator orientation="vertical" className="h-4" />
                <span>📚 {session.citations} {t.citations}</span>
                <Separator orientation="vertical" className="h-4" />
                <Badge
                  className={
                    session.ptcs >= 80
                      ? "bg-green-500/15 text-green-600 dark:text-green-400"
                      : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                  }
                >
                  {t.ptcs} {session.ptcs}%
                </Badge>
                <Badge variant="secondary">{translateType(session.type, t)}</Badge>
              </div>
            </header>

            {/* Abstract block */}
            <blockquote className="mb-10 rounded-lg border-l-4 border-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/5 px-5 py-4 text-sm text-gray-600 dark:text-muted-foreground italic">
              {loc.abstract}
            </blockquote>

            {/* Markdown content */}
            {content ? (
              <div className="prose-academic">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children, ...props }) => {
                      const text = String(children);
                      const headingId = text.toLowerCase().replace(/[^a-z0-9가-힣\s-]/g, "").replace(/\s+/g, "-").slice(0, 60);
                      return <h1 id={headingId} className="mt-12 mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-foreground scroll-mt-20" {...props}>{children}</h1>;
                    },
                    h2: ({ children, ...props }) => {
                      const text = String(children);
                      const headingId = text.toLowerCase().replace(/[^a-z0-9가-힣\s-]/g, "").replace(/\s+/g, "-").slice(0, 60);
                      return <h2 id={headingId} className="mt-10 mb-4 pb-2 border-b border-gray-200 dark:border-border text-xl font-semibold tracking-tight text-gray-900 dark:text-foreground scroll-mt-20" {...props}>{children}</h2>;
                    },
                    h3: ({ children, ...props }) => {
                      const text = String(children);
                      const headingId = text.toLowerCase().replace(/[^a-z0-9가-힣\s-]/g, "").replace(/\s+/g, "-").slice(0, 60);
                      return <h3 id={headingId} className="mt-8 mb-3 text-lg font-semibold text-gray-800 dark:text-foreground scroll-mt-20" {...props}>{children}</h3>;
                    },
                    h4: ({ children, ...props }) => {
                      const text = String(children);
                      const headingId = text.toLowerCase().replace(/[^a-z0-9가-힣\s-]/g, "").replace(/\s+/g, "-").slice(0, 60);
                      return <h4 id={headingId} className="mt-6 mb-2 text-base font-semibold text-gray-800 dark:text-foreground scroll-mt-20" {...props}>{children}</h4>;
                    },
                    p: ({ children }) => (
                      <p className="mb-4 text-[15px] leading-[1.85] text-gray-700 dark:text-muted-foreground">{children}</p>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="my-6 rounded-r-lg border-l-4 border-indigo-400/50 bg-indigo-50/50 dark:bg-indigo-500/5 px-5 py-4 text-sm italic text-gray-600 dark:text-muted-foreground">{children}</blockquote>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-gray-900 dark:text-foreground">{children}</strong>
                    ),
                    ol: ({ children }) => (
                      <ol className="my-4 list-decimal space-y-2 pl-6 text-[15px] text-gray-700 dark:text-muted-foreground">{children}</ol>
                    ),
                    ul: ({ children }) => (
                      <ul className="my-4 list-disc space-y-2 pl-6 text-[15px] text-gray-700 dark:text-muted-foreground">{children}</ul>
                    ),
                    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                    table: ({ children }) => (
                      <div className="my-6 overflow-x-auto rounded-lg border"><table className="w-full text-sm">{children}</table></div>
                    ),
                    thead: ({ children }) => <thead className="bg-gray-50 dark:bg-muted/50">{children}</thead>,
                    th: ({ children }) => <th className="px-4 py-2.5 text-left font-semibold text-gray-900 dark:text-foreground">{children}</th>,
                    td: ({ children }) => <td className="px-4 py-2.5 text-gray-700 dark:text-muted-foreground border-t">{children}</td>,
                    hr: () => <hr className="my-10 border-gray-200 dark:border-border" />,
                    img: ({ src, alt }) => (
                      <figure className="my-8">
                        <div className="overflow-hidden rounded-lg border bg-white dark:bg-card">
                          <img src={src} alt={alt || ""} className="w-full" />
                        </div>
                        {alt && <figcaption className="mt-2 text-center text-sm italic text-gray-500 dark:text-muted-foreground">{alt}</figcaption>}
                      </figure>
                    ),
                    a: ({ href, children }) => (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline underline-offset-2 hover:text-indigo-500">{children}</a>
                    ),
                    code: ({ children, className }) => {
                      const isBlock = className?.includes("language-");
                      if (isBlock) {
                        return <code className="block my-4 p-4 rounded-lg bg-gray-100 dark:bg-muted text-sm overflow-x-auto">{children}</code>;
                      }
                      return <code className="rounded bg-gray-100 dark:bg-muted px-1.5 py-0.5 text-sm font-mono text-gray-800 dark:text-foreground">{children}</code>;
                    },
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-muted-foreground italic">
                {locale === "ko" ? "논문 원본 파일을 찾을 수 없습니다." : "Thesis file not found."}
              </p>
            )}
          </article>

          {/* --- Right TOC sidebar (desktop) --- */}
          {toc.length > 0 && tocOpen && (
            <aside className="hidden lg:block w-72 shrink-0">
              <nav className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
                {groupedToc.map((group, gi) => (
                  <div key={group.parent.id} className="mb-4">
                    <button
                      onClick={() => scrollToSection(group.parent.id)}
                      className={`block w-full text-left text-[13px] font-semibold leading-snug py-1 transition-colors ${
                        activeId === group.parent.id
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-gray-900 dark:text-foreground hover:text-indigo-600 dark:hover:text-indigo-400"
                      }`}
                    >
                      {group.parent.text}
                    </button>
                    {group.children.length > 0 && (
                      <ul className="mt-1 space-y-0.5 pl-1">
                        {group.children.map((child, ci) => (
                          <li key={child.id}>
                            <button
                              onClick={() => scrollToSection(child.id)}
                              className={`block w-full text-left text-[12px] leading-snug py-0.5 pl-3 transition-colors ${
                                activeId === child.id
                                  ? "text-indigo-600 dark:text-indigo-400 font-medium"
                                  : "text-gray-500 dark:text-muted-foreground hover:text-gray-800 dark:hover:text-foreground"
                              }`}
                            >
                              <span className="inline-block w-5 text-gray-400 dark:text-muted-foreground text-[11px]">
                                {String(ci + 1).padStart(2, "0")}
                              </span>
                              {child.text}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </nav>
            </aside>
          )}
        </div>
      </div>

      {/* Bottom navigation */}
      {h2Sections.length > 1 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3">
          <button
            onClick={goPrev}
            disabled={currentSectionIdx <= 0}
            className="flex items-center justify-center w-12 h-10 rounded-full bg-indigo-600 text-white shadow-lg disabled:opacity-30 hover:bg-indigo-500 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <div className="px-3 py-1.5 rounded-full bg-white dark:bg-card border shadow-lg text-xs font-medium text-gray-600 dark:text-muted-foreground min-w-[48px] text-center">
            {Math.round(progress)}%
          </div>
          <button
            onClick={goNext}
            disabled={currentSectionIdx >= h2Sections.length - 1}
            className="flex items-center justify-center w-12 h-10 rounded-full bg-indigo-600 text-white shadow-lg disabled:opacity-30 hover:bg-indigo-500 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>

          {/* Scroll to top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center justify-center w-8 h-8 rounded-full border bg-white dark:bg-card shadow text-gray-400 hover:text-gray-700 dark:hover:text-foreground transition-colors ml-1"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5M5 12l7-7 7 7"/>
            </svg>
          </button>
        </div>
      )}

      {/* Mobile TOC overlay */}
      {tocOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setTocOpen(false)}
        >
          <div
            className="absolute right-0 top-14 bottom-0 w-72 bg-white dark:bg-background border-l overflow-y-auto p-4 animate-in slide-in-from-right"
            onClick={(e) => e.stopPropagation()}
          >
            {groupedToc.map((group, gi) => (
              <div key={group.parent.id} className="mb-4">
                <button
                  onClick={() => scrollToSection(group.parent.id)}
                  className={`block w-full text-left text-[13px] font-semibold leading-snug py-1 transition-colors ${
                    activeId === group.parent.id
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-900 dark:text-foreground"
                  }`}
                >
                  {group.parent.text}
                </button>
                {group.children.length > 0 && (
                  <ul className="mt-1 space-y-0.5 pl-1">
                    {group.children.map((child, ci) => (
                      <li key={child.id}>
                        <button
                          onClick={() => scrollToSection(child.id)}
                          className={`block w-full text-left text-[12px] leading-snug py-0.5 pl-3 transition-colors ${
                            activeId === child.id
                              ? "text-indigo-600 dark:text-indigo-400 font-medium"
                              : "text-gray-500 dark:text-muted-foreground"
                          }`}
                        >
                          <span className="inline-block w-5 text-gray-400 text-[11px]">
                            {String(ci + 1).padStart(2, "0")}
                          </span>
                          {child.text}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
