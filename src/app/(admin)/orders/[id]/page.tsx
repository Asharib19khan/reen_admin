import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*, products(title))")
    .eq("id", resolvedParams.id)
    .single();

  if (!order) notFound();

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/orders" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
          <p className="text-muted-foreground text-sm font-mono mt-1">ID: {order.id}</p>
        </div>
        <Badge variant="outline" className="ml-auto">{order.status}</Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <div className="font-semibold text-muted-foreground mb-1">Name</div>
              <div>{order.customer_name}</div>
            </div>
            <div>
              <div className="font-semibold text-muted-foreground mb-1">Phone</div>
              <div>{order.customer_phone}</div>
            </div>
            <div>
              <div className="font-semibold text-muted-foreground mb-1">Address</div>
              <div className="whitespace-pre-wrap">{order.customer_address}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <div className="font-semibold text-muted-foreground mb-1">Date Placed</div>
              <div>{new Date(order.created_at).toLocaleString()}</div>
            </div>
            <div>
              <div className="font-semibold text-muted-foreground mb-1">Total Amount</div>
              <div className="text-lg font-bold text-primary">Rs. {order.total_amount}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Variants</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price at Purchase</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.order_items.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.products?.title || "Unknown Product"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div className="space-y-0.5">
                      {item.selected_color && <p>Color: {item.selected_color}</p>}
                      {item.selected_size && <p>Size: {item.selected_size}</p>}
                      {item.selected_addon && <p>Add-on: {item.selected_addon}</p>}
                      {item.custom_measurement && <p className="whitespace-pre-wrap">Measurements: {item.custom_measurement}</p>}
                      {!item.selected_color && !item.selected_size && !item.selected_addon && !item.custom_measurement && (
                        <span>—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>Rs. {item.price_at_purchase}</TableCell>
                  <TableCell className="text-right">Rs. {item.quantity * item.price_at_purchase}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
