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
    if (!data) return null;
    return {
      eyebrow: data.eyebrow ?? staticHero.eyebrow,
      title: data.title ?? staticHero.title,
      description: data.description ?? staticHero.description,
    };
  }, staticHero);
}

export async function fetchTrustStats() {
  return fetchOrFallback(async () => {
    const { data } = await supabase.from("trust_stats").select("*").order("sort_order");
    return data && data.length > 0
      ? data.map((s: any) => ({ value: s.value, label: s.label }))
      : null;
  }, staticTrustStats);
}

export async function fetchServices() {
  return fetchOrFallback(async () => {
    const { data } = await supabase.from("services").select("*").order("sort_order");
    return data && data.length > 0
      ? data.map((s: any) => ({
          id: s.slug,
          slug: s.slug,
          title: s.title,
          summary: s.summary,
          bullets: Array.isArray(s.bullets) ? s.bullets : [],
          icon: s.icon,
        }))
      : null;
  }, staticServices);
}

export async function fetchProjects() {
  return fetchOrFallback(async () => {
    const { data } = await supabase.from("projects").select("*").order("sort_order");
    return data && data.length > 0
      ? data.map((p: any) => ({
          id: p.slug,
          slug: p.slug,
          title: p.title,
          category: p.category,
          client: p.client,
          summary: p.summary,
          tech: Array.isArray(p.tech) ? p.tech : [],
          is_featured: p.is_featured,
          live_url: p.live_url,
          cover_url: p.cover_url,
          gradient: p.gradient,
          year: p.year,
        }))
      : null;
  }, staticProjects);
}

export async function fetchTestimonials() {
  return fetchOrFallback(async () => {
    const { data } = await supabase.from("testimonials").select("*").order("sort_order");
    return data && data.length > 0
      ? data.map((t: any) => ({
          id: t.id,
          name: t.name,
          role: t.role,
          company: t.company,
          business: t.business,
          project: t.project,
          rating: t.rating,
          quote: t.quote,
          avatar_url: t.avatar_url,
        }))
      : null;
  }, staticTestimonials);
}

export async function fetchFounders() {
  return fetchOrFallback(async () => {
    const { data } = await supabase.from("founders").select("*").order("sort_order");
    return data && data.length > 0
      ? data.map((f: any) => ({
          id: f.slug,
          name: f.name,
          role: f.role,
          bio: f.bio,
          photo_url: f.photo_url,
          skills: Array.isArray(f.skills) ? f.skills : [],
          linkedin_url: f.linkedin_url,
          github_url: f.github_url,
        }))
      : null;
  }, staticFounders);
}

export async function fetchSiteConfig() {
  return fetchOrFallback(async () => {
    const { data } = await supabase.from("site_config").select("*").single();
    if (!data) return null;
    return {
      name: data.name ?? staticSiteConfig.name,
      shortName: data.short_name ?? staticSiteConfig.shortName,
      tagline: data.tagline ?? staticSiteConfig.tagline,
      description: data.description ?? staticSiteConfig.description,
      email: data.email ?? staticSiteConfig.email,
      whatsapp: data.whatsapp ?? staticSiteConfig.whatsapp,
      whatsappUrl: data.whatsapp_url ?? staticSiteConfig.whatsappUrl,
      linkedin: data.linkedin ?? staticSiteConfig.linkedin,
      github: data.github ?? staticSiteConfig.github,
      location: data.location ?? staticSiteConfig.location,
      formspreeEndpoint: data.formspree_endpoint ?? staticSiteConfig.formspreeEndpoint,
    };
  }, staticSiteConfig);
}

export async function fetchProcess() {
  return fetchOrFallback(async () => {
    const { data } = await supabase.from("process_steps").select("*").order("sort_order");
    return data && data.length > 0
      ? data.map((p: any) => ({ step: p.step, title: p.title, text: p.text }))
      : null;
  }, staticProcess);
}

export async function fetchWhyChooseUs() {
  return fetchOrFallback(async () => {
    const { data } = await supabase.from("why_choose_us").select("*").order("sort_order");
    return data && data.length > 0
      ? data.map((w: any) => ({ title: w.title, text: w.text }))
      : null;
  }, staticWhyChooseUs);
}
