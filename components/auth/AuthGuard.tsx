"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { User } from "@/lib/types/dashboard";

export function AuthGuard({ 
  children, 
  initialUser 
}: { 
  children: React.ReactNode; 
  initialUser: User | null;
}) {
  const router = useRouter();
  const { setUser, isAuthenticated } = useAuthStore();

  // Initialize store with server-fetched user
  useEffect(() => {
    setUser(initialUser);
  }, [initialUser, setUser]);

  // Protect route
  useEffect(() => {
    if (!initialUser && !isAuthenticated) {
      router.push("/login");
    }
  }, [initialUser, isAuthenticated, router]);

  // Render nothing or a loader while determining auth state
  if (!initialUser && !isAuthenticated) {
    return null; // Or a matching full-screen loading spinner
  }

  return <>{children}</>;
}
