"use client";

import { useState, useEffect, useRef } from "react";

interface ReadSettingsProps {
  open: boolean;
  onClose: () => void;
  settings: ReadingSettings;
  onChange: (settings: ReadingSettings) => void;
}

export interface ReadingSettings {
  fontSize: number; // 1~15, default 8
  lineHeight: number; // 1~15, default 8
  viewMode: "default" | "sepia" | "dark";
}

const STORAGE_KEY = "navi-reading-settings";

export const DEFAULT_SETTINGS: ReadingSettings = {
  fontSize: 8,
  lineHeight: 8,
  viewMode: "default",
};

export function loadSettings(): ReadingSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(s: ReadingSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

export function getFontSize(level: number): string {
  const base = 13;
  const step = 1;
  return `${base + (level - 1) * step}px`;
}

export function getLineHeight(level: number): string {
  const base = 1.5;
  const step = 0.05;
  return `${base + (level - 1) * step}`;
}

export function getViewModeClasses(mode: ReadingSettings["viewMode"]) {
  switch (mode) {
    case "sepia":
      return "bg-[#F5F0E8] text-[#5B4636]";
    case "dark":
      return "bg-[#1A1A1A] text-[#D4D4D4]";
    default:
      return "bg-[#FAFAFA] text-gray-900 dark:bg-background dark:text-foreground";
  }
}

export function ReadSettings({
  open,
  onClose,
  settings,
  onChange,
}: ReadSettingsProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  if (!open) return null;

  const update = (partial: Partial<ReadingSettings>) => {
    const next = { ...settings, ...partial };
    onChange(next);
    saveSettings(next);
  };

  const reset = () => {
    onChange(DEFAULT_SETTINGS);
    saveSettings(DEFAULT_SETTINGS);
  };

  return (
    <div
      ref={ref}
      className="absolute right-0 top-12 z-50 w-64 rounded-xl border bg-white dark:bg-card shadow-2xl p-4 animate-in fade-in-0 zoom-in-95"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-foreground">
          설정
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-foreground transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Font Size */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-700 dark:text-muted-foreground">
          글자크기
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              update({ fontSize: Math.max(1, settings.fontSize - 1) })
            }
            disabled={settings.fontSize <= 1}
            className="w-6 h-6 rounded-full border flex items-center justify-center text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-accent disabled:opacity-30 transition-colors"
          >
            −
          </button>
          <span className="text-sm font-medium w-5 text-center text-gray-900 dark:text-foreground">
            {settings.fontSize}
          </span>
          <button
            onClick={() =>
              update({ fontSize: Math.min(15, settings.fontSize + 1) })
            }
            disabled={settings.fontSize >= 15}
            className="w-6 h-6 rounded-full border flex items-center justify-center text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-accent disabled:opacity-30 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Line Height */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-700 dark:text-muted-foreground">
          줄간격
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              update({ lineHeight: Math.max(1, settings.lineHeight - 1) })
            }
            disabled={settings.lineHeight <= 1}
            className="w-6 h-6 rounded-full border flex items-center justify-center text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-accent disabled:opacity-30 transition-colors"
          >
            −
          </button>
          <span className="text-sm font-medium w-5 text-center text-gray-900 dark:text-foreground">
            {settings.lineHeight}
          </span>
          <button
            onClick={() =>
              update({ lineHeight: Math.min(15, settings.lineHeight + 1) })
            }
            disabled={settings.lineHeight >= 15}
            className="w-6 h-6 rounded-full border flex items-center justify-center text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-accent disabled:opacity-30 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={reset}
        className="w-full rounded-lg border py-2 text-sm text-gray-600 dark:text-muted-foreground hover:bg-gray-50 dark:hover:bg-accent transition-colors mb-4"
      >
        초기화
      </button>

      {/* View Mode */}
      <div className="border-t pt-3">
        <div className="text-xs font-medium text-gray-500 dark:text-muted-foreground mb-2 uppercase tracking-wider">
          보기모드
        </div>
        {(
          [
            { id: "default", label: "기본 모드" },
            { id: "sepia", label: "눈 편한 모드" },
            { id: "dark", label: "다크 모드" },
          ] as const
        ).map((mode) => (
          <button
            key={mode.id}
            onClick={() => update({ viewMode: mode.id })}
            className={`flex items-center gap-2.5 w-full rounded-lg px-3 py-2 text-sm transition-colors ${
              settings.viewMode === mode.id
                ? "text-indigo-600 dark:text-indigo-400 font-medium"
                : "text-gray-600 dark:text-muted-foreground hover:bg-gray-50 dark:hover:bg-accent"
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                settings.viewMode === mode.id
                  ? "border-indigo-600 dark:border-indigo-400"
                  : "border-gray-300 dark:border-muted-foreground/30"
              }`}
            >
              {settings.viewMode === mode.id && (
                <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
              )}
            </span>
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  );
}
