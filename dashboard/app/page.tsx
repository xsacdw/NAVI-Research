"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/header";
import { useLocale } from "@/components/locale-provider";
import { useAdmin } from "@/components/admin-provider";
import { translateType } from "@/lib/i18n";
import { sessions, groups } from "@/lib/data";
import {
  loadSettings,
  applyViewMode,
  getViewModeClasses,
  DEFAULT_SETTINGS,
  type ReadingSettings,
} from "@/components/read-settings";

const HIDDEN_KEY = "navi-hidden-sessions";

export default function Home() {
  const { locale, t } = useLocale();
  const isAdmin = useAdmin();

  const [readSettings, setReadSettings] = useState<ReadingSettings>(DEFAULT_SETTINGS);
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const s = loadSettings();
    setReadSettings(s);
    applyViewMode(s.viewMode);
    try {
      const raw = localStorage.getItem(HIDDEN_KEY);
      if (raw) setHiddenIds(new Set(JSON.parse(raw)));
    } catch {}
  }, []);

  const toggleCollapse = (id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleHide = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setHiddenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem(HIDDEN_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  const restoreAll = () => {
    setHiddenIds(new Set());
    localStorage.removeItem(HIDDEN_KEY);
  };

  const getGroupSessions = (groupId: string) =>
    sessions.filter((s) => {
      if (!isAdmin && hiddenIds.has(s.id)) return false;
      return (s.group || "default") === groupId;
    });

  return (
    <div className={`min-h-screen transition-colors ${getViewModeClasses(readSettings.viewMode)}`}>
      <Header showSettings settings={readSettings} onSettingsChange={setReadSettings} />

      <main className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
        {/* Title */}
        <div className="mb-6 sm:mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{t.pageTitle}</h1>
              {isAdmin && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/15 text-red-400 border border-red-500/20">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">{t.pageDesc}</p>
          </div>
          {isAdmin && hiddenIds.size > 0 && (
            <button onClick={restoreAll} className="text-xs text-muted-foreground hover:text-foreground border rounded-lg px-3 py-1.5 transition-colors">
              숨김 {hiddenIds.size}개 복원
            </button>
          )}
        </div>

        {/* Groups */}
        <div className="space-y-4">
          {groups.map((group) => {
            const items = getGroupSessions(group.id);
            if (items.length === 0) return null;
            const isCollapsed = collapsed.has(group.id);

            return (
              <div key={group.id}>
                {groups.length > 1 && (
                  <button
                    onClick={() => toggleCollapse(group.id)}
                    className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span className={`transition-transform text-xs ${isCollapsed ? "" : "rotate-90"}`}>▶</span>
                    📁 {group.name}
                    <span className="text-xs opacity-50">({items.length})</span>
                  </button>
                )}

                {!isCollapsed && (
                  <div className="space-y-3">
                    {items.map((s) => {
                      const loc = s[locale];
                      const isHidden = hiddenIds.has(s.id);
                      return (
                        <div key={s.id} className={`relative ${isHidden ? "opacity-40" : ""}`}>
                          <Link href={`${isAdmin ? "/admin" : ""}/read/${s.id}`} className="block">
                            <Card className="group cursor-pointer transition-all hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5">
                              <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6">
                                <CardTitle className={`text-base sm:text-lg leading-snug group-hover:text-indigo-400 transition-colors ${isHidden ? "line-through" : ""}`}>
                                  {loc.title}
                                </CardTitle>
                                {loc.subtitle && <p className="text-xs sm:text-sm text-muted-foreground">{loc.subtitle}</p>}
                              </CardHeader>
                              <CardContent className="space-y-2 sm:space-y-3 px-4 sm:px-6">
                                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{loc.abstract}</p>
                                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-muted-foreground">
                                  <span>📅 {s.date}</span>
                                  <Separator orientation="vertical" className="h-3 hidden sm:block" />
                                  <span>{s.words.toLocaleString()} {t.words}</span>
                                  <Separator orientation="vertical" className="h-3 hidden sm:block" />
                                  <span>📚 {s.citations} {t.citations}</span>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                  <Badge className={s.ptcs >= 80 ? "bg-green-500/15 text-green-400" : "bg-amber-500/15 text-amber-400"}>
                                    {t.ptcs} {s.ptcs}%
                                  </Badge>
                                  <Badge variant="secondary">{translateType(s.type, t)}</Badge>
                                  {isAdmin && <span className="ml-auto text-[10px] font-mono opacity-30 hidden sm:inline">{s.id}</span>}
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                          {isAdmin && (
                            <button
                              onClick={(e) => toggleHide(s.id, e)}
                              className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-10 p-1 sm:p-1.5 rounded-lg border text-xs transition-all ${
                                isHidden
                                  ? "bg-green-500/10 text-green-400 border-green-500/30"
                                  : "bg-red-500/10 text-red-400 border-red-500/30"
                              }`}
                              title={isHidden ? "표시" : "숨기기"}
                            >
                              {isHidden ? "👁️" : "🙈"}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
