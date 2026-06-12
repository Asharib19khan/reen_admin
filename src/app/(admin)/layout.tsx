import { AdminNav } from "@/components/AdminNav";
import { getAdminRole } from "@/lib/admin-role";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getAdminRole();

  if (!auth) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      <AdminNav role={auth.role} email={auth.email} />
      <div className="flex min-h-screen flex-1 flex-col">
        <main className="flex-1 p-6 md:p-8 lg:p-10">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
        <footer className="border-t border-border/60 px-6 py-3 md:px-10">
          <p className="font-mono text-[10px] text-muted-foreground/80">
            reens admin · session active · {auth.email}
          </p>
        </footer>
      </div>
    </div>
  );
}
