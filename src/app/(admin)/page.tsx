import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, AlertCircle, Clock } from "lucide-react";

export default async function Dashboard() {
  const supabase = await createClient();

  const [
    { count: totalOrders },
    { count: pendingOrders },
    { count: totalProducts },
    { count: lowStockProducts }
  ] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "Pending"),
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }).lte("quantity", 3)
  ]);

  const cards = [
    {
      title: "Total Orders",
      value: totalOrders || 0,
      icon: ShoppingCart,
    },
    {
      title: "Pending Orders",
      value: pendingOrders || 0,
      icon: Clock,
    },
    {
      title: "Total Products",
      value: totalProducts || 0,
      icon: Package,
    },
    {
      title: "Low Stock Items",
      value: lowStockProducts || 0,
      icon: AlertCircle,
      alert: (lowStockProducts || 0) > 0,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title} className={card.alert ? "border-destructive/50 bg-destructive/10" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.alert ? "text-destructive" : "text-muted-foreground"}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.alert ? "text-destructive" : ""}`}>{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
