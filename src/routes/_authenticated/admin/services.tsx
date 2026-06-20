import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageTitle } from "@/components/admin/AdminShell";
import { CrudList } from "@/components/admin/CrudList";
import { TagInput } from "@/components/admin/TagInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fetchAllServices, type ServiceRow } from "@/lib/cms";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/services")({ component: ServicesAdmin });

const EMPTY: Partial<ServiceRow> = {
  slug: "", title: "", summary: "", bullets: [], icon: "Sparkles", sort_order: 0, is_published: true,
};

function ServicesAdmin() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["admin", "services"], queryFn: fetchAllServices });
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Partial<ServiceRow>>(EMPTY);

  const save = useMutation({
    mutationFn: async (row: Partial<ServiceRow>) => {
      if (row.id) {
        const { error } = await supabase.from("services").update(row).eq("id", row.id);
        if (error) throw error;
      } else {
        const { id, ...insert } = row;
        const { error } = await supabase.from("services").insert(insert as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "services"] });
      qc.invalidateQueries({ queryKey: ["public", "services"] });
      setOpen(false);
      toast.success("Saved");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "services"] });
      qc.invalidateQueries({ queryKey: ["public", "services"] });
      toast.success("Deleted");
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <>
      <PageTitle title="Services" description="Edit what's shown on /services.">
        <Button onClick={() => { setDraft({ ...EMPTY, sort_order: data.length }); setOpen(true); }}>
          <Plus className="mr-2 size-4" /> New service
        </Button>
      </PageTitle>
      <div className="p-6">
        <CrudList
          items={data.map((s) => ({ id: s.id, title: s.title, subtitle: s.summary, published: s.is_published }))}
          onEdit={(id) => { setDraft(data.find((s) => s.id === id) ?? EMPTY); setOpen(true); }}
          onDelete={(id) => del.mutate(id)}
          onTogglePublish={(id, next) => save.mutate({ id, is_published: next })}
        />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>{draft.id ? "Edit" : "New"} service</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Title"><Input value={draft.title ?? ""} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
              <Field label="Slug"><Input value={draft.slug ?? ""} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} /></Field>
            </div>
            <Field label="Summary"><Textarea rows={3} value={draft.summary ?? ""} onChange={(e) => setDraft({ ...draft, summary: e.target.value })} /></Field>
            <Field label="Bullets"><TagInput value={draft.bullets ?? []} onChange={(v) => setDraft({ ...draft, bullets: v })} placeholder="Add a bullet, press Enter" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Icon (Lucide name)"><Input value={draft.icon ?? ""} onChange={(e) => setDraft({ ...draft, icon: e.target.value })} placeholder="Globe, Scissors, Sparkles…" /></Field>
              <Field label="Sort order"><Input type="number" value={draft.sort_order ?? 0} onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })} /></Field>
            </div>
            <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
              <Label>Published</Label>
              <Switch checked={!!draft.is_published} onCheckedChange={(c) => setDraft({ ...draft, is_published: c })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => save.mutate(draft)} disabled={save.isPending}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
