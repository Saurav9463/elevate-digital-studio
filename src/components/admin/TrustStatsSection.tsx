import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { trustStats as fallback } from "@/data/site";
import { SectionLoader, SaveButton } from "./HeroSection";

type Stat = { id?: number; value: string; label: string };

export function TrustStatsSection() {
  const [stats, setStats] = useState<Stat[]>(fallback);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("trust_stats").select("*").order("id").then(({ data }) => {
      if (data && data.length > 0) setStats(data);
      setLoading(false);
    });
  }, []);

  function update(i: number, field: keyof Stat, value: string) {
    setStats((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));
  }

  async function save() {
    setSaving(true);
    const rows = stats.map((s, i) => ({ id: i + 1, value: s.value, label: s.label }));
    const { error } = await supabase.from("trust_stats").upsert(rows);
    setSaving(false);
    if (error) toast.error("Failed to save: " + error.message);
    else toast.success("Trust stats saved!");
  }

  if (loading) return <SectionLoader />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trust Stats</CardTitle>
        <CardDescription>The 4 statistics shown below the hero.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.map((stat, i) => (
          <div key={i} className="flex gap-3 items-end">
            <div className="space-y-1 w-28">
              <Label className="text-xs text-muted-foreground">Value</Label>
              <Input value={stat.value} onChange={(e) => update(i, "value", e.target.value)} placeholder="40+" />
            </div>
            <div className="space-y-1 flex-1">
              <Label className="text-xs text-muted-foreground">Label</Label>
              <Input value={stat.label} onChange={(e) => update(i, "label", e.target.value)} placeholder="Projects delivered" />
            </div>
          </div>
        ))}
        <SaveButton saving={saving} onClick={save} />
      </CardContent>
    </Card>
  );
}
