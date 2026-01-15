import { getSessionUserFromCookies } from "@/lib/server/auth";
import AccountClient from "./account-client";

export default async function AccountPage() {
  const user = await getSessionUserFromCookies();

  return (
    <main className="min-h-screen bg-background pt-24">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        <h1 className="text-2xl font-bold">Account</h1>
        <p className="text-sm text-muted-foreground">
          This page is rendered on the server and reads your session from an HttpOnly cookie.
        </p>

        <div className="rounded-lg border bg-card p-4">
          {user ? (
            <div className="space-y-1">
              <div className="font-medium">Signed in</div>
              <div className="text-sm text-muted-foreground">Email: {user.email}</div>
              <div className="text-sm text-muted-foreground">Role: {user.role}</div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="font-medium">Not signed in</div>
              <div className="text-sm text-muted-foreground">Go to /login to sign in.</div>
            </div>
          )}
        </div>

        <AccountClient signedIn={!!user} />
      </div>
    </main>
  );
}
