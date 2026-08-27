"use client";

import React, { useState, useEffect } from "react";
import { RoadmapMilestone } from "@/lib/roadmap-generator";
import { CheckCircle2, Lock, Play, Sparkles, Target, Award, Clock, ArrowRight, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";

interface SnakeRoadmapCanvasProps {
  milestones: RoadmapMilestone[];
  activeMilestoneId: string;
  onSelectMilestone: (milestone: RoadmapMilestone) => void;
  compact?: boolean;
  filterStatus?: string; // "all", "completed", "in_progress", "upcoming", "locked"
  searchQuery?: string;
}

export const SnakeRoadmapCanvas: React.FC<SnakeRoadmapCanvasProps> = ({
  milestones,
  activeMilestoneId,
  onSelectMilestone,
  compact = false,
  filterStatus = "all",
  searchQuery = "",
}) => {
  const [windowWidth, setWindowWidth] = useState<number>(1024);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  // Filter & Search Match Helpers
  const matchesFilter = (m: RoadmapMilestone) => {
    if (!filterStatus || filterStatus === "all") return true;
    if (filterStatus === "completed") return m.status === "completed";
    if (filterStatus === "in_progress") return m.status === "in_progress";
    if (filterStatus === "upcoming") return m.status === "available";
    if (filterStatus === "locked") return m.status === "locked";
    return true;
  };

  const matchesSearch = (m: RoadmapMilestone) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.title.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.skills.some((s) => s.toLowerCase().includes(q)) ||
      m.topics.some((t) => t.name.toLowerCase().includes(q))
    );
  };

  // 1. MOBILE TIMELINE VIEW (< 768px)
  if (isMobile) {
    return (
      <div className="py-6 px-1 space-y-6 relative before:absolute before:left-8 before:top-8 before:bottom-8 before:w-0.5 before:border-l-2 before:border-dashed before:border-blue-500/30">
        {/* Special Start Node */}
        <div className="relative flex items-center gap-4 pl-2">
          <div className="z-10 h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg animate-pulse">
            <Play className="h-5 w-5 fill-white" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Journey Start</span>
            <h4 className="font-black text-sm text-slate-900 dark:text-white">START HERE</h4>
          </div>
        </div>

        {/* Milestone Cards */}
        {milestones.map((m) => {
          const isCompleted = m.status === "completed";
          const isInProgress = m.status === "in_progress";
          const isAvailable = m.status === "available";
          const isLocked = m.status === "locked";

          const matches = matchesFilter(m) && matchesSearch(m);
          const isDimmed = !matches;

          return (
            <div
              key={m.id}
              onClick={() => matches && onSelectMilestone(m)}
              className={`relative flex items-start gap-4 pl-2 transition-all duration-300 ${
                isDimmed ? "opacity-25 grayscale pointer-events-none scale-95" : "cursor-pointer group"
              }`}
            >
              {/* Node Circle */}
              <div
                className={`z-10 h-12 w-12 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 border-2 transition-all shadow-md ${
                  isCompleted
                    ? "bg-emerald-600 border-emerald-500 dark:border-emerald-400 text-white"
                    : isInProgress
                    ? "bg-blue-600 border-blue-400 text-white ring-4 ring-blue-500/20"
                    : isAvailable
                    ? "bg-white dark:bg-[#111827] border-blue-500 text-blue-500 dark:text-blue-400"
                    : "bg-slate-100 dark:bg-[#111827] border-slate-300 dark:border-slate-800 text-slate-400 dark:text-slate-600"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : isLocked ? (
                  <Lock className="h-5 w-5" />
                ) : (
                  <span>{m.stepNumber.toString().padStart(2, "0")}</span>
                )}
              </div>

              {/* Card */}
              <div
                className={`flex-1 p-4 rounded-2xl border transition-all ${
                  isInProgress
                    ? "bg-white dark:bg-[#172033] border-blue-500 dark:border-blue-400 text-slate-900 dark:text-white shadow-lg ring-1 ring-blue-500/40"
                    : isCompleted
                    ? "bg-white/80 dark:bg-[#172033]/80 border-emerald-500/40 text-slate-700 dark:text-[#CBD5E1]"
                    : isAvailable
                    ? "bg-white dark:bg-[#172033] border-slate-200 dark:border-[#273449] text-slate-800 dark:text-[#CBD5E1]"
                    : "bg-slate-50 dark:bg-[#111827]/40 border-slate-200 dark:border-[#273449]/40 text-slate-400 dark:text-slate-600 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[9px] font-mono font-bold text-blue-500 dark:text-blue-400 uppercase">
                    STEP {m.stepNumber.toString().padStart(2, "0")}
                  </span>
                  <Badge
                    variant={
                      isCompleted
                        ? "success"
                        : isInProgress
                        ? "primary"
                        : isAvailable
                        ? "outline"
                        : "secondary"
                    }
                    className="text-[9px] py-0 px-1.5 font-bold"
                  >
                    {isCompleted ? "Completed ✓" : isInProgress ? `${m.progressPercentage}% In Progress` : isAvailable ? "Available" : "Locked 🔒"}
                  </Badge>
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{m.title}</h4>
                <p className="text-xs text-slate-500 dark:text-[#CBD5E1] line-clamp-2 mt-1 leading-relaxed">
                  {m.description}
                </p>
                {!isLocked && (
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-[#273449]/50 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500 dark:text-[#CBD5E1] font-semibold">{m.estimatedHours} hrs</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold group-hover:underline">View Details →</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Special Completion Node */}
        <div className="relative flex items-center gap-4 pl-2 pt-2">
          <div className={`z-10 h-12 w-12 rounded-full flex items-center justify-center text-white shadow-lg ${
            milestones.every(m => m.status === "completed")
              ? "bg-gradient-to-br from-emerald-500 to-green-600 animate-bounce"
              : "bg-slate-200 dark:bg-[#111827] border-2 border-slate-300 dark:border-slate-800 text-slate-400 dark:text-slate-600"
          }`}>
            <Award className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">End Goal</span>
            <h4 className="font-black text-sm text-slate-900 dark:text-white">YOU DID IT!</h4>
          </div>
        </div>
      </div>
    );
  }

  // 2. COMPACT VIEW (CIRCLES ONLY - USED ON DASHBOARD)
  if (compact) {
    const colsPerRow = 3;
    const nodeWidth = 220;
    const rowHeight = 160;
    const startX = 140;
    const startY = 80;

    const nodeCoords = milestones.map((m, idx) => {
      const row = Math.floor(idx / colsPerRow);
      const colInRow = idx % colsPerRow;
      const isEvenRow = row % 2 === 0;
      const actualCol = isEvenRow ? colInRow : colsPerRow - 1 - colInRow;

      const x = startX + actualCol * nodeWidth;
      const y = startY + row * rowHeight;

      return { id: m.id, x, y, row, col: actualCol, milestone: m };
    });

    const totalRows = Math.ceil(milestones.length / colsPerRow);
    const canvasWidth = startX * 2 + (colsPerRow - 1) * nodeWidth;
    const canvasHeight = startY + totalRows * rowHeight;

    let svgPathD = "";
    for (let i = 0; i < nodeCoords.length - 1; i++) {
      const curr = nodeCoords[i];
      const next = nodeCoords[i + 1];

      if (i === 0) svgPathD += `M ${curr.x} ${curr.y}`;

      if (curr.row === next.row) {
        svgPathD += ` L ${next.x} ${next.y}`;
      } else {
        const midY = (curr.y + next.y) / 2;
        svgPathD += ` C ${curr.x} ${midY}, ${next.x} ${midY}, ${next.x} ${next.y}`;
      }
    }

    return (
      <div className="w-full overflow-x-auto py-6 px-4 flex justify-center bg-white dark:bg-[#172033] rounded-2xl border border-slate-200 dark:border-[#273449] shadow-sm relative select-none">
        <div className="relative" style={{ width: canvasWidth, height: canvasHeight }}>
          <svg width={canvasWidth} height={canvasHeight} className="absolute inset-0 pointer-events-none z-0">
            <path d={svgPathD} fill="none" stroke="#e2e8f0" strokeWidth="8" className="dark:stroke-[#273449]" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 6" />
            <path d={svgPathD} fill="none" stroke="#2563eb" strokeWidth="4" className="dark:stroke-blue-500" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          {nodeCoords.map((nc) => {
            const m = nc.milestone;
            const isCompleted = m.status === "completed";
            const isInProgress = m.status === "in_progress";
            const isAvailable = m.status === "available";
            const isLocked = m.status === "locked";

            return (
              <div
                key={m.id}
                style={{ left: nc.x - 24, top: nc.y - 24 }}
                onClick={() => onSelectMilestone(m)}
                className="absolute z-10 flex flex-col items-center cursor-pointer group"
              >
                <div
                  className={`relative h-12 w-12 rounded-2xl flex items-center justify-center font-bold text-xs border-2 transition-all duration-300 shadow-md group-hover:scale-110 ${
                    isCompleted
                      ? "bg-emerald-600 border-emerald-400 text-white shadow-emerald-950/20"
                      : isInProgress
                      ? "bg-blue-600 border-blue-400 text-white ring-4 ring-blue-500/20"
                      : isAvailable
                      ? "bg-white dark:bg-[#111827] border-blue-500 text-blue-500"
                      : "bg-slate-50 dark:bg-[#111827] border-slate-200 dark:border-slate-800 text-slate-400"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  ) : isLocked ? (
                    <Lock className="h-5 w-5 text-slate-400" />
                  ) : (
                    <span>{m.stepNumber.toString().padStart(2, "0")}</span>
                  )}
                </div>

                <div className="mt-2 text-center max-w-[120px]">
                  <div className="text-[10px] font-extrabold text-slate-800 dark:text-white line-clamp-1">
                    {m.title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 3. FULL DESKTOP & TABLET WINDING ROADMAP OF CARDS (>= 768px)
  const colsPerRow = isTablet ? 2 : 3;

  // Let's build the full node list containing Start, Milestones, and End
  const startNodeData = {
    id: "node-start",
    type: "start",
    title: milestones.some(m => m.status === "completed" || m.status === "in_progress") ? "CONTINUE JOURNEY" : "START HERE",
    description: "Begin your personalized career-learning journey",
  };

  const endNodeData = {
    id: "node-end",
    type: "end",
    title: "YOU DID IT!",
    description: "Complete your training milestones to unlock your full potential",
  };

  const fullNodesList = [
    { type: "start", data: startNodeData },
    ...milestones.map((m) => ({ type: "milestone", data: m })),
    { type: "end", data: endNodeData },
  ];

  // Grid Coordinate Sizing Math
  const cardWidth = isTablet ? 230 : 260;
  const cardHeight = 165;
  const horizontalGap = isTablet ? 45 : 70;
  const verticalGap = isTablet ? 60 : 75;
  const startX = 40;
  const startY = 40;

  // Compute node coordinates
  const nodeCoords = fullNodesList.map((node, idx) => {
    const row = Math.floor(idx / colsPerRow);
    const colInRow = idx % colsPerRow;

    const isEvenRow = row % 2 === 0;
    const actualCol = isEvenRow ? colInRow : colsPerRow - 1 - colInRow;

    const x = startX + actualCol * (cardWidth + horizontalGap);
    const y = startY + row * (cardHeight + verticalGap);

    return {
      id: node.data.id,
      type: node.type,
      x,
      y,
      cx: x + cardWidth / 2,
      cy: y + cardHeight / 2,
      row,
      col: actualCol,
      node,
    };
  });

  const totalRows = Math.ceil(fullNodesList.length / colsPerRow);
  const canvasWidth = startX * 2 + colsPerRow * cardWidth + (colsPerRow - 1) * horizontalGap;
  const canvasHeight = startY * 2 + totalRows * cardHeight + (totalRows - 1) * verticalGap;

  // Build Curved Winding SVG Path
  let svgPathD = "";
  for (let i = 0; i < nodeCoords.length - 1; i++) {
    const curr = nodeCoords[i];
    const next = nodeCoords[i + 1];

    if (i === 0) svgPathD += `M ${curr.cx} ${curr.cy}`;

    if (curr.row === next.row) {
      // Horizontal connecting line
      svgPathD += ` L ${next.cx} ${next.cy}`;
    } else {
      // Curve down to the next row
      const midY = (curr.cy + next.cy) / 2;
      svgPathD += ` C ${curr.cx} ${midY}, ${next.cx} ${midY}, ${next.cx} ${next.cy}`;
    }
  }

  return (
    <div className="w-full overflow-x-auto py-8 px-4 flex justify-center bg-slate-50/50 dark:bg-[#0b1220]/30 rounded-3xl border border-slate-200 dark:border-[#273449] relative select-none">
      <div className="relative shrink-0" style={{ width: canvasWidth, height: canvasHeight }}>
        {/* SVG Background Winding Lines */}
        <svg width={canvasWidth} height={canvasHeight} className="absolute inset-0 pointer-events-none z-0">
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          {/* Underlay shadow/track path */}
          <path
            d={svgPathD}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="10"
            className="dark:stroke-[#172033]"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Glowing Winding Path dotted line */}
          <path
            d={svgPathD}
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="8 8"
            className="opacity-75"
          />
        </svg>

        {/* Interactive Cards & Nodes Grid */}
        {nodeCoords.map((nc) => {
          if (nc.type === "start") {
            const hasStarted = milestones.some(m => m.status === "completed" || m.status === "in_progress");
            const firstOrCurrent = milestones.find(m => m.status === "in_progress") || milestones.find(m => m.status === "available") || milestones[0];

            return (
              <div
                key={nc.id}
                style={{ left: nc.x, top: nc.y, width: cardWidth, height: cardHeight }}
                onClick={() => firstOrCurrent && onSelectMilestone(firstOrCurrent)}
                className="absolute z-10 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl shadow-lg border border-blue-400/30 cursor-pointer hover:scale-105 transition-all duration-300"
              >
                <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center shadow-inner border border-white/20 mb-2">
                  <Play className="h-7 w-7 text-white fill-white ml-1" />
                </div>
                <div className="text-[10px] font-bold text-blue-200 tracking-wider uppercase">JOURNEY ACCELERATOR</div>
                <div className="font-black text-sm tracking-tight text-center mt-0.5">{nc.node.data.title}</div>
              </div>
            );
          }

          if (nc.type === "end") {
            const isFinished = milestones.every(m => m.status === "completed");

            return (
              <div
                key={nc.id}
                style={{ left: nc.x, top: nc.y, width: cardWidth, height: cardHeight }}
                className={`absolute z-10 flex flex-col items-center justify-center p-4 rounded-3xl shadow-lg border transition-all duration-300 ${
                  isFinished
                    ? "bg-gradient-to-br from-emerald-600 to-green-600 text-white border-emerald-400/40 hover:scale-105 cursor-pointer animate-bounce"
                    : "bg-white dark:bg-[#172033] border-slate-200 dark:border-[#273449] text-slate-400 dark:text-slate-600 opacity-60"
                }`}
              >
                <div className={`h-16 w-16 rounded-full flex items-center justify-center shadow-inner mb-2 border ${
                  isFinished ? "bg-white/10 border-white/20 text-white" : "bg-slate-100 dark:bg-[#111827] border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600"
                }`}>
                  <Award className="h-8 w-8" />
                </div>
                <div className={`text-[10px] font-bold tracking-wider uppercase ${isFinished ? "text-emerald-200" : "text-slate-400"}`}>
                  GOAL ACHIEVED
                </div>
                <div className="font-black text-sm tracking-tight text-center mt-0.5">{nc.node.data.title}</div>
              </div>
            );
          }

          // Milestone Card (nc.type === "milestone")
          const m = nc.node.data as RoadmapMilestone;
          const isCompleted = m.status === "completed";
          const isInProgress = m.status === "in_progress";
          const isAvailable = m.status === "available";
          const isLocked = m.status === "locked";

          const matches = matchesFilter(m) && matchesSearch(m);
          const isDimmed = !matches;

          return (
            <div
              key={m.id}
              style={{ left: nc.x, top: nc.y, width: cardWidth, height: cardHeight }}
              onClick={() => matches && onSelectMilestone(m)}
              className={`absolute z-10 p-4 rounded-3xl border flex flex-col justify-between transition-all duration-300 ${
                isDimmed
                  ? "opacity-20 grayscale-75 scale-95 pointer-events-none"
                  : "cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500 group"
              } ${
                isInProgress
                  ? "bg-white dark:bg-[#172033] border-blue-500 dark:border-blue-500 shadow-md ring-2 ring-blue-500/10"
                  : isCompleted
                  ? "bg-white dark:bg-[#172033] border-emerald-500/40 dark:border-emerald-500/30 text-slate-800 dark:text-[#CBD5E1]"
                  : isAvailable
                  ? "bg-white dark:bg-[#172033] border-slate-200 dark:border-[#273449]"
                  : "bg-slate-50 dark:bg-[#111827]/40 border-slate-200 dark:border-[#273449]/40 opacity-70"
              }`}
            >
              {/* Card Glow / Glow Ping */}
              {isInProgress && !isDimmed && (
                <div className="absolute inset-0 rounded-3xl bg-blue-500/5 animate-pulse pointer-events-none" />
              )}

              {/* Step & Status Badges */}
              <div className="flex items-center justify-between shrink-0">
                <span className="text-[10px] font-mono font-extrabold text-blue-500 dark:text-blue-400">
                  STEP {m.stepNumber.toString().padStart(2, "0")}
                </span>
                <div className="flex items-center gap-1.5">
                  {m.isWeakArea && (
                    <Badge variant="warning" className="text-[8px] py-0 px-1 font-bold">Gap ⚠️</Badge>
                  )}
                  <Badge
                    variant={
                      isCompleted
                        ? "success"
                        : isInProgress
                        ? "primary"
                        : isAvailable
                        ? "outline"
                        : "secondary"
                    }
                    className="text-[9px] py-0 px-1.5 font-bold"
                  >
                    {isCompleted ? "Completed" : isInProgress ? "Active" : isAvailable ? "Available" : "Locked 🔒"}
                  </Badge>
                </div>
              </div>

              {/* Title & Description */}
              <div className="my-1.5 flex-1 min-w-0">
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {m.title}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-[#CBD5E1] line-clamp-2 mt-0.5 leading-normal">
                  {m.description}
                </p>
              </div>

              {/* Footer Progress & Time */}
              <div className="space-y-1.5 shrink-0 pt-1.5 border-t border-slate-100 dark:border-[#273449]/40">
                <div className="flex items-center justify-between text-[9px] text-slate-500 dark:text-[#CBD5E1] font-semibold">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{m.estimatedHours} hrs</span>
                  </span>
                  <span>{m.progressPercentage}%</span>
                </div>
                <ProgressBar value={m.progressPercentage} size="sm" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
