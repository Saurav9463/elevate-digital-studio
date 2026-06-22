import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { Mail, MessageCircle, MapPin, Linkedin, Github, Send, CheckCircle2 } from "lucide-react";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { siteConfig, services } from "@/data/site";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Elevate Web Solutions" },
      { name: "description", content: "Tell us about your business. We'll reply within one working day with next steps, timelines, and a transparent quote." },
      { property: "og:title", content: "Contact — Elevate Web Solutions" },
      { property: "og:description", content: "Start a project with Elevate. Free consultation, honest timelines, fixed-scope quotes." },
    ],
  }),
  component: ContactPage,
});

const leadSchema = z.object({
  name: z.string().trim().min(1, "Required").max(120),
  email: z.string().trim().email("Enter a valid email").max(255),
  company: z.string().trim().max(200).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  service: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Required").max(5000),
});

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    try {
      const fd = new FormData(form);
      const parsed = leadSchema.parse({
        name: fd.get("name"),
        email: fd.get("email"),
        company: fd.get("company") ?? "",
        phone: fd.get("phone") ?? "",
        service: selectedService || "",
        message: fd.get("message"),
      });

      const res = await fetch(siteConfig.formspreeEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new URLSearchParams({
          name: parsed.name,
          email: parsed.email,
          company: parsed.company || "",
          phone: parsed.phone || "",
          service: parsed.service || "",
          message: parsed.message,
          _subject: `New enquiry from ${parsed.name}`,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({} as any));
        throw new Error(data?.errors?.[0]?.message ?? "Could not send message");
      }

      setSubmitted(true);
      setSelectedService("");
      toast.success("Thanks — we'll be in touch within one working day.");
      form.reset();
    } catch (err: any) {
      const msg = err?.issues?.[0]?.message ?? err?.message ?? "Could not send message";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="Contact"
        title="Tell us about your business."
        description="Share a few details and we'll reply within one working day with next steps, a recommended scope, and a transparent quote."
      />

      <section className="container-page py-16 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="card-surface rounded-2xl p-6 md:p-10"
          >
            {submitted ? (
              <div className="flex flex-col items-start gap-4 py-6">
                <CheckCircle2 className="size-10 text-primary" />
                <h2 className="text-2xl font-semibold tracking-tight">Message received.</h2>
                <p className="text-muted-foreground">
                  Thank you. One of the founders will personally reply within one working day.
                </p>
                <Button variant="outline" onClick={() => setSubmitted(false)}>
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your name</Label>
                    <Input id="name" name="name" required placeholder="Priya Sharma" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required placeholder="you@business.com" />
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company">Business name</Label>
                    <Input id="company" name="company" placeholder="Spice Route Restaurant" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone / WhatsApp</Label>
                    <Input id="phone" name="phone" placeholder="+91 98765 43210" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service">What do you need?</Label>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger id="service">
                      <SelectValue placeholder="Choose a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((s) => (
                        <SelectItem key={s.slug} value={s.slug}>
                          {s.title}
                        </SelectItem>
                      ))}
                      <SelectItem value="other">Something else</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Project details</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    placeholder="Tell us about your business, goals, timeline, and budget range."
                  />
                </div>
                {/* Honeypot for basic spam protection */}
                <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
                <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto">
                  {loading ? "Sending..." : (
                    <>
                      Send message <Send className="ml-2 size-4" />
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground">
                  By submitting, you agree to be contacted about your project. We never share your details.
                </p>
              </form>
            )}
          </motion.div>

          <div className="space-y-6">
            <div className="card-surface rounded-2xl p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Reach us directly</h3>
              <ul className="mt-4 space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 size-4 text-primary" />
                  <a href={`mailto:${siteConfig.email}`} className="text-foreground hover:underline">{siteConfig.email}</a>
                </li>
                <li className="flex items-start gap-3">
                  <MessageCircle className="mt-0.5 size-4 text-primary" />
                  <a href={siteConfig.whatsappUrl} target="_blank" rel="noreferrer" className="text-foreground hover:underline">
                    WhatsApp: {siteConfig.whatsapp}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 text-primary" />
                  <span className="text-muted-foreground">{siteConfig.location}</span>
                </li>
              </ul>
              <div className="mt-6 flex gap-3">
                <a href={siteConfig.linkedin} target="_blank" rel="noreferrer" className="inline-flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground transition hover:border-primary hover:text-primary" aria-label="LinkedIn">
                  <Linkedin className="size-4" />
                </a>
                <a href={siteConfig.github} target="_blank" rel="noreferrer" className="inline-flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground transition hover:border-primary hover:text-primary" aria-label="GitHub">
                  <Github className="size-4" />
                </a>
              </div>
            </div>

            <div className="card-surface rounded-2xl p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">What happens next</h3>
              <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li><span className="font-medium text-foreground">1.</span> We reply within one working day.</li>
                <li><span className="font-medium text-foreground">2.</span> Free 30-minute discovery call.</li>
                <li><span className="font-medium text-foreground">3.</span> Fixed-scope quote with a clear timeline.</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
