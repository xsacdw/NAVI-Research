import fs from "fs";
import path from "path";

const SESSIONS_DIR = path.join(process.cwd(), "..", "docs", "sessions");

/**
 * Load thesis markdown content from docs/sessions/{folder}/output/thesis.md
 * If locale is "en", try thesis_en.md first, fallback to thesis.md
 */
export function loadThesisContent(sessionFolder: string, locale?: string): string | null {
  if (locale === "en") {
    const enPath = path.join(SESSIONS_DIR, sessionFolder, "output", "thesis_en.md");
    try {
      return fs.readFileSync(enPath, "utf-8");
    } catch {
      // fallback to Korean
    }
  }
  const thesisPath = path.join(SESSIONS_DIR, sessionFolder, "output", "thesis.md");
  try {
    return fs.readFileSync(thesisPath, "utf-8");
  } catch {
    return null;
  }
}

/**
 * Extract headings from markdown for TOC generation
 */
export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function extractToc(markdown: string): TocItem[] {
  const headingRegex = /^(#{1,4})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    // Skip title line (first h1) and metadata lines
    if (level === 1 && items.length === 0) continue;
    // Skip Abstract/초록 from TOC
    if (/^(abstract|초록)$/i.test(text)) continue;
    // Create slug-style id
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 60);
    items.push({ id, text, level });
  }

  return items;
}

/**
 * Copy figure images from docs/sessions to public/figures at build time
 */
export function getSessionFigures(sessionFolder: string): string[] {
  const figuresDir = path.join(SESSIONS_DIR, sessionFolder, "output", "figures");
  try {
    const files = fs.readdirSync(figuresDir);
    return files.filter((f) => /\.(png|jpg|jpeg|svg|webp)$/i.test(f));
  } catch {
    return [];
  }
}

/**
 * Copy figure files to public/figures/ for static serving
 */
export function copyFiguresToPublic(sessionFolder: string, sessionId: string): void {
  const figuresDir = path.join(SESSIONS_DIR, sessionFolder, "output", "figures");
  const publicDir = path.join(process.cwd(), "public", "figures");

  // Ensure public/figures exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  try {
    const files = fs.readdirSync(figuresDir);
    for (const file of files) {
      if (/\.(png|jpg|jpeg|svg|webp)$/i.test(file)) {
        const src = path.join(figuresDir, file);
        const dest = path.join(publicDir, `${sessionId}_${file}`);
        fs.copyFileSync(src, dest);
      }
    }
  } catch {
    // No figures directory — that's ok
  }
}

/**
 * Transform markdown image paths to use public/figures/ paths
 * e.g. ![caption](figures/fig1.png) → ![caption](/figures/session-id_fig1.png)
 */
export function rewriteImagePaths(markdown: string, sessionId: string): string {
  return markdown.replace(
    /!\[([^\]]*)\]\((?:\.\/)?figures\/([^)]+)\)/g,
    `![$1](/figures/${sessionId}_$2)`
  );
}
