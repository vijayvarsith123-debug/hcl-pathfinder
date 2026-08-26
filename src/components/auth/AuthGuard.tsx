"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Skeleton } from "@/components/ui/skeleton";

const PUBLIC_ROUTES = ["/", "/login", "/signup", "/forgot-password", "/onboarding"];

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isAuthLoading } = useApp();

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname || "/");

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated && !isPublicRoute) {
      router.push(`/login?redirectTo=${encodeURIComponent(pathname || "/dashboard")}`);
    }
  }, [isAuthenticated, isAuthLoading, isPublicRoute, pathname, router]);

  if (isAuthLoading && !isPublicRoute) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-4 text-center">
          <div className="h-10 w-10 bg-blue-600 rounded-xl mx-auto animate-pulse" />
          <Skeleton className="h-6 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
