"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { removeTeamMember } from "./actions";

type Member = { id: string; email: string; role: string; created_at: string; [key: string]: unknown };

export function TeamTable({ initialMembers, currentUserId }: { initialMembers: Member[], currentUserId: string }) {
  const [members, setMembers] = useState(initialMembers);
  const supabase = createClient();

  const handleRoleChange = async (id: string, newRole: string) => {
    if (id === currentUserId) {
      alert("You cannot change your own role here.");
      return;
    }

    const previous = members.find((m) => m.id === id);
    if (!previous) return;

    setMembers(members.map((m) => (m.id === id ? { ...m, role: newRole } : m)));

    const { error } = await supabase
      .from("user_roles")
      .update({ role: newRole })
      .eq("id", id);

    if (error) {
      setMembers(members.map((m) => (m.id === id ? { ...m, role: previous.role } : m)));
      alert("Failed to update role: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to permanently delete this user from the system?")) {
      setMembers(members.filter(m => m.id !== id));
      await removeTeamMember(id);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Date Added</TableHead>
          <TableHead>Current Role</TableHead>
          <TableHead className="text-right">Assign Role</TableHead>
          <TableHead className="text-right w-16"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground h-24">No team members found.</TableCell>
          </TableRow>
        ) : members.map((member) => (
          <TableRow key={member.id}>
            <TableCell className="font-medium">
              {member.email}
              {member.id === currentUserId && <Badge variant="outline" className="ml-2">You</Badge>}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {new Date(member.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <Badge variant={member.role === 'super_admin' ? 'success' : member.role === 'admin' ? 'default' : 'secondary'}>
                {member.role}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <select
                value={member.role}
                onChange={(e) => handleRoleChange(member.id, e.target.value)}
                disabled={member.id === currentUserId}
                style={{ colorScheme: 'dark' }}
                className="bg-background text-foreground border border-input text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="super_admin">super_admin</option>
                <option value="admin">admin</option>
                <option value="employee">employee</option>
              </select>
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDelete(member.id)}
                disabled={member.id === currentUserId}
                title="Remove Member"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
