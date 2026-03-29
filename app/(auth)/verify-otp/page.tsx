"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MailIcon, ListChecksIcon, ArrowLeftIcon, RefreshCwIcon } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { verifyOtpRequest, resendOtpRequest } from "@/lib/auth/client";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (!email) {
      router.push("/register");
    }
  }, [email, router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter a 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const result = await verifyOtpRequest(email, otp);
      if (result.ok) {
        setMessage("Email verified successfully! Redirecting...");
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 2000);
      } else {
        setError(result.error);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResend() {
    if (timer > 0) return;

    setIsResending(true);
    setError("");
    setMessage("");

    try {
      const result = await resendOtpRequest(email);
      if (result.ok) {
        setMessage("A new OTP has been sent to your email.");
        setTimer(60); // 60 seconds cooldown
      } else {
        setError(result.error);
      }
    } catch {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-blue-50 p-4 dark:bg-blue-900/20">
              <MailIcon className="size-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Verify Your Email</CardTitle>
          <CardDescription className="mt-2 text-sm text-muted-foreground">
            We've sent a 6-digit verification code to <br />
            <span className="font-medium text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter 6-digit code"
                className="h-12 text-center text-2xl font-bold tracking-[0.5em]"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                disabled={isLoading}
              />
              {error && <p className="text-center text-sm text-destructive">{error}</p>}
              {message && <p className="text-center text-sm text-green-600 dark:text-green-400">{message}</p>}
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 py-6 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Didn't receive the code?{" "}
              <button
                onClick={handleResend}
                disabled={isResending || timer > 0}
                className="font-medium text-blue-600 transition-colors hover:text-blue-700 disabled:opacity-50 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {isResending ? (
                  <span className="flex items-center gap-1">
                    <RefreshCwIcon className="size-3 animate-spin" /> Resending...
                  </span>
                ) : timer > 0 ? (
                  `Resend in ${timer}s`
                ) : (
                  "Resend Code"
                )}
              </button>
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center border-t py-4">
          <Link
            href="/register"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeftIcon className="size-4" />
            Back to Registration
          </Link>
        </CardFooter>
        </Card>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="absolute top-8 left-8 hidden items-center gap-2 md:flex"
      >
        <ListChecksIcon className="size-8 text-blue-600 dark:text-blue-400" />
        <span className="text-2xl font-bold tracking-tight text-foreground">Taskify</span>
      </motion.div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
