import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { sessions } from "@/lib/data";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-3xl items-center px-4">
          <span className="mr-2 text-xl">🧭</span>
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-lg font-bold text-transparent">
            NAVI Research
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-3xl space-y-4 px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">연구 세션</h1>
          <p className="text-sm text-muted-foreground">
            시뮬레이션으로 생성된 논문을 열람합니다
          </p>
        </div>

        {sessions.map((s) => (
          <Link key={s.id} href={`/read/${s.id}`}>
            <Card className="group cursor-pointer transition-all hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg leading-snug group-hover:text-indigo-400 transition-colors">
                  {s.title}
                </CardTitle>
                {s.subtitle && (
                  <p className="text-sm text-muted-foreground">{s.subtitle}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {s.abstract}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>📅 {s.date}</span>
                  <Separator orientation="vertical" className="h-3" />
                  <span>{s.words.toLocaleString()} words</span>
                  <Separator orientation="vertical" className="h-3" />
                  <span>📚 {s.citations} citations</span>
                  <Separator orientation="vertical" className="h-3" />
                  <span>🖼️ {s.diagrams} fig</span>
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant={s.ptcs >= 80 ? "default" : "secondary"}
                    className={
                      s.ptcs >= 80
                        ? "bg-green-500/15 text-green-400 hover:bg-green-500/20"
                        : "bg-amber-500/15 text-amber-400 hover:bg-amber-500/20"
                    }
                  >
                    PTCS {s.ptcs}%
                  </Badge>
                  <Badge variant="secondary">{s.type}</Badge>
                  <Badge variant="outline">{s.lang}</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </main>
    </div>
  );
}
