"use client";

import * as React from "react";
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  LogOut,
  ChevronRight,
  ListChecks,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const items = [
  {
    title: "Projects",
    url: "projects",
    icon: LayoutDashboard,
  },
  {
    title: "Tasks",
    url: "tasks",
    icon: CheckSquare,
  },
  {
    title: "Users",
    url: "users",
    icon: Users,
  },
];

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const activeView = searchParams.get("view") || "projects";

    const setView = (view: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("view", view);
        router.push(`?${params.toString()}`);
    };

  return (
    <Sidebar collapsible="icon" {...props} className="border-r border-border/50 bg-sidebar/50 backdrop-blur-xl">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <ListChecks className="size-6" />
          </div>
          <div className="flex flex-col gap-0.5 group-data-[collapsible=icon]:hidden">
            <span className="text-lg font-bold tracking-tight">Taskify</span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Management Suite</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 group-data-[collapsible=icon]:hidden">
            Platform
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={activeView === item.url}
                    onClick={() => setView(item.url)}
                    className="h-11 px-4 transition-all hover:bg-accent/50 data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                  >
                    <item.icon className="size-5 shrink-0" />
                    <span className="font-medium group-data-[collapsible=icon]:hidden">{item.title}</span>
                    {activeView === item.url && (
                        <ChevronRight className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-border/50">
        <LogoutButton className="w-full justify-start gap-3 h-11 px-4 text-muted-foreground hover:text-foreground transition-colors group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center">
            <LogOut className="size-5 shrink-0 rotate-180" />
            <span className="font-medium group-data-[collapsible=icon]:hidden">Logout</span>
        </LogoutButton>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
