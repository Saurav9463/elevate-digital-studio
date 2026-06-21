import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Mail, MessageCircle, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageTitle } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchAllLeads, type LeadRow } from "@/lib/cms";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/leads")({
  component: LeadsPage,
});

const STATUSES: LeadRow["status"][] = ["new", "contacted", "won", "lost", "archived"];

function LeadsPage() {
  const qc = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | LeadRow["status"]>("all");

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["admin", "leads"],
    queryFn: fetchAllLeads,
  });

  const filtered = filter === "all" ? leads : leads.filter((l) => l.status === filter);
  const selected = leads.find((l) => l.id === selectedId) ?? filtered[0];

  const updateLead = useMutation({
    mutationFn: async (patch: Partial<LeadRow> & { id: string }) => {
      const { error } = await supabase.from("leads").update(patch).eq("id", patch.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "leads"] });
      qc.invalidateQueries({ queryKey: ["admin", "counts"] });
      qc.invalidateQueries({ queryKey: ["admin", "recent-leads"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteLead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      setSelectedId(null);
      toast.success("Lead deleted");
      qc.invalidateQueries({ queryKey: ["admin", "leads"] });
      qc.invalidateQueries({ queryKey: ["admin", "counts"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <>
      <PageTitle title="Leads" description="Inquiries submitted through your contact form.">
        <Select value={filter} onValueChange={(v) => setFilter(v as any)}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All ({leads.length})</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PageTitle>

      <div className="grid h-[calc(100vh-117px)] grid-cols-1 lg:grid-cols-[380px_1fr]">
        {/* List */}
        <div className="overflow-y-auto border-b border-r border-border bg-background lg:border-b-0">
          {isLoading && <div className="p-6 text-sm text-muted-foreground">Loading…</div>}
          {!isLoading && filtered.length === 0 && (
            <div className="p-10 text-center text-sm text-muted-foreground">No leads in this view.</div>
          )}
          {filtered.map((l) => {
            const active = selected?.id === l.id;
            return (
              <button
                key={l.id}
                onClick={() => setSelectedId(l.id)}
                className={`block w-full border-b border-border px-5 py-4 text-left transition ${
                  active ? "bg-primary/5" : "hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="truncate font-medium text-foreground">{l.name}</div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide ${
                      l.status === "new" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {l.status}
                  </span>
                </div>
                <div className="mt-0.5 truncate text-xs text-muted-foreground">
                  {l.company ?? l.email}
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{l.message}</p>
                <div className="mt-2 text-[11px] text-muted-foreground">
                  {formatDistanceToNow(new Date(l.created_at), { addSuffix: true })}
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail */}
        <div className="overflow-y-auto p-6">
          {!selected && <div className="text-sm text-muted-foreground">Select a lead to view details.</div>}
          {selected && (
            <div className="mx-auto max-w-2xl space-y-6">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">{selected.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {selected.email}
                      {selected.company && <> · {selected.company}</>}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Received {formatDistanceToNow(new Date(selected.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (confirm("Delete this lead?")) deleteLead.mutate(selected.id);
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild size="sm" variant="outline">
                    <a href={`mailto:${selected.email}`}>
                      <Mail className="mr-2 size-4" /> Email
                    </a>
                  </Button>
                  {selected.phone && (
                    <Button asChild size="sm" variant="outline">
                      <a
                        href={`https://wa.me/${selected.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <MessageCircle className="mr-2 size-4" /> WhatsApp
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Service">{selected.service ?? "—"}</Field>
                <Field label="Phone">{selected.phone ?? "—"}</Field>
                <Field label="Source">{selected.source ?? "—"}</Field>
                <Field label="Status">
                  <Select
                    value={selected.status}
                    onValueChange={(v) => updateLead.mutate({ id: selected.id, status: v as LeadRow["status"] })}
                  >
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <div>
                <h3 className="text-sm font-semibold">Message</h3>
                <div className="mt-2 whitespace-pre-wrap rounded-lg border border-border bg-background p-4 text-sm">
                  {selected.message}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold">Internal notes</h3>
                <Textarea
                  key={selected.id}
                  defaultValue={selected.notes ?? ""}
                  rows={4}
                  className="mt-2"
                  placeholder="Notes only your team sees…"
                  onBlur={(e) => {
                    if (e.target.value !== (selected.notes ?? "")) {
                      updateLead.mutate({ id: selected.id, notes: e.target.value });
                      toast.success("Notes saved");
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm">{children}</div>
    </div>
  );
}
