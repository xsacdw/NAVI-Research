"use client";

import { useLocale } from "@/components/locale-provider";

export function LangToggle() {
  const { t, toggle } = useLocale();
  return (
    <button
      onClick={toggle}
      className="rounded-md border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-indigo-500 hover:text-indigo-400"
      title="Switch language"
    >
      {t.langLabel}
    </button>
  );
}
