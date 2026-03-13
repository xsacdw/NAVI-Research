"use client";

import { createContext, useContext, ReactNode } from "react";
import { usePathname } from "next/navigation";

const AdminContext = createContext(false);

export function useAdmin() {
  return useContext(AdminContext);
}

/**
 * 관리자 모드 Provider
 * - /admin 경로에서만 관리 UI 활성화
 * - Cloudflare Access로 /admin 경로 보호
 */
export function AdminProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <AdminContext.Provider value={isAdmin}>
      {children}
    </AdminContext.Provider>
  );
}
