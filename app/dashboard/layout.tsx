import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/dashboard/AdminSidebar"
import { AdminHeader } from "@/components/dashboard/AdminHeader"
import { TooltipProvider } from "@/components/ui/tooltip"
import { getSessionUser } from "@/lib/auth/get-user"
import { DeveloperSidebar } from "@/components/dashboard/DeveloperSidebar"
import { AuthGuard } from "@/components/auth/AuthGuard"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getSessionUser()
  const isAdmin = user?.role === "admin"

  return (
    <AuthGuard initialUser={user as any}>
      <TooltipProvider delayDuration={0}>
        <SidebarProvider>
          {isAdmin ? <AdminSidebar /> : <DeveloperSidebar />}
          <SidebarInset className="bg-background/50 backdrop-blur-3xl overflow-hidden">
            <AdminHeader user={user} />
            <main className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="mx-auto max-w-[1400px]">
                    {children}
                </div>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </AuthGuard>
  )
}
