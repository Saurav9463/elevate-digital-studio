import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, PageShell } from "@/components/site/PageShell";
import { ProjectCard } from "@/components/site/ProjectCard";
import { projects as staticProjects } from "@/data/site";
import { fetchProjects } from "@/lib/queries";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Our Work — Elevate Web Solutions" },
      { name: "description", content: "Selected projects — websites, booking systems, and dashboards built for real businesses." },
      { property: "og:title", content: "Our Work — Elevate Web Solutions" },
      { property: "og:description", content: "Selected projects — websites, booking systems, and dashboards." },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { data: projects = staticProjects } = useQuery({ queryKey: ["projects"], queryFn: fetchProjects, staleTime: 1000 * 60 });
  const categories = ["All", ...Array.from(new Set(projects.map((p: any) => p.category)))];
  const [active, setActive] = useState<string>("All");
  const filtered = active === "All" ? projects : projects.filter((p: any) => p.category === active);

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
            {filtered.map((p: any, i: number) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
          {!filtered.length && (
            <div className="rounded-lg border border-dashed border-border p-16 text-center text-sm text-muted-foreground">
              No projects to show yet.
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
