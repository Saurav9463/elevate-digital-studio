import { supabase } from "@/integrations/supabase/client";
import {
  services as staticServices,
  projects as staticProjects,
  founders as staticFounders,
  testimonials as staticTestimonials,
} from "@/data/site";

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

// ---------- Static fallbacks (used when DB is empty) ----------

const STATIC_SERVICES: ServiceRow[] = staticServices.map((s, i) => ({
  id: `static-service-${i}`,
  slug: s.slug,
  title: s.title,
  summary: s.summary,
  bullets: s.bullets,
  icon: s.icon,
  sort_order: i,
  is_published: true,
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z",
}));

const STATIC_PROJECTS: ProjectRow[] = staticProjects.map((p, i) => ({
  id: `static-project-${i}`,
  slug: p.slug,
  title: p.title,
  category: p.category,
  client: p.client,
  summary: p.summary,
  tech: p.tech,
  cover_url: null,
  gradient: p.gradient,
  live_url: p.liveUrl ?? null,
  year: p.year,
  is_featured: p.featured ?? false,
  is_published: true,
  sort_order: i,
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z",
}));

const STATIC_TESTIMONIALS: TestimonialRow[] = staticTestimonials.map((t, i) => ({
  id: `static-testimonial-${i}`,
  name: t.name,
  role: t.role,
  company: t.company,
  business: t.business,
  project: t.project,
  rating: t.rating,
  quote: t.quote,
  avatar_url: null,
  sort_order: i,
  is_published: true,
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z",
}));

const STATIC_FOUNDERS: FounderRow[] = staticFounders.map((f, i) => ({
  id: `static-founder-${i}`,
  name: f.name,
  role: f.role,
  bio: f.bio,
  photo_url: (f as any).photo ?? null,
  skills: f.skills,
  linkedin_url: f.links.linkedin,
  github_url: f.links.github,
  sort_order: i,
  is_published: true,
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z",
}));

const DEFAULT_SETTINGS: Record<string, any> = {
  hero: {
    title: "We build websites that help local businesses grow.",
    subtitle:
      "Professional websites, booking systems, and business dashboards designed to help you attract more customers and run a calmer business.",
    buttonPrimaryText: "View our work",
    buttonPrimaryLink: "/projects",
    buttonSecondaryText: "Get a free consultation",
    buttonSecondaryLink: "/contact",
  },
  trust_stats: [
    { value: "40+", label: "Projects delivered" },
    { value: "98%", label: "Client satisfaction" },
    { value: "2–4 wk", label: "Average delivery" },
    { value: "24/7", label: "Ongoing support" },
  ],
};

// ---------- Public reads (with static fallback) ----------

export async function fetchPublishedServices(): Promise<ServiceRow[]> {
  try {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("is_published", true)
      .order("sort_order");
    if (error) throw error;
    if (data && data.length > 0) return data as ServiceRow[];
  } catch {
    // fall through to static data
  }
  return STATIC_SERVICES;
}

export async function fetchPublishedProjects(): Promise<ProjectRow[]> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_published", true)
      .order("sort_order");
    if (error) throw error;
    if (data && data.length > 0) return data as ProjectRow[];
  } catch {
    // fall through to static data
  }
  return STATIC_PROJECTS;
}

export async function fetchPublishedTestimonials(): Promise<TestimonialRow[]> {
  try {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_published", true)
      .order("sort_order");
    if (error) throw error;
    if (data && data.length > 0) return data as TestimonialRow[];
  } catch {
    // fall through to static data
  }
  return STATIC_TESTIMONIALS;
}

export async function fetchPublishedFounders(): Promise<FounderRow[]> {
  try {
    const { data, error } = await supabase
      .from("founders")
      .select("*")
      .eq("is_published", true)
      .order("sort_order");
    if (error) throw error;
    if (data && data.length > 0) return data as FounderRow[];
  } catch {
    // fall through to static data
  }
  return STATIC_FOUNDERS;
}

export async function fetchSiteSettings(): Promise<Record<string, any>> {
  try {
    const { data, error } = await supabase.from("site_settings").select("key, value");
    if (error) throw error;
    if (data && data.length > 0) {
      const map: Record<string, any> = {};
      data.forEach((r: any) => (map[r.key] = r.value));
      return map;
    }
  } catch {
    // fall through to defaults
  }
  return DEFAULT_SETTINGS;
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

// ---------- Admin Mutations ----------

export async function saveSiteSetting(key: string, value: any): Promise<void> {
  const { error } = await supabase.from("site_settings").upsert(
    { key, value, updated_at: new Date().toISOString() },
    { onConflict: "key" }
  );
  if (error) throw error;
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}

export async function deleteService(id: string): Promise<void> {
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw error;
}

export async function deleteTestimonial(id: string): Promise<void> {
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw error;
}

export async function deleteFounder(id: string): Promise<void> {
  const { error } = await supabase.from("founders").delete().eq("id", id);
  if (error) throw error;
}
