"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

type Review = { 
  id: string; 
  customer_name: string; 
  rating: number; 
  review_text: string; 
  is_approved: boolean; 
  is_featured: boolean; 
  created_at: string; 
};

export function ReviewsTable({ initialReviews, role = "admin" }: { initialReviews: Review[], role?: string }) {
  const [reviews, setReviews] = useState(initialReviews);
  const supabase = createClient();
  
  const canEdit = role === "super_admin" || role === "admin";

  const toggleApproved = async (id: string, current: boolean) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, is_approved: !current } : r));
    await supabase.from("customer_reviews").update({ is_approved: !current }).eq("id", id);
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, is_featured: !current } : r));
    await supabase.from("customer_reviews").update({ is_featured: !current }).eq("id", id);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead className="max-w-[300px]">Review</TableHead>
          <TableHead>Approved (Public)</TableHead>
          <TableHead>Featured (Homepage)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reviews.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground h-24">
              No reviews found.
            </TableCell>
          </TableRow>
        ) : (
          reviews.map((review) => (
            <TableRow key={review.id}>
              <TableCell className="text-muted-foreground text-xs">
                {new Date(review.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="font-medium">{review.customer_name}</TableCell>
              <TableCell>
                <div className="text-primary tracking-widest text-sm">
                  {Array(review.rating).fill('★').join('')}
                  {Array(5 - review.rating).fill('☆').join('')}
                </div>
              </TableCell>
              <TableCell className="max-w-[300px]">
                <p className="text-sm line-clamp-2 italic text-muted-foreground">"{review.review_text}"</p>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={review.is_approved}
                    onCheckedChange={() => toggleApproved(review.id, review.is_approved)}
                    disabled={!canEdit}
                  />
                  {review.is_approved ? <Badge variant="default" className="text-[10px]">Visible</Badge> : <Badge variant="secondary" className="text-[10px]">Hidden</Badge>}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={review.is_featured}
                    onCheckedChange={() => toggleFeatured(review.id, review.is_featured)}
                    disabled={!canEdit}
                  />
                  {review.is_featured && <Badge variant="default" className="text-[10px] bg-yellow-500 hover:bg-yellow-600">Featured</Badge>}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
