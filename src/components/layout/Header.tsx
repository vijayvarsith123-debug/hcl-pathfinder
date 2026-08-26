"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Search, LogOut, ChevronDown, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";

export const Header: React.FC = () => {
  const router = useRouter();
  const { profile, userEmail, logout, systemProgress } = useApp();
  const [showMenu, setShowMenu] = useState(false);

  const activeTask = systemProgress.todaysFocusTask;

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900 px-6 flex items-center justify-between sticky top-0 z-30 shadow-md">
      {/* Search & Search Context */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search ML topics, resources, algorithms, or code..."
            className="w-full h-9 pl-9 pr-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
        </div>
      </div>

      {/* Right Top Bar Actions */}
      <div className="flex items-center gap-3">
        {/* Recommended Action Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-xs">
          <CheckCircle2 className="h-3.5 w-3.5 text-purple-400" />
          <span className="text-slate-400 font-medium">Next Action:</span>
          <span className="font-bold text-white line-clamp-1">{activeTask?.title || "Decision Trees Task"}</span>
        </div>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="relative h-9 w-9 p-0 text-slate-400 hover:text-white rounded-lg"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-purple-500 ring-2 ring-slate-900" />
        </Button>

        <div className="h-4 w-px bg-slate-800 mx-1" />

        {/* Profile Dropdown */}
        <div className="relative">
          <div
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 cursor-pointer hover:bg-slate-800/80 p-1.5 rounded-lg transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {profile.fullName ? profile.fullName.split(" ").map((n) => n[0]).join("") : "VK"}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-tight">{profile.fullName}</span>
              <span className="text-[10px] text-purple-400 font-semibold">{profile.careerGoal}</span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 ml-1" />
          </div>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl bg-slate-900 border border-slate-800 p-1 shadow-2xl z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="text-xs font-bold text-white truncate">{profile.fullName}</p>
                <p className="text-[10px] text-slate-400 truncate">{userEmail}</p>
              </div>

              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-rose-400 hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer transition-colors mt-1"
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
