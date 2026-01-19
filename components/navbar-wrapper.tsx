import { getSessionUserFromCookies } from "@/lib/server/auth";
import NavbarDemo from "./resizable-navbar";

export default async function NavbarWrapper() {
  const sessionUser = await getSessionUserFromCookies();
  const user = sessionUser ? { ...sessionUser, id: String(sessionUser.id) } : null;
  
  return <NavbarDemo user={user} />;
}