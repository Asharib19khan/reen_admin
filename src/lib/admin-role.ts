import { createClient } from "@/utils/supabase/server";

export const SUPER_ADMIN_EMAIL = "yeezus196@gmail.com";

export type AdminRole = "super_admin" | "admin";

export async function getAdminRole(): Promise<{
  role: AdminRole;
  userId: string;
  email: string;
} | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  const { data: userRole, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("id", user.id)
    .single();

  console.log("DEBUG getAdminRole:", {
    userId: user.id,
    userEmail: user.email,
    userRoleData: userRole,
    roleError: roleError
  });

  const role: AdminRole =
    user.email?.toLowerCase() === SUPER_ADMIN_EMAIL
      ? "super_admin"
      : ((userRole?.role as AdminRole) || "admin");

  return { role, userId: user.id, email: user.email ?? "" };
}

export function canManageCatalog(role: AdminRole): boolean {
  return role === "super_admin" || role === "admin";
}

export async function requireCatalogManager() {
  const auth = await getAdminRole();
  if (!auth || !canManageCatalog(auth.role)) {
    throw new Error("Unauthorized");
  }
  return auth;
}

export async function requireSuperAdmin() {
  const auth = await getAdminRole();
  if (!auth || auth.role !== "super_admin") {
    throw new Error("Unauthorized");
  }
  return auth;
}
