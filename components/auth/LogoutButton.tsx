import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LogoutButton({ 
    children, 
    className, 
    ...props 
}: React.ComponentProps<typeof Button>) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      router.push("/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button 
        type="button" 
        variant="outline" 
        onClick={logout} 
        disabled={loading}
        className={cn(className)}
        {...props}
    >
      {loading ? "Signing out…" : (children || "Sign out")}
    </Button>
  );
}
