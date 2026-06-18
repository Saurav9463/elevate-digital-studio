import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

export function ServiceCard({
  title,
  summary,
  bullets,
  icon,
  index = 0,
}: {
  title: string;
  summary: string;
  bullets: string[];
  icon: string;
  index?: number;
}) {
  const Icon = (Icons[icon as keyof typeof Icons] as LucideIcon) ?? Icons.Sparkles;
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.2) }}
      className="card-surface flex flex-col gap-4 p-6"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-base font-semibold tracking-tight text-foreground">{title}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">{summary}</p>
      </div>
      <ul className="mt-2 space-y-1.5 text-sm text-foreground/80">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            {b}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
