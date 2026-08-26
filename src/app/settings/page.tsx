"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/context/AppContext";
import { User, Settings, Bell, Shield, RotateCcw, Save } from "lucide-react";

export default function SettingsPage() {
  const { profile, updateProfile, resetDemoData } = useApp();

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
      <div className="space-y-8 pb-12 max-w-4xl">
        {/* Header */}
        <div className="border-b border-slate-200 pb-6">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="primary" className="bg-blue-50 text-blue-700 border-blue-200">
              Account Preferences
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
          <p className="text-xs text-slate-500 mt-1">Manage your learner profile, weekly commitment, and demo preferences.</p>
        </div>

        {/* SETTINGS FORM */}
        <form onSubmit={handleSave} className="space-y-6">
          <Card className="shadow-sm border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900">Learner Profile Settings</CardTitle>
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
                  <span className="text-xs text-emerald-600 font-semibold">Preferences updated!</span>
                ) : (
                  <span />
                )}
                <Button type="submit" variant="primary" size="sm" leftIcon={<Save className="h-4 w-4" />}>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* DEMO RESET CARD */}
          <Card className="shadow-sm border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900">Hackathon Demo State Controls</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Reset all adaptive path modifications and assessment scores back to the initial Machine Learning Engineer baseline.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Button
                type="button"
                variant="outline"
                onClick={resetDemoData}
                leftIcon={<RotateCcw className="h-4 w-4" />}
                className="text-xs"
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
