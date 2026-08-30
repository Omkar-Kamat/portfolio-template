import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex">
      <AdminSidebar email={session.email} />
      <main className="flex-1 min-w-0">
        <div className="max-w-5xl mx-auto px-6 py-8 md:px-10 md:py-10">{children}</div>
      </main>
    </div>
  );
}
