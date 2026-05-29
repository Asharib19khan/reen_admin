import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/AdminPageHeader";
import { Package, ShoppingCart, AlertCircle, Clock } from "lucide-react";

export default async function Dashboard() {
  const supabase = await createClient();

  const [
    { count: totalOrders },
    { count: pendingOrders },
    { count: totalProducts },
    { count: lowStockProducts },
  ] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "Pending"),
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }).lte("quantity", 3),
  ]);

  const cards = [
    { title: "Total Orders", value: totalOrders || 0, icon: ShoppingCart, alert: false },
    { title: "Pending Orders", value: pendingOrders || 0, icon: Clock, alert: false },
    { title: "Total Products", value: totalProducts || 0, icon: Package, alert: false },
    {
      title: "Low Stock",
      value: lowStockProducts || 0,
      icon: AlertCircle,
      alert: (lowStockProducts || 0) > 0,
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Dashboard"
        description="Live snapshot of orders, catalog health, and inventory signals."
        badge="overview"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card
            key={card.title}
            className={card.alert ? "border-destructive/40 bg-destructive/5 shadow-[0_0_24px_rgba(240,113,120,0.08)]" : ""}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="admin-mono-label text-muted-foreground">{card.title}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.alert ? "text-destructive" : "text-primary/70"}`} />
            </CardHeader>
            <CardContent>
              <div className={`font-mono text-3xl font-semibold tabular-nums ${card.alert ? "text-destructive" : ""}`}>
                {card.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
