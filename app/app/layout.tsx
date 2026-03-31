import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { ClientSidebar } from "@/components/client/sidebar";
import { ClientHeader } from "@/components/client/header";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <ClientSidebar user={user} />
      <div className="lg:pl-72">
        <ClientHeader user={user} />
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
