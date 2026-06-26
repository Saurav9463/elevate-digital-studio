import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Unique visual theme per service — gradient + decorative SVG pattern
const serviceThemes: Record<string, {
  gradient: string;
  pattern: string;
  accent: string;
}> = {
  "business-websites": {
    gradient: "from-slate-800 via-slate-700 to-slate-900",
    accent: "text-sky-300",
    pattern: `<rect x="160" y="-20" width="180" height="220" rx="16" fill="white" fill-opacity="0.04"/>
      <rect x="180" y="10" width="140" height="12" rx="4" fill="white" fill-opacity="0.1"/>
      <rect x="180" y="32" width="100" height="8" rx="4" fill="white" fill-opacity="0.07"/>
      <rect x="180" y="50" width="120" height="8" rx="4" fill="white" fill-opacity="0.07"/>
      <rect x="180" y="80" width="60" height="24" rx="6" fill="white" fill-opacity="0.12"/>`,
  },
  "restaurant-websites": {
    gradient: "from-orange-700 via-amber-600 to-red-800",
    accent: "text-amber-200",
    pattern: `<circle cx="270" cy="60" r="70" fill="white" fill-opacity="0.05"/>
      <circle cx="270" cy="60" r="48" fill="white" fill-opacity="0.05"/>
      <circle cx="270" cy="60" r="26" fill="white" fill-opacity="0.08"/>
      <line x1="230" y1="60" x2="310" y2="60" stroke="white" stroke-opacity="0.12" stroke-width="1.5"/>
      <line x1="270" y1="20" x2="270" y2="100" stroke="white" stroke-opacity="0.12" stroke-width="1.5"/>`,
  },
  "salon-websites": {
    gradient: "from-pink-700 via-fuchsia-700 to-purple-800",
    accent: "text-pink-200",
    pattern: `<circle cx="280" cy="30" r="40" fill="white" fill-opacity="0.06"/>
      <circle cx="240" cy="90" r="30" fill="white" fill-opacity="0.05"/>
      <circle cx="300" cy="80" r="20" fill="white" fill-opacity="0.06"/>
      <line x1="220" y1="10" x2="320" y2="110" stroke="white" stroke-opacity="0.08" stroke-width="1"/>
      <line x1="200" y1="50" x2="340" y2="50" stroke="white" stroke-opacity="0.06" stroke-width="1"/>`,
  },
  "clinic-websites": {
    gradient: "from-teal-700 via-emerald-700 to-cyan-800",
    accent: "text-emerald-200",
    pattern: `<line x1="260" y1="20" x2="260" y2="100" stroke="white" stroke-opacity="0.15" stroke-width="12" stroke-linecap="round"/>
      <line x1="220" y1="60" x2="300" y2="60" stroke="white" stroke-opacity="0.15" stroke-width="12" stroke-linecap="round"/>
      <circle cx="260" cy="60" r="55" fill="none" stroke="white" stroke-opacity="0.06" stroke-width="1.5"/>`,
  },
  "gym-websites": {
    gradient: "from-zinc-800 via-neutral-700 to-stone-900",
    accent: "text-yellow-300",
    pattern: `<rect x="200" y="40" width="100" height="28" rx="14" fill="white" fill-opacity="0.07"/>
      <rect x="170" y="48" width="30" height="12" rx="6" fill="white" fill-opacity="0.1"/>
      <rect x="300" y="48" width="30" height="12" rx="6" fill="white" fill-opacity="0.1"/>
      <rect x="215" y="75" width="70" height="8" rx="4" fill="white" fill-opacity="0.07"/>
      <rect x="225" y="90" width="50" height="8" rx="4" fill="white" fill-opacity="0.05"/>`,
  },
  "admin-dashboards": {
    gradient: "from-blue-800 via-indigo-700 to-violet-900",
    accent: "text-blue-200",
    pattern: `<rect x="155" y="15" width="185" height="110" rx="8" fill="white" fill-opacity="0.05"/>
      <rect x="162" y="22" width="171" height="16" rx="4" fill="white" fill-opacity="0.08"/>
      <rect x="162" y="46" width="80" height="50" rx="4" fill="white" fill-opacity="0.06"/>
      <rect x="250" y="46" width="83" height="22" rx="4" fill="white" fill-opacity="0.06"/>
      <rect x="250" y="74" width="83" height="22" rx="4" fill="white" fill-opacity="0.06"/>`,
  },
  "booking-systems": {
    gradient: "from-violet-800 via-purple-700 to-indigo-900",
    accent: "text-violet-200",
    pattern: `<rect x="160" y="10" width="175" height="120" rx="8" fill="white" fill-opacity="0.05"/>
      <line x1="160" y1="35" x2="335" y2="35" stroke="white" stroke-opacity="0.08" stroke-width="1"/>
      <rect x="170" y="45" width="24" height="24" rx="4" fill="white" fill-opacity="0.1"/>
      <rect x="202" y="45" width="24" height="24" rx="4" fill="white" fill-opacity="0.06"/>
      <rect x="234" y="45" width="24" height="24" rx="4" fill="white" fill-opacity="0.06"/>
      <rect x="266" y="45" width="24" height="24" rx="4" fill="white" fill-opacity="0.1"/>
      <rect x="298" y="45" width="24" height="24" rx="4" fill="white" fill-opacity="0.06"/>
      <rect x="170" y="77" width="24" height="24" rx="4" fill="white" fill-opacity="0.06"/>
      <rect x="202" y="77" width="24" height="24" rx="4" fill="white" fill-opacity="0.1"/>
      <rect x="234" y="77" width="24" height="24" rx="4" fill="white" fill-opacity="0.06"/>`,
  },
  "custom-apps": {
    gradient: "from-cyan-800 via-sky-700 to-blue-900",
    accent: "text-cyan-200",
    pattern: `<text x="160" y="55" font-family="monospace" font-size="11" fill="white" fill-opacity="0.12">const app = () =&gt; {</text>
      <text x="172" y="72" font-family="monospace" font-size="11" fill="white" fill-opacity="0.09">  return &lt;Site /&gt;</text>
      <text x="160" y="89" font-family="monospace" font-size="11" fill="white" fill-opacity="0.12">}</text>
      <rect x="155" y="30" width="190" height="80" rx="6" fill="white" fill-opacity="0.03"/>`,
  },
  "maintenance": {
    gradient: "from-green-800 via-emerald-700 to-teal-900",
    accent: "text-green-200",
    pattern: `<circle cx="270" cy="60" r="55" fill="none" stroke="white" stroke-opacity="0.08" stroke-width="1.5"/>
      <circle cx="270" cy="60" r="38" fill="none" stroke="white" stroke-opacity="0.07" stroke-width="1.5"/>
      <circle cx="270" cy="60" r="20" fill="white" fill-opacity="0.07"/>
      <path d="M255 60 L265 70 L285 48" stroke="white" stroke-opacity="0.25" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
  },
};

const defaultTheme = {
  gradient: "from-gray-700 via-gray-600 to-gray-800",
  accent: "text-gray-200",
  pattern: `<circle cx="270" cy="60" r="55" fill="white" fill-opacity="0.05"/>`,
};

export function ServiceCard({
  title,
  summary,
  bullets,
  icon,
  slug,
  index = 0,
}: {
  title: string;
  summary: string;
  bullets: string[];
  icon: string;
  slug?: string;
  index?: number;
}) {
  const Icon = (Icons[icon as keyof typeof Icons] as LucideIcon) ?? Icons.Sparkles;
  const theme = (slug && serviceThemes[slug]) ? serviceThemes[slug] : defaultTheme;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.2) }}
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${theme.gradient} flex flex-col min-h-[280px] group cursor-default`}
    >
      {/* SVG decorative background pattern */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 140"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g dangerouslySetInnerHTML={{ __html: theme.pattern }} />
      </svg>

      {/* Subtle bottom gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-6">
        {/* Icon */}
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm ${theme.accent}`}>
          <Icon className="h-5 w-5" />
        </div>

        {/* Spacer to push text to bottom */}
        <div className="flex-1" />

        {/* Text content at bottom */}
        <div>
          <h3 className="text-base font-semibold tracking-tight text-white">{title}</h3>
          <p className="mt-1.5 text-sm text-white/70 leading-relaxed">{summary}</p>

          {/* Bullets — shown on hover */}
          <ul className="mt-3 space-y-1 max-h-0 overflow-hidden opacity-0 group-hover:max-h-40 group-hover:opacity-100 transition-all duration-300 ease-in-out">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-white/80">
                <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/60`} />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
