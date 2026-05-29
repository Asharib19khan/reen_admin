import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AdminPageHeader } from "@/components/AdminPageHeader";
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
      <AdminPageHeader
        title="Customer Reviews"
        description="Approve, hide, or feature customer reviews on the storefront homepage."
      />

      <div className="admin-panel overflow-hidden">
        <ReviewsTable initialReviews={reviews || []} role={role} />
      </div>
    </div>
  );
}
