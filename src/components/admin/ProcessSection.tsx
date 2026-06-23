import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { process as fallback } from "@/data/site";
import { SectionLoader, SaveButton } from "./HeroSection";

type Step = { id?: string; step: string; title: string; text: string };

export function ProcessSection() {
  const [steps, setSteps] = useState<Step[]>(fallback);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("process_steps").select("*").order("step").then(({ data }) => {
      if (data && data.length > 0) setSteps(data);
      setLoading(false);
    });
  }, []);

  function update(i: number, field: keyof Step, value: string) {
    setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  }

  async function save() {
    setSaving(true);
    const { error: delErr } = await supabase.from("process_steps").delete().neq("step", "");
    if (delErr) { toast.error("Failed: " + delErr.message); setSaving(false); return; }
    const rows = steps.map((s) => ({ step: s.step, title: s.title, text: s.text }));
    const { error } = await supabase.from("process_steps").insert(rows);
    setSaving(false);
    if (error) toast.error("Failed: " + error.message);
    else toast.success("Process steps saved!");
  }

  if (loading) return <SectionLoader />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Process Steps</CardTitle>
        <CardDescription>The 4-step process shown on the homepage.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {steps.map((s, i) => (
          <div key={i} className="space-y-2 pb-4 border-b last:border-0 last:pb-0">
            <div className="flex gap-3">
              <div className="space-y-1 w-20">
                <Label className="text-xs">Step #</Label>
                <Input value={s.step} onChange={e => update(i, "step", e.target.value)} placeholder="01" />
              </div>
              <div className="space-y-1 flex-1">
                <Label className="text-xs">Title</Label>
                <Input value={s.title} onChange={e => update(i, "title", e.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Description</Label>
              <Textarea rows={2} value={s.text} onChange={e => update(i, "text", e.target.value)} />
            </div>
          </div>
        ))}
        <SaveButton saving={saving} onClick={save} />
      </CardContent>
    </Card>
  );
}
