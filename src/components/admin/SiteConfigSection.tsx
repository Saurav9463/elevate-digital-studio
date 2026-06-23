import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { siteConfig as fallback } from "@/data/site";
import { SectionLoader, SaveButton } from "./HeroSection";

type Config = { name: string; tagline: string; description: string; email: string; whatsapp: string; whatsappUrl: string; linkedin: string; github: string; location: string; formspreeEndpoint: string };

const fallbackConfig: Config = {
  name: fallback.name, tagline: fallback.tagline, description: fallback.description,
  email: fallback.email, whatsapp: fallback.whatsapp, whatsappUrl: fallback.whatsappUrl,
  linkedin: fallback.linkedin, github: fallback.github, location: fallback.location,
  formspreeEndpoint: fallback.formspreeEndpoint,
};

const fields: { key: keyof Config; label: string; type?: "textarea" }[] = [
  { key: "name", label: "Site Name" },
  { key: "tagline", label: "Tagline" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "email", label: "Email" },
  { key: "whatsapp", label: "WhatsApp Display" },
  { key: "whatsappUrl", label: "WhatsApp URL" },
  { key: "linkedin", label: "LinkedIn URL" },
  { key: "github", label: "GitHub URL" },
  { key: "location", label: "Location" },
  { key: "formspreeEndpoint", label: "Formspree Endpoint" },
];

export function SiteConfigSection() {
  const [config, setConfig] = useState<Config>(fallbackConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("site_config").select("*").single().then(({ data }) => {
      if (data) setConfig(data);
      setLoading(false);
    });
  }, []);

  async function save() {
    setSaving(true);
    await supabase.from("site_config").delete().neq("name", "");
    const { error } = await supabase.from("site_config").insert({ ...config });
    setSaving(false);
    if (error) toast.error("Failed: " + error.message);
    else toast.success("Site config saved!");
  }

  if (loading) return <SectionLoader />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Config</CardTitle>
        <CardDescription>Global site settings and contact information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map(({ key, label, type }) => (
          <div key={key} className="space-y-1.5">
            <Label>{label}</Label>
            {type === "textarea"
              ? <Textarea rows={2} value={config[key]} onChange={e => setConfig({ ...config, [key]: e.target.value })} />
              : <Input value={config[key]} onChange={e => setConfig({ ...config, [key]: e.target.value })} />
            }
          </div>
        ))}
        <SaveButton saving={saving} onClick={save} />
      </CardContent>
    </Card>
  );
}
