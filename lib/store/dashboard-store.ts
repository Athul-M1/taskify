import { create } from 'zustand';
import { Task, Project, User } from '@/lib/types/dashboard';

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  last_page: number;
}

interface DashboardState {
  tasks: Task[];
  projects: Project[];
  users: User[];
  tasksMeta: PaginationMeta | null;
  usersMeta: PaginationMeta | null;
  isLoadingTasks: boolean;
  isLoadingProjects: boolean;
  isLoadingUsers: boolean;
  
  // Actions
  setTasks: (tasks: Task[]) => void;
  setProjects: (projects: Project[]) => void;
  setUsers: (users: User[]) => void;
  
  fetchTasks: (filters?: { project_id?: string; status?: string; assigned_to?: string; date?: string; page?: number; limit?: number }) => Promise<void>;
  fetchProjects: () => Promise<void>;
  fetchUsers: (page?: number, limit?: number) => Promise<void>;
  
  updateTaskStatus: (taskId: string, status: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  tasks: [],
  projects: [],
  users: [],
  tasksMeta: null,
  usersMeta: null,
  isLoadingTasks: false,
  isLoadingProjects: false,
  isLoadingUsers: false,

  setTasks: (tasks) => set({ tasks }),
  setProjects: (projects) => set({ projects }),
  setUsers: (users) => set({ users }),

  fetchTasks: async (filters) => {
    set({ isLoadingTasks: true });
    try {
      let url = "/api/tasks?";
      if (filters?.project_id) url += `project_id=${filters.project_id}&`;
      if (filters?.status) url += `status=${filters.status}&`;
      if (filters?.assigned_to) url += `assigned_to=${filters.assigned_to}&`;
      if (filters?.date) url += `date=${filters.date}&`;
      if (filters?.page) url += `page=${filters.page}&`;
      if (filters?.limit) url += `limit=${filters.limit}&`;
      
      const res = await fetch(url.slice(0, -1));
      if (res.ok) {
        const result = await res.json();
        // If it's a paginated response (has data/meta)
        if (result.data) {
          set({ tasks: result.data, tasksMeta: result.meta });
        } else {
          set({ tasks: result });
        }
      }
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      set({ isLoadingTasks: false });
    }
  },

  fetchProjects: async () => {
    // Only fetch if we don't have data yet (simple cache)
    if (get().projects.length > 0) return;
    
    set({ isLoadingProjects: true });
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        set({ projects: await res.json() });
      }
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      set({ isLoadingProjects: false });
    }
  },

  fetchUsers: async (page = 1, limit = 10) => {
    set({ isLoadingUsers: true });
    try {
      const res = await fetch(`/api/users?page=${page}&limit=${limit}`);
      if (res.ok) {
        const result = await res.json();
        if (result.data) {
          set({ users: result.data, usersMeta: result.meta });
        } else {
          set({ users: result });
        }
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      set({ isLoadingUsers: false });
    }
  },

  updateTaskStatus: async (taskId, status) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}?action=status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        // Optimistic update or just refresh? Let's optimistic update
        set(state => ({
          tasks: state.tasks.map(t => t.id === taskId ? { ...t, status: status as any } : t)
        }));
      }
    } catch (error) {
      console.error("Failed to update status", error);
      throw error;
    }
  },

  deleteTask: async (taskId) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      if (res.ok) {
        set(state => ({
          tasks: state.tasks.filter(t => t.id !== taskId)
        }));
      }
    } catch (error) {
      console.error("Failed to delete task", error);
      throw error;
    }
  }
}));
