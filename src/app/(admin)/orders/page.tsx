import { createClient } from "@/utils/supabase/server";
import { getAdminRole } from "@/lib/admin-role";
import { AdminPageHeader } from "@/components/AdminPageHeader";
import { OrdersTable } from "./OrdersTable";

export default async function OrdersPage() {
  const supabase = await createClient();
  
  const auth = await getAdminRole();
  const role = auth?.role || "admin";

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Orders"
        description="Track and fulfill customer orders from the storefront."
      />
      <div className="admin-panel overflow-hidden">
        <OrdersTable initialOrders={orders || []} role={role} />
      </div>
    </div>
  );
}
