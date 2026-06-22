import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, PageShell } from "@/components/site/PageShell";
import { ServiceCard } from "@/components/site/ServiceCard";
import { process, services } from "@/data/site";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Elevate Web Solutions" },
      { name: "description", content: "Websites, booking systems, dashboards, and custom web apps for local businesses." },
      { property: "og:title", content: "Services — Elevate Web Solutions" },
      { property: "og:description", content: "Websites, booking systems, dashboards, and custom web apps for local businesses." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Services"
        title="From a simple website to a full operating system for your business."
        description="We design and engineer modern digital products that local businesses actually need — focused on outcomes, not buzzwords."
      />
      <section className="section">
        <div className="container-page grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <ServiceCard key={s.id} title={s.title} summary={s.summary} bullets={s.bullets} icon={s.icon} index={i} />
          ))}
        </div>
      </section>

      <section className="section border-t border-border bg-surface-muted/40">
        <div className="container-page">
          <span className="eyebrow">How we work</span>
          <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight md:text-4xl">A calm, predictable process.</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {process.map((p) => (
              <div key={p.step} className="card-surface p-6">
                <div className="text-xs font-semibold tracking-widest text-accent">{p.step}</div>
                <h3 className="mt-3 text-base font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-border">
        <div className="container-page text-center">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">Not sure which service you need?</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Tell us about your business. We'll recommend the right scope and budget — no pressure.</p>
          <Link to="/contact" className="btn-accent mt-8">Get a free consultation</Link>
        </div>
      </section>
    </PageShell>
  );
}
