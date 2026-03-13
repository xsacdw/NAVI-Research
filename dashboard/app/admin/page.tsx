"use client";

import Home from "@/app/page";
import { AdminLoginGate } from "@/components/admin-login-gate";

export default function AdminPage() {
  return (
    <AdminLoginGate>
      <Home />
    </AdminLoginGate>
  );
}
