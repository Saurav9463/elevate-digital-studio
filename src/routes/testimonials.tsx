import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader, PageShell } from "@/components/site/PageShell";
import { testimonials as staticTestimonials } from "@/data/site";
import { fetchTestimonials } from "@/lib/queries";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Testimonials — Elevate Web Solutions" },
      { name: "description", content: "What restaurant, salon, clinic, and gym owners say about working with Elevate Web Solutions." },
      { property: "og:title", content: "Testimonials — Elevate Web Solutions" },
      { property: "og:description", content: "Reviews from real businesses we've worked with." },
    ],
  }),
  component: TestimonialsPage,
});

function TestimonialsPage() {
  const { data: testimonials = staticTestimonials } = useQuery({ queryKey: ["testimonials"], queryFn: fetchTestimonials, staleTime: 1000 * 60 });

  return (
    <PageShell>
      <PageHeader
        eyebrow="Testimonials"
        title="What our clients say."
        description="Honest words from business owners we've worked with — restaurants, salons, clinics, gyms, and beyond."
      />
      <section className="section pt-12">
        <div className="container-page">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t: any, i: number) => (
              <motion.figure
                key={t.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.2) }}
                className="card-surface flex flex-col p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5 text-accent">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="rounded-full border border-border bg-surface-muted px-2.5 py-0.5 text-[11px] text-muted-foreground">{t.business}</span>
                </div>
                <blockquote className="mt-5 text-sm text-foreground">"{t.quote}"</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                  {t.avatar_url && <img src={t.avatar_url} alt={t.name} className="size-10 rounded-full object-cover" />}
                  <div>
                    <div className="text-sm font-medium text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}, {t.company}</div>
                    {t.project && <div className="mt-1 text-[11px] uppercase tracking-wider text-accent">{t.project}</div>}
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
