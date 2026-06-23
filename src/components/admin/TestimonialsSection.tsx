import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import { testimonials as fallback } from "@/data/site";
import { SectionLoader } from "./HeroSection";

type Testimonial = { id?: string; name: string; role: string; company: string; business: string; project: string; quote: string; rating: number; avatar_url: string };
const empty: Testimonial = { name: "", role: "", company: "", business: "", project: "", quote: "", rating: 5, avatar_url: "" };

export function TestimonialsSection() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("testimonials").select("*").order("name").then(({ data }) => {
      setItems(data && data.length > 0 ? data.map(d => ({ ...d, avatar_url: d.avatar_url ?? "" })) : fallback.map(t => ({ ...t, avatar_url: t.avatar_url ?? "" })));
      setLoading(false);
    });
  }, []);

  function openNew() { setEditing(empty); setOpen(true); }
  function openEdit(t: Testimonial) { setEditing(t); setOpen(true); }

  async function save() {
    setSaving(true);
    const row = { ...editing, avatar_url: editing.avatar_url || null };
    const { data, error } = editing.id
      ? await supabase.from("testimonials").update(row).eq("id", editing.id).select().single()
      : await supabase.from("testimonials").insert(row).select().single();
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    const updated = { ...data, avatar_url: data.avatar_url ?? "" };
    setItems(prev => editing.id ? prev.map(t => t.id === editing.id ? updated : t) : [...prev, updated]);
    setOpen(false);
    toast.success(editing.id ? "Testimonial updated!" : "Testimonial added!");
  }

  async function del(id: string) {
    if (!confirm("Delete?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    setItems(prev => prev.filter(t => t.id !== id));
    toast.success("Deleted.");
  }

  if (loading) return <SectionLoader />;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>Testimonials</CardTitle>
            <CardDescription>Client reviews shown on the site.</CardDescription>
          </div>
          <Button size="sm" onClick={openNew}><Plus className="h-4 w-4 mr-1" />Add</Button>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {items.map((t, i) => (
              <div key={t.id ?? i} className="flex items-center justify-between py-3 gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role} · {t.company}</p>
                  <div className="flex gap-0.5 mt-0.5">{Array.from({ length: t.rating }).map((_, j) => <Star key={j} className="h-3 w-3 fill-amber-400 text-amber-400" />)}</div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(t)}><Pencil className="h-3.5 w-3.5" /></Button>
                  {t.id && <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => del(t.id!)}><Trash2 className="h-3.5 w-3.5" /></Button>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing.id ? "Edit Testimonial" : "New Testimonial"}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            {(["name", "role", "company", "business", "project", "avatar_url"] as const).map(f => (
              <div key={f} className="space-y-1">
                <Label className="capitalize">{f.replace("_", " ")}</Label>
                <Input value={editing[f] as string} onChange={e => setEditing({ ...editing, [f]: e.target.value })} />
              </div>
            ))}
            <div className="space-y-1">
              <Label>Quote</Label>
              <Textarea rows={3} value={editing.quote} onChange={e => setEditing({ ...editing, quote: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Rating (1–5)</Label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(n => (
                  <button key={n} type="button" onClick={() => setEditing({ ...editing, rating: n })}>
                    <Star className={`h-6 w-6 ${n <= editing.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
