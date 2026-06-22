import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";
import { PageHeader, PageShell } from "@/components/site/PageShell";
import { founders, process, technologies, whyChooseUs } from "@/data/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Elevate Web Solutions" },
      { name: "description", content: "Meet the founders of Elevate Web Solutions — a two-person studio building modern websites and web apps." },
      { property: "og:title", content: "About — Elevate Web Solutions" },
      { property: "og:description", content: "Meet the founders behind Elevate Web Solutions." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {

  return (
    <PageShell>
      <PageHeader
        eyebrow="Our story"
        title="A small studio with a simple promise: build great web products for great businesses."
        description="Elevate Web Solutions brings agency-grade design and engineering to local businesses — without the agency overhead."
      />

      <section className="section">
        <div className="container-page">
          <span className="eyebrow">Founders</span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">Meet the team.</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {founders.map((f, i) => (
              <motion.article
                key={f.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="card-surface overflow-hidden"
              >
                <div className="aspect-[4/5] w-full overflow-hidden bg-surface-muted">
                  {f.photo_url && <img src={f.photo_url} alt={`${f.name} — ${f.role}`} loading="lazy" className="h-full w-full object-cover" />}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold tracking-tight">{f.name}</h3>
                  <p className="mt-1 text-sm text-accent">{f.role}</p>
                  <p className="mt-4 text-sm text-muted-foreground">{f.bio}</p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {f.skills.map((s) => (
                      <span key={s} className="rounded-md border border-border bg-surface-muted px-2 py-0.5 text-[11px] text-muted-foreground">{s}</span>
                    ))}
                  </div>
                  <div className="mt-6 flex gap-2">
                    {f.linkedin_url && (
                      <a href={f.linkedin_url} target="_blank" rel="noreferrer" aria-label={`${f.name} on LinkedIn`} className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-muted-foreground hover:text-foreground">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {f.github_url && (
                      <a href={f.github_url} target="_blank" rel="noreferrer" aria-label={`${f.name} on GitHub`} className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-muted-foreground hover:text-foreground">
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-border bg-surface-muted/40">
        <div className="container-page">
          <span className="eyebrow">Tools we love</span>
          <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight md:text-4xl">A modern, proven stack.</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">We pick tools that make your product fast today and easy to evolve tomorrow.</p>
          <div className="mt-10 flex flex-wrap gap-2">
            {technologies.map((t) => (
              <span key={t} className="rounded-lg border border-border bg-surface px-3.5 py-1.5 text-sm text-foreground">{t}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-border">
        <div className="container-page">
          <span className="eyebrow">Process</span>
          <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight md:text-4xl">How a project comes together.</h2>
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

      <section className="section border-t border-border bg-surface-muted/40">
        <div className="container-page">
          <span className="eyebrow">Why Elevate</span>
          <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight md:text-4xl">What it's like to work with us.</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {whyChooseUs.map((w) => (
              <div key={w.title} className="card-surface p-6">
                <h3 className="text-base font-semibold tracking-tight">{w.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{w.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Link to="/contact" className="btn-accent">Start a conversation</Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
