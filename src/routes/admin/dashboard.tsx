import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Sparkles, BarChart2, Briefcase, FolderKanban, Star, Users, Settings, ListOrdered, CheckCircle } from "lucide-react";
import { HeroSection } from "@/components/admin/HeroSection";
import { TrustStatsSection } from "@/components/admin/TrustStatsSection";
import { ServicesSection } from "@/components/admin/ServicesSection";
import { ProjectsSection } from "@/components/admin/ProjectsSection";
import { TestimonialsSection } from "@/components/admin/TestimonialsSection";
import { FoundersSection } from "@/components/admin/FoundersSection";
import { SiteConfigSection } from "@/components/admin/SiteConfigSection";
import { ProcessSection } from "@/components/admin/ProcessSection";
import { WhyChooseUsSection } from "@/components/admin/WhyChooseUsSection";

export const Route = createFileRoute("/admin/dashboard")({
  component: Dashboard,
});

const navItems = [
  { id: "hero", label: "Hero", icon: Sparkles },
  { id: "trust-stats", label: "Trust Stats", icon: BarChart2 },
  { id: "services", label: "Services", icon: Briefcase },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "testimonials", label: "Testimonials", icon: Star },
  { id: "founders", label: "Founders", icon: Users },
  { id: "site-config", label: "Site Config", icon: Settings },
  { id: "process", label: "Process", icon: ListOrdered },
  { id: "why-choose-us", label: "Why Choose Us", icon: CheckCircle },
];

function Dashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("hero");
  const [userEmail, setUserEmail] = useState("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate({ to: "/admin/login" });
      } else {
        setUserEmail(data.session.user.email ?? "");
        setChecking(false);
      }
    });
  }, [navigate]);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="h-8 w-8 rounded-full border-2 border-gray-900 border-t-transparent animate-spin" />
      </div>
    );
  }

  const sectionComponents: Record<string, React.ReactNode> = {
    "hero": <HeroSection />,
    "trust-stats": <TrustStatsSection />,
    "services": <ServicesSection />,
    "projects": <ProjectsSection />,
    "testimonials": <TestimonialsSection />,
    "founders": <FoundersSection />,
    "site-config": <SiteConfigSection />,
    "process": <ProcessSection />,
    "why-choose-us": <WhyChooseUsSection />,
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-gray-900 text-white flex flex-col">
        <div className="p-5 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
              <span className="text-gray-900 font-bold text-sm">E</span>
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">Elevate Admin</p>
              <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[140px]">{userEmail}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2">Content</p>
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSection === id
                  ? "bg-white text-gray-900"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-700">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          {sectionComponents[activeSection]}
        </div>
      </main>
    </div>
  );
}
