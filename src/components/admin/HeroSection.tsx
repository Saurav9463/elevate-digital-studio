import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { hero as fallback } from "@/data/site";

type HeroData = { eyebrow: string; title: string; description: string };

export function HeroSection() {
  const [data, setData] = useState<HeroData>(fallback);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("hero").select("*").single().then(({ data: d }) => {
      if (d) setData(d);
      setLoading(false);
    });
  }, []);

  async function save() {
    setSaving(true);
    const { error } = await supabase.from("hero").upsert({ id: 1, ...data });
    setSaving(false);
    if (error) toast.error("Failed to save: " + error.message);
    else toast.success("Hero section saved!");
  }

  if (loading) return <SectionLoader />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Section</CardTitle>
        <CardDescription>The main headline section on the homepage.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Eyebrow text</Label>
          <Input value={data.eyebrow} onChange={(e) => setData({ ...data, eyebrow: e.target.value })} placeholder="A boutique web studio" />
        </div>
        <div className="space-y-2">
          <Label>Title</Label>
          <Input value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} placeholder="We build websites…" />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea rows={3} value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} />
        </div>
        <SaveButton saving={saving} onClick={save} />
      </CardContent>
    </Card>
  );
}

export function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}

export function SaveButton({ saving, onClick }: { saving: boolean; onClick: () => void }) {
  return (
    <Button onClick={onClick} disabled={saving} className="gap-2">
      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      Save Changes
    </Button>
  );
}
