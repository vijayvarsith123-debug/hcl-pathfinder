"use client";

import React, { useState } from "react";

export type BuddyMood =
  | "happy"
  | "thinking"
  | "encouraging"
  | "focused"
  | "explaining"
  | "supportive"
  | "celebrating"
  | "empathetic"
  | "mini";

interface BuddyAvatarProps {
  mood?: BuddyMood;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showBadge?: boolean;
  variant?: "head" | "full";
}

const MOOD_ASSET_MAP: { [key in BuddyMood]: string } = {
  happy: "/buddy_assets/buddy_happy.png",
  thinking: "/buddy_assets/buddy_thinking.png",
  encouraging: "/buddy_assets/buddy_encouraging.png",
  focused: "/buddy_assets/buddy_focused.png",
  explaining: "/buddy_assets/buddy_explaining.png",
  supportive: "/buddy_assets/buddy_supportive.png",
  celebrating: "/buddy_assets/buddy_celebrating.png",
  empathetic: "/buddy_assets/buddy_empathetic.png",
  mini: "/buddy_assets/buddy_mini.png",
};

export const BuddyAvatar: React.FC<BuddyAvatarProps> = ({
  mood = "happy",
  size = "md",
  className = "",
  showBadge = true,
  variant = "head",
}) => {
  const [imgError, setImgError] = useState(false);

  const dimensionMap = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const dimClass = dimensionMap[size] || dimensionMap.md;

  const moodRingColor: { [key in BuddyMood]: string } = {
    happy: "ring-blue-400/40",
    thinking: "ring-sky-400/60 animate-pulse",
    encouraging: "ring-emerald-400/50",
    focused: "ring-blue-600/60",
    explaining: "ring-orange-400/60",
    supportive: "ring-indigo-400/50",
    celebrating: "ring-amber-400/70",
    empathetic: "ring-teal-400/50",
    mini: "ring-slate-400/40",
  };

  const ringClass = moodRingColor[mood] || "ring-orange-400/40";
  const imgSrc = !imgError && MOOD_ASSET_MAP[mood] ? MOOD_ASSET_MAP[mood] : "/buddy.png";

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${dimClass} ${className}`}>
      <div className={`w-full h-full rounded-full bg-slate-900 p-0.5 ring-2 ${ringClass} shadow-md overflow-hidden flex items-center justify-center transition-all duration-300 hover:scale-105`}>
        <img
          src={imgSrc}
          alt={`Buddy AI Mascot (${mood})`}
          onError={() => setImgError(true)}
          className="w-full h-full object-contain object-center scale-110"
        />
      </div>

      {showBadge && (
        <span
          className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-[8px] font-black text-white shadow-xs capitalize"
          title={`Buddy state: ${mood}`}
        >
          P
        </span>
      )}
    </div>
  );
};

/**
 * FULL BODY BUDDY MASCOT AVATAR
 * Displays full figure mascot matching current mood state.
 */
export const BuddyFullBodyAvatar: React.FC<{
  mood?: BuddyMood;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}> = ({ mood = "happy", size = "md", className = "" }) => {
  const [imgError, setImgError] = useState(false);

  const dimensionMap = {
    sm: "w-10 h-12",
    md: "w-14 h-16",
    lg: "w-20 h-24",
    xl: "w-28 h-32",
  };

  const dimClass = dimensionMap[size] || dimensionMap.md;
  const imgSrc = !imgError && MOOD_ASSET_MAP[mood] ? MOOD_ASSET_MAP[mood] : "/buddy.png";

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${dimClass} ${className}`}>
      <div className="w-full h-full flex items-center justify-center transition-transform duration-300 hover:scale-105">
        <img
          src={imgSrc}
          alt={`Buddy PathAI Mascot (${mood})`}
          onError={() => setImgError(true)}
          className="w-full h-full object-contain object-center drop-shadow-lg"
        />
      </div>
    </div>
  );
};
