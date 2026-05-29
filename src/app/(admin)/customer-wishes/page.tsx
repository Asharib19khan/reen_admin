import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AdminPageHeader } from "@/components/AdminPageHeader";
import { CustomerWishesTable } from "./CustomerWishesTable";
import { canManageCatalog, getAdminRole } from "@/lib/admin-role";

export default async function CustomerWishesPage() {
  const auth = await getAdminRole();
  if (!auth) {
    redirect("/login");
  }
  if (!canManageCatalog(auth.role)) {
    redirect("/");
  }

  const supabase = await createClient();

  const { data: wishes } = await supabase
    .from("customer_wishes")
    .select(`
      id,
      customer_name,
      customer_phone,
      customer_email,
      visitor_id,
      created_at,
      updated_at,
      product_id,
      products (
        id,
        title,
        price,
        brand,
        image_urls,
        is_active,
        quantity
      )
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Customer Wishes"
        description="Products customers have saved to their wishlist on the storefront."
      />

      <div className="admin-panel overflow-hidden">
        <CustomerWishesTable initialWishes={wishes || []} role={auth.role} />
      </div>
    </div>
  );
}
