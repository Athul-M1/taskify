"use client";

import { useState } from "react";
import {
  CheckIcon,
  LockIcon,
  MailIcon,
  ListChecksIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormRegister, type FieldValues, type Path } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
  loginSchema,
  signupSchema,
  type LoginFormData,
  type SignupFormData,
} from "@/lib/auth/schemas";
import { loginRequest, registerRequest } from "@/lib/auth/client";

type AuthMode = "login" | "register";

export default function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const isLogin = mode === "login";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onLogin(data: LoginFormData) {
    setIsLoading(true);
    setError("");
    try {
      const result = await loginRequest(data);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function onSignup(data: SignupFormData) {
    setIsLoading(true);
    setError("");
    try {
      const result = await registerRequest(data);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative mx-auto flex h-screen max-w-6xl min-h-screen items-center justify-center">
      <div className="hidden flex-1 flex-col items-start justify-center gap-0 px-12 md:flex">
        <div className="mb-8 flex items-center gap-3">
          <ListChecksIcon className="size-12 text-brand" />
          <span className="text-4xl font-bold tracking-tight text-foreground">
            TaskFlow
          </span>
        </div>

        <h1 className="flex flex-col gap-2 text-5xl text-foreground/90">
          {isLogin ? "Welcome Back!" : "Join TaskFlow"}
          <span className="text-4xl text-muted-foreground">
            {isLogin
              ? "Stay Productive, Stay Organized"
              : "Start Your Productivity Journey"}
          </span>
        </h1>

        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-3 text-muted-foreground">
            <CalendarIcon className="size-5 text-blue-500 dark:text-blue-400" />
            <span>Plan your tasks efficiently</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <ClockIcon className="size-5 text-brand-soft" />
            <span>Track deadlines and progress</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <CheckIcon className="size-5 text-brand-soft" />
            <span>Achieve more with smart task management</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center p-4">
        <Card className="w-full shadow-lg md:w-96">
          <CardHeader className="text-center">
            <div className="mb-2 flex justify-center">
              <ListChecksIcon className="size-10 text-brand" />
            </div>
            <CardTitle className="text-4xl font-medium text-foreground">
              {isLogin ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <CardDescription className="mt-3 text-sm text-muted-foreground">
              {isLogin
                ? "Sign in to manage your tasks and boost productivity"
                : "Join TaskFlow and start organizing your tasks today"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="mb-6 flex w-full items-center gap-4">
              <Separator className="flex-1" />
              <span className="whitespace-nowrap text-xs text-muted-foreground">
                {isLogin ? "sign in with email" : "sign up with email"}
              </span>
              <Separator className="flex-1" />
            </div>

            {isLogin ? (
              <form
                onSubmit={loginForm.handleSubmit(onLogin)}
                className="space-y-4"
              >
                <EmailField
                  register={loginForm.register}
                  error={loginForm.formState.errors.email?.message}
                  disabled={isLoading}
                />
                <PasswordField
                  register={loginForm.register}
                  error={loginForm.formState.errors.password?.message}
                  disabled={isLoading}
                  placeholder="Enter your password"
                  id="password"
                />
                {error && (
                  <p className="text-center text-sm text-destructive">{error}</p>
                )}
                <div className="flex justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-brand transition-colors hover:text-brand-link-hover"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-brand text-brand-foreground hover:bg-brand-hover"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in…" : "Sign In"}
                </Button>
              </form>
            ) : (
              <form
                onSubmit={signupForm.handleSubmit(onSignup)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    Full Name
                  </Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 transform text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      className="pl-9"
                      {...signupForm.register("name")}
                      disabled={isLoading}
                    />
                  </div>
                  {signupForm.formState.errors.name && (
                    <p className="text-sm text-destructive">
                      {signupForm.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <EmailField
                  register={signupForm.register}
                  error={signupForm.formState.errors.email?.message}
                  disabled={isLoading}
                />
                <PasswordField
                  register={signupForm.register}
                  error={signupForm.formState.errors.password?.message}
                  disabled={isLoading}
                  placeholder="Create a password"
                  id="password"
                />
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 transform text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      className="pl-9"
                      {...signupForm.register("confirmPassword")}
                      disabled={isLoading}
                    />
                  </div>
                  {signupForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {signupForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                {error && (
                  <p className="text-center text-sm text-destructive">{error}</p>
                )}
                <Button
                  type="submit"
                  className="w-full bg-brand text-brand-foreground hover:bg-brand-hover"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account…" : "Create Account"}
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <Link
                href={isLogin ? "/register" : "/login"}
                className="font-medium text-brand transition-colors hover:text-brand-link-hover"
              >
                {isLogin ? "Create account" : "Sign in"}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

function EmailField<T extends FieldValues>({
  register,
  error,
  disabled,
}: {
  register: UseFormRegister<T>;
  error?: string;
  disabled: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="email" className="text-foreground">
        Email Address
      </Label>
      <div className="relative">
        <MailIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 transform text-muted-foreground" />
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          className="pl-9"
          {...register("email" as Path<T>)}
          disabled={disabled}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

function PasswordField<T extends FieldValues>({
  register,
  error,
  disabled,
  placeholder,
  id,
}: {
  register: UseFormRegister<T>;
  error?: string;
  disabled: boolean;
  placeholder: string;
  id: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-foreground">
        Password
      </Label>
      <div className="relative">
        <LockIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 transform text-muted-foreground" />
        <Input
          id={id}
          type="password"
          placeholder={placeholder}
          className="pl-9"
          {...register("password" as Path<T>)}
          disabled={disabled}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
