import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Mail, MessageCircle } from "lucide-react";
import { navLinks, siteConfig } from "@/data/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-muted/40">
      <div className="container-page py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <Logo className="h-7 w-7" />
              <span className="text-sm font-semibold tracking-tight">{siteConfig.name}</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              A boutique web studio building websites, booking systems, and dashboards
              that help local businesses grow.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <a
                href={siteConfig.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-muted-foreground transition-colors hover:text-foreground"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                aria-label="Email"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-muted-foreground transition-colors hover:text-foreground"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-muted-foreground transition-colors hover:text-foreground"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Studio
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-foreground/80 hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Contact
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-foreground/80">
              <li>{siteConfig.email}</li>
              <li>{siteConfig.whatsapp}</li>
              <li>{siteConfig.location}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <p>Designed and built in-house · Saurav Arora & Raman Kumar</p>
            <Link to="/auth" className="opacity-60 hover:opacity-100 hover:underline">Studio admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
