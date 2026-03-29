"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit2, Loader2, Folder, Calendar, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = editingProject ? `/api/projects/${editingProject.id}` : "/api/projects";
      const method = editingProject ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      if (res.ok) {
        setShowForm(false);
        setEditingProject(null);
        setName("");
        setDescription("");
        fetchProjects();
      }
    } catch (error) {
      console.error("Failed to save project", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    toast("Delete Project", {
      description: "Are you sure you want to delete this project?",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
            if (res.ok) {
              fetchProjects();
              toast.success("Project deleted successfully");
            }
          } catch (error) {
            console.error("Failed to delete project", error);
            toast.error("Failed to delete project");
          }
        }
      }
    });
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setName(project.name);
    setDescription(project.description);
    setShowForm(true);
  };

  if (isLoading && projects.length === 0) {
    return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8 text-brand" /></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-foreground">Projects</h2>
          <p className="text-muted-foreground mt-1 text-base">Organize and track your high-level infrastructure goals.</p>
        </div>
        <Button 
            onClick={() => { setShowForm(!showForm); setEditingProject(null); setName(""); setDescription(""); }}
            className="rounded-xl h-11 px-6 bg-brand hover:bg-brand-hover text-white shadow-lg shadow-brand/20 transition-all font-bold"
        >
          {showForm ? "Cancel" : <><Plus className="mr-2 h-5 w-5" /> Create Project</>}
        </Button>
      </div>

      {showForm && (
        <Card className="border-border/50 bg-card/30 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-300">
          <CardHeader>
            <CardTitle className="text-xl">{editingProject ? "Update Project Details" : "Define New Project"}</CardTitle>
            <CardDescription>Fill in the details to establish a new project environment.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Project Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Cloud Infrastructure" className="h-11 bg-accent/10 border-border/50 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</Label>
                <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Provide context about the project..." className="h-11 bg-accent/10 border-border/50 rounded-xl" />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full h-11 rounded-xl bg-brand text-white font-bold text-lg shadow-lg shadow-brand/10">
                {isSubmitting ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
                {editingProject ? "Push Updates" : "Initialize Project"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="relative group overflow-hidden border-border/40 bg-card/40 backdrop-blur-xl hover:ring-2 hover:ring-brand/50 transition-all duration-300">
             <div className="absolute top-0 right-0 h-32 w-32 -mr-12 -mt-12 rounded-full bg-brand/5 group-hover:bg-brand/10 transition-colors duration-500" />
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="h-12 w-12 rounded-2xl bg-brand/10 flex items-center justify-center text-brand shadow-inner">
                    <Folder className="size-6" />
                </div>
                <Badge variant="brand" className="h-6">Active</Badge>
              </div>
              <div className="mt-4">
                <CardTitle className="text-xl font-bold">{project.name}</CardTitle>
                <CardDescription className="line-clamp-2 mt-1.5 text-sm">{project.description || "No description provided for this project."}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 py-4 border-y border-border/20">
                <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Created</span>
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                        <Calendar className="size-3 text-brand" />
                        {new Date(project.created_at).toLocaleDateString()}
                    </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button size="icon-sm" variant="ghost" className="h-9 w-9 rounded-xl hover:bg-accent/30" onClick={() => handleEdit(project)}>
                  <Edit2 className="h-4.5 w-4.5" />
                </Button>
                <Button size="icon-sm" variant="ghost" className="h-9 w-9 rounded-xl text-destructive hover:bg-destructive/10" onClick={() => handleDelete(project.id)}>
                  <Trash2 className="h-4.5 w-4.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!isLoading && projects.length === 0 && (
        <div className="text-center p-20 bg-muted/10 rounded-3xl border-2 border-dashed border-border/50">
          <div className="h-20 w-20 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-4">
            <Folder className="size-10 text-muted-foreground/30" />
          </div>
          <h3 className="text-xl font-bold">No projects initialized</h3>
          <p className="text-muted-foreground max-w-xs mx-auto mt-2">Create your first project to start tracking development velocity.</p>
        </div>
      )}
    </div>
  );
}
