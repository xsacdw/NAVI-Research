"use client";

import { useState, useEffect } from "react";

interface AdminLoginGateProps {
  children: React.ReactNode;
}

const SESSION_KEY = "navi-admin-auth";

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * 관리자 로그인 게이트
 *
 * 환경변수로 설정:
 *   NEXT_PUBLIC_ADMIN_USER — 아이디 (기본: admin)
 *   NEXT_PUBLIC_ADMIN_HASH — 비밀번호 SHA-256 해시
 *
 * 해시 생성: echo -n "비밀번호" | shasum -a 256
 */
export function AdminLoginGate({ children }: AdminLoginGateProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const ADMIN_USER = process.env.NEXT_PUBLIC_ADMIN_USER || "admin";
  const ADMIN_HASH =
    process.env.NEXT_PUBLIC_ADMIN_HASH ||
    "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"; // "admin"

  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved === "1") {
      setAuthenticated(true);
    }
    setChecking(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (username !== ADMIN_USER) {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
      return;
    }

    const hash = await hashPassword(password);
    if (hash === ADMIN_HASH) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setAuthenticated(true);
    } else {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  if (authenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-background">
      <div className="w-80 rounded-2xl border bg-white dark:bg-card p-8 shadow-xl">
        <div className="text-center mb-6">
          <span className="text-3xl">🔒</span>
          <h1 className="mt-2 text-lg font-semibold text-gray-900 dark:text-foreground">
            관리자 로그인
          </h1>
          <p className="text-xs text-gray-500 dark:text-muted-foreground mt-1">
            NAVI Research Admin
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="아이디"
              autoComplete="username"
              className="w-full rounded-lg border bg-gray-50 dark:bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              autoComplete="current-password"
              className="w-full rounded-lg border bg-gray-50 dark:bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}
