import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/AdminPageHeader";
import { Package, ShoppingCart, AlertCircle, Clock } from "lucide-react";
import { DashboardCharts } from "@/components/DashboardCharts";
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

  // Fetch orders for the last 7 days for the chart
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const { data: recentOrders } = await supabase
    .from("orders")
    .select("created_at, total_amount")
    .gte("created_at", sevenDaysAgo.toISOString());

  // Process sales data
  const salesMap = new Map<string, number>();
  // Initialize last 7 days with 0
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    salesMap.set(dayName, 0);
  }

  if (recentOrders) {
    recentOrders.forEach((order) => {
      const d = new Date(order.created_at);
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
      if (salesMap.has(dayName)) {
        salesMap.set(dayName, salesMap.get(dayName)! + Number(order.total_amount || 0));
      }
    });
  }

  const salesData = Array.from(salesMap.entries()).map(([name, total]) => ({
    name,
    total,
  }));

  // Fetch product counts by category for the pie chart
  const { data: allProducts } = await supabase.from("products").select("category");
  
  const categoryMap = new Map<string, number>();
  if (allProducts) {
    allProducts.forEach((product) => {
      const cat = product.category || "Uncategorized";
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
    });
  }

  const categoryData = Array.from(categoryMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

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
              <div className={`font-sans text-3xl font-semibold tabular-nums ${card.alert ? "text-destructive" : ""}`}>
                {card.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <DashboardCharts salesData={salesData} categoryData={categoryData} />
    </div>
  );
}
