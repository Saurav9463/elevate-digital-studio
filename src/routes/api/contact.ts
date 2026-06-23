import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

export const Route = createFileRoute("/api/contact")({});

const leadSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  company: z.string().trim().max(200).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  service: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().min(1).max(5000),
});

export async function submitContactForm(raw: unknown) {
  const parsed = leadSchema.parse(raw);
  const { error } = await supabase
    .from("contact_submissions")
    .insert([parsed]);
  if (error) throw new Error(error.message);
  return { ok: true };
}
