import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ReviewsTable } from "./ReviewsTable";

export default async function ReviewsPage() {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect("/login");
  }

  // Get user role
  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  const role = roleData?.role || "employee";

  // Fetch reviews
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
