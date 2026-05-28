import { login } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSupabaseConfigError, isSupabaseConfigured } from "@/utils/supabase/env";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const configError = getSupabaseConfigError();

  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-4 text-center">
          <h1 className="text-2xl font-bold">Configuration required</h1>
          <p className="text-muted-foreground text-sm">{configError}</p>
          <p className="text-muted-foreground text-xs">
            In Vercel → Settings → Environment Variables, set the project URL and anon JWT, then
            redeploy.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Admin Vault</h1>
          <p className="text-muted-foreground">Enter your credentials to access.</p>
        </div>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="admin@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          {error && (
            <div className="text-destructive text-sm font-medium">{error}</div>
          )}
          <Button type="submit" formAction={login} className="w-full h-10">
            Authenticate
          </Button>
        </form>
      </div>
    </div>
  );
}
