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

export default function Home() {
  const { locale, t } = useLocale();
  const isAdmin = useAdmin();

  // View mode
  const [viewMode, setViewMode] = useState<ReadingSettings["viewMode"]>("default");

  useEffect(() => {
    const s = loadSettings();
    setViewMode(s.viewMode);
    applyViewMode(s.viewMode);
  }, []);

  // Collapsed folders
  const [collapsedFolders, setCollapsedFolders] = useState<Set<string>>(new Set());

  const toggleCollapse = (folderId: string) => {
    setCollapsedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) next.delete(folderId);
      else next.add(folderId);
      return next;
    });
  };

  const getSessionsInGroup = (groupId: string) =>
    sessions.filter((s) => (s.group || "default") === groupId);

  return (
    <div className={`min-h-screen transition-colors ${getViewModeClasses(viewMode)}`}>
      <Header />

      <main className="mx-auto max-w-3xl space-y-2 px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">{t.pageTitle}</h1>
          <p className="text-sm text-muted-foreground">{t.pageDesc}</p>
        </div>

        {groups.map((group) => {
          const groupSessions = getSessionsInGroup(group.id);
          const isCollapsed = collapsedFolders.has(group.id);

          if (groupSessions.length === 0) return null;

          return (
            <div key={group.id} className="mb-4">
              {/* Group Header */}
              {groups.length > 1 && (
                <div className="flex items-center gap-2 mb-2">
                  <button
                    onClick={() => toggleCollapse(group.id)}
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span className={`transition-transform ${isCollapsed ? "" : "rotate-90"}`}>
                      ▶
                    </span>
                    📁 {group.name}
                    <span className="text-xs opacity-50">
                      ({groupSessions.length})
                    </span>
                  </button>
                </div>
              )}

              {/* Session Cards */}
              {!isCollapsed && (
                <div className="space-y-3 pl-0">
                  {groupSessions.map((s) => {
                    const loc = s[locale];
                    return (
                      <Link
                        key={s.id}
                        href={`${isAdmin ? "/admin" : ""}/read/${s.id}`}
                        className="block"
                      >
                        <Card className="group cursor-pointer transition-all hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg leading-snug group-hover:text-indigo-400 transition-colors">
                              {loc.title}
                            </CardTitle>
                            {loc.subtitle && (
                              <p className="text-sm text-muted-foreground">
                                {loc.subtitle}
                              </p>
                            )}
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {loc.abstract}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              <span>📅 {s.date}</span>
                              <Separator orientation="vertical" className="h-3" />
                              <span>{s.words.toLocaleString()} {t.words}</span>
                              <Separator orientation="vertical" className="h-3" />
                              <span>📚 {s.citations} {t.citations}</span>
                              <Separator orientation="vertical" className="h-3" />
                              <span>🖼️ {s.diagrams} {t.figures}</span>
                            </div>
                            <div className="flex gap-2">
                              <Badge
                                className={
                                  s.ptcs >= 80
                                    ? "bg-green-500/15 text-green-400 hover:bg-green-500/20"
                                    : "bg-amber-500/15 text-amber-400 hover:bg-amber-500/20"
                                }
                              >
                                {t.ptcs} {s.ptcs}%
                              </Badge>
                              <Badge variant="secondary">
                                {translateType(s.type, t)}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </main>
    </div>
  );
}
