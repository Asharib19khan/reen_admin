import { createClient } from "@/utils/supabase/server";
import { AdminPageHeader } from "@/components/AdminPageHeader";
import { OrdersTable } from "./OrdersTable";

export default async function OrdersPage() {
  const supabase = await createClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  const { data: userRole } = await supabase.from("user_roles").select("role").eq("id", session?.user.id).single();
  const role = session?.user.email?.toLowerCase() === 'yeezus196@gmail.com' ? 'super_admin' : (userRole?.role || "employee");

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
