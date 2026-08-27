import React from "react";
import Link from "next/link";
import { Compass } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-[#273449] bg-white dark:bg-[#0B1220] py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
            <Compass className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            Path<span className="text-blue-600 dark:text-blue-400">AI</span>
          </span>
          <span className="text-xs text-slate-500 dark:text-[#CBD5E1]/60 ml-2">
            © {new Date().getFullYear()} PathAI Inc. All rights reserved.
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-[#CBD5E1] font-medium">
          <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Terms of Service
          </Link>
          <Link href="/methodology" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Recommendation Specs
          </Link>
        </div>
      </div>
    </footer>
  );
};
