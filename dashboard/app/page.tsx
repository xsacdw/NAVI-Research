"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/header";
import { useLocale } from "@/components/locale-provider";
import { translateType } from "@/lib/i18n";
import { sessions } from "@/lib/data";
import { SessionMenu } from "@/components/session-menu";
import { FolderDialog } from "@/components/folder-dialog";
import {
  getFolders,
  createFolder,
  renameFolder,
  deleteFolder,
  getSessionFolder,
  moveSession,
  removeSession,
  type Folder,
} from "@/lib/folder-store";

export default function Home() {
  const { locale, t } = useLocale();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [sessionFolders, setSessionFolders] = useState<Record<string, string>>(
    {}
  );
  const [hiddenSessions, setHiddenSessions] = useState<Set<string>>(new Set());
  const [collapsedFolders, setCollapsedFolders] = useState<Set<string>>(
    new Set()
  );

  // Dialogs
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [renamingFolder, setRenamingFolder] = useState<Folder | null>(null);

  // Folder menu
  const [folderMenuOpen, setFolderMenuOpen] = useState<string | null>(null);

  // Multi-select
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showBulkMove, setShowBulkMove] = useState(false);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllInFolder = (folderId: string) => {
    const ids = getSessionsInFolder(folderId).map((s) => s.id);
    setSelected((prev) => {
      const next = new Set(prev);
      const allSelected = ids.every((id) => next.has(id));
      if (allSelected) {
        ids.forEach((id) => next.delete(id));
      } else {
        ids.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const bulkMove = (folderId: string) => {
    selected.forEach((id) => moveSession(id, folderId));
    setSelected(new Set());
    setShowBulkMove(false);
    refreshState();
  };

  const bulkDelete = () => {
    const updated = new Set(hiddenSessions);
    selected.forEach((id) => {
      updated.add(id);
      removeSession(id);
    });
    localStorage.setItem("navi-hidden-sessions", JSON.stringify([...updated]));
    setSelected(new Set());
    refreshState();
  };

  const refreshState = useCallback(() => {
    setFolders(getFolders());
    const mapping: Record<string, string> = {};
    sessions.forEach((s) => {
      mapping[s.id] = getSessionFolder(s.id);
    });
    setSessionFolders(mapping);

    // Load hidden sessions
    try {
      const raw = localStorage.getItem("navi-hidden-sessions");
      setHiddenSessions(raw ? new Set(JSON.parse(raw)) : new Set());
    } catch {
      setHiddenSessions(new Set());
    }
  }, []);

  useEffect(() => {
    refreshState();
  }, [refreshState]);

  const visibleSessions = sessions.filter((s) => !hiddenSessions.has(s.id));

  const handleMoveSession = (sessionId: string, folderId: string) => {
    moveSession(sessionId, folderId);
    refreshState();
  };

  const handleDeleteSession = (sessionId: string) => {
    const updated = new Set(hiddenSessions);
    updated.add(sessionId);
    localStorage.setItem(
      "navi-hidden-sessions",
      JSON.stringify([...updated])
    );
    removeSession(sessionId);
    refreshState();
  };

  const handleCreateFolder = (name: string) => {
    createFolder(name);
    refreshState();
  };

  const handleRenameFolder = (name: string) => {
    if (renamingFolder) {
      renameFolder(renamingFolder.id, name);
      refreshState();
    }
  };

  const handleDeleteFolder = (folderId: string) => {
    deleteFolder(folderId);
    refreshState();
  };

  const toggleCollapse = (folderId: string) => {
    setCollapsedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) next.delete(folderId);
      else next.add(folderId);
      return next;
    });
  };

  const getSessionsInFolder = (folderId: string) =>
    visibleSessions.filter(
      (s) => (sessionFolders[s.id] || "default") === folderId
    );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-3xl space-y-2 px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t.pageTitle}</h1>
            <p className="text-sm text-muted-foreground">{t.pageDesc}</p>
          </div>
          <button
            onClick={() => setShowCreateFolder(true)}
            className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:border-indigo-500/50 transition-all"
          >
            <span className="text-lg leading-none">+</span> 폴더
          </button>
        </div>

        {folders.map((folder) => {
          const folderSessions = getSessionsInFolder(folder.id);
          const isCollapsed = collapsedFolders.has(folder.id);

          return (
            <div key={folder.id} className="mb-4">
              {/* Folder Header */}
              <div className="flex items-center gap-2 mb-2">
                {/* Select all checkbox */}
                {folderSessions.length > 0 && (
                  <button
                    onClick={() => selectAllInFolder(folder.id)}
                    className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] transition-colors ${
                      folderSessions.every((s) => selected.has(s.id))
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : folderSessions.some((s) => selected.has(s.id))
                          ? "bg-indigo-600/30 border-indigo-500 text-white"
                          : "border-muted-foreground/30 hover:border-indigo-500"
                    }`}
                  >
                    {folderSessions.every((s) => selected.has(s.id)) ? "✓" : folderSessions.some((s) => selected.has(s.id)) ? "–" : ""}
                  </button>
                )}

                <button
                  onClick={() => toggleCollapse(folder.id)}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span
                    className={`transition-transform ${isCollapsed ? "" : "rotate-90"}`}
                  >
                    ▶
                  </span>
                  📁 {folder.name}
                  <span className="text-xs opacity-50">
                    ({folderSessions.length})
                  </span>
                </button>

                {folder.id !== "default" && (
                  <div className="relative ml-auto">
                    <button
                      onClick={() =>
                        setFolderMenuOpen(
                          folderMenuOpen === folder.id ? null : folder.id
                        )
                      }
                      className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                      >
                        <circle cx="3" cy="8" r="1.5" />
                        <circle cx="8" cy="8" r="1.5" />
                        <circle cx="13" cy="8" r="1.5" />
                      </svg>
                    </button>
                    {folderMenuOpen === folder.id && (
                      <div className="absolute right-0 top-7 z-50 w-36 rounded-lg border bg-popover p-1 shadow-lg animate-in fade-in-0 zoom-in-95">
                        <button
                          onClick={() => {
                            setRenamingFolder(folder);
                            setFolderMenuOpen(null);
                          }}
                          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
                        >
                          ✏️ 이름 변경
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteFolder(folder.id);
                            setFolderMenuOpen(null);
                          }}
                          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          🗑️ 삭제
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Session Cards */}
              {!isCollapsed && (
                <div className="space-y-3 pl-5">
                  {folderSessions.length === 0 && (
                    <p className="text-xs text-muted-foreground py-2 italic">
                      비어 있음
                    </p>
                  )}
                  {folderSessions.map((s) => {
                    const loc = s[locale];
                    const isSelected = selected.has(s.id);
                    return (
                      <div key={s.id} className={`flex items-start gap-2 rounded-lg transition-colors ${isSelected ? "bg-indigo-500/5" : ""}`}>
                        {/* Checkbox */}
                        <button
                          onClick={() => toggleSelect(s.id)}
                          className={`mt-5 w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center text-[10px] transition-colors ${
                            isSelected
                              ? "bg-indigo-600 border-indigo-600 text-white"
                              : "border-muted-foreground/30 hover:border-indigo-500"
                          }`}
                        >
                          {isSelected ? "✓" : ""}
                        </button>
                        <Link href={`/read/${s.id}`} className="flex-1 min-w-0">
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
                                <Separator
                                  orientation="vertical"
                                  className="h-3"
                                />
                                <span>
                                  {s.words.toLocaleString()} {t.words}
                                </span>
                                <Separator
                                  orientation="vertical"
                                  className="h-3"
                                />
                                <span>
                                  📚 {s.citations} {t.citations}
                                </span>
                                <Separator
                                  orientation="vertical"
                                  className="h-3"
                                />
                                <span>
                                  🖼️ {s.diagrams} {t.figures}
                                </span>
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
                        <div className="pt-4">
                          <SessionMenu
                            sessionId={s.id}
                            folders={folders}
                            currentFolderId={
                              sessionFolders[s.id] || "default"
                            }
                            onMove={handleMoveSession}
                            onDelete={handleDeleteSession}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </main>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-card border rounded-full px-5 py-2.5 shadow-2xl animate-in slide-in-from-bottom-4">
          <span className="text-sm font-medium">
            {selected.size}개 선택
          </span>
          <div className="w-px h-5 bg-border" />
          <div className="relative">
            <button
              onClick={() => setShowBulkMove(!showBulkMove)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm hover:bg-accent transition-colors"
            >
              📂 이동
            </button>
            {showBulkMove && (
              <div className="absolute bottom-10 left-0 w-40 rounded-lg border bg-popover p-1 shadow-lg animate-in fade-in-0 zoom-in-95">
                {folders.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => bulkMove(f.id)}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
                  >
                    📁 {f.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={bulkDelete}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            🗑️ 삭제
          </button>
          <div className="w-px h-5 bg-border" />
          <button
            onClick={() => setSelected(new Set())}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            취소
          </button>
        </div>
      )}

      <FolderDialog
        open={showCreateFolder}
        onClose={() => setShowCreateFolder(false)}
        onSubmit={handleCreateFolder}
        title="새 폴더"
      />

      <FolderDialog
        open={!!renamingFolder}
        onClose={() => setRenamingFolder(null)}
        onSubmit={handleRenameFolder}
        title="폴더 이름 변경"
        initialValue={renamingFolder?.name || ""}
      />
    </div>
  );
}
