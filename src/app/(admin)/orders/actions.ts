"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function deleteOrder(orderId: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  // Create a supabase client with the service role key to bypass RLS
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  try {
    // 1. Delete associated order items first to avoid foreign key constraint errors
    const { error: itemsError } = await supabase
      .from("order_items")
      .delete()
      .eq("order_id", orderId);

    if (itemsError) throw itemsError;

    // 2. Delete the order itself
    const { error: orderError } = await supabase
      .from("orders")
      .delete()
      .eq("id", orderId);

    if (orderError) throw orderError;

    // Revalidate the orders page cache
    revalidatePath("/orders");
    
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting order:", error);
    return { success: false, error: error.message };
  }
}
