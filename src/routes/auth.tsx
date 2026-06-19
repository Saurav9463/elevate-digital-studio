import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/site/Logo";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — Elevate Admin" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

const emailSchema = z.string().trim().email("Enter a valid email").max(255);
const passwordSchema = z.string().min(8, "At least 8 characters").max(128);
const nameSchema = z.string().trim().min(1, "Required").max(80);

function AuthPage() {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: isAdmin ? "/admin" : "/", replace: true });
    }
  }, [user, isAdmin, loading, navigate]);

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    try {
      const fd = new FormData(e.currentTarget);
      const email = emailSchema.parse(fd.get("email"));
      const password = passwordSchema.parse(fd.get("password"));
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Welcome back.");
    } catch (err: any) {
      toast.error(err.message ?? "Could not sign in");
    } finally {
      setBusy(false);
    }
  }

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    try {
      const fd = new FormData(e.currentTarget);
      const name = nameSchema.parse(fd.get("name"));
      const email = emailSchema.parse(fd.get("email"));
      const password = passwordSchema.parse(fd.get("password"));
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
          data: { display_name: name },
        },
      });
      if (error) throw error;
      toast.success("Account created. Signing you in…");
    } catch (err: any) {
      toast.error(err.message ?? "Could not create account");
    } finally {
      setBusy(false);
    }
  }

  async function handleReset() {
    const email = prompt("Enter your account email to receive a reset link:");
    if (!email) return;
    try {
      const valid = emailSchema.parse(email);
      const { error } = await supabase.auth.resetPasswordForEmail(valid, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success("Reset link sent — check your inbox.");
    } catch (err: any) {
      toast.error(err.message ?? "Could not send reset email");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <Link to="/" className="mb-6"><Logo /></Link>
          <h1 className="text-2xl font-semibold tracking-tight">Studio admin</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to manage projects, leads, and site content.
          </p>
        </div>

        <div className="card-surface rounded-2xl p-6">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="si-email">Email</Label>
                  <Input id="si-email" name="email" type="email" required autoComplete="email" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="si-password">Password</Label>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot?
                    </button>
                  </div>
                  <Input id="si-password" name="password" type="password" required autoComplete="current-password" />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? "Signing in…" : "Sign in"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="su-name">Display name</Label>
                  <Input id="su-name" name="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="su-email">Email</Label>
                  <Input id="su-email" name="email" type="email" required autoComplete="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="su-password">Password</Label>
                  <Input id="su-password" name="password" type="password" required minLength={8} autoComplete="new-password" />
                  <p className="text-xs text-muted-foreground">Minimum 8 characters.</p>
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? "Creating account…" : "Create account"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  The first account becomes the studio admin. Additional accounts need admin promotion.
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:underline">← Back to the website</Link>
        </p>
      </motion.div>
    </div>
  );
}
