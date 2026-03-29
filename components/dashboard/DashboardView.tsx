"use client"
import { ProjectManager } from "./ProjectManager";
import { TaskManager } from "./TaskManager";
import { UserManager } from "./UserManager";
import { DeveloperTaskManager } from "./DeveloperTaskManager";
import { DeveloperDashboardHome } from "./DeveloperDashboardHome";
import { DeveloperProjectManager } from "./DeveloperProjectManager";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export function DashboardView({ user, className }: { 
    user: { id: string, name: string, email: string, role: string },
    className?: string 
}) {
  const searchParams = useSearchParams();
  const activeView = searchParams.get("view") || (user.role === "admin" ? "projects" : "tasks");

  const isAdmin = user.role === "admin";

  return (
    <div className={cn("min-h-[400px]", className)}>
        {isAdmin ? (
            <>
                {activeView === "projects" && <ProjectManager />}
                {activeView === "tasks" && <TaskManager />}
                {activeView === "users" && <UserManager />}
            </>
        ) : (
            <>
                {activeView === "home" && <DeveloperDashboardHome user={user} />}
                {activeView === "tasks" && <DeveloperTaskManager user={user} />}
                {activeView === "projects" && <DeveloperProjectManager user={user} />}
            </>
        )}
    </div>
  );
}
