"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Folder, 
  Layers, 
  Users, 
  ArrowRight,
  TrendingUp,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { Project } from "@/lib/types/dashboard";

export function DeveloperProjectManager({ user }: { user: { id: string } }) {
  const { 
    tasks, 
    projects: allProjects, 
    isLoadingProjects: isProjectsLoading, 
    isLoadingTasks: isTasksLoading,
    fetchProjects, 
    fetchTasks 
  } = useDashboardStore();

  const [displayProjects, setDisplayProjects] = useState<(Project & { task_count: number })[]>([]);

  useEffect(() => {
    const loadData = async () => {
        await Promise.all([
            fetchProjects(),
            fetchTasks({ assigned_to: user.id, limit: 100 })
        ]);
    };
    loadData();
  }, [user.id]);

  useEffect(() => {
    // Map task counts to projects
    const projectsWithCounts = allProjects.map((p) => ({
        ...p,
        task_count: tasks.filter(t => t.project_id === p.id).length
    }));
    
    // Sort projects by user's task count
    setDisplayProjects(projectsWithCounts.sort((a, b) => (b.task_count || 0) - (a.task_count || 0)));
  }, [tasks, allProjects]);

  const isLoading = isProjectsLoading || isTasksLoading;

  if (isLoading && displayProjects.length === 0) {
    return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8 text-brand" /></div>;
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black tracking-tight text-foreground flex items-center gap-3">
          My Projects
          <Folder className="size-8 text-brand fill-brand/10" />
        </h2>
        <p className="text-muted-foreground text-lg font-medium opacity-80">Track the infrastructure and goals you're contributing to.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {displayProjects.map(project => (
          <Card key={project.id} className="relative group overflow-hidden border-border/40 bg-card/40 backdrop-blur-xl rounded-[32px] p-2 hover:ring-2 hover:ring-brand/50 transition-all duration-500">
            <CardHeader className="p-6">
                <div className="flex items-start justify-between">
                    <div className="h-14 w-14 rounded-2xl bg-brand/10 flex items-center justify-center text-brand shadow-inner group-hover:scale-110 group-hover:bg-brand transition-all duration-500 group-hover:text-white">
                        <Layers className="size-7" />
                    </div>
                    {project.task_count && project.task_count > 0 ? (
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[10px] tracking-widest px-3 py-1 uppercase">{project.task_count} ACITVE TASKS</Badge>
                    ) : (
                        <Badge variant="outline" className="text-[10px] font-bold opacity-40">OBSERVER</Badge>
                    )}
                </div>
                <div className="mt-8 space-y-2">
                    <CardTitle className="text-2xl font-black tracking-tight">{project.name}</CardTitle>
                    <CardDescription className="text-base line-clamp-2 leading-relaxed opacity-80">
                        {project.description || "No project overview provided by the administration."}
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
                <div className="flex items-center gap-6 py-6 border-y border-border/10 mb-6">
                    <div className="flex flex-col gap-1 flex-1">
                        <span className="text-[10px] uppercase font-black tracking-widest text-[#6B7280]">Role</span>
                        <div className="flex items-center gap-2 text-sm font-bold">
                            <Users className="size-4 text-brand" />
                            Contributor
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                        <span className="text-[10px] uppercase font-black tracking-widest text-[#6B7280]">Velocity</span>
                        <div className="flex items-center gap-2 text-sm font-bold">
                            <TrendingUp className="size-4 text-emerald-500" />
                            Active
                        </div>
                    </div>
                </div>
                <Button className="w-full h-12 bg-muted/50 hover:bg-brand hover:text-white border-none rounded-2xl font-black text-sm tracking-widest transition-all duration-300">
                    VIEW PROJECT REPO
                    <ArrowRight className="ml-2 size-4" />
                </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {displayProjects.length === 0 && !isLoading && (
          <div className="text-center p-20 bg-muted/10 rounded-[40px] border-2 border-dashed border-border/50">
              <Folder className="size-16 text-muted-foreground/30 mx-auto mb-6" />
              <h3 className="text-2xl font-black">No active projects</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mt-2 text-lg">Contact your administrator to be assigned to high-priority infrastructure goals.</p>
          </div>
      )}
    </div>
  );
}
