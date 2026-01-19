import AdminDashboard from "@/components/admin/admin-dashboard"
import { getSessionUserFromCookies } from "@/lib/server/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const user = await getSessionUserFromCookies();
  if (!user || user.role !== "admin") redirect("/admin/login");

  return (
    <AdminDashboard />
  )
}
