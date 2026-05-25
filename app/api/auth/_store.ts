import bcrypt from "bcrypt";
import { getSupabaseAdminClient, hasSupabaseServiceConfig } from "@/lib/server/supabase";

export type User = {
    id: string;
    email: string;
    passwordHash: string;
    name?: string;
    role: "user" | "admin";
};

export const users: User[] = [];

type DbUserRow = {
    id: string;
    email: string;
    full_name: string | null;
    role: "user" | "admin";
};

function mapDbUser(row: DbUserRow, passwordHash: string): User {
    return {
        id: row.id,
        email: row.email,
        passwordHash: passwordHash,
        name: row.full_name ?? undefined,
        role: row.role,
    };
}

export async function findUserByEmail(email: string): Promise<User | null> {
    const EmailNormalized = String(email).toLowerCase().trim();

    if (!hasSupabaseServiceConfig) {
        return users.find((u) => u.email.toLowerCase() === EmailNormalized) || null;
    }

    const supabase = getSupabaseAdminClient();
    
    // Get user from users table (NO password_hash)
    const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id,email,full_name,role")
        .eq("email", EmailNormalized)
        .maybeSingle();

    if (userError) throw new Error(userError.message);
    if (!userData) return null;

    //Get password_hash from user_credentials table (if exists)
    const { data: credData, error: credError } = await supabase
        .from("user_credentials")
        .select("password_hash")
        .eq("user_id", userData.id)
        .maybeSingle();

    if (credError) throw new Error(credError.message);
    
    // For OAuth users without passwords, use empty string as passwordHash
    const passwordHash = credData?.password_hash || '';

    // Combine data
    return mapDbUser(userData as DbUserRow, passwordHash);
}

export async function createUser(input: {
    email: string;
    passwordHash: string;
    name?: string;
    role: "user" | "admin";
}): Promise<User> {
    const EmailNormalized = String(input.email).toLowerCase().trim();

    if (!hasSupabaseServiceConfig) {
        const user: User = {
            id: String(users.length + 1),
            email: EmailNormalized,
            passwordHash: input.passwordHash,
            name: input.name,
            role: input.role,
        };
        users.push(user);
        return user;
    }

    const supabase = getSupabaseAdminClient();
    
    const { data: userData, error: userError } = await supabase
        .from("users")
        .insert([
            {
                email: EmailNormalized,
                full_name: input.name ?? null,
                role: input.role,
                email_verified: true, 
                is_active: true,
            },
        ])
        .select("id,email,full_name,role")
        .single();

    if (userError) {
        throw new Error(`User creation failed: ${userError.message}`);
    }

    if (input.passwordHash) {
        const { error: credError } = await supabase
            .from("user_credentials")
            .insert([
                {
                    user_id: userData.id,
                    email: EmailNormalized,
                    password_hash: input.passwordHash,
                    password_salt: "",
                },
            ]);

        if (credError) {
            await supabase.from("users").delete().eq("id", userData.id);
            throw new Error(`Credential creation failed: ${credError.message}`);
        }
    }

    return mapDbUser(userData as DbUserRow, input.passwordHash);
}

export async function ensureSeedAdmin() {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminEmail || !adminPassword) return;

    try {
        const existing = await findUserByEmail(adminEmail);
        if (existing) return;

        const passwordHash = await bcrypt.hash(adminPassword, 12);
        await createUser({ email: adminEmail, passwordHash, name: "Admin", role: "admin" });
    } catch (error) {
        console.error('Failed to seed admin:', error);
    }
}

export function toPublicUser(user: User) {
    const { passwordHash: _, ...sanitized } = user;
    return sanitized;
}