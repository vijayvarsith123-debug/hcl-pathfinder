"use client";

import React, { useState, useEffect } from "react";
import { RoadmapMilestone } from "@/lib/roadmap-generator";
import { CheckCircle2, Lock, Play, Sparkles, Target, Award, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SnakeRoadmapCanvasProps {
  milestones: RoadmapMilestone[];
  activeMilestoneId: string;
  onSelectMilestone: (milestone: RoadmapMilestone) => void;
}

export const SnakeRoadmapCanvas: React.FC<SnakeRoadmapCanvasProps> = ({
  milestones,
  activeMilestoneId,
  onSelectMilestone,
}) => {
  const [windowWidth, setWindowWidth] = useState<number>(1000);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  // Render Mobile Vertical Snake Flow if screen width < 768px
  if (isMobile) {
    return (
      <div className="py-6 px-2 space-y-6 relative before:absolute before:left-8 before:top-8 before:bottom-8 before:w-1 before:bg-blue-500/30">
        {milestones.map((m, idx) => {
          const isCompleted = m.status === "completed";
          const isInProgress = m.status === "in_progress";
          const isAvailable = m.status === "available";
          const isLocked = m.status === "locked";

          return (
            <div
              key={m.id}
              onClick={() => onSelectMilestone(m)}
              className="relative flex items-start gap-4 pl-2 cursor-pointer group"
            >
              {/* Node Icon Circle */}
              <div
                className={`z-10 h-12 w-12 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 border-2 transition-all shadow-md ${
                  isCompleted
                    ? "bg-emerald-600 border-emerald-500 text-white shadow-emerald-900/20"
                    : isInProgress
                    ? "bg-blue-600 border-blue-400 text-white ring-4 ring-blue-500/30 shadow-blue-900/30"
                    : isAvailable
                    ? "bg-slate-900 border-blue-500 text-blue-400"
                    : "bg-slate-900 border-slate-700 text-slate-600"
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

              {/* Node Card */}
              <div
                className={`flex-1 p-4 rounded-xl border transition-all ${
                  isInProgress
                    ? "bg-slate-900 border-blue-500 text-white shadow-lg ring-1 ring-blue-500/40"
                    : isCompleted
                    ? "bg-slate-900/80 border-emerald-500/50 text-slate-200"
                    : isAvailable
                    ? "bg-slate-900/90 border-slate-700 text-slate-300 hover:border-blue-400"
                    : "bg-slate-900/40 border-slate-800 text-slate-500 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold text-blue-400 uppercase">
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
                    className="text-[10px] py-0 px-1.5"
                  >
                    {isCompleted ? "Completed ✓" : isInProgress ? `${m.progressPercentage}% In Progress` : isAvailable ? "Available" : "Locked"}
                  </Badge>
                </div>
                <h4 className="font-extrabold text-sm text-slate-100">{m.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{m.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // DESKTOP WINDING SNAKE ROADMAP CANVAS
  // 3 milestones per row: Snake sequence
  const colsPerRow = 3;
  const nodeWidth = 220;
  const rowHeight = 160;
  const startX = 140;
  const startY = 80;

  // Calculate (x, y) coordinates for each milestone node
  const nodeCoords = milestones.map((m, idx) => {
    const row = Math.floor(idx / colsPerRow);
    const colInRow = idx % colsPerRow;

    // Snake direction: Even rows left-to-right (0, 1, 2), Odd rows right-to-left (2, 1, 0)
    const isEvenRow = row % 2 === 0;
    const actualCol = isEvenRow ? colInRow : colsPerRow - 1 - colInRow;

    const x = startX + actualCol * nodeWidth;
    const y = startY + row * rowHeight;

    return { id: m.id, x, y, row, col: actualCol, milestone: m };
  });

  const totalRows = Math.ceil(milestones.length / colsPerRow);
  const canvasWidth = startX * 2 + (colsPerRow - 1) * nodeWidth;
  const canvasHeight = startY + totalRows * rowHeight;

  // Build SVG Path Commands
  let svgPathD = "";
  for (let i = 0; i < nodeCoords.length - 1; i++) {
    const curr = nodeCoords[i];
    const next = nodeCoords[i + 1];

    if (i === 0) {
      svgPathD += `M ${curr.x} ${curr.y}`;
    }

    if (curr.row === next.row) {
      // Straight horizontal line in same row
      svgPathD += ` L ${next.x} ${next.y}`;
    } else {
      // Curve down to next row
      const midY = (curr.y + next.y) / 2;
      svgPathD += ` C ${curr.x} ${midY}, ${next.x} ${midY}, ${next.x} ${next.y}`;
    }
  }

  return (
    <div className="w-full overflow-x-auto py-8 px-4 flex justify-center bg-slate-950/60 rounded-2xl border border-slate-800 shadow-2xl relative select-none">
      <div className="relative" style={{ width: canvasWidth, height: canvasHeight }}>
        {/* SVG Winding Path Lines */}
        <svg
          width={canvasWidth}
          height={canvasHeight}
          className="absolute inset-0 pointer-events-none z-0"
        >
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="50%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>

          {/* Background Shadow Path */}
          <path
            d={svgPathD}
            fill="none"
            stroke="#1E293B"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Glowing Winding Path Line */}
          <path
            d={svgPathD}
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]"
          />
        </svg>

        {/* Milestone Nodes */}
        {nodeCoords.map((nc) => {
          const m = nc.milestone;
          const isCompleted = m.status === "completed";
          const isInProgress = m.status === "in_progress";
          const isAvailable = m.status === "available";
          const isLocked = m.status === "locked";

          return (
            <div
              key={m.id}
              style={{ left: nc.x - 36, top: nc.y - 36 }}
              onClick={() => onSelectMilestone(m)}
              className="absolute z-10 flex flex-col items-center cursor-pointer group"
            >
              {/* Circular Node Icon */}
              <div
                className={`relative h-18 w-18 rounded-2xl flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 shadow-xl group-hover:scale-110 ${
                  isCompleted
                    ? "bg-emerald-600 border-emerald-400 text-white shadow-emerald-900/40"
                    : isInProgress
                    ? "bg-blue-600 border-blue-400 text-white ring-4 ring-blue-500/40 shadow-blue-900/50 animate-pulse"
                    : isAvailable
                    ? "bg-slate-900 border-sky-400 text-sky-400 hover:border-sky-300"
                    : "bg-slate-900/90 border-slate-700 text-slate-600"
                }`}
              >
                {/* Active Pulse Ring */}
                {isInProgress && (
                  <span className="absolute -inset-1 rounded-2xl bg-blue-500 opacity-75 animate-ping -z-10" />
                )}

                {isCompleted ? (
                  <CheckCircle2 className="h-8 w-8 text-white" />
                ) : isLocked ? (
                  <Lock className="h-6 w-6 text-slate-500" />
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-mono opacity-80 uppercase">STEP</span>
                    <span className="text-base font-extrabold leading-none">{m.stepNumber.toString().padStart(2, "0")}</span>
                  </div>
                )}

                {/* Progress Badge overlay */}
                {!isLocked && !isCompleted && (
                  <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full bg-blue-500 text-white text-[9px] font-extrabold shadow-sm">
                    {m.progressPercentage}%
                  </span>
                )}
              </div>

              {/* Node Title & Label below */}
              <div className="mt-2 text-center max-w-[150px]">
                <div className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-wider">
                  {isCompleted ? "Mastered ✓" : isInProgress ? "In Progress" : isAvailable ? "Available" : "Locked"}
                </div>
                <div className="text-xs font-extrabold text-slate-100 line-clamp-2 group-hover:text-sky-300 transition-colors">
                  {m.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
