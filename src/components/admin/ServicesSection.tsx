import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { services as fallback } from "@/data/site";
import { SectionLoader } from "./HeroSection";

type Service = { id?: string; title: string; summary: string; bullets: string; icon: string; slug: string };

const empty: Service = { title: "", summary: "", bullets: "", icon: "", slug: "" };

export function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Service>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("services").select("*").order("title").then(({ data }) => {
      setServices(data && data.length > 0 ? data.map(d => ({ ...d, bullets: Array.isArray(d.bullets) ? d.bullets.join(", ") : d.bullets })) : fallback.map(s => ({ ...s, bullets: s.bullets.join(", ") })));
      setLoading(false);
    });
  }, []);

  function openNew() { setEditing(empty); setOpen(true); }
  function openEdit(s: Service) { setEditing(s); setOpen(true); }

  async function saveService() {
    setSaving(true);
    const row = { ...editing, bullets: editing.bullets.split(",").map(b => b.trim()).filter(Boolean) };
    const { data, error } = editing.id
      ? await supabase.from("services").update(row).eq("id", editing.id).select().single()
      : await supabase.from("services").insert(row).select().single();
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    const updated = { ...data, bullets: Array.isArray(data.bullets) ? data.bullets.join(", ") : data.bullets };
    setServices(prev => editing.id ? prev.map(s => s.id === editing.id ? updated : s) : [...prev, updated]);
    setOpen(false);
    toast.success(editing.id ? "Service updated!" : "Service added!");
  }

  async function deleteService(id: string) {
    if (!confirm("Delete this service?")) return;
    await supabase.from("services").delete().eq("id", id);
    setServices(prev => prev.filter(s => s.id !== id));
    toast.success("Deleted.");
  }

  if (loading) return <SectionLoader />;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>Services</CardTitle>
            <CardDescription>Manage the services you offer.</CardDescription>
          </div>
          <Button size="sm" onClick={openNew}><Plus className="h-4 w-4 mr-1" />Add</Button>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {services.map((s, i) => (
              <div key={s.id ?? i} className="flex items-center justify-between py-3 gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{s.title || <span className="text-muted-foreground italic">Untitled</span>}</p>
                  <p className="text-xs text-muted-foreground truncate">{s.summary}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(s)}><Pencil className="h-3.5 w-3.5" /></Button>
                  {s.id && <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteService(s.id!)}><Trash2 className="h-3.5 w-3.5" /></Button>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing.id ? "Edit Service" : "New Service"}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            {(["title", "slug", "icon"] as const).map(f => (
              <div key={f} className="space-y-1">
                <Label className="capitalize">{f}</Label>
                <Input value={editing[f]} onChange={e => setEditing({ ...editing, [f]: e.target.value })} />
              </div>
            ))}
            <div className="space-y-1">
              <Label>Summary</Label>
              <Textarea rows={2} value={editing.summary} onChange={e => setEditing({ ...editing, summary: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Bullets <span className="text-muted-foreground text-xs">(comma-separated)</span></Label>
              <Textarea rows={2} value={editing.bullets} onChange={e => setEditing({ ...editing, bullets: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={saveService} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
