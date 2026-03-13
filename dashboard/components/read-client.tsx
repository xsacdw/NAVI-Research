"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLocale } from "@/components/locale-provider";
import { translateType } from "@/lib/i18n";
import { sessions } from "@/lib/data";
import {
  ReadSettings,
  loadSettings,
  applyViewMode,
  getFontSize,
  getLineHeight,
  getViewModeClasses,
  getHeaderClasses,
  DEFAULT_SETTINGS,
  type ReadingSettings,
} from "@/components/read-settings";

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

/** Split markdown into chapters by ## headings */
function splitChapters(md: string): { title: string; body: string }[] {
  const lines = md.split("\n");
  const chapters: { title: string; body: string }[] = [];
  let currentTitle = "";
  let currentLines: string[] = [];

  for (const line of lines) {
    const h2Match = line.match(/^##\s+(.+)$/);
    if (h2Match) {
      if (currentLines.length > 0 || currentTitle) {
        chapters.push({ title: currentTitle, body: currentLines.join("\n") });
      }
      currentTitle = h2Match[1];
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }
  if (currentLines.length > 0 || currentTitle) {
    chapters.push({ title: currentTitle, body: currentLines.join("\n") });
  }
  return chapters;
}

export function ReadClient({ id, content, toc }: ReadClientProps) {
  const { locale, t } = useLocale();
  const session = sessions.find((s) => s.id === id);
  if (!session) notFound();

  const loc = session[locale];

  // --- Chapters ---
  const chapters = useMemo(() => {
    if (!content) return [];
    return splitChapters(content);
  }, [content]);

  const [chapterIdx, setChapterIdx] = useState(0);
  const currentChapter = chapters[chapterIdx] || null;

  const goNext = () => {
    if (chapterIdx < chapters.length - 1) {
      setChapterIdx(chapterIdx + 1);
      window.scrollTo({ top: 0 });
    }
  };

  const goPrev = () => {
    if (chapterIdx > 0) {
      setChapterIdx(chapterIdx - 1);
      window.scrollTo({ top: 0 });
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  // --- TOC sidebar ---
  const [tocOpen, setTocOpen] = useState(false);

  // --- Reading settings ---
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [readSettings, setReadSettings] = useState<ReadingSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const s = loadSettings();
    setReadSettings(s);
    applyViewMode(s.viewMode);
  }, []);

  // Progress
  const progress = chapters.length > 0 ? Math.round(((chapterIdx + 1) / chapters.length) * 100) : 0;

  // --- Grouped TOC ---
  const groupedToc = useMemo(() => {
    const groups: { parent: TocItem; children: TocItem[]; chapterIdx: number }[] = [];
    let h2Index = -1;
    toc.forEach((item) => {
      if (item.level === 2) {
        h2Index++;
        groups.push({ parent: item, children: [], chapterIdx: h2Index + 1 });
      } else if (groups.length > 0) {
        groups[groups.length - 1].children.push(item);
      }
    });
    return groups;
  }, [toc]);

  // Markdown components
  const mdComponents = useMemo(() => ({
    h1: ({ children, ...props }: any) => {
      const text = String(children);
      const hid = text.toLowerCase().replace(/[^a-z0-9가-힣\s-]/g, "").replace(/\s+/g, "-").slice(0, 60);
      return <h1 id={hid} className="mt-10 mb-4 text-2xl font-bold tracking-tight scroll-mt-20" {...props}>{children}</h1>;
    },
    h2: ({ children, ...props }: any) => {
      const text = String(children);
      const hid = text.toLowerCase().replace(/[^a-z0-9가-힣\s-]/g, "").replace(/\s+/g, "-").slice(0, 60);
      return <h2 id={hid} className="mt-8 mb-4 pb-2 border-b text-xl font-semibold tracking-tight scroll-mt-20" {...props}>{children}</h2>;
    },
    h3: ({ children, ...props }: any) => {
      const text = String(children);
      const hid = text.toLowerCase().replace(/[^a-z0-9가-힣\s-]/g, "").replace(/\s+/g, "-").slice(0, 60);
      return <h3 id={hid} className="mt-6 mb-3 text-lg font-semibold scroll-mt-20" {...props}>{children}</h3>;
    },
    h4: ({ children, ...props }: any) => {
      const text = String(children);
      const hid = text.toLowerCase().replace(/[^a-z0-9가-힣\s-]/g, "").replace(/\s+/g, "-").slice(0, 60);
      return <h4 id={hid} className="mt-4 mb-2 text-base font-semibold scroll-mt-20" {...props}>{children}</h4>;
    },
    p: ({ children }: any) => <p className="mb-4 text-inherit" style={{ lineHeight: "inherit" }}>{children}</p>,
    blockquote: ({ children }: any) => <blockquote className="my-6 rounded-r-lg border-l-4 border-indigo-400/50 bg-indigo-500/5 px-5 py-4 text-sm italic opacity-80">{children}</blockquote>,
    strong: ({ children }: any) => <strong className="font-semibold">{children}</strong>,
    ol: ({ children }: any) => <ol className="my-4 list-decimal space-y-2 pl-6">{children}</ol>,
    ul: ({ children }: any) => <ul className="my-4 list-disc space-y-2 pl-6">{children}</ul>,
    li: ({ children }: any) => <li style={{ lineHeight: "inherit" }}>{children}</li>,
    table: ({ children }: any) => <div className="my-6 overflow-x-auto rounded-lg border"><table className="w-full text-sm">{children}</table></div>,
    thead: ({ children }: any) => <thead className="bg-muted/50">{children}</thead>,
    th: ({ children }: any) => <th className="px-4 py-2.5 text-left font-semibold">{children}</th>,
    td: ({ children }: any) => <td className="px-4 py-2.5 border-t">{children}</td>,
    hr: () => <hr className="my-10 border-current opacity-10" />,
    img: ({ src, alt }: any) => (
      <figure className="my-8">
        <div className="overflow-hidden rounded-lg border"><img src={src} alt={alt || ""} className="w-full" /></div>
        {alt && <figcaption className="mt-2 text-center text-sm italic opacity-60">{alt}</figcaption>}
      </figure>
    ),
    a: ({ href, children }: any) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline underline-offset-2 hover:text-indigo-300">{children}</a>,
    code: ({ children, className }: any) => {
      const isBlock = className?.includes("language-");
      if (isBlock) return <code className="block my-4 p-4 rounded-lg bg-black/10 dark:bg-white/5 text-sm overflow-x-auto">{children}</code>;
      return <code className="rounded bg-black/10 dark:bg-white/10 px-1.5 py-0.5 text-sm font-mono">{children}</code>;
    },
  }), []);

  return (
    <div className={`min-h-screen transition-colors ${getViewModeClasses(readSettings.viewMode)}`}>
      {/* Top bar */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-md ${getHeaderClasses(readSettings.viewMode)}`}>
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 h-14">
          <Link href="/" className="opacity-60 hover:opacity-100 transition-opacity">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </Link>

          <div className="text-center flex-1 min-w-0 px-4">
            <h1 className="text-sm font-semibold truncate">
              {currentChapter?.title || loc.title}
            </h1>
            {loc.subtitle && (
              <p className="text-xs opacity-50 truncate">{loc.subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Settings button — gear icon */}
            <div className="relative">
              <button
                onClick={() => { setSettingsOpen(!settingsOpen); setTocOpen(false); }}
                className={`p-2 rounded-lg transition-colors ${
                  settingsOpen ? "bg-indigo-500/10 text-indigo-400" : "opacity-60 hover:opacity-100"
                }`}
                aria-label="설정"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
              <ReadSettings
                open={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                settings={readSettings}
                onChange={setReadSettings}
              />
            </div>

            {/* TOC button */}
            <button
              onClick={() => { setTocOpen(!tocOpen); setSettingsOpen(false); }}
              className={`p-2 rounded-lg transition-colors ${
                tocOpen ? "bg-indigo-500/10 text-indigo-400" : "opacity-60 hover:opacity-100"
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

      {/* Progress bar */}
      <div className="fixed top-14 left-0 right-0 z-40 h-0.5 bg-current opacity-10">
        <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex gap-8">
          {/* Main content */}
          <article
            className="min-w-0 flex-1 max-w-3xl mx-auto"
            style={{
              fontSize: getFontSize(readSettings.fontSize),
              lineHeight: getLineHeight(readSettings.lineHeight),
            }}
          >
            {/* Chapter 0 = intro (title + abstract) */}
            {chapterIdx === 0 && (
              <>
                <header className="mb-8 text-center">
                  <h1 className="mb-2 text-2xl font-bold leading-tight tracking-tight">
                    {loc.title}
                  </h1>
                  {loc.subtitle && (
                    <p className="mb-4 text-base opacity-50">{loc.subtitle}</p>
                  )}
                  <div className="flex flex-wrap justify-center items-center gap-3 text-sm opacity-50">
                    <span>📅 {session.date}</span>
                    <Separator orientation="vertical" className="h-4" />
                    <span>{session.words.toLocaleString()} {t.words}</span>
                    <Separator orientation="vertical" className="h-4" />
                    <span>📚 {session.citations} {t.citations}</span>
                    <Separator orientation="vertical" className="h-4" />
                    <Badge className={session.ptcs >= 80 ? "bg-green-500/15 text-green-400" : "bg-amber-500/15 text-amber-400"}>
                      {t.ptcs} {session.ptcs}%
                    </Badge>
                    <Badge variant="secondary">{translateType(session.type, t)}</Badge>
                  </div>
                </header>
                <blockquote className="mb-10 rounded-lg border-l-4 border-indigo-400 bg-indigo-500/5 px-5 py-4 text-sm italic opacity-70">
                  {loc.abstract}
                </blockquote>
              </>
            )}

            {/* Chapter content */}
            {currentChapter && (
              <div className="prose-academic">
                {currentChapter.title && chapterIdx > 0 && (
                  <h2 className="mt-2 mb-6 pb-2 border-b text-xl font-semibold tracking-tight">
                    {currentChapter.title}
                  </h2>
                )}
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                  {currentChapter.body}
                </ReactMarkdown>
              </div>
            )}

            {!content && (
              <p className="opacity-50 italic">
                {locale === "ko" ? "논문 원본 파일을 찾을 수 없습니다." : "Thesis file not found."}
              </p>
            )}
          </article>

          {/* Right TOC sidebar */}
          {toc.length > 0 && tocOpen && (
            <aside className="hidden lg:block w-72 shrink-0">
              <nav className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
                {groupedToc.map((group) => (
                  <div key={group.parent.id} className="mb-4">
                    <button
                      onClick={() => { setChapterIdx(group.chapterIdx); setTocOpen(false); window.scrollTo({ top: 0 }); }}
                      className={`block w-full text-left text-[13px] font-semibold leading-snug py-1 transition-colors ${
                        chapterIdx === group.chapterIdx ? "text-indigo-400" : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      {group.parent.text}
                    </button>
                    {group.children.length > 0 && (
                      <ul className="mt-1 space-y-0.5 pl-1">
                        {group.children.map((child, ci) => (
                          <li key={child.id}>
                            <button
                              onClick={() => { setChapterIdx(group.chapterIdx); setTocOpen(false); window.scrollTo({ top: 0 }); }}
                              className="block w-full text-left text-[12px] leading-snug py-0.5 pl-3 opacity-50 hover:opacity-80 transition-opacity"
                            >
                              <span className="inline-block w-5 text-[11px] opacity-50">
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
      {chapters.length > 1 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3">
          <button
            onClick={goPrev}
            disabled={chapterIdx <= 0}
            className="flex items-center justify-center w-12 h-10 rounded-full bg-indigo-600 text-white shadow-lg disabled:opacity-30 hover:bg-indigo-500 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/10 shadow-lg text-xs font-medium min-w-[48px] text-center">
            {progress}%
          </div>
          <button
            onClick={goNext}
            disabled={chapterIdx >= chapters.length - 1}
            className="flex items-center justify-center w-12 h-10 rounded-full bg-indigo-600 text-white shadow-lg disabled:opacity-30 hover:bg-indigo-500 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      )}

      {/* Mobile TOC overlay */}
      {tocOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setTocOpen(false)}>
          <div className="absolute right-0 top-14 bottom-0 w-72 border-l overflow-y-auto p-4 animate-in slide-in-from-right bg-inherit" onClick={(e) => e.stopPropagation()}>
            {groupedToc.map((group) => (
              <div key={group.parent.id} className="mb-4">
                <button
                  onClick={() => { setChapterIdx(group.chapterIdx); setTocOpen(false); window.scrollTo({ top: 0 }); }}
                  className={`block w-full text-left text-[13px] font-semibold leading-snug py-1 transition-colors ${
                    chapterIdx === group.chapterIdx ? "text-indigo-400" : ""
                  }`}
                >
                  {group.parent.text}
                </button>
                {group.children.length > 0 && (
                  <ul className="mt-1 space-y-0.5 pl-1">
                    {group.children.map((child, ci) => (
                      <li key={child.id}>
                        <button
                          onClick={() => { setChapterIdx(group.chapterIdx); setTocOpen(false); window.scrollTo({ top: 0 }); }}
                          className="block w-full text-left text-[12px] leading-snug py-0.5 pl-3 opacity-60"
                        >
                          <span className="inline-block w-5 text-[11px] opacity-50">
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
