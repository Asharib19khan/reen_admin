"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Order = {
  id: string;
  status: string;
  customer_name: string;
  customer_phone: string;
  total_amount: number;
  created_at: string;
};

export function OrdersTable({ initialOrders, role = "employee" }: { initialOrders: Order[], role?: string }) {
  const [orders, setOrders] = useState(initialOrders);
  const supabase = createClient();
  
  const canEdit = role === "super_admin" || role === "admin";

  const handleStatusChange = async (id: string, newStatus: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    
    await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", id);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground h-24">
              No orders found.
            </TableCell>
          </TableRow>
        ) : (
          orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono text-xs">{order.id.split('-')[0]}...</TableCell>
              <TableCell>
                <div className="font-medium">{order.customer_name}</div>
                <div className="text-xs text-muted-foreground">{order.customer_phone}</div>
              </TableCell>
              <TableCell>Rs. {order.total_amount}</TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(order.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  disabled={!canEdit}
                  style={{ colorScheme: 'dark' }}
                  className="bg-background text-foreground border border-input text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                </select>
              </TableCell>
              <TableCell className="text-right">
                <Link href={`/orders/${order.id}`} className="text-sm text-primary hover:underline font-medium">
                  View
                </Link>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
