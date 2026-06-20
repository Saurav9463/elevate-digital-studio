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
import { fetchAllFounders, type FounderRow } from "@/lib/cms";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/founders")({ component: FoundersAdmin });

const EMPTY: Partial<FounderRow> = {
  name: "", role: "", bio: "", photo_url: null, skills: [],
  linkedin_url: "", github_url: "", sort_order: 0, is_published: true,
};

function FoundersAdmin() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["admin", "founders"], queryFn: fetchAllFounders });
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Partial<FounderRow>>(EMPTY);

  const save = useMutation({
    mutationFn: async (row: Partial<FounderRow>) => {
      if (row.id) {
        const { error } = await supabase.from("founders").update(row).eq("id", row.id);
        if (error) throw error;
      } else {
        const { id, ...insert } = row;
        const { error } = await supabase.from("founders").insert(insert as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "founders"] });
      qc.invalidateQueries({ queryKey: ["public", "founders"] });
      setOpen(false); toast.success("Saved");
    },
    onError: (e: any) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("founders").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "founders"] });
      qc.invalidateQueries({ queryKey: ["public", "founders"] });
      toast.success("Deleted");
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <>
      <PageTitle title="Founders" description="Profiles shown on /about.">
        <Button onClick={() => { setDraft({ ...EMPTY, sort_order: data.length }); setOpen(true); }}>
          <Plus className="mr-2 size-4" /> New founder
        </Button>
      </PageTitle>
      <div className="p-6">
        <CrudList
          items={data.map((f) => ({ id: f.id, title: f.name, subtitle: f.role, thumb: f.photo_url, published: f.is_published }))}
          onEdit={(id) => { setDraft(data.find((f) => f.id === id) ?? EMPTY); setOpen(true); }}
          onDelete={(id) => del.mutate(id)}
          onTogglePublish={(id, next) => save.mutate({ id, is_published: next })}
        />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
          <DialogHeader><DialogTitle>{draft.id ? "Edit" : "New"} founder</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Name"><Input value={draft.name ?? ""} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field>
              <Field label="Role"><Input value={draft.role ?? ""} onChange={(e) => setDraft({ ...draft, role: e.target.value })} /></Field>
            </div>
            <Field label="Bio"><Textarea rows={4} value={draft.bio ?? ""} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} /></Field>
            <Field label="Skills"><TagInput value={draft.skills ?? []} onChange={(v) => setDraft({ ...draft, skills: v })} /></Field>
            <Field label="Photo"><ImageUpload value={draft.photo_url ?? null} onChange={(url) => setDraft({ ...draft, photo_url: url })} folder="founders" aspect="aspect-[4/5]" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="LinkedIn URL"><Input value={draft.linkedin_url ?? ""} onChange={(e) => setDraft({ ...draft, linkedin_url: e.target.value })} /></Field>
              <Field label="GitHub URL"><Input value={draft.github_url ?? ""} onChange={(e) => setDraft({ ...draft, github_url: e.target.value })} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Sort order"><Input type="number" value={draft.sort_order ?? 0} onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })} /></Field>
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
