"use client";

import React from "react";
import Link from "next/link";
import { Compass, Sparkles, ArrowRight, Bot, LayoutDashboard, LogOut, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";

export const Navbar: React.FC = () => {
  const { isAuthenticated, logout, theme, toggleTheme } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/85 dark:border-[#273449]/80 bg-white/95 dark:bg-[#0B1220]/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm group-hover:bg-blue-700 transition-colors">
            <Compass className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              Path<span className="text-blue-600 dark:text-blue-400">AI</span>
            </span>
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 tracking-wider uppercase">
              Learning Recommender
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/#how-it-works" className="text-xs font-semibold text-slate-600 dark:text-[#CBD5E1] hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            How It Works
          </Link>
          <Link href="/#features" className="text-xs font-semibold text-slate-600 dark:text-[#CBD5E1] hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Features
          </Link>
          <Link href="/#careers" className="text-xs font-semibold text-slate-600 dark:text-[#CBD5E1] hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Career Catalog
          </Link>

          {isAuthenticated ? (
            <Link href="/ai-tutor" className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors flex items-center gap-1.5 bg-orange-50 dark:bg-orange-950/40 px-2.5 py-1 rounded-full border border-orange-200 dark:border-orange-900/40">
              <Bot className="h-3.5 w-3.5" />
              <span>Buddy AI Assistant</span>
            </Link>
          ) : (
            <Link href="/#buddy-preview" className="text-xs font-semibold text-slate-600 dark:text-[#CBD5E1] hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
              <Bot className="h-3.5 w-3.5 text-orange-500" />
              <span>Meet Buddy AI</span>
            </Link>
          )}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-9 w-9 p-0 text-slate-600 dark:text-[#CBD5E1] hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-colors cursor-pointer"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" />
            )}
          </Button>

          {isAuthenticated ? (
            <>
              <Link href="/dashboard">
                <Button variant="primary" size="sm" leftIcon={<LayoutDashboard className="h-4 w-4" />}>
                  Dashboard
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout} className="dark:text-[#CBD5E1] dark:hover:text-white" title="Log Out" leftIcon={<LogOut className="h-4 w-4" />}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-semibold text-slate-700 dark:text-[#CBD5E1] dark:hover:text-white">
                  Log in
                </Button>
              </Link>
              <Link href="/onboarding">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Sparkles className="h-4 w-4" />}
                  rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                >
                  Build My Learning Path
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
