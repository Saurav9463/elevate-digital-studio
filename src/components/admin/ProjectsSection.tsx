import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Pencil, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import { projects as fallback } from "@/data/site";
import { SectionLoader } from "./HeroSection";

type Project = { id?: string; title: string; category: string; client: string; summary: string; year: string; tech: string; live_url: string; cover_url: string; is_featured: boolean; gradient: string; slug: string };
const empty: Project = { title: "", category: "", client: "", summary: "", year: "", tech: "", live_url: "", cover_url: "", is_featured: false, gradient: "", slug: "" };

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Project>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("projects").select("*").order("title").then(({ data }) => {
      setProjects(data && data.length > 0
        ? data.map(d => ({ ...d, tech: Array.isArray(d.tech) ? d.tech.join(", ") : (d.tech ?? "") }))
        : fallback.map(p => ({ ...p, tech: p.tech.join(", "), live_url: p.live_url ?? "", cover_url: p.cover_url ?? "", is_featured: p.is_featured ?? false })));
      setLoading(false);
    });
  }, []);

  function openNew() { setEditing(empty); setOpen(true); }
  function openEdit(p: Project) { setEditing(p); setOpen(true); }

  const featuredCount = projects.filter(p => p.is_featured).length;

  async function saveProject() {
    if (editing.is_featured && !editing.id && featuredCount >= 3) { toast.error("Max 3 featured projects"); return; }
    setSaving(true);
    const row = { ...editing, tech: editing.tech.split(",").map(t => t.trim()).filter(Boolean) };
    const { data, error } = editing.id
      ? await supabase.from("projects").update(row).eq("id", editing.id).select().single()
      : await supabase.from("projects").insert(row).select().single();
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    const updated = { ...data, tech: Array.isArray(data.tech) ? data.tech.join(", ") : data.tech };
    setProjects(prev => editing.id ? prev.map(p => p.id === editing.id ? updated : p) : [...prev, updated]);
    setOpen(false);
    toast.success(editing.id ? "Project updated!" : "Project added!");
  }

  async function deleteProject(id: string) {
    if (!confirm("Delete this project?")) return;
    await supabase.from("projects").delete().eq("id", id);
    setProjects(prev => prev.filter(p => p.id !== id));
    toast.success("Deleted.");
  }

  if (loading) return <SectionLoader />;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>Projects</CardTitle>
            <CardDescription>Manage your portfolio. Up to 3 can be featured.</CardDescription>
          </div>
          <Button size="sm" onClick={openNew}><Plus className="h-4 w-4 mr-1" />Add</Button>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {projects.map((p, i) => (
              <div key={p.id ?? i} className="flex items-center justify-between py-3 gap-2">
                <div className="min-w-0 flex items-center gap-2">
                  {p.is_featured && <Star className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />}
                  <div>
                    <p className="font-medium text-sm truncate">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{p.category} · {p.year}</p>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}><Pencil className="h-3.5 w-3.5" /></Button>
                  {p.id && <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteProject(p.id!)}><Trash2 className="h-3.5 w-3.5" /></Button>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing.id ? "Edit Project" : "New Project"}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            {(["title", "slug", "category", "client", "year", "gradient"] as const).map(f => (
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
              <Label>Tech <span className="text-muted-foreground text-xs">(comma-separated)</span></Label>
              <Input value={editing.tech} onChange={e => setEditing({ ...editing, tech: e.target.value })} />
            </div>
            {(["live_url", "cover_url"] as const).map(f => (
              <div key={f} className="space-y-1">
                <Label>{f === "live_url" ? "Live URL" : "Cover Image URL"}</Label>
                <Input value={editing[f]} onChange={e => setEditing({ ...editing, [f]: e.target.value })} />
              </div>
            ))}
            <div className="flex items-center gap-3">
              <Switch checked={editing.is_featured} onCheckedChange={v => setEditing({ ...editing, is_featured: v })} id="featured" />
              <Label htmlFor="featured">Featured <span className="text-muted-foreground text-xs">({featuredCount}/3 featured)</span></Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={saveProject} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
