import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { founders as fallback } from "@/data/site";
import { SectionLoader, SaveButton } from "./HeroSection";

type Founder = { id?: string; name: string; role: string; bio: string; photo_url: string; skills: string; linkedin_url: string; github_url: string };

function toForm(f: typeof fallback[0]): Founder {
  return { ...f, photo_url: f.photo_url ?? "", skills: f.skills.join(", "), linkedin_url: f.linkedin_url ?? "", github_url: f.github_url ?? "" };
}

export function FoundersSection() {
  const [founders, setFounders] = useState<Founder[]>(fallback.map(toForm));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("founders").select("*").order("name").then(({ data }) => {
      if (data && data.length > 0) {
        setFounders(data.map(d => ({ ...d, photo_url: d.photo_url ?? "", skills: Array.isArray(d.skills) ? d.skills.join(", ") : (d.skills ?? ""), linkedin_url: d.linkedin_url ?? "", github_url: d.github_url ?? "" })));
      }
      setLoading(false);
    });
  }, []);

  function update(i: number, field: keyof Founder, value: string) {
    setFounders(prev => prev.map((f, idx) => idx === i ? { ...f, [field]: value } : f));
  }

  async function save() {
    setSaving(true);
    const rows = founders.map(f => ({ ...f, skills: f.skills.split(",").map(s => s.trim()).filter(Boolean), photo_url: f.photo_url || null, linkedin_url: f.linkedin_url || null, github_url: f.github_url || null }));
    const { error } = await supabase.from("founders").upsert(rows);
    setSaving(false);
    if (error) toast.error("Failed: " + error.message);
    else toast.success("Founders saved!");
  }

  if (loading) return <SectionLoader />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Founders</h2>
          <p className="text-sm text-muted-foreground">Edit the two founder profiles.</p>
        </div>
        <SaveButton saving={saving} onClick={save} />
      </div>
      {founders.map((f, i) => (
        <Card key={f.id ?? i}>
          <CardHeader><CardTitle className="text-base">{f.name || `Founder ${i + 1}`}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {(["name", "role", "photo_url", "linkedin_url", "github_url"] as const).map(field => (
              <div key={field} className="space-y-1">
                <Label className="text-xs capitalize">{field.replace(/_/g, " ")}</Label>
                <Input value={f[field]} onChange={e => update(i, field, e.target.value)} />
              </div>
            ))}
            <div className="space-y-1">
              <Label className="text-xs">Bio</Label>
              <Textarea rows={3} value={f.bio} onChange={e => update(i, "bio", e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Skills <span className="text-muted-foreground">(comma-separated)</span></Label>
              <Input value={f.skills} onChange={e => update(i, "skills", e.target.value)} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
