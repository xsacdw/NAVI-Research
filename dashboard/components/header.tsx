"use client";

import Link from "next/link";
import { LangToggle } from "@/components/lang-toggle";
import { useLocale } from "@/components/locale-provider";

interface HeaderProps {
  showBack?: boolean;
}

export function Header({ showBack }: HeaderProps) {
  const { t } = useLocale();
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
          <LangToggle />
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
