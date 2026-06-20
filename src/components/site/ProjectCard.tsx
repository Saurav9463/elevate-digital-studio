import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export type ProjectCardData = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  tech: string[];
  gradient: string;
  cover_url?: string | null;
  is_featured?: boolean;
  live_url?: string | null;
};

export function ProjectCard({ project, index = 0 }: { project: ProjectCardData; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.25), ease: [0.22, 1, 0.36, 1] }}
      className="card-surface group flex flex-col overflow-hidden"
    >
      <div className={`relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br ${project.gradient}`}>
        {project.cover_url && (
          <img src={project.cover_url} alt={project.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        )}
        <div className="absolute inset-0 flex items-end p-5">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-background/85 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur">
              {project.category}
            </span>
            {project.is_featured && (
              <span className="rounded-full bg-foreground px-2.5 py-1 text-[11px] font-medium text-background">
                Featured
              </span>
            )}
          </div>
        </div>
        <div className="absolute left-4 top-4 flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-background/70" />
          <span className="h-2 w-2 rounded-full bg-background/55" />
          <span className="h-2 w-2 rounded-full bg-background/40" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">{project.title}</h3>
          <ArrowUpRight className="mt-1 h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
        </div>
        <p className="text-sm text-muted-foreground">{project.summary}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {project.tech.map((t) => (
            <span key={t} className="rounded-md border border-border bg-surface-muted px-2 py-0.5 text-[11px] text-muted-foreground">{t}</span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
