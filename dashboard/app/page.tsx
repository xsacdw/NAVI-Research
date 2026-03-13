"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/header";
import { useLocale } from "@/components/locale-provider";
import { useAdmin } from "@/components/admin-provider";
import { translateType } from "@/lib/i18n";
import { sessions as rawSessions, groups as rawGroups, type Session, type SessionGroup } from "@/lib/data";
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

  const [readSettings, setReadSettings] = useState<ReadingSettings>(DEFAULT_SETTINGS);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Mutable copies for admin editing
  const [groups, setGroups] = useState<SessionGroup[]>(rawGroups);
  const [sessionList, setSessionList] = useState<Session[]>(rawSessions);
  const [activeGroupId, setActiveGroupId] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Dialogs
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [showMoveDialog, setShowMoveDialog] = useState(false);

  // KV save status
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  // --- Load folder structure from KV on mount ---
  useEffect(() => {
    const s = loadSettings();
    setReadSettings(s);
    applyViewMode(s.viewMode);

    // Fetch folder structure from KV
    fetch("/api/folders")
      .then(r => r.ok ? r.json() : null)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any) => {
        if (data && data.groups) {
          setGroups(data.groups);
          // Apply assignments to sessions
          if (data.assignments) {
            setSessionList(prev => prev.map(s => ({
              ...s,
              group: data.assignments[s.id] || s.group || "default"
            })));
          }
        }
      })
      .catch(() => {
        // KV not available (local dev), use static data
      });
  }, []);

  // --- Save folder structure to KV (auto-save for admin) ---
  const saveToKV = useCallback(async (grps: SessionGroup[], sessions: Session[]) => {
    if (!isAdmin) return;
    const assignments: Record<string, string> = {};
    sessions.forEach(s => { assignments[s.id] = s.group || "default"; });
    try {
      const res = await fetch("/api/folders", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer quasar5-admin",
        },
        body: JSON.stringify({ groups: grps, assignments }),
      });
      if (res.ok) {
        setSaveStatus("saved");
        if (saveTimeout.current) clearTimeout(saveTimeout.current);
        saveTimeout.current = setTimeout(() => setSaveStatus("idle"), 2000);
      }
      // 404 = API not available (local dev) → silently ignore
    } catch {
      // Network error (local dev) → silently ignore
    }
  }, [isAdmin]);

  // --- Group CRUD ---
  const createGroup = () => {
    if (!newGroupName.trim()) return;
    const id = newGroupName.trim().toLowerCase().replace(/[^a-z0-9가-힣]/g, "-").slice(0, 30) + "-" + Date.now().toString(36);
    const newGroups = [...groups, { id, name: newGroupName.trim() }];
    setGroups(newGroups);
    setNewGroupName("");
    setShowCreateGroup(false);
    saveToKV(newGroups, sessionList);
  };

  const renameGroup = (groupId: string) => {
    if (!editingName.trim()) return;
    const newGroups = groups.map(g => g.id === groupId ? { ...g, name: editingName.trim() } : g);
    setGroups(newGroups);
    setEditingGroupId(null);
    setEditingName("");
    saveToKV(newGroups, sessionList);
  };

  const deleteGroup = (groupId: string) => {
    if (groupId === "default") return;
    const newGroups = groups.filter(g => g.id !== groupId);
    const newSessions = sessionList.map(s => s.group === groupId ? { ...s, group: "default" } : s);
    setGroups(newGroups);
    setSessionList(newSessions);
    if (activeGroupId === groupId) setActiveGroupId("all");
    saveToKV(newGroups, newSessions);
  };

  const moveSessionsToGroup = (targetGroupId: string) => {
    const newSessions = sessionList.map(s => selectedIds.has(s.id) ? { ...s, group: targetGroupId } : s);
    setSessionList(newSessions);
    setSelectedIds(new Set());
    setShowMoveDialog(false);
    saveToKV(groups, newSessions);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAllInView = () => {
    const visible = getVisibleSessions();
    const allSelected = visible.every(s => selectedIds.has(s.id));
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(visible.map(s => s.id)));
    }
  };


  // --- Filter ---
  const getVisibleSessions = () => {
    if (activeGroupId === "all") return sessionList;
    return sessionList.filter(s => (s.group || "default") === activeGroupId);
  };

  const visibleSessions = getVisibleSessions();

  return (
    <div className={`min-h-screen transition-colors ${getViewModeClasses(readSettings.viewMode)}`}>
      <Header />

      <div className="flex">
        {/* Left Sidebar */}
        <aside className={`${sidebarOpen ? "w-56 sm:w-64" : "w-0"} shrink-0 border-r transition-all overflow-hidden`}>
          <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto p-3 space-y-1">
            {/* All */}
            <button
              onClick={() => setActiveGroupId("all")}
              className={`flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm transition-colors ${
                activeGroupId === "all" ? "bg-indigo-500/10 text-indigo-400 font-medium" : "text-muted-foreground hover:bg-accent"
              }`}
            >
              📋 전체 <span className="ml-auto text-xs opacity-50">{sessionList.length}</span>
            </button>

            <div className="h-px bg-border my-2" />

            {/* Folders */}
            {groups.map((group) => {
              const count = sessionList.filter(s => (s.group || "default") === group.id).length;
              const isEditing = editingGroupId === group.id;
              return (
                <div key={group.id} className="group/folder relative">
                  {isEditing ? (
                    <form
                      onSubmit={(e) => { e.preventDefault(); renameGroup(group.id); }}
                      className="flex items-center gap-1 px-1"
                    >
                      <input
                        autoFocus
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onBlur={() => setEditingGroupId(null)}
                        className="flex-1 rounded border bg-transparent px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </form>
                  ) : (
                    <button
                      onClick={() => setActiveGroupId(group.id)}
                      className={`flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm transition-colors ${
                        activeGroupId === group.id ? "bg-indigo-500/10 text-indigo-400 font-medium" : "text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      📁 {group.name}
                      <span className="ml-auto text-xs opacity-50">{count}</span>
                    </button>
                  )}
                  {/* Folder actions */}
                  {isAdmin && group.id !== "default" && !isEditing && (
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 hidden group-hover/folder:flex items-center gap-0.5">
                      <button
                        onClick={() => { setEditingGroupId(group.id); setEditingName(group.name); }}
                        className="p-1 rounded text-[10px] opacity-50 hover:opacity-100 hover:bg-accent"
                        title="이름 변경"
                      >✏️</button>
                      <button
                        onClick={() => deleteGroup(group.id)}
                        className="p-1 rounded text-[10px] opacity-50 hover:opacity-100 hover:bg-red-500/10"
                        title="삭제"
                      >🗑️</button>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Create folder */}
            {isAdmin && (
              <>
                {showCreateGroup ? (
                  <form
                    onSubmit={(e) => { e.preventDefault(); createGroup(); }}
                    className="flex items-center gap-1 px-1 mt-2"
                  >
                    <input
                      autoFocus
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      onBlur={() => { if (!newGroupName.trim()) setShowCreateGroup(false); }}
                      placeholder="폴더 이름"
                      className="flex-1 rounded border bg-transparent px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </form>
                ) : (
                  <button
                    onClick={() => setShowCreateGroup(true)}
                    className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent transition-colors mt-1"
                  >
                    <span className="text-base">+</span> 새 폴더
                  </button>
                )}
              </>
            )}

            {/* Auto-save status */}
            {isAdmin && saveStatus !== "idle" && (
              <div className="pt-3 border-t mt-4 px-3">
                <span className={`text-xs ${
                  saveStatus === "saved" ? "text-green-400" :
                  saveStatus === "error" ? "text-red-400" :
                  "text-yellow-400"
                }`}>
                  {saveStatus === "saving" ? "⏳ 저장 중..." :
                   saveStatus === "saved" ? "✅ 자동 저장됨" :
                   "❌ 저장 실패"}
                </span>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 py-6 sm:py-8 max-w-3xl mx-auto">
          {/* Title bar */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {/* Mobile sidebar toggle */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1.5 rounded-lg border text-muted-foreground hover:text-foreground transition-colors sm:hidden"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </button>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                {activeGroupId === "all" ? t.pageTitle : groups.find(g => g.id === activeGroupId)?.name || t.pageTitle}
              </h1>
              {isAdmin && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/15 text-red-400 border border-red-500/20">
                  Admin
                </span>
              )}
              <span className="text-xs text-muted-foreground">({visibleSessions.length})</span>
            </div>

            {/* Admin bulk actions */}
            {isAdmin && (
              <div className="flex items-center gap-2">
                {selectedIds.size > 0 && (
                  <>
                    <span className="text-xs text-muted-foreground">{selectedIds.size}개 선택</span>
                    <button
                      onClick={() => setShowMoveDialog(true)}
                      className="text-xs border rounded-lg px-2.5 py-1 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/10 transition-colors"
                    >
                      이동
                    </button>
                    <button
                      onClick={() => setSelectedIds(new Set())}
                      className="text-xs border rounded-lg px-2.5 py-1 text-muted-foreground hover:bg-accent transition-colors"
                    >
                      취소
                    </button>
                  </>
                )}
                <button
                  onClick={selectAllInView}
                  className="text-xs border rounded-lg px-2.5 py-1 text-muted-foreground hover:bg-accent transition-colors"
                >
                  {visibleSessions.every(s => selectedIds.has(s.id)) && visibleSessions.length > 0 ? "전체 해제" : "전체 선택"}
                </button>
              </div>
            )}
          </div>

          {/* Session cards */}
          <div className="space-y-3">
            {visibleSessions.map((s) => {
              const loc = s[locale];
              const isSelected = selectedIds.has(s.id);
              return (
                <div key={s.id} className={`relative flex items-start gap-2 ${isSelected ? "ring-1 ring-indigo-500/30 rounded-lg" : ""}`}>
                  {isAdmin && (
                    <button
                      onClick={() => toggleSelect(s.id)}
                      className={`mt-5 w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center text-[10px] transition-colors ${
                        isSelected ? "bg-indigo-600 border-indigo-600 text-white" : "border-muted-foreground/30 hover:border-indigo-500"
                      }`}
                    >
                      {isSelected ? "✓" : ""}
                    </button>
                  )}
                  <Link href={`${isAdmin ? "/admin" : ""}/read/${s.id}`} className="block flex-1 min-w-0">
                    <Card className="group cursor-pointer transition-all hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5">
                      <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6">
                        <CardTitle className="text-base sm:text-lg leading-snug group-hover:text-indigo-400 transition-colors">
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
                          {isAdmin && (
                            <span className="ml-auto text-[10px] font-mono opacity-30 hidden sm:inline">
                              {groups.find(g => g.id === (s.group || "default"))?.name || "기본"}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              );
            })}
            {visibleSessions.length === 0 && (
              <p className="text-sm text-muted-foreground italic py-8 text-center">비어 있음</p>
            )}
          </div>
        </main>
      </div>

      {/* Move dialog */}
      {showMoveDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowMoveDialog(false)}>
          <div className="w-72 rounded-xl border bg-card p-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-semibold mb-3">{selectedIds.size}개 세션 이동</h3>
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {groups.map(g => (
                <button
                  key={g.id}
                  onClick={() => moveSessionsToGroup(g.id)}
                  className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors"
                >
                  📁 {g.name}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowMoveDialog(false)}
              className="mt-3 w-full text-xs text-muted-foreground border rounded-lg py-1.5 hover:bg-accent transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
