"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "@/components/locale-provider";
import {
  ReadSettings,
  loadSettings,
  type ReadingSettings,
  DEFAULT_SETTINGS,
} from "@/components/read-settings";

interface HeaderProps {
  showBack?: boolean;
  showSettings?: boolean;
  settings?: ReadingSettings;
  onSettingsChange?: (s: ReadingSettings) => void;
}

export function Header({ showBack, showSettings = false, settings, onSettingsChange }: HeaderProps) {
  const { t } = useLocale();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">🧭</span>
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-lg font-bold text-transparent">
            {t.siteTitle}
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {showSettings && settings && onSettingsChange && (
            <div className="relative">
              <button
                onClick={() => setSettingsOpen(!settingsOpen)}
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
                settings={settings}
                onChange={onSettingsChange}
              />
            </div>
          )}
          {showBack && (
            <Link
              href="/"
              className="rounded-md border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-indigo-500 hover:text-indigo-400"
            >
              {t.backToList}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
