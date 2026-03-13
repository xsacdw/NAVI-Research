"use client";

import { useState, useRef, useEffect } from "react";

interface SessionMenuProps {
  sessionId: string;
  folders: { id: string; name: string }[];
  currentFolderId: string;
  onMove: (sessionId: string, folderId: string) => void;
  onDelete: (sessionId: string) => void;
}

export function SessionMenu({
  sessionId,
  folders,
  currentFolderId,
  onMove,
  onDelete,
}: SessionMenuProps) {
  const [open, setOpen] = useState(false);
  const [showMove, setShowMove] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setShowMove(false);
        setShowDeleteConfirm(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(!open);
          setShowMove(false);
          setShowDeleteConfirm(false);
        }}
        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        aria-label="세션 메뉴"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="8" cy="3" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="8" cy="13" r="1.5" />
        </svg>
      </button>

      {open && !showMove && !showDeleteConfirm && (
        <div className="absolute right-0 top-8 z-50 w-40 rounded-lg border bg-popover p-1 shadow-lg animate-in fade-in-0 zoom-in-95">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowMove(true);
            }}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
          >
            📂 이동
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowDeleteConfirm(true);
            }}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            🗑️ 삭제
          </button>
        </div>
      )}

      {open && showMove && (
        <div className="absolute right-0 top-8 z-50 w-44 rounded-lg border bg-popover p-1 shadow-lg animate-in fade-in-0 zoom-in-95">
          <div className="px-3 py-1.5 text-xs text-muted-foreground font-medium">
            이동할 폴더
          </div>
          {folders
            .filter((f) => f.id !== currentFolderId)
            .map((f) => (
              <button
                key={f.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onMove(sessionId, f.id);
                  setOpen(false);
                  setShowMove(false);
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
              >
                📁 {f.name}
              </button>
            ))}
        </div>
      )}

      {open && showDeleteConfirm && (
        <div className="absolute right-0 top-8 z-50 w-52 rounded-lg border bg-popover p-3 shadow-lg animate-in fade-in-0 zoom-in-95">
          <p className="text-sm mb-3">대시보드에서 제거할까요?</p>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowDeleteConfirm(false);
                setOpen(false);
              }}
              className="flex-1 rounded-md border px-3 py-1.5 text-xs hover:bg-accent transition-colors"
            >
              취소
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(sessionId);
                setOpen(false);
              }}
              className="flex-1 rounded-md bg-red-500/15 text-red-400 px-3 py-1.5 text-xs hover:bg-red-500/25 transition-colors"
            >
              삭제
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
