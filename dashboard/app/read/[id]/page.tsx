import { sessions } from "@/lib/data";
import { loadThesisContent, extractToc, rewriteImagePaths, copyFiguresToPublic } from "@/lib/load-session";
import { ReadClient } from "@/components/read-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ReadPage({ params }: PageProps) {
  const { id } = await params;
  const session = sessions.find((s) => s.id === id);

  // Load thesis markdown
  let content = session?.folder ? loadThesisContent(session.folder) : null;
  let toc: { id: string; text: string; level: number }[] = [];

  if (content && session) {
    // Copy figures to public
    copyFiguresToPublic(session.folder, session.id);
    // Rewrite image paths
    content = rewriteImagePaths(content, session.id);
    // Remove Abstract/초록 heading from body
    content = content.replace(/^##\s+(Abstract|초록)\s*$/gm, "");
    // Extract TOC
    toc = extractToc(content);
  }

  return <ReadClient id={id} content={content} toc={toc} />;
}

export function generateStaticParams() {
  return sessions.map((s) => ({ id: s.id }));
}
