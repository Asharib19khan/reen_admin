import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ReviewsTable } from "./ReviewsTable";
import { canManageCatalog, getAdminRole } from "@/lib/admin-role";

export default async function ReviewsPage() {
  const auth = await getAdminRole();
  if (!auth) {
    redirect("/login");
  }
  if (!canManageCatalog(auth.role)) {
    redirect("/");
  }

  const supabase = await createClient();
  const role = auth.role;

  const { data: reviews } = await supabase
    .from("customer_reviews")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customer Reviews Manager</h1>
        <p className="text-muted-foreground mt-2">Approve, hide, or feature customer reviews on the Storefront homepage.</p>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
        <ReviewsTable initialReviews={reviews || []} role={role} />
      </div>
    </div>
  );
}
