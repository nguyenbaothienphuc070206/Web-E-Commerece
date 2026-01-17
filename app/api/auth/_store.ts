import bcrypt from "bcrypt";
import { getSupabaseAdminClient, hasSupabaseServiceConfig } from "@/lib/server/supabase";

export type User = {
	id: number;
	email: string;
	passwordHash: string;
	name?: string;
	role: "user" | "admin";
};

export const users: User[] = [];

type DbUserRow = {
	id: number;
	email: string;
	password_hash: string;
	name: string | null;
	role: "user" | "admin";
};

function mapDbUser(row: DbUserRow): User {
	return {
		id: Number(row.id),
		email: row.email,
		passwordHash: row.password_hash,
		name: row.name ?? undefined,
		role: row.role,
	};
}

export async function findUserByEmail(email: string): Promise<User | null> {
	const normalized = String(email).toLowerCase().trim();

	if (!hasSupabaseServiceConfig) {
		return users.find((u) => u.email.toLowerCase() === normalized) || null;
	}

	const supabase = getSupabaseAdminClient();
	const { data, error } = await supabase
		.from("users")
		.select("id,email,password_hash,name,role")
		.eq("email", normalized)
		.maybeSingle();

	if (error) throw new Error(error.message);
	if (!data) return null;
	return mapDbUser(data as DbUserRow);
}

export async function createUser(input: {
	email: string;
	passwordHash: string;
	name?: string;
	role: "user" | "admin";
}): Promise<User> {
	const normalized = String(input.email).toLowerCase().trim();

	if (!hasSupabaseServiceConfig) {
		const user: User = {
			id: users.length + 1,
			email: normalized,
			passwordHash: input.passwordHash,
			name: input.name,
			role: input.role,
		};
		users.push(user);
		return user;
	}

	const supabase = getSupabaseAdminClient();
	const { data, error } = await supabase
		.from("users")
		.insert([
			{
				email: normalized,
				password_hash: input.passwordHash,
				name: input.name ?? null,
				role: input.role,
			},
		])
		.select("id,email,password_hash,name,role")
		.single();

	if (error) throw new Error(error.message);
	return mapDbUser(data as DbUserRow);
}

export async function ensureSeedAdmin() {
	const adminEmail = process.env.ADMIN_EMAIL;
	const adminPassword = process.env.ADMIN_PASSWORD;
	if (!adminEmail || !adminPassword) return;

	const existing = await findUserByEmail(adminEmail);
	if (existing) return;

	const passwordHash = await bcrypt.hash(adminPassword, 12);
	await createUser({ email: adminEmail, passwordHash, name: "Admin", role: "admin" });
}

export function toPublicUser(user: User) {
	const { passwordHash: _, ...sanitized } = user;
	return sanitized;
}
