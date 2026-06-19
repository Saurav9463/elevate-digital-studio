import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageTitle } from "@/components/admin/AdminShell";
import { Inbox, Briefcase, Quote, Sparkles, Users } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminHome,
});

function AdminHome() {
  const counts = useQuery({
    queryKey: ["admin", "counts"],
    queryFn: async () => {
      const [leads, projects, services, testimonials, founders, newLeads] = await Promise.all([
        supabase.from("leads").select("id", { count: "exact", head: true }),
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("services").select("id", { count: "exact", head: true }),
        supabase.from("testimonials").select("id", { count: "exact", head: true }),
        supabase.from("founders").select("id", { count: "exact", head: true }),
        supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
      ]);
      return {
        leads: leads.count ?? 0,
        newLeads: newLeads.count ?? 0,
        projects: projects.count ?? 0,
        services: services.count ?? 0,
        testimonials: testimonials.count ?? 0,
        founders: founders.count ?? 0,
      };
    },
  });

  const recentLeads = useQuery({
    queryKey: ["admin", "recent-leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("id, name, email, company, status, created_at, message")
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  const c = counts.data;
  const cards = [
    { label: "New leads", value: c?.newLeads ?? "—", icon: Inbox, to: "/admin/leads", accent: true },
    { label: "Total leads", value: c?.leads ?? "—", icon: Inbox, to: "/admin/leads" },
    { label: "Projects", value: c?.projects ?? "—", icon: Briefcase, to: "/admin/projects" },
    { label: "Services", value: c?.services ?? "—", icon: Sparkles, to: "/admin/services" },
    { label: "Testimonials", value: c?.testimonials ?? "—", icon: Quote, to: "/admin/testimonials" },
    { label: "Founders", value: c?.founders ?? "—", icon: Users, to: "/admin/founders" },
  ];

  return (
    <>
      <PageTitle title="Overview" description="A quick snapshot of your studio." />
      <div className="space-y-8 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.label}
                to={card.to}
                className={`group rounded-xl border p-5 transition hover:shadow-sm ${
                  card.accent ? "border-primary/30 bg-primary/5" : "border-border bg-background"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{card.label}</span>
                  <Icon className={`size-4 ${card.accent ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div className="mt-3 text-3xl font-semibold tracking-tight">{card.value}</div>
              </Link>
            );
          })}
        </div>

        <section className="rounded-xl border border-border bg-background">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold">Recent leads</h2>
            <Link to="/admin/leads" className="text-xs text-primary hover:underline">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentLeads.isLoading && <div className="px-5 py-6 text-sm text-muted-foreground">Loading…</div>}
            {recentLeads.data?.length === 0 && (
              <div className="px-5 py-10 text-center text-sm text-muted-foreground">
                No leads yet. Submissions from your contact form will appear here.
              </div>
            )}
            {recentLeads.data?.map((l: any) => (
              <Link
                key={l.id}
                to="/admin/leads"
                className="block px-5 py-4 transition hover:bg-muted/50"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-medium text-foreground">{l.name}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {l.email}{l.company ? ` · ${l.company}` : ""}
                    </div>
                  </div>
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs capitalize">{l.status}</span>
                </div>
                <p className="mt-2 line-clamp-1 text-sm text-muted-foreground">{l.message}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
