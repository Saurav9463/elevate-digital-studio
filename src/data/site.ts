export const siteConfig = {
  name: "Elevate Web Solutions",
  shortName: "Elevate",
  tagline: "We build websites that help local businesses grow.",
  description:
    "Elevate Web Solutions is a boutique web studio building professional websites, booking systems, and business dashboards for restaurants, salons, clinics, gyms, and local businesses.",
  email: "hello@elevateweb.studio",
  whatsapp: "+91 98765 43210",
  whatsappUrl: "https://wa.me/919876543210",
  linkedin: "https://www.linkedin.com/company/elevate-web-solutions",
  github: "https://github.com/elevate-web-solutions",
  location: "Delhi NCR, India · Working with clients worldwide",
};

export const navLinks = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Work" },
  { to: "/about", label: "About" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/contact", label: "Contact" },
] as const;

export const trustStats = [
  { value: "40+", label: "Projects delivered" },
  { value: "98%", label: "Client satisfaction" },
  { value: "2–4 wk", label: "Average delivery" },
  { value: "24/7", label: "Ongoing support" },
];

export const services = [
  {
    slug: "business-websites",
    title: "Business Websites",
    summary:
      "Conversion-focused websites for local businesses — fast, mobile-first, and built to win trust.",
    bullets: ["Custom design system", "Mobile-first & SEO ready", "Editable content"],
    icon: "Globe",
  },
  {
    slug: "restaurant-websites",
    title: "Restaurant Websites",
    summary:
      "Menus, reservations, and ordering experiences that turn hungry visitors into regulars.",
    bullets: ["Online menu & gallery", "Table reservations", "WhatsApp ordering"],
    icon: "Utensils",
  },
  {
    slug: "salon-websites",
    title: "Salon Websites",
    summary:
      "Beautiful booking-first sites for salons and spas, with services, stylists, and availability.",
    bullets: ["Online appointment booking", "Service & pricing pages", "Instagram integration"],
    icon: "Scissors",
  },
  {
    slug: "clinic-websites",
    title: "Clinic Websites",
    summary:
      "Trustworthy, compliant sites for clinics and practitioners with patient-friendly booking.",
    bullets: ["Doctor & service profiles", "Appointment requests", "Health-content friendly"],
    icon: "Stethoscope",
  },
  {
    slug: "gym-websites",
    title: "Gym Websites",
    summary:
      "High-energy websites for gyms and studios with class schedules and lead capture.",
    bullets: ["Class schedules", "Trial class signups", "Membership pricing"],
    icon: "Dumbbell",
  },
  {
    slug: "admin-dashboards",
    title: "Admin Dashboards",
    summary:
      "Custom internal dashboards that put your data, customers, and operations in one place.",
    bullets: ["Role-based access", "Realtime data", "Reports & exports"],
    icon: "LayoutDashboard",
  },
  {
    slug: "booking-systems",
    title: "Booking Systems",
    summary:
      "End-to-end booking platforms with calendar, reminders, payments, and customer management.",
    bullets: ["Calendar & availability", "Email & SMS reminders", "Payment integration"],
    icon: "CalendarCheck",
  },
  {
    slug: "custom-apps",
    title: "Custom Web Apps",
    summary:
      "Full-stack web applications built around your unique workflow with React and Supabase.",
    bullets: ["React + TypeScript", "Supabase backend", "Scalable architecture"],
    icon: "Code2",
  },
  {
    slug: "maintenance",
    title: "Maintenance & Support",
    summary:
      "Ongoing care plans — updates, monitoring, performance, and a real human to call.",
    bullets: ["Monthly retainers", "Performance monitoring", "Priority support"],
    icon: "LifeBuoy",
  },
];

export type Project = {
  slug: string;
  title: string;
  category: string;
  client: string;
  summary: string;
  tech: string[];
  featured?: boolean;
  liveUrl?: string;
  gradient: string; // tailwind gradient classes for cover
  year: string;
};

export const projects: Project[] = [
  {
    slug: "spice-route-restaurant",
    title: "Spice Route Restaurant",
    category: "Restaurant",
    client: "Spice Route, Delhi",
    summary:
      "Reservation-first website with multilingual menu, gallery, and direct WhatsApp ordering. Increased weekday bookings by 38%.",
    tech: ["React", "TypeScript", "Tailwind", "Supabase"],
    featured: true,
    year: "2025",
    liveUrl: "#",
    gradient: "from-amber-100 via-rose-100 to-orange-100",
  },
  {
    slug: "luxe-salon-booking",
    title: "Luxe Salon — Booking System",
    category: "Salon",
    client: "Luxe Salon & Spa",
    summary:
      "End-to-end appointment system with stylist availability, SMS reminders, and an owner dashboard for daily operations.",
    tech: ["React", "Node.js", "Express", "Supabase", "Twilio"],
    featured: true,
    year: "2025",
    liveUrl: "#",
    gradient: "from-rose-100 via-pink-100 to-purple-100",
  },
  {
    slug: "northcare-clinic",
    title: "NorthCare Clinic",
    category: "Clinic",
    client: "NorthCare Medical",
    summary:
      "A calm, trust-first clinic website with doctor profiles, services, and patient appointment requests routed to staff.",
    tech: ["React", "TypeScript", "Tailwind", "Supabase"],
    featured: true,
    year: "2024",
    liveUrl: "#",
    gradient: "from-sky-100 via-blue-100 to-cyan-100",
  },
  {
    slug: "iron-forge-gym",
    title: "Iron Forge Gym",
    category: "Gym",
    client: "Iron Forge Strength Co.",
    summary:
      "Bold website for a strength gym with class schedules, trainer bios, and free trial lead capture.",
    tech: ["React", "Framer Motion", "Supabase"],
    year: "2024",
    liveUrl: "#",
    gradient: "from-zinc-200 via-neutral-200 to-stone-200",
  },
  {
    slug: "metric-business-dashboard",
    title: "Metric — Business Dashboard",
    category: "Dashboard",
    client: "Metric Retail Group",
    summary:
      "Custom admin dashboard unifying sales, inventory, and staff across 6 retail locations with role-based access.",
    tech: ["React", "TypeScript", "Node.js", "Supabase", "Recharts"],
    featured: true,
    year: "2025",
    liveUrl: "#",
    gradient: "from-blue-100 via-indigo-100 to-violet-100",
  },
  {
    slug: "videotube",
    title: "Videotube",
    category: "Web App",
    client: "Internal product",
    summary:
      "Full-stack video platform with channels, subscriptions, playlists, and watch history — built end-to-end.",
    tech: ["React", "Node.js", "Express", "MongoDB"],
    year: "2024",
    liveUrl: "#",
    gradient: "from-red-100 via-orange-100 to-amber-100",
  },
  {
    slug: "atelier-portfolio",
    title: "Atelier — Portfolio Site",
    category: "Portfolio",
    client: "Atelier Studio",
    summary:
      "Editorial portfolio for an interior design studio with project case studies and inquiry form.",
    tech: ["React", "TypeScript", "Tailwind"],
    year: "2024",
    liveUrl: "#",
    gradient: "from-stone-100 via-neutral-100 to-zinc-100",
  },
  {
    slug: "greenleaf-yoga",
    title: "Greenleaf Yoga Studio",
    category: "Studio",
    client: "Greenleaf Yoga",
    summary:
      "Calm, conversion-focused studio website with class booking and instructor pages.",
    tech: ["React", "Tailwind", "Supabase"],
    year: "2024",
    liveUrl: "#",
    gradient: "from-emerald-100 via-green-100 to-teal-100",
  },
];

export const founders = [
  {
    name: "Saurav Arora",
    role: "Co-founder · Design & Frontend",
    bio:
      "Saurav leads design and frontend engineering at Elevate. He focuses on visual systems, motion, and turning business goals into interfaces that convert.",
    photo: "/founders/saurav.png",
    skills: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "UI/UX", "Design Systems"],
    links: {
      linkedin: "https://www.linkedin.com/in/saurav-arora",
      github: "https://github.com/saurav-arora",
    },
  },
  {
    name: "Raman Kumar",
    role: "Co-founder · Backend & Systems",
    bio:
      "Raman leads backend engineering and infrastructure. He designs the APIs, databases, and integrations that keep client products fast and reliable.",
    photo: "/founders/raman.jpg",
    skills: ["Node.js", "Express", "Supabase", "PostgreSQL", "REST APIs", "Cloud Infra"],
    links: {
      linkedin: "https://www.linkedin.com/in/raman-kumar",
      github: "https://github.com/raman-kumar",
    },
  },
];

export const technologies = [
  "React", "TypeScript", "Tailwind CSS", "Framer Motion",
  "Node.js", "Express", "Supabase", "PostgreSQL",
  "REST APIs", "Stripe", "Vercel", "Cloudflare",
];

export const process = [
  {
    step: "01",
    title: "Discover",
    text: "We start with a free consultation to understand your business, customers, and goals.",
  },
  {
    step: "02",
    title: "Design",
    text: "We design a custom interface tailored to your brand — not a template, not a copy.",
  },
  {
    step: "03",
    title: "Build",
    text: "We engineer the site or app with modern tools — fast, accessible, SEO-ready.",
  },
  {
    step: "04",
    title: "Launch & support",
    text: "We launch, train your team, and stay on as an ongoing partner.",
  },
];

export const whyChooseUs = [
  {
    title: "Built for business outcomes",
    text: "Every decision — copy, layout, speed — is tied back to leads, bookings, and revenue.",
  },
  {
    title: "Two senior founders, no handoffs",
    text: "You work directly with the people designing and building your product. No agencies-within-agencies.",
  },
  {
    title: "Modern, maintainable stack",
    text: "React, TypeScript and Supabase mean your site stays fast today and easy to extend tomorrow.",
  },
  {
    title: "Honest timelines & pricing",
    text: "Fixed-scope quotes, weekly demos, and a transparent project tracker — no surprises.",
  },
];

export const testimonials = [
  {
    name: "Priya Sharma",
    role: "Owner",
    company: "Spice Route Restaurant",
    business: "Restaurant",
    project: "Website + Reservations",
    rating: 5,
    quote:
      "Elevate rebuilt our website in three weeks. Weekday reservations are up 38% and the new menu is so much easier to update ourselves.",
  },
  {
    name: "Anjali Mehta",
    role: "Founder",
    company: "Luxe Salon & Spa",
    business: "Salon",
    project: "Booking System",
    rating: 5,
    quote:
      "The booking system pays for itself every month. Clients book themselves, my staff get reminders, and I finally have one source of truth.",
  },
  {
    name: "Dr. Rohit Verma",
    role: "Medical Director",
    company: "NorthCare Clinic",
    business: "Clinic",
    project: "Website",
    rating: 5,
    quote:
      "Saurav and Raman understood our patients. The site feels calm and credible, and appointment requests have nearly doubled.",
  },
  {
    name: "Karan Singh",
    role: "Co-owner",
    company: "Iron Forge Gym",
    business: "Gym",
    project: "Website + Lead Capture",
    rating: 5,
    quote:
      "We went from a Google form to a real brand online. Trial signups jumped immediately after launch.",
  },
  {
    name: "Meera Kapoor",
    role: "Operations Lead",
    company: "Metric Retail Group",
    business: "Retail",
    project: "Custom Dashboard",
    rating: 5,
    quote:
      "Our team finally has one dashboard for everything. Reports that used to take a day are now one click.",
  },
  {
    name: "Sahil Bansal",
    role: "Founder",
    company: "Atelier Studio",
    business: "Design Studio",
    project: "Portfolio Site",
    rating: 5,
    quote:
      "Beautiful, fast, and incredibly easy to manage. We get compliments on the website constantly.",
  },
];
