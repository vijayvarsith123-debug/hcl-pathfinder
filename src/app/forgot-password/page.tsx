"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Compass, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { useApp } from "@/context/AppContext";

export default function ForgotPasswordPage() {
  const { resetUserPassword } = useApp();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await resetUserPassword(email);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err?.message || "Failed to send reset link. Please check the email entered.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
            <Compass className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            Path<span className="text-blue-600">AI</span>
          </span>
        </Link>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Reset your password</h2>
        <p className="mt-1 text-xs text-slate-500">
          Enter your email to receive password reset instructions.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="shadow-lg border-slate-200 bg-white">
          <CardContent className="pt-6 space-y-6">
            {error && <Alert variant="error">{error}</Alert>}

            {isSubmitted ? (
              <div className="text-center py-4 space-y-4">
                <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Check your inbox</h3>
                <p className="text-xs text-slate-600">
                  We sent a reset link to <strong className="text-slate-900">{email}</strong> if an account exists.
                </p>
                <Link href="/login" className="inline-block mt-2">
                  <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email address"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="h-4 w-4" />}
                  placeholder="you@example.com"
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full h-11 text-sm font-semibold"
                  isLoading={isLoading}
                >
                  Send Reset Link
                </Button>

                <div className="text-center pt-2">
                  <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600">
                    <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
