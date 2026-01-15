import bcrypt from "bcrypt";

export type User = {
	id: number;
	email: string;
	passwordHash: string;
	name?: string;
	role: "user" | "admin";
};

export const users: User[] = [];

export async function ensureSeedAdmin() {
	const adminEmail = process.env.ADMIN_EMAIL;
	const adminPassword = process.env.ADMIN_PASSWORD;
	if (!adminEmail || !adminPassword) return;

	const existing = users.find((u) => u.email.toLowerCase() === adminEmail.toLowerCase());
	if (existing) return;

	const passwordHash = await bcrypt.hash(adminPassword, 10);
	users.push({ id: 1, email: adminEmail, passwordHash, name: "Admin", role: "admin" });
}

export function toPublicUser(user: User) {
	const { passwordHash: _, ...sanitized } = user;
	return sanitized;
}
