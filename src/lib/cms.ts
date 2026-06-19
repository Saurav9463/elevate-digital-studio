import { supabase } from "@/integrations/supabase/client";

export type ServiceRow = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  bullets: string[];
  icon: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  client: string;
  summary: string;
  tech: string[];
  cover_url: string | null;
  gradient: string;
  live_url: string | null;
  year: string;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type TestimonialRow = {
  id: string;
  name: string;
  role: string;
  company: string;
  business: string;
  project: string;
  rating: number;
  quote: string;
  avatar_url: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type FounderRow = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo_url: string | null;
  skills: string[];
  linkedin_url: string | null;
  github_url: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type LeadRow = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  service: string | null;
  message: string;
  status: "new" | "contacted" | "won" | "lost" | "archived";
  notes: string | null;
  source: string | null;
  created_at: string;
  updated_at: string;
};

export type SiteSettingRow = {
  id: string;
  key: string;
  value: any;
  updated_at: string;
};

// ---------- Public reads ----------
export async function fetchPublishedServices(): Promise<ServiceRow[]> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");
  if (error) throw error;
  return data as ServiceRow[];
}

export async function fetchPublishedProjects(): Promise<ProjectRow[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");
  if (error) throw error;
  return data as ProjectRow[];
}

export async function fetchPublishedTestimonials(): Promise<TestimonialRow[]> {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");
  if (error) throw error;
  return data as TestimonialRow[];
}

export async function fetchPublishedFounders(): Promise<FounderRow[]> {
  const { data, error } = await supabase
    .from("founders")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");
  if (error) throw error;
  return data as FounderRow[];
}

export async function fetchSiteSettings(): Promise<Record<string, any>> {
  const { data, error } = await supabase.from("site_settings").select("key, value");
  if (error) throw error;
  const map: Record<string, any> = {};
  (data ?? []).forEach((r: any) => (map[r.key] = r.value));
  return map;
}

// ---------- Admin reads (RLS will allow only admins) ----------
export async function fetchAllLeads(): Promise<LeadRow[]> {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as LeadRow[];
}

export async function fetchAllServices(): Promise<ServiceRow[]> {
  const { data, error } = await supabase.from("services").select("*").order("sort_order");
  if (error) throw error;
  return data as ServiceRow[];
}

export async function fetchAllProjects(): Promise<ProjectRow[]> {
  const { data, error } = await supabase.from("projects").select("*").order("sort_order");
  if (error) throw error;
  return data as ProjectRow[];
}

export async function fetchAllTestimonials(): Promise<TestimonialRow[]> {
  const { data, error } = await supabase.from("testimonials").select("*").order("sort_order");
  if (error) throw error;
  return data as TestimonialRow[];
}

export async function fetchAllFounders(): Promise<FounderRow[]> {
  const { data, error } = await supabase.from("founders").select("*").order("sort_order");
  if (error) throw error;
  return data as FounderRow[];
}
