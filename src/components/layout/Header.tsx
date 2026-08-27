"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Search, LogOut, ChevronDown, CheckCircle2, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";

export const Header: React.FC = () => {
  const router = useRouter();
  const { profile, userEmail, logout, systemProgress, theme, toggleTheme } = useApp();
  const [showMenu, setShowMenu] = useState(false);

  const activeTask = systemProgress.todaysFocusTask;

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-[#273449] bg-white dark:bg-[#172033] px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs transition-colors">
      {/* Search & Search Context */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-400" />
          <input
            type="text"
            placeholder="Search ML topics, resources, algorithms, or code..."
            className="w-full h-9 pl-9 pr-4 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#273449] text-xs text-slate-900 dark:text-[#F8FAFC] placeholder:text-slate-400 dark:placeholder:text-[#94A3B8] focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
      </div>

      {/* Right Top Bar Actions */}
      <div className="flex items-center gap-3">
        {/* Recommended Action Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-500/30 text-xs">
          <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          <span className="text-slate-600 dark:text-[#CBD5E1] font-medium">Next Action:</span>
          <span className="font-bold text-slate-900 dark:text-white line-clamp-1">{activeTask?.title || "Decision Trees Task"}</span>
        </div>

        {/* Theme Switcher Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="h-9 w-9 p-0 text-slate-600 dark:text-[#CBD5E1] hover:text-blue-600 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-slate-700" />
          )}
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="relative h-9 w-9 p-0 text-slate-600 dark:text-[#CBD5E1] hover:text-slate-900 dark:hover:text-white rounded-xl"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-[#172033]" />
        </Button>

        <div className="h-4 w-px bg-slate-200 dark:bg-[#273449] mx-1" />

        {/* Profile Dropdown */}
        <div className="relative">
          <div
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-[#1E293B] p-1.5 rounded-xl transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {profile.fullName ? profile.fullName.split(" ").map((n) => n[0]).join("") : "VK"}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC] leading-tight">{profile.fullName}</span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">{profile.careerGoal}</span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 ml-1" />
          </div>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white dark:bg-[#172033] border border-slate-200 dark:border-[#273449] p-1 shadow-xl z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-[#273449]/60">
                <p className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC] truncate">{profile.fullName}</p>
                <p className="text-[10px] text-slate-500 dark:text-[#CBD5E1] truncate">{userEmail}</p>
              </div>

              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer transition-colors mt-1"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
