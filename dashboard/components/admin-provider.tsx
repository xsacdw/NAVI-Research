"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const AdminContext = createContext(false);

export function useAdmin() {
  return useContext(AdminContext);
}

/**
 * 관리자 모드 Provider
 * - URL에 ?admin=1 로 접속하면 관리자 모드 활성화
 * - localStorage에 저장되어 새로고침해도 유지
 * - ?admin=0 으로 해제
 */
export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const adminParam = params.get("admin");

    if (adminParam === "1") {
      localStorage.setItem("navi-admin", "1");
      setIsAdmin(true);
      // Clean URL
      const url = new URL(window.location.href);
      url.searchParams.delete("admin");
      window.history.replaceState({}, "", url.pathname);
    } else if (adminParam === "0") {
      localStorage.removeItem("navi-admin");
      setIsAdmin(false);
      const url = new URL(window.location.href);
      url.searchParams.delete("admin");
      window.history.replaceState({}, "", url.pathname);
    } else {
      setIsAdmin(localStorage.getItem("navi-admin") === "1");
    }
  }, []);

  return (
    <AdminContext.Provider value={isAdmin}>
      {children}
    </AdminContext.Provider>
  );
}
