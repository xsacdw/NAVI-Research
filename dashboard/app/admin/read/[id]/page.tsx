import type { Metadata } from "next";
import { sessions } from "@/lib/data";
import { loadThesisContent, extractToc, rewriteImagePaths, copyFiguresToPublic } from "@/lib/load-session";
import { ReadClient } from "@/components/read-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const session = sessions.find((s) => s.id === id);
  if (!session) return { title: "Not Found" };
  return {
    title: `${session.ko.title} — NAVI Research`,
    description: session.ko.abstract,
  };
}

function processContent(raw: string | null, session: { folder: string; id: string }) {
  if (!raw) return { content: null, toc: [] as { id: string; text: string; level: number }[] };
  let content = rewriteImagePaths(raw, session.id);
  content = content.replace(/^##\s+(Abstract|초록)\s*$/gm, "");
  const toc = extractToc(content);
  return { content, toc };
}

export default async function ReadPage({ params }: PageProps) {
  const { id } = await params;
  const session = sessions.find((s) => s.id === id);

  // Copy figures
  if (session) copyFiguresToPublic(session.folder, session.id);

  // Load both Korean and English content at build time
  const koRaw = session?.folder ? loadThesisContent(session.folder, "ko") : null;
  const enRaw = session?.folder ? loadThesisContent(session.folder, "en") : null;

  const ko = processContent(koRaw, session || { folder: "", id });
  const en = processContent(enRaw, session || { folder: "", id });

  return (
    <ReadClient
      id={id}
      content={ko.content}
      contentEn={en.content}
      toc={ko.toc}
      tocEn={en.toc}
    />
  );
}

export function generateStaticParams() {
  return sessions.map((s) => ({ id: s.id }));
}
