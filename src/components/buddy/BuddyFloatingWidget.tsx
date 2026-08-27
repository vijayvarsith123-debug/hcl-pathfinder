"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BuddyAvatar } from "./BuddyAvatar";
import { Bot, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export const BuddyFloatingWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Drawer / Popup Window */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-2xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#172033] shadow-2xl overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          <div className="bg-slate-900 dark:bg-[#0B1220] text-white p-3.5 flex items-center justify-between border-b border-slate-800 dark:border-[#273449]">
            <div className="flex items-center gap-3">
              <BuddyAvatar mood="focused" size="sm" variant="full" />
              <div>
                <h4 className="font-extrabold text-xs text-white">Buddy Assistant</h4>
                <p className="text-[10px] text-slate-300">Task-Focused AI Learning Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-4 space-y-3 bg-slate-50 dark:bg-[#111827] text-xs text-slate-800 dark:text-[#F8FAFC]">
            <p className="text-[11px] leading-relaxed text-slate-600 dark:text-[#CBD5E1]">
              Need quick guidance, prerequisite info, or code debugging? Buddy gives direct, factual answers without fluff.
            </p>

            <div className="space-y-1.5 pt-1">
              <Link href="/ai-tutor" onClick={() => setIsOpen(false)}>
                <button className="w-full text-left p-2 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#273449] hover:border-blue-500 text-slate-800 dark:text-[#F8FAFC] font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-all flex items-center justify-between cursor-pointer text-xs">
                  <span>"What should I learn next?"</span>
                  <ExternalLink className="h-3 w-3 text-slate-400" />
                </button>
              </Link>
              <Link href="/ai-tutor" onClick={() => setIsOpen(false)}>
                <button className="w-full text-left p-2 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#273449] hover:border-blue-500 text-slate-800 dark:text-[#F8FAFC] font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-all flex items-center justify-between cursor-pointer text-xs">
                  <span>"What is my weakest skill?"</span>
                  <ExternalLink className="h-3 w-3 text-slate-400" />
                </button>
              </Link>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-[#273449]">
              <Link href="/ai-tutor" onClick={() => setIsOpen(false)}>
                <Button variant="primary" size="sm" className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold h-9 shadow-xs" leftIcon={<Bot className="h-3.5 w-3.5" />}>
                  Open Full Buddy AI Chat
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-slate-900 dark:bg-[#172033] text-white shadow-xl hover:shadow-2xl transition-all flex items-center justify-center border-2 border-orange-500 cursor-pointer group hover:scale-105 p-1"
        title="Ask Buddy AI Assistant"
      >
        <BuddyAvatar mood={isOpen ? "explaining" : "happy"} size="md" variant="full" />
      </button>
    </div>
  );
};
