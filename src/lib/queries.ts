import { supabase } from "@/lib/supabase";
import {
  hero as staticHero,
  trustStats as staticTrustStats,
  services as staticServices,
  projects as staticProjects,
  testimonials as staticTestimonials,
  founders as staticFounders,
  siteConfig as staticSiteConfig,
  process as staticProcess,
  whyChooseUs as staticWhyChooseUs,
} from "@/data/site";

async function fetchOrFallback<T>(fetcher: () => Promise<T | null>, fallback: T): Promise<T> {
  try {
    const result = await fetcher();
    return result ?? fallback;
  } catch {
    return fallback;
  }
}

export async function fetchHero() {
  return fetchOrFallback(async () => {
    const { data } = await supabase.from("hero").select("*").single();
    return data;
  }, staticHero);
}

export async function fetchTrustStats() {
  return fetchOrFallback(async () => {
    const { data } = await supabase.from("trust_stats").select("*").order("id");
    return data && data.length > 0 ? data : null;
  }, staticTrustStats);
}

export async function fetchServices() {
  return fetchOrFallback(async () => {
    const { data } = await supabase.from("services").select("*").order("title");
    return data && data.length > 0
      ? data.map((s: any) => ({ ...s, bullets: Array.isArray(s.bullets) ? s.bullets : [] }))
      : null;
  }, staticServices);
}

export async function fetchProjects() {
  return fetchOrFallback(async () => {
    const { data } = await supabase.from("projects").select("*").order("title");
    return data && data.length > 0
      ? data.map((p: any) => ({ ...p, tech: Array.isArray(p.tech) ? p.tech : [] }))
      : null;
  }, staticProjects);
}

export async function fetchTestimonials() {
  return fetchOrFallback(async () => {
    const { data } = await supabase.from("testimonials").select("*").order("name");
    return data && data.length > 0 ? data : null;
  }, staticTestimonials);
}

export async function fetchFounders() {
  return fetchOrFallback(async () => {
    const { data } = await supabase.from("founders").select("*").order("name");
    return data && data.length > 0
      ? data.map((f: any) => ({ ...f, skills: Array.isArray(f.skills) ? f.skills : [] }))
      : null;
  }, staticFounders);
}

export async function fetchSiteConfig() {
  return fetchOrFallback(async () => {
    const { data } = await supabase.from("site_config").select("*").single();
    return data;
  }, staticSiteConfig);
}

export async function fetchProcess() {
  return fetchOrFallback(async () => {
    const { data } = await supabase.from("process_steps").select("*").order("step");
    return data && data.length > 0 ? data : null;
  }, staticProcess);
}

export async function fetchWhyChooseUs() {
  return fetchOrFallback(async () => {
    const { data } = await supabase.from("why_choose_us").select("*").order("id");
    return data && data.length > 0 ? data : null;
  }, staticWhyChooseUs);
}
