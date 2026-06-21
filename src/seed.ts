import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import ws from "ws";

// Simple manual .env parsing to avoid dependency error
let url = "";
let key = "";
try {
  const envContent = fs.readFileSync(".env", "utf-8");
  const urlMatch = envContent.match(/VITE_SUPABASE_URL\s*=\s*["']?([^"'\r\n]+)/);
  // Look for service role key or publishable key
  const serviceKeyMatch = envContent.match(/(?:SUPABASE_SERVICE_ROLE_KEY|SERVICE_ROLE_KEY)\s*=\s*["']?([^"'\r\n]+)/);
  const pubKeyMatch = envContent.match(/VITE_SUPABASE_PUBLISHABLE_KEY\s*=\s*["']?([^"'\r\n]+)/);
  
  if (urlMatch) url = urlMatch[1];
  if (serviceKeyMatch) key = serviceKeyMatch[1];
  else if (pubKeyMatch) key = pubKeyMatch[1];
} catch (e) {
  console.error("Could not read .env file", e);
}

if (!url || !key) {
  console.error("Missing Supabase env variables.");
  process.exit(1);
}

// Inject ws transport for Node environment
const supabase = createClient(url, key, {
  auth: {
    persistSession: false
  },
  realtime: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transport: ws as any
  }
});

const services = [
  {
    slug: "business-websites",
    title: "Business Websites",
    summary: "Conversion-focused websites for local businesses — fast, mobile-first, and built to win trust.",
    bullets: ["Custom design system", "Mobile-first & SEO ready", "Editable content"],
    icon: "Globe",
    sort_order: 1
  },
  {
    slug: "restaurant-websites",
    title: "Restaurant Websites",
    summary: "Menus, reservations, and ordering experiences that turn hungry visitors into regulars.",
    bullets: ["Online menu & gallery", "Table reservations", "WhatsApp ordering"],
    icon: "Utensils",
    sort_order: 2
  },
  {
    slug: "salon-websites",
    title: "Salon Websites",
    summary: "Beautiful booking-first sites for salons and spas, with services, stylists, and availability.",
    bullets: ["Online appointment booking", "Service & pricing pages", "Instagram integration"],
    icon: "Scissors",
    sort_order: 3
  },
  {
    slug: "clinic-websites",
    title: "Clinic Websites",
    summary: "Trustworthy, compliant sites for clinics and practitioners with patient-friendly booking.",
    bullets: ["Doctor & service profiles", "Appointment requests", "Health-content friendly"],
    icon: "Stethoscope",
    sort_order: 4
  },
  {
    slug: "gym-websites",
    title: "Gym Websites",
    summary: "High-energy websites for gyms and studios with class schedules and lead capture.",
    bullets: ["Class schedules", "Trial class signups", "Membership pricing"],
    icon: "Dumbbell",
    sort_order: 5
  },
  {
    slug: "admin-dashboards",
    title: "Admin Dashboards",
    summary: "Custom internal dashboards that put your data, customers, and operations in one place.",
    bullets: ["Role-based access", "Realtime data", "Reports & exports"],
    icon: "LayoutDashboard",
    sort_order: 6
  },
  {
    slug: "booking-systems",
    title: "Booking Systems",
    summary: "End-to-end booking platforms with calendar, reminders, payments, and customer management.",
    bullets: ["Calendar & availability", "Email & SMS reminders", "Payment integration"],
    icon: "CalendarCheck",
    sort_order: 7
  },
  {
    slug: "custom-apps",
    title: "Custom Web Apps",
    summary: "Full-stack web applications built around your unique workflow with React and Supabase.",
    bullets: ["React + TypeScript", "Supabase backend", "Scalable architecture"],
    icon: "Code2",
    sort_order: 8
  },
  {
    slug: "maintenance",
    title: "Maintenance & Support",
    summary: "Ongoing care plans — updates, monitoring, performance, and a real human to call.",
    bullets: ["Monthly retainers", "Performance monitoring", "Priority support"],
    icon: "LifeBuoy",
    sort_order: 9
  }
];

const projects = [
  {
    slug: "spice-route-restaurant",
    title: "Spice Route Restaurant",
    category: "Restaurant",
    client: "Spice Route, Delhi",
    summary: "Reservation-first website with multilingual menu, gallery, and direct WhatsApp ordering. Increased weekday bookings by 38%.",
    tech: ["React", "TypeScript", "Tailwind", "Supabase"],
    is_featured: true,
    year: "2025",
    live_url: "#",
    gradient: "from-amber-100 via-rose-100 to-orange-100",
    sort_order: 1
  },
  {
    slug: "luxe-salon-booking",
    title: "Luxe Salon — Booking System",
    category: "Salon",
    client: "Luxe Salon & Spa",
    summary: "End-to-end appointment system with stylist availability, SMS reminders, and an owner dashboard for daily operations.",
    tech: ["React", "Node.js", "Express", "Supabase", "Twilio"],
    is_featured: true,
    year: "2025",
    live_url: "#",
    gradient: "from-rose-100 via-pink-100 to-purple-100",
    sort_order: 2
  },
  {
    slug: "northcare-clinic",
    title: "NorthCare Clinic",
    category: "Clinic",
    client: "NorthCare Medical",
    summary: "A calm, trust-first clinic website with doctor profiles, services, and patient appointment requests routed to staff.",
    tech: ["React", "TypeScript", "Tailwind", "Supabase"],
    is_featured: true,
    year: "2024",
    live_url: "#",
    gradient: "from-sky-100 via-blue-100 to-cyan-100",
    sort_order: 3
  },
  {
    slug: "iron-forge-gym",
    title: "Iron Forge Gym",
    category: "Gym",
    client: "Iron Forge Strength Co.",
    summary: "Bold website for a strength gym with class schedules, trainer bios, and free trial lead capture.",
    tech: ["React", "Framer Motion", "Supabase"],
    is_featured: false,
    year: "2024",
    live_url: "#",
    gradient: "from-zinc-200 via-neutral-200 to-stone-200",
    sort_order: 4
  },
  {
    slug: "metric-business-dashboard",
    title: "Metric — Business Dashboard",
    category: "Dashboard",
    client: "Metric Retail Group",
    summary: "Custom admin dashboard unifying sales, inventory, and staff across 6 retail locations with role-based access.",
    tech: ["React", "TypeScript", "Node.js", "Supabase", "Recharts"],
    is_featured: true,
    year: "2025",
    live_url: "#",
    gradient: "from-blue-100 via-indigo-100 to-violet-100",
    sort_order: 5
  }
];

const founders = [
  {
    name: "Saurav Arora",
    role: "Co-founder · Design & Frontend",
    bio: "Saurav leads design and frontend engineering at Elevate. He focuses on visual systems, motion, and turning business goals into interfaces that convert.",
    photo_url: null,
    skills: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "UI/UX", "Design Systems"],
    linkedin_url: "https://www.linkedin.com/in/saurav-arora",
    github_url: "https://github.com/saurav-arora",
    sort_order: 1
  },
  {
    name: "Raman Kumar",
    role: "Co-founder · Backend & Systems",
    bio: "Raman leads backend engineering and infrastructure. He designs the APIs, databases, and integrations that keep client products fast and reliable.",
    photo_url: null,
    skills: ["Node.js", "Express", "Supabase", "PostgreSQL", "REST APIs", "Cloud Infra"],
    linkedin_url: "https://www.linkedin.com/in/raman-kumar",
    github_url: "https://github.com/raman-kumar",
    sort_order: 2
  }
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Owner",
    company: "Spice Route Restaurant",
    business: "Restaurant",
    project: "Website + Reservations",
    rating: 5,
    quote: "Elevate rebuilt our website in three weeks. Weekday reservations are up 38% and the new menu is so much easier to update ourselves.",
    avatar_url: null,
    sort_order: 1
  },
  {
    name: "Anjali Mehta",
    role: "Founder",
    company: "Luxe Salon & Spa",
    business: "Salon",
    project: "Booking System",
    rating: 5,
    quote: "The booking system pays for itself every month. Clients book themselves, my staff get reminders, and I finally have one source of truth.",
    avatar_url: null,
    sort_order: 2
  },
  {
    name: "Dr. Rohit Verma",
    role: "Medical Director",
    company: "NorthCare Clinic",
    business: "Clinic",
    project: "Website",
    rating: 5,
    quote: "Saurav and Raman understood our patients. The site feels calm and credible, and appointment requests have nearly doubled.",
    avatar_url: null,
    sort_order: 3
  }
];

const settings: Array<{ key: string; value: any }> = [
  {
    key: "hero",
    value: {
      title: "We build websites that help local businesses grow.",
      subtitle: "Professional websites, booking systems, and business dashboards designed to help you attract more customers and run a calmer business.",
      buttonPrimaryText: "View our work",
      buttonPrimaryLink: "/projects",
      buttonSecondaryText: "Get a free consultation",
      buttonSecondaryLink: "/contact"
    }
  },
  {
    key: "trust_stats",
    value: [
      { value: "40+", label: "Projects delivered" },
      { value: "98%", label: "Client satisfaction" },
      { value: "2–4 wk", label: "Average delivery" },
      { value: "24/7", label: "Ongoing support" }
    ]
  }
];

async function seed() {
  console.log("Seeding Supabase with WS transport...");

  const { error: servError } = await supabase.from("services").upsert(services, { onConflict: "slug" });
  if (servError) console.error("Error seeding services:", servError);
  else console.log("Seeded services!");

  const { error: projError } = await supabase.from("projects").upsert(projects, { onConflict: "slug" });
  if (projError) console.error("Error seeding projects:", projError);
  else console.log("Seeded projects!");

  const { error: foundError } = await supabase.from("founders").upsert(founders, { onConflict: "name" });
  if (foundError) console.error("Error seeding founders:", foundError);
  else console.log("Seeded founders!");

  const { error: testError } = await supabase.from("testimonials").upsert(testimonials, { onConflict: "name" });
  if (testError) console.error("Error seeding testimonials:", testError);
  else console.log("Seeded testimonials!");

  for (const set of settings) {
    const { error: setError } = await supabase.from("site_settings").upsert(set, { onConflict: "key" });
    if (setError) console.error(`Error seeding setting ${set.key}:`, setError);
    else console.log(`Seeded setting ${set.key}!`);
  }

  console.log("Seeding process finished.");
}

seed();
