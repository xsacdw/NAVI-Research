/**
 * Folder Store — localStorage 기반 세션 폴더 관리
 *
 * 데이터 구조:
 * localStorage["navi-folders"] = [{ id, name, order }]
 * localStorage["navi-session-folders"] = { [sessionId]: folderId }
 */

export interface Folder {
  id: string;
  name: string;
  order: number;
}

const FOLDERS_KEY = "navi-folders";
const SESSION_FOLDERS_KEY = "navi-session-folders";
const DEFAULT_FOLDER: Folder = { id: "default", name: "기본", order: 0 };

// ── Folder CRUD ──

export function getFolders(): Folder[] {
  if (typeof window === "undefined") return [DEFAULT_FOLDER];
  const raw = localStorage.getItem(FOLDERS_KEY);
  if (!raw) return [DEFAULT_FOLDER];
  try {
    const folders = JSON.parse(raw) as Folder[];
    // 기본 폴더가 항상 있도록 보장
    if (!folders.find((f) => f.id === "default")) {
      folders.unshift(DEFAULT_FOLDER);
    }
    return folders.sort((a, b) => a.order - b.order);
  } catch {
    return [DEFAULT_FOLDER];
  }
}

export function createFolder(name: string): Folder {
  const folders = getFolders();
  const id = name
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 30) + "-" + Date.now().toString(36);
  const order = Math.max(...folders.map((f) => f.order), 0) + 1;
  const folder: Folder = { id, name, order };
  folders.push(folder);
  localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
  return folder;
}

export function renameFolder(folderId: string, newName: string): void {
  const folders = getFolders();
  const folder = folders.find((f) => f.id === folderId);
  if (folder && folder.id !== "default") {
    folder.name = newName;
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
  }
}

export function deleteFolder(folderId: string): void {
  if (folderId === "default") return;
  const folders = getFolders().filter((f) => f.id !== folderId);
  localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));

  // 삭제된 폴더의 세션을 기본 폴더로 이동
  const mapping = getSessionFolderMapping();
  for (const sessionId of Object.keys(mapping)) {
    if (mapping[sessionId] === folderId) {
      mapping[sessionId] = "default";
    }
  }
  localStorage.setItem(SESSION_FOLDERS_KEY, JSON.stringify(mapping));
}

// ── Session-Folder Mapping ──

export function getSessionFolderMapping(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(SESSION_FOLDERS_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function getSessionFolder(sessionId: string): string {
  return getSessionFolderMapping()[sessionId] || "default";
}

export function moveSession(sessionId: string, folderId: string): void {
  const mapping = getSessionFolderMapping();
  mapping[sessionId] = folderId;
  localStorage.setItem(SESSION_FOLDERS_KEY, JSON.stringify(mapping));
}

export function removeSession(sessionId: string): void {
  const mapping = getSessionFolderMapping();
  delete mapping[sessionId];
  localStorage.setItem(SESSION_FOLDERS_KEY, JSON.stringify(mapping));
}
