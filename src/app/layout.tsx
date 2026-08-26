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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0B0F19] text-slate-100 font-sans">
        <LenisProvider>
          <AppProvider>{children}</AppProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
