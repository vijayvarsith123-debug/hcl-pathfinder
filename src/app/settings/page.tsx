"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/context/AppContext";
import { User, Settings, Sun, Moon, RotateCcw, Save, Palette } from "lucide-react";

export default function SettingsPage() {
  const { profile, updateProfile, resetDemoData, theme, setThemeMode } = useApp();

  const [fullName, setFullName] = useState(profile.fullName);
  const [weeklyHours, setWeeklyHours] = useState(profile.weeklyHours);
  const [timelineMonths, setTimelineMonths] = useState(profile.timelineMonths);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ fullName, weeklyHours, timelineMonths });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <AppLayout>
      <div className="space-y-8 pb-12 max-w-4xl font-sans">
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="primary" className="bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/30">
              Account Preferences
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Settings</h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            Manage your learner profile, weekly commitment, theme mode, and demo preferences.
          </p>
        </div>

        {/* SETTINGS FORM */}
        <form onSubmit={handleSave} className="space-y-6">
          {/* THEME MODE CARD */}
          <Card className="shadow-xs border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <CardTitle className="text-base font-extrabold text-slate-900 dark:text-white">Appearance & Theme Mode</CardTitle>
              </div>
              <CardDescription className="text-xs text-slate-600 dark:text-slate-300">
                Choose your preferred visual theme for the PathAI application.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* DARK MODE OPTION */}
              <div
                onClick={() => setThemeMode("dark")}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  theme === "dark"
                    ? "border-purple-600 bg-purple-50/20 dark:bg-purple-950/40 ring-2 ring-purple-500/20"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-950"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-900 text-purple-400 border border-slate-800">
                    <Moon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-slate-900 dark:text-white">Dark Mode</div>
                    <div className="text-xs text-slate-600 dark:text-slate-300">Deep cyber navy theme</div>
                  </div>
                </div>
                {theme === "dark" && (
                  <Badge variant="primary" className="bg-purple-600 text-white font-bold text-[10px]">Active</Badge>
                )}
              </div>

              {/* LIGHT MODE OPTION */}
              <div
                onClick={() => setThemeMode("light")}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  theme === "light"
                    ? "border-purple-600 bg-purple-50/20 dark:bg-purple-950/40 ring-2 ring-purple-500/20"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-950"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-700 border border-amber-200">
                    <Sun className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-slate-900 dark:text-white">Light Mode</div>
                    <div className="text-xs text-slate-600 dark:text-slate-300">Clean high-contrast theme</div>
                  </div>
                </div>
                {theme === "light" && (
                  <Badge variant="primary" className="bg-purple-600 text-white font-bold text-[10px]">Active</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* LEARNER PROFILE SETTINGS */}
          <Card className="shadow-xs border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-base font-extrabold text-slate-900 dark:text-white">Learner Profile Settings</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                leftIcon={<User className="h-4 w-4" />}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Weekly Commitment (Hours/Week)"
                  type="number"
                  min={2}
                  max={40}
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(parseInt(e.target.value))}
                />

                <Input
                  label="Target Timeline (Months)"
                  type="number"
                  min={1}
                  max={24}
                  value={timelineMonths}
                  onChange={(e) => setTimelineMonths(parseInt(e.target.value))}
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                {isSaved ? (
                  <span className="text-xs text-emerald-600 font-bold">Preferences updated!</span>
                ) : (
                  <span />
                )}
                <Button type="submit" variant="primary" size="sm" className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs" leftIcon={<Save className="h-4 w-4" />}>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* DEMO RESET CARD */}
          <Card className="shadow-xs border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-base font-extrabold text-slate-900 dark:text-white">Hackathon Demo State Controls</CardTitle>
              <CardDescription className="text-xs text-slate-600 dark:text-slate-300">
                Reset all adaptive path modifications and assessment scores back to the initial Machine Learning Engineer baseline.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Button
                type="button"
                variant="outline"
                onClick={resetDemoData}
                leftIcon={<RotateCcw className="h-4 w-4" />}
                className="text-xs font-bold border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200"
              >
                Reset Demo to Initial Baseline
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </AppLayout>
  );
}
