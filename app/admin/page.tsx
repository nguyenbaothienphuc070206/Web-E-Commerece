import AdminDashboard from "@/components/admin/admin-dashboard"
import OrderManagement from "@/components/orders/order-management"
import { getSessionUserFromCookies } from "@/lib/server/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const user = await getSessionUserFromCookies();
  if (!user || user.role !== "admin") redirect("/admin/login");

  return (
    <main className="min-h-screen bg-background max-w-7xl mx-auto px-4 py-6 space-y-6">
      <AdminDashboard />
      <OrderManagement />
    </main>
  )
}
