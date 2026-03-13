import sessionsJson from "@/public/sessions.json";

export interface LocalizedMeta {
  title: string;
  subtitle?: string;
  abstract: string;
}

export interface Session {
  id: string;
  folder: string;
  group: string;
  date: string;
  type: "Literature Review" | "Research Paper" | "Report";
  words: number;
  citations: number;
  ptcs: number;
  diagrams: number;
  ko: LocalizedMeta;
  en: LocalizedMeta;
}

export interface SessionGroup {
  id: string;
  name: string;
}

// 유일한 데이터 소스: public/sessions.json
export const groups: SessionGroup[] = sessionsJson.groups as SessionGroup[];
export const sessions: Session[] = sessionsJson.sessions as Session[];
