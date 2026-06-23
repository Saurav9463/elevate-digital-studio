import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Check, Sparkles, Star } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { ProjectCard } from "@/components/site/ProjectCard";
import { ServiceCard } from "@/components/site/ServiceCard";
import { hero as staticHero, projects as staticProjects, services as staticServices, testimonials as staticTestimonials, trustStats as staticTrustStats, whyChooseUs as staticWhyChooseUs } from "@/data/site";
import { fetchHero, fetchTrustStats, fetchServices, fetchProjects, fetchTestimonials, fetchWhyChooseUs } from "@/lib/queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Elevate Web Solutions — Websites that help local businesses grow" },
      { name: "description", content: "Custom websites, booking systems, and business dashboards for restaurants, salons, clinics, gyms, and local businesses." },
      { property: "og:title", content: "Elevate Web Solutions" },
      { property: "og:description", content: "Custom websites, booking systems, and business dashboards for local businesses." },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: hero = staticHero } = useQuery({ queryKey: ["hero"], queryFn: fetchHero, staleTime: 1000 * 60 });
  const { data: trustStats = staticTrustStats } = useQuery({ queryKey: ["trust_stats"], queryFn: fetchTrustStats, staleTime: 1000 * 60 });
  const { data: services = staticServices } = useQuery({ queryKey: ["services"], queryFn: fetchServices, staleTime: 1000 * 60 });
  const { data: projects = staticProjects } = useQuery({ queryKey: ["projects"], queryFn: fetchProjects, staleTime: 1000 * 60 });
  const { data: testimonials = staticTestimonials } = useQuery({ queryKey: ["testimonials"], queryFn: fetchTestimonials, staleTime: 1000 * 60 });
  const { data: whyChooseUs = staticWhyChooseUs } = useQuery({ queryKey: ["why_choose_us"], queryFn: fetchWhyChooseUs, staleTime: 1000 * 60 });

  const featured = projects.filter((p: any) => p.is_featured).slice(0, 3);
  const homeServices = services.slice(0, 6);
  const headline = hero.title.includes("local businesses") ? (
    <>
      {hero.title.split("local businesses")[0]}
      <span className="text-accent">local businesses</span>
      {hero.title.split("local businesses")[1] ?? ""}
    </>
  ) : (
    hero.title
  );

  return (
    <PageShell>
      <section className="relative overflow-hidden">
        <div className="bg-grid-fade absolute inset-0 -z-10" />
        <div className="container-page pt-20 pb-24 md:pt-28 md:pb-32">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="eyebrow"><Sparkles className="h-3 w-3 text-accent" />{hero.eyebrow}</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }} className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-6xl">
            {headline}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }} className="mt-6 max-w-2xl text-lg text-muted-foreground">
            {hero.description}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.15 }} className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/projects" className="btn-primary">View our work <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/contact" className="btn-outline">Get a free consultation</Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
            {trustStats.map((s: any) => (
              <div key={s.label} className="bg-surface p-6">
                <div className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{s.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section border-t border-border">
        <div className="container-page">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="eyebrow">What we do</span>
              <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight md:text-4xl">Everything a local business needs online.</h2>
            </div>
            <Link to="/services" className="text-sm font-medium text-accent hover:underline">See all services →</Link>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {homeServices.map((s: any, i: number) => (
              <ServiceCard key={s.id ?? s.slug} title={s.title} summary={s.summary} bullets={s.bullets} icon={s.icon} index={i} />
            ))}
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="section border-t border-border bg-surface-muted/40">
          <div className="container-page">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
              <div>
                <span className="eyebrow">Selected work</span>
                <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight md:text-4xl">Recent projects we're proud of.</h2>
              </div>
              <Link to="/projects" className="text-sm font-medium text-accent hover:underline">View all projects →</Link>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((p: any, i: number) => (
                <ProjectCard key={p.id} project={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section border-t border-border">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <span className="eyebrow">Why Elevate</span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">A studio that treats your business like our own.</h2>
            <p className="mt-4 max-w-md text-muted-foreground">We're small on purpose. Two senior founders working directly with you — no junior handoffs, no inflated overhead.</p>
            <Link to="/about" className="mt-6 inline-flex text-sm font-medium text-accent hover:underline">Meet the founders →</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {whyChooseUs.map((w: any) => (
              <div key={w.title} className="card-surface p-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground text-background">
                  <Check className="h-4 w-4" />
                </div>
                <h3 className="mt-4 text-base font-semibold tracking-tight">{w.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="section border-t border-border bg-surface-muted/40">
          <div className="container-page">
            <span className="eyebrow">Loved by owners</span>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">Real businesses. Real results.</h2>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {testimonials.slice(0, 3).map((t: any) => (
                <figure key={t.id} className="card-surface flex flex-col p-6">
                  <div className="flex gap-0.5 text-accent">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <blockquote className="mt-4 text-sm text-foreground">"{t.quote}"</blockquote>
                  <figcaption className="mt-6 border-t border-border pt-4 text-sm">
                    <div className="font-medium text-foreground">{t.name}</div>
                    <div className="text-muted-foreground">{t.role}, {t.company}</div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section border-t border-border">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground px-8 py-14 text-background md:px-14 md:py-20">
            <div className="relative z-10 grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Ready to grow your business online?</h2>
                <p className="mt-3 max-w-xl text-background/70">Book a free 30-minute consultation. We'll review your current presence and outline a plan — no pressure, no obligation.</p>
              </div>
              <div className="flex flex-wrap gap-3 md:justify-end">
                <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-accent-foreground transition-all hover:brightness-110">
                  Book consultation <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
