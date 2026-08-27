"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Sparkles, ChevronRight, Flame } from "lucide-react";
import { NAVIGATION_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { profile } = useApp();

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col h-screen sticky top-0 shrink-0 select-none shadow-xs transition-colors">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center border-b border-slate-100 dark:border-slate-800 justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold shadow-md">
            <Compass className="h-4 w-4" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
            Path<span className="text-purple-600 dark:text-purple-400">AI</span>
          </span>
        </Link>
        <span className="px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-500/30 rounded-full uppercase tracking-wide">
          ML Demo
        </span>
      </div>

      {/* Career Goal Banner */}
      <div className="p-4 mx-3 my-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">
          <Sparkles className="h-3.5 w-3.5" />
          Target Goal
        </div>
        <div className="text-xs font-extrabold text-slate-900 dark:text-white line-clamp-1">
          {profile.careerGoal}
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-300 mt-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <span>{profile.weeklyHours} hrs/week</span>
          <span className="font-bold text-purple-600 dark:text-purple-400">{profile.timelineMonths} mo plan</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider px-3 mb-2">
          Learning Portal
        </div>
        {NAVIGATION_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group",
                isActive
                  ? "bg-purple-600 text-white font-extrabold shadow-md border border-purple-500/40"
                  : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive ? "text-white" : "text-slate-400 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400"
                  )}
                />
                <span>{item.name}</span>
              </div>
              {item.badge ? (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-orange-500 text-white">
                  {item.badge}
                </span>
              ) : (
                isActive && <ChevronRight className="h-3.5 w-3.5 text-white" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom User Streak Widget */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
            <Flame className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-slate-900 dark:text-white">14 Day Streak 🔥</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-300 font-medium">Top 5% Learner Consistency</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
