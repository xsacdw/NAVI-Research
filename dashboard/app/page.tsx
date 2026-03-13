"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/header";
import { useLocale } from "@/components/locale-provider";
import { sessions } from "@/lib/data";

export default function Home() {
  const { locale, t } = useLocale();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-3xl space-y-4 px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">{t.pageTitle}</h1>
          <p className="text-sm text-muted-foreground">{t.pageDesc}</p>
        </div>

        {sessions.map((s) => {
          const loc = s[locale];
          return (
            <Link key={s.id} href={`/read/${s.id}`}>
              <Card className="group cursor-pointer transition-all hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 mb-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg leading-snug group-hover:text-indigo-400 transition-colors">
                    {loc.title}
                  </CardTitle>
                  {loc.subtitle && (
                    <p className="text-sm text-muted-foreground">{loc.subtitle}</p>
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
                      PTCS {s.ptcs}%
                    </Badge>
                    <Badge variant="secondary">{s.type}</Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </main>
    </div>
  );
}
