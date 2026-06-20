import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageTitle } from "@/components/admin/AdminShell";
import { CrudList } from "@/components/admin/CrudList";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fetchAllTestimonials, type TestimonialRow } from "@/lib/cms";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/testimonials")({ component: TestimonialsAdmin });

const EMPTY: Partial<TestimonialRow> = {
  name: "", role: "", company: "", business: "", project: "", rating: 5, quote: "",
  avatar_url: null, sort_order: 0, is_published: true,
};

function TestimonialsAdmin() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["admin", "testimonials"], queryFn: fetchAllTestimonials });
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Partial<TestimonialRow>>(EMPTY);

  const save = useMutation({
    mutationFn: async (row: Partial<TestimonialRow>) => {
      if (row.id) {
        const { error } = await supabase.from("testimonials").update(row).eq("id", row.id);
        if (error) throw error;
      } else {
        const { id, ...insert } = row;
        const { error } = await supabase.from("testimonials").insert(insert as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "testimonials"] });
      qc.invalidateQueries({ queryKey: ["public", "testimonials"] });
      setOpen(false); toast.success("Saved");
    },
    onError: (e: any) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "testimonials"] });
      qc.invalidateQueries({ queryKey: ["public", "testimonials"] });
      toast.success("Deleted");
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <>
      <PageTitle title="Testimonials" description="Reviews shown on /testimonials and the homepage.">
        <Button onClick={() => { setDraft({ ...EMPTY, sort_order: data.length }); setOpen(true); }}>
          <Plus className="mr-2 size-4" /> New testimonial
        </Button>
      </PageTitle>
      <div className="p-6">
        <CrudList
          items={data.map((t) => ({ id: t.id, title: `${t.name} · ${t.company}`, subtitle: t.quote, thumb: t.avatar_url, published: t.is_published }))}
          onEdit={(id) => { setDraft(data.find((t) => t.id === id) ?? EMPTY); setOpen(true); }}
          onDelete={(id) => del.mutate(id)}
          onTogglePublish={(id, next) => save.mutate({ id, is_published: next })}
        />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
          <DialogHeader><DialogTitle>{draft.id ? "Edit" : "New"} testimonial</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Name"><Input value={draft.name ?? ""} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field>
              <Field label="Role"><Input value={draft.role ?? ""} onChange={(e) => setDraft({ ...draft, role: e.target.value })} /></Field>
              <Field label="Company"><Input value={draft.company ?? ""} onChange={(e) => setDraft({ ...draft, company: e.target.value })} /></Field>
              <Field label="Business type"><Input value={draft.business ?? ""} onChange={(e) => setDraft({ ...draft, business: e.target.value })} placeholder="Restaurant, Salon…" /></Field>
            </div>
            <Field label="Project tag"><Input value={draft.project ?? ""} onChange={(e) => setDraft({ ...draft, project: e.target.value })} /></Field>
            <Field label="Quote"><Textarea rows={4} value={draft.quote ?? ""} onChange={(e) => setDraft({ ...draft, quote: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Rating (1-5)"><Input type="number" min={1} max={5} value={draft.rating ?? 5} onChange={(e) => setDraft({ ...draft, rating: Number(e.target.value) })} /></Field>
              <Field label="Sort order"><Input type="number" value={draft.sort_order ?? 0} onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })} /></Field>
            </div>
            <Field label="Avatar"><ImageUpload value={draft.avatar_url ?? null} onChange={(url) => setDraft({ ...draft, avatar_url: url })} folder="testimonials" aspect="aspect-square" /></Field>
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
