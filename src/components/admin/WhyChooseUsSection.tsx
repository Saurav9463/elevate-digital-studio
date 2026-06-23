import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { whyChooseUs as fallback } from "@/data/site";
import { SectionLoader, SaveButton } from "./HeroSection";

type Item = { id?: string; title: string; text: string };

export function WhyChooseUsSection() {
  const [items, setItems] = useState<Item[]>(fallback);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("why_choose_us").select("*").order("title").then(({ data }) => {
      if (data && data.length > 0) setItems(data);
      setLoading(false);
    });
  }, []);

  function update(i: number, field: keyof Item, value: string) {
    setItems(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  }

  async function save() {
    setSaving(true);
    const { error: delErr } = await supabase.from("why_choose_us").delete().neq("title", "");
    if (delErr) { toast.error("Failed: " + delErr.message); setSaving(false); return; }
    const rows = items.map((s) => ({ title: s.title, text: s.text }));
    const { error } = await supabase.from("why_choose_us").insert(rows);
    setSaving(false);
    if (error) toast.error("Failed: " + error.message);
    else toast.success("Saved!");
  }

  if (loading) return <SectionLoader />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Why Choose Us</CardTitle>
        <CardDescription>The 4 selling points shown on the homepage.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {items.map((item, i) => (
          <div key={i} className="space-y-2 pb-4 border-b last:border-0 last:pb-0">
            <div className="space-y-1">
              <Label className="text-xs">Title</Label>
              <Input value={item.title} onChange={e => update(i, "title", e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Description</Label>
              <Textarea rows={2} value={item.text} onChange={e => update(i, "text", e.target.value)} />
            </div>
          </div>
        ))}
        <SaveButton saving={saving} onClick={save} />
      </CardContent>
    </Card>
  );
}
