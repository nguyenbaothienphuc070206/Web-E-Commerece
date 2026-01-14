export type User = { id: number; email: string; password: string; name?: string; role: "user" | "admin" }
export const users: User[] = [{ id: 1, email: "admin@site.com", password: "admin123", name: "Admin", role: "admin" }]
