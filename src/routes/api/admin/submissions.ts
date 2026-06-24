import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/api/admin/submissions")({});

export async function getSubmissions(token: string) {
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("contact_submissions")
    .select("id, name, email, company, phone, service, message, status, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) throw new Error(error.message);
  return data;
}

export async function updateSubmissionStatus(token: string, id: string, status: string) {
  const ALLOWED_STATUSES = ["new", "reviewed", "archived"];
  if (!ALLOWED_STATUSES.includes(status)) throw new Error("Invalid status");

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("contact_submissions")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return { ok: true };
}
