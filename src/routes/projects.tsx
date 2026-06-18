import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageShell } from "@/components/site/PageShell";
import { ProjectCard } from "@/components/site/ProjectCard";
import { projects } from "@/data/site";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Our Work — Elevate Web Solutions" },
      {
        name: "description",
        content:
          "Selected projects by Elevate Web Solutions — websites, booking systems, and dashboards built for real businesses.",
      },
      { property: "og:title", content: "Our Work — Elevate Web Solutions" },
      {
        property: "og:description",
        content: "Selected projects — websites, booking systems, and dashboards.",
      },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];
  const [active, setActive] = useState<string>("All");
  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Our work"
        title="A selection of recent projects."
        description="Every project below was designed and built end-to-end by our two-person team."
      />

      <section className="section pt-12">
        <div className="container-page">
          <div className="mb-10 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  active === c
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-surface text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i} />
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
