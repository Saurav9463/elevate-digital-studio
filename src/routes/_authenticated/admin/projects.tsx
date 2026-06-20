import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageTitle } from "@/components/admin/AdminShell";
import { CrudList } from "@/components/admin/CrudList";
import { TagInput } from "@/components/admin/TagInput";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fetchAllProjects, type ProjectRow } from "@/lib/cms";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/projects")({ component: ProjectsAdmin });

const GRADIENTS = [
  "from-amber-100 via-rose-100 to-orange-100",
  "from-rose-100 via-pink-100 to-purple-100",
  "from-sky-100 via-blue-100 to-cyan-100",
  "from-zinc-200 via-neutral-200 to-stone-200",
  "from-blue-100 via-indigo-100 to-violet-100",
  "from-emerald-100 via-green-100 to-teal-100",
];

const EMPTY: Partial<ProjectRow> = {
  slug: "", title: "", category: "", client: "", summary: "", tech: [],
  cover_url: null, gradient: GRADIENTS[0], live_url: "", year: String(new Date().getFullYear()),
  is_featured: false, is_published: true, sort_order: 0,
};

function ProjectsAdmin() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["admin", "projects"], queryFn: fetchAllProjects });
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Partial<ProjectRow>>(EMPTY);

  const save = useMutation({
    mutationFn: async (row: Partial<ProjectRow>) => {
      if (row.id) {
        const { error } = await supabase.from("projects").update(row).eq("id", row.id);
        if (error) throw error;
      } else {
        const { id, ...insert } = row;
        const { error } = await supabase.from("projects").insert(insert as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "projects"] });
      qc.invalidateQueries({ queryKey: ["public", "projects"] });
      setOpen(false); toast.success("Saved");
    },
    onError: (e: any) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "projects"] });
      qc.invalidateQueries({ queryKey: ["public", "projects"] });
      toast.success("Deleted");
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <>
      <PageTitle title="Projects" description="Manage your portfolio shown on /projects.">
        <Button onClick={() => { setDraft({ ...EMPTY, sort_order: data.length }); setOpen(true); }}>
          <Plus className="mr-2 size-4" /> New project
        </Button>
      </PageTitle>
      <div className="p-6">
        <CrudList
          items={data.map((p) => ({ id: p.id, title: p.title, subtitle: `${p.category} · ${p.client}`, thumb: p.cover_url, published: p.is_published }))}
          onEdit={(id) => { setDraft(data.find((p) => p.id === id) ?? EMPTY); setOpen(true); }}
          onDelete={(id) => del.mutate(id)}
          onTogglePublish={(id, next) => save.mutate({ id, is_published: next })}
        />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader><DialogTitle>{draft.id ? "Edit" : "New"} project</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Title"><Input value={draft.title ?? ""} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
              <Field label="Slug"><Input value={draft.slug ?? ""} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} /></Field>
              <Field label="Category"><Input value={draft.category ?? ""} onChange={(e) => setDraft({ ...draft, category: e.target.value })} placeholder="Restaurant, Salon…" /></Field>
              <Field label="Client"><Input value={draft.client ?? ""} onChange={(e) => setDraft({ ...draft, client: e.target.value })} /></Field>
            </div>
            <Field label="Summary"><Textarea rows={3} value={draft.summary ?? ""} onChange={(e) => setDraft({ ...draft, summary: e.target.value })} /></Field>
            <Field label="Tech stack"><TagInput value={draft.tech ?? []} onChange={(v) => setDraft({ ...draft, tech: v })} placeholder="React, Supabase…" /></Field>
            <Field label="Cover image">
              <ImageUpload value={draft.cover_url ?? null} onChange={(url) => setDraft({ ...draft, cover_url: url })} folder="projects" aspect="aspect-[16/10]" />
            </Field>
            <Field label="Fallback gradient (used when no image)">
              <div className="grid grid-cols-3 gap-2">
                {GRADIENTS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setDraft({ ...draft, gradient: g })}
                    className={`h-10 rounded-md bg-gradient-to-br ring-2 ${g} ${draft.gradient === g ? "ring-primary" : "ring-transparent"}`}
                  />
                ))}
              </div>
            </Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Year"><Input value={draft.year ?? ""} onChange={(e) => setDraft({ ...draft, year: e.target.value })} /></Field>
              <Field label="Live URL"><Input value={draft.live_url ?? ""} onChange={(e) => setDraft({ ...draft, live_url: e.target.value })} placeholder="https://…" /></Field>
              <Field label="Sort order"><Input type="number" value={draft.sort_order ?? 0} onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                <Label>Featured</Label>
                <Switch checked={!!draft.is_featured} onCheckedChange={(c) => setDraft({ ...draft, is_featured: c })} />
              </div>
              <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                <Label>Published</Label>
                <Switch checked={!!draft.is_published} onCheckedChange={(c) => setDraft({ ...draft, is_published: c })} />
              </div>
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
