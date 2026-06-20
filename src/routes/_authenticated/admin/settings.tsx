import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageTitle } from "@/components/admin/AdminShell";
import { fetchSiteSettings } from "@/lib/cms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/settings")({ component: SettingsAdmin });

type Hero = { eyebrow: string; title: string; description: string };
type Contact = { email: string; whatsapp: string; whatsapp_url: string; location: string };
type Social = { linkedin: string; github: string };
type Stat = { value: string; label: string };

function SettingsAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["public", "settings"], queryFn: fetchSiteSettings });

  const [hero, setHero] = useState<Hero>({ eyebrow: "", title: "", description: "" });
  const [contact, setContact] = useState<Contact>({ email: "", whatsapp: "", whatsapp_url: "", location: "" });
  const [social, setSocial] = useState<Social>({ linkedin: "", github: "" });
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    if (!data) return;
    setHero({ eyebrow: "", title: "", description: "", ...(data.hero ?? {}) });
    setContact({ email: "", whatsapp: "", whatsapp_url: "", location: "", ...(data.contact ?? {}) });
    setSocial({ linkedin: "", github: "", ...(data.social ?? {}) });
    setStats(Array.isArray(data.trust_stats) ? data.trust_stats : []);
  }, [data]);

  const save = useMutation({
    mutationFn: async (rows: Array<{ key: string; value: any }>) => {
      const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["public", "settings"] });
      toast.success("Settings saved");
    },
    onError: (e: any) => toast.error(e.message),
  });

  function handleSave() {
    save.mutate([
      { key: "hero", value: hero },
      { key: "contact", value: contact },
      { key: "social", value: social },
      { key: "trust_stats", value: stats },
    ]);
  }

  return (
    <>
      <PageTitle title="Site settings" description="Homepage copy, contact details, and social links.">
        <Button onClick={handleSave} disabled={save.isPending}>Save all</Button>
      </PageTitle>
      <div className="mx-auto max-w-3xl space-y-6 p-6">
        <Card>
          <CardHeader><CardTitle>Hero (homepage)</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <F label="Eyebrow"><Input value={hero.eyebrow} onChange={(e) => setHero({ ...hero, eyebrow: e.target.value })} /></F>
            <F label="Title"><Textarea rows={2} value={hero.title} onChange={(e) => setHero({ ...hero, title: e.target.value })} /></F>
            <F label="Description"><Textarea rows={3} value={hero.description} onChange={(e) => setHero({ ...hero, description: e.target.value })} /></F>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Trust stats</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {stats.map((s, i) => (
              <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2">
                <Input placeholder="40+" value={s.value} onChange={(e) => setStats(stats.map((x, j) => j === i ? { ...x, value: e.target.value } : x))} />
                <Input placeholder="Projects delivered" value={s.label} onChange={(e) => setStats(stats.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} />
                <Button variant="ghost" size="sm" onClick={() => setStats(stats.filter((_, j) => j !== i))}>Remove</Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setStats([...stats, { value: "", label: "" }])}>Add stat</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Contact</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <F label="Email"><Input value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} /></F>
            <div className="grid grid-cols-2 gap-3">
              <F label="WhatsApp (display)"><Input value={contact.whatsapp} onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })} /></F>
              <F label="WhatsApp URL"><Input value={contact.whatsapp_url} onChange={(e) => setContact({ ...contact, whatsapp_url: e.target.value })} /></F>
            </div>
            <F label="Location"><Input value={contact.location} onChange={(e) => setContact({ ...contact, location: e.target.value })} /></F>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Social</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <F label="LinkedIn URL"><Input value={social.linkedin} onChange={(e) => setSocial({ ...social, linkedin: e.target.value })} /></F>
            <F label="GitHub URL"><Input value={social.github} onChange={(e) => setSocial({ ...social, github: e.target.value })} /></F>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
