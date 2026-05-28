"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addTeamMember } from "./actions";

export function AddMemberForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await addTeamMember(formData);
    
    if (result.error) {
      setError(result.error);
    } else {
      (e.target as HTMLFormElement).reset();
    }
    
    setLoading(false);
  };

  return (
    <div className="space-y-2 mb-8">
      <form onSubmit={handleSubmit} className="flex items-end gap-4 bg-muted/30 p-6 border border-border">
        <div className="grid gap-2 flex-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="staff@example.com" required />
        </div>
        <div className="grid gap-2 flex-1">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="text" placeholder="min 6 chars" required minLength={6} />
        </div>
        <div className="grid gap-2 w-48">
          <Label htmlFor="role">Role</Label>
          <select
            id="role"
            name="role"
            style={{ colorScheme: 'dark' }}
            className="flex h-10 w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Member"}
        </Button>
      </form>
      {error && <p className="text-destructive text-sm font-medium">{error}</p>}
    </div>
  );
}
