import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Check if user has admin access
  if (!["super_admin", "admin", "manager"].includes(user.role_name || "")) {
    redirect("/app");
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar user={user} />
      <div className="lg:pl-72">
        <AdminHeader user={user} />
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
