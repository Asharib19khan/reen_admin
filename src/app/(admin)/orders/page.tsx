import { createClient } from "@/utils/supabase/server";
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
      </div>
      <div className="bg-card border border-border">
        <OrdersTable initialOrders={orders || []} role={role} />
      </div>
    </div>
  );
}
