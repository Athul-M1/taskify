import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/get-user";
import { DashboardView } from "@/components/dashboard/DashboardView"; 

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return (
    <div className="space-y-6">
      <DashboardView user={user} className="animate-in fade-in slide-in-from-bottom-4 duration-500" />
    </div>
  );
}
