export const siteConfig = {
  name: "200Studio",
  shortName: "200studio",
  tagline: "We build websites that help local businesses grow.",
  description:
    "Elevate Web Solutions is a boutique web studio building professional websites, booking systems, and business dashboards for restaurants, salons, clinics, gyms, and local businesses.",
  email: "hello@elevateweb.studio",
  whatsapp: "+91 98765 43210",
  whatsappUrl: "https://wa.me/919876543210",
  linkedin: "https://www.linkedin.com/company/elevate-web-solutions",
  github: "https://github.com/elevate-web-solutions",
  location: "Delhi NCR, India · Working with clients worldwide",
  // Set VITE_FORMSPREE_ENDPOINT in .env, or replace the fallback below with your form ID
  formspreeEndpoint:
    (import.meta.env.VITE_FORMSPREE_ENDPOINT as string | undefined) ??
    "https://formspree.io/f/your-form-id",
};

export const navLinks = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Work" },
  { to: "/about", label: "About" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/contact", label: "Contact" },
] as const;

export const hero = {
  eyebrow: "A boutique web studio",
  title: "We build websites that help local businesses grow.",
  description:
    "Professional websites, booking systems, and business dashboards designed to help you attract more customers and run a calmer business.",
};

export const trustStats = [
  { value: "40+", label: "Projects delivered" },
  { value: "98%", label: "Client satisfaction" },
  { value: "2–4 wk", label: "Average delivery" },
  { value: "24/7", label: "Ongoing support" },
];

export type Service = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  bullets: string[];
  icon: string;
};

export const services: Service[] = [
  { id: "business-websites", slug: "business-websites", title: "Business Websites", summary: "Conversion-focused websites for local businesses — fast, mobile-first, and built to win trust.", bullets: ["Custom design system", "Mobile-first & SEO ready", "Editable content"], icon: "Globe" },
  { id: "restaurant-websites", slug: "restaurant-websites", title: "Restaurant Websites", summary: "Menus, reservations, and ordering experiences that turn hungry visitors into regulars.", bullets: ["Online menu & gallery", "Table reservations", "WhatsApp ordering"], icon: "Utensils" },
  { id: "salon-websites", slug: "salon-websites", title: "Salon Websites", summary: "Beautiful booking-first sites for salons and spas, with services, stylists, and availability.", bullets: ["Online appointment booking", "Service & pricing pages", "Instagram integration"], icon: "Scissors" },
  { id: "clinic-websites", slug: "clinic-websites", title: "Clinic Websites", summary: "Trustworthy, compliant sites for clinics and practitioners with patient-friendly booking.", bullets: ["Doctor & service profiles", "Appointment requests", "Health-content friendly"], icon: "Stethoscope" },
  { id: "gym-websites", slug: "gym-websites", title: "Gym Websites", summary: "High-energy websites for gyms and studios with class schedules and lead capture.", bullets: ["Class schedules", "Trial class signups", "Membership pricing"], icon: "Dumbbell" },
  { id: "admin-dashboards", slug: "admin-dashboards", title: "Admin Dashboards", summary: "Custom internal dashboards that put your data, customers, and operations in one place.", bullets: ["Role-based access", "Realtime data", "Reports & exports"], icon: "LayoutDashboard" },
  { id: "booking-systems", slug: "booking-systems", title: "Booking Systems", summary: "End-to-end booking platforms with calendar, reminders, payments, and customer management.", bullets: ["Calendar & availability", "Email & SMS reminders", "Payment integration"], icon: "CalendarCheck" },
  { id: "custom-apps", slug: "custom-apps", title: "Custom Web Apps", summary: "Full-stack web applications built around your unique workflow with modern tooling.", bullets: ["React + TypeScript", "Modern backends", "Scalable architecture"], icon: "Code2" },
  { id: "maintenance", slug: "maintenance", title: "Maintenance & Support", summary: "Ongoing care plans — updates, monitoring, performance, and a real human to call.", bullets: ["Monthly retainers", "Performance monitoring", "Priority support"], icon: "LifeBuoy" },
];

export type Project = {
  id: string;
  slug: string;
  title: string;
  category: string;
  client: string;
  summary: string;
  tech: string[];
  is_featured?: boolean;
  live_url?: string | null;
  cover_url?: string | null;
  gradient: string;
  year: string;
};

export const projects: Project[] = [
  {
    id: "multicut-salon",
    slug: "multicut-salon",
    title: "Multicut Salon",
    category: "Salon",
    client: "Multicut Salon",
    summary: "Full-featured salon website with service listings, gallery, contact, and a clean mobile-first design built to drive walk-ins and bookings.",
    tech: ["React", "TypeScript", "Tailwind CSS"],
    is_featured: true,
    year: "2025",
    live_url: "https://multicutsalon.in/",
    cover_url: "/projects/multicut-salon.png",
    gradient: "from-rose-200 via-pink-100 to-fuchsia-100",
  },
  {
    id: "wok-singh",
    slug: "wok-singh",
    title: "Wok Singh — Crafted Kitchen",
    category: "Restaurant",
    client: "Wok Singh",
    summary: "Bold restaurant website for a fast-food chain featuring the full menu, brand story, and an appetising visual experience designed to convert hungry visitors.",
    tech: ["React", "TypeScript", "Tailwind CSS", "Lovable"],
    is_featured: true,
    year: "2025",
    live_url: "https://wok-singh-crafted-kitchen.lovable.app/",
    cover_url: "/projects/wok-singh.png",
    gradient: "from-amber-200 via-orange-100 to-yellow-100",
  },
  {
    id: "burger-corner",
    slug: "burger-corner",
    title: "Burger Corner — Luxury Burgers",
    category: "Restaurant",
    client: "Burger Corner",
    summary: "Premium burger brand site with a rich, high-energy layout showcasing the menu, brand personality, and a seamless order-now experience.",
    tech: ["React", "TypeScript", "Tailwind CSS", "Replit"],
    is_featured: true,
    year: "2025",
    live_url: "https://burger-corner-luxury--mk9365886.replit.app/",
    cover_url: "/projects/burger-corner.png",
    gradient: "from-red-200 via-orange-100 to-amber-100",
  },
];

export type Founder = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo_url: string | null;
  skills: string[];
  linkedin_url: string | null;
  github_url: string | null;
};

export const founders: Founder[] = [
  {
    id: "saurav-arora",
    name: "Saurav Arora",
    role: "Co-founder · Design & Frontend",
    bio: "Saurav leads design and frontend engineering at Elevate. He focuses on visual systems, motion, and turning business goals into interfaces that convert.",
    photo_url: "/founders/saurav.png",
    skills: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "UI/UX", "Design Systems"],
    linkedin_url: "https://www.linkedin.com/in/saurav-arora",
    github_url: "https://github.com/saurav-arora",
  },
  {
    id: "raman-kumar",
    name: "Raman Kumar",
    role: "Co-founder · Backend & Systems",
    bio: "Raman leads backend engineering and infrastructure. He designs the APIs, databases, and integrations that keep client products fast and reliable.",
    photo_url: "/founders/raman.jpg",
    skills: ["Node.js", "Express", "PostgreSQL", "REST APIs", "Cloud Infra"],
    linkedin_url: "https://www.linkedin.com/in/raman-kumar",
    github_url: "https://github.com/raman-kumar",
  },
];

export const technologies = [
  "React", "TypeScript", "Tailwind CSS", "Framer Motion",
  "Node.js", "Express", "PostgreSQL",
  "REST APIs", "Stripe", "Vercel", "Cloudflare",
];

export const process = [
  { step: "01", title: "Discover", text: "We start with a free consultation to understand your business, customers, and goals." },
  { step: "02", title: "Design", text: "We design a custom interface tailored to your brand — not a template, not a copy." },
  { step: "03", title: "Build", text: "We engineer the site or app with modern tools — fast, accessible, SEO-ready." },
  { step: "04", title: "Launch & support", text: "We launch, train your team, and stay on as an ongoing partner." },
];

export const whyChooseUs = [
  { title: "Built for business outcomes", text: "Every decision — copy, layout, speed — is tied back to leads, bookings, and revenue." },
  { title: "Two senior founders, no handoffs", text: "You work directly with the people designing and building your product. No agencies-within-agencies." },
  { title: "Modern, maintainable stack", text: "React, TypeScript and modern tooling mean your site stays fast today and easy to extend tomorrow." },
  { title: "Honest timelines & pricing", text: "Fixed-scope quotes, weekly demos, and a transparent project tracker — no surprises." },
];

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  business: string;
  project: string;
  rating: number;
  quote: string;
  avatar_url?: string | null;
};

export const testimonials: Testimonial[] = [
  { id: "priya-sharma", name: "Priya Sharma", role: "Owner", company: "Spice Route Restaurant", business: "Restaurant", project: "Website + Reservations", rating: 5, quote: "Elevate rebuilt our website in three weeks. Weekday reservations are up 38% and the new menu is so much easier to update ourselves.", avatar_url: null },
  { id: "anjali-mehta", name: "Anjali Mehta", role: "Founder", company: "Luxe Salon & Spa", business: "Salon", project: "Booking System", rating: 5, quote: "The booking system pays for itself every month. Clients book themselves, my staff get reminders, and I finally have one source of truth.", avatar_url: null },
  { id: "rohit-verma", name: "Dr. Rohit Verma", role: "Medical Director", company: "NorthCare Clinic", business: "Clinic", project: "Website", rating: 5, quote: "Saurav and Raman understood our patients. The site feels calm and credible, and appointment requests have nearly doubled.", avatar_url: null },
  { id: "karan-singh", name: "Karan Singh", role: "Co-owner", company: "Iron Forge Gym", business: "Gym", project: "Website + Lead Capture", rating: 5, quote: "We went from a Google form to a real brand online. Trial signups jumped immediately after launch.", avatar_url: null },
  { id: "meera-kapoor", name: "Meera Kapoor", role: "Operations Lead", company: "Metric Retail Group", business: "Retail", project: "Custom Dashboard", rating: 5, quote: "Our team finally has one dashboard for everything. Reports that used to take a day are now one click.", avatar_url: null },
  { id: "sahil-bansal", name: "Sahil Bansal", role: "Founder", company: "Atelier Studio", business: "Design Studio", project: "Portfolio Site", rating: 5, quote: "Beautiful, fast, and incredibly easy to manage. We get compliments on the website constantly.", avatar_url: null },
];
