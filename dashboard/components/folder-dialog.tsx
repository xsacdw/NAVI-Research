"use client";

import { useState, useRef, useEffect } from "react";

interface FolderDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  title: string;
  initialValue?: string;
}

export function FolderDialog({
  open,
  onClose,
  onSubmit,
  title,
  initialValue = "",
}: FolderDialogProps) {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setValue(initialValue);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, initialValue]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in-0"
      onClick={onClose}
    >
      <div
        className="w-80 rounded-xl border bg-popover p-5 shadow-2xl animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-sm font-semibold mb-3">{title}</h3>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && value.trim()) {
              onSubmit(value.trim());
              onClose();
            }
            if (e.key === "Escape") onClose();
          }}
          placeholder="폴더 이름"
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
        />
        <div className="flex gap-2 mt-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border px-3 py-2 text-sm hover:bg-accent transition-colors"
          >
            취소
          </button>
          <button
            onClick={() => {
              if (value.trim()) {
                onSubmit(value.trim());
                onClose();
              }
            }}
            disabled={!value.trim()}
            className="flex-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-500 disabled:opacity-40 transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
