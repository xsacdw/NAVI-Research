"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, Locale } from "@/lib/i18n";

type TranslationStrings = typeof translations.ko;

interface LocaleContextType {
  locale: Locale;
  t: TranslationStrings;
  toggle: () => void;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: "ko",
  t: translations.ko,
  toggle: () => {},
});

export function useLocale() {
  return useContext(LocaleContext);
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("ko");

  useEffect(() => {
    const saved = localStorage.getItem("navi-locale") as Locale | null;
    if (saved && (saved === "ko" || saved === "en")) {
      setLocale(saved);
    }
  }, []);

  const toggle = () => {
    const next = locale === "ko" ? "en" : "ko";
    setLocale(next);
    localStorage.setItem("navi-locale", next);
  };

  return (
    <LocaleContext.Provider value={{ locale, t: translations[locale], toggle }}>
      {children}
    </LocaleContext.Provider>
  );
}
