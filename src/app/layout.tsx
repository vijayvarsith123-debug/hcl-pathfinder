import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { LenisProvider } from "@/components/providers/LenisProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PathAI — AI-Powered Personalized Learning Path Recommender",
  description:
    "Discover your personalized learning roadmap. PathAI analyzes your career goals, existing skills, and gaps to deliver adaptive weekly plans and curated resources.",
};

const ANTI_FLASH_SCRIPT = `
(function() {
  try {
    var saved = localStorage.getItem('pathai_theme');
    var theme = saved || 'dark';
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased dark`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: ANTI_FLASH_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-[#0B1220] text-slate-900 dark:text-[#F8FAFC] font-sans transition-colors">
        <LenisProvider>
          <AppProvider>{children}</AppProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
