"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteOrder } from "./actions";

type Order = {
  id: string;
  status: string;
  customer_name: string;
  customer_phone: string;
  total_amount: number;
  created_at: string;
};

export function OrdersTable({ initialOrders, role = "admin" }: { initialOrders: Order[], role?: string }) {
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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this order? This action cannot be undone.")) return;
    
    // Optimistic UI update
    const previousOrders = [...orders];
    setOrders(orders.filter(o => o.id !== id));
    
    const result = await deleteOrder(id);
      
    if (!result.success) {
       console.error("Error deleting order:", result.error);
       alert("Failed to delete order. It might be linked to other records.");
       setOrders(previousOrders); // Revert on failure
    }
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
                  <option value="Received">Received</option>
                </select>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-3 items-center">
                  <Link href={`/orders/${order.id}`} className="text-sm text-primary hover:underline font-medium">
                    View
                  </Link>
                  {role === "super_admin" && (
                    <button 
                      onClick={() => handleDelete(order.id)}
                      className="text-sm text-destructive hover:underline font-medium"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
