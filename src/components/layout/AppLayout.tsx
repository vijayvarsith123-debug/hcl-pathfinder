"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { BuddyFloatingWidget } from "@/components/buddy/BuddyFloatingWidget";

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] text-slate-900 dark:text-[#F8FAFC] font-sans antialiased relative transition-colors">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
        </div>
        <BuddyFloatingWidget />
      </div>
    </AuthGuard>
  );
};
