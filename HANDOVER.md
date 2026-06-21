# Elevate Web Solutions — Project Handover Document

**Prepared for:** Continued development in Cursor  
**Prepared by:** Lead Software Architect (handover review)  
**Date:** June 21, 2026  
**Repository:** Lovable project (synced to GitHub)  
**Live preview:** `https://id-preview--bf371291-3682-4f4d-afba-72df04d89e68.lovable.app`

---

## 1. PROJECT OVERVIEW

### 1.1 Project Purpose
Elevate Web Solutions is a boutique web studio's marketing + lead-generation website with a built-in CMS/admin dashboard. The site markets web-design services (business sites, restaurant sites, salon/clinic booking, dashboards), showcases project work and testimonials, and captures inbound leads. The admin area lets the founders manage every piece of public content and triage leads without touching code.

### 1.2 Target Audience
- **Public site:** Local businesses (restaurants, salons, clinics, gyms, boutiques) in India and abroad evaluating a web partner.
- **Admin area:** The two founders (Saurav, Raman) and any future internal teammates.

### 1.3 Technology Stack
| Layer | Tech |
|---|---|
| Framework | TanStack Start v1 (React 19, file-based routing) |
| Build tool | Vite 7 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (via `src/styles.css`, no `tailwind.config.js`) |
| UI primitives | shadcn/ui (Radix) + lucide-react icons |
| Data fetching | TanStack Query v5 |
| Forms / validation | React Hook Form + Zod |
| Backend (BaaS) | Lovable Cloud (Supabase) — Postgres, Auth, Storage, RLS |
| Server runtime | TanStack `createServerFn` on Cloudflare Workers (nodejs_compat) |
| Notifications | `sonner` toasts |
| Package manager | Bun |
| Deployment | Lovable (preview + published) |

### 1.4 Current Architecture
- **Routing:** file-based, `src/routes/`. `routeTree.gen.ts` is auto-generated.
- **Public site:** SSR-enabled top-level routes.
- **Admin:** pathless `_authenticated/` layout (`ssr: false`) redirects to `/auth` when no Supabase session.
- **Data flow:**  
  Public pages → `src/lib/cms.ts` query helpers → Supabase publishable client (RLS as anon, `is_published = true` only).  
  Admin pages → same helpers but read all rows (RLS via `has_role('admin')`).
- **Auth:** Supabase email/password; first signup auto-promoted to `admin` via `handle_new_user()` trigger. Role lookup via `public.has_role()` security-definer function. Roles stored in dedicated `user_roles` table (not on profiles).
- **Storage:** private bucket `site-media` with 1-year signed URLs (founders, project covers, testimonial avatars).
- **Type safety:** generated types in `src/integrations/supabase/types.ts`.

### 1.5 Current Routing Structure
```
/                         → src/routes/index.tsx           Home (hero, services preview, featured work, testimonials, CTA)
/services                 → src/routes/services.tsx        Service catalogue
/projects                 → src/routes/projects.tsx        Filterable portfolio grid
/testimonials             → src/routes/testimonials.tsx    Client testimonials
/about                    → src/routes/about.tsx           Founders + studio story
/contact                  → src/routes/contact.tsx         Lead capture form (live DB write)
/auth                     → src/routes/auth.tsx            Sign in / sign up
/reset-password           → src/routes/reset-password.tsx  Password reset
/sitemap.xml              → src/routes/sitemap[.]xml.ts    Dynamic sitemap

/_authenticated/          (pathless gate — ssr:false, redirects to /auth)
  /admin                  → admin/index.tsx                Overview + recent leads
  /admin/leads            → admin/leads.tsx                Lead inbox (status, notes, WhatsApp/email)
  /admin/projects         → admin/projects.tsx             CRUD
  /admin/services         → admin/services.tsx             CRUD
  /admin/testimonials     → admin/testimonials.tsx         CRUD
  /admin/founders         → admin/founders.tsx             CRUD
  /admin/settings         → admin/settings.tsx             Hero / stats / contact / social
```

---

## 2. FRONTEND COMPLETED

### 2.1 Public Pages (live, DB-driven unless noted)
- **Home (`/`)** — Hero (CMS), trust stats (CMS), services grid (DB), featured projects (DB), testimonials carousel (DB), CTA strip.
- **Services (`/services`)** — Full service list with bullets and Lucide icons (DB).
- **Projects (`/projects`)** — Grid with category filter chips derived from live data; cover image with gradient fallback (DB).
- **Testimonials (`/testimonials`)** — All published testimonials with rating, role, company, business (DB).
- **About (`/about`)** — Studio story + founder cards with photos, bios, skills, LinkedIn/GitHub (DB).
- **Contact (`/contact`)** — Form posts to `public.leads` with Zod validation; success state + toast.
- **Auth (`/auth`)** — Email/password sign-in + sign-up; forgot-password link.
- **Reset password (`/reset-password`)** — Token handling + new-password set.
- **Sitemap (`/sitemap.xml`)** + `public/robots.txt`.

### 2.2 Admin Pages (live, fully CRUD)
- **Overview** — Counts (projects, services, testimonials, founders, leads) + recent leads feed.
- **Leads** — List, filter by status (`new` / `contacted` / `won` / `lost` / `archived`), internal notes, WhatsApp + mailto deep-links.
- **Projects** — Create/edit/delete, tag inputs (tech stack), gradient picker, featured toggle, publish toggle, cover upload.
- **Services** — Create/edit/delete, bullets tag input, Lucide icon name, sort order, publish toggle.
- **Testimonials** — Create/edit/delete, rating, avatar upload, publish toggle.
- **Founders** — Create/edit/delete, photo upload, skills, LinkedIn/GitHub.
- **Site settings** — Hero copy, trust stats (repeater), contact details, social URLs.

### 2.3 Components
- **Site:** `Header`, `Footer`, `Logo`, `PageShell`, `ProjectCard`, `ServiceCard`.
- **Admin:** `AdminShell` (sidebar + mobile bar), `PageTitle`, `CrudList`, `ImageUpload`, `TagInput`, `ComingSoon`.
- **UI:** Full shadcn/ui kit (~50 primitives in `src/components/ui/`).
- **Hooks:** `useAuth` (session, user, isAdmin, signOut), `useMobile`.

### 2.4 Cross-cutting
- **Navigation:** Type-safe TanStack `<Link>`; mobile sheet menu in header.
- **Responsive:** Mobile-first across all pages; admin sidebar collapses to top scrollable nav on mobile.
- **SEO:** Per-route `head()` metadata (title, description, OG); `robots.txt` + dynamic sitemap.
- **Forms:** RHF + Zod on contact + auth + every admin dialog.
- **Toasts:** `sonner` for save/delete/error feedback.
- **Animations:** Tailwind transitions on cards, buttons, hover states (no heavy motion library — clean and performant).

### 2.5 Functional vs Static
| Area | Status |
|---|---|
| Services / Projects / Testimonials / Founders / Hero / Stats / Contact info | **DB-driven** |
| Contact form | **Live** (writes to `leads`) |
| Authentication + admin gating | **Live** |
| Lead management | **Live** (DB only — no email notifications yet) |
| Analytics | **Static / none** |
| Email notifications | **None** |
| Blog / case studies | **Not built** |
| Search | **Not built** |

---

## 3. UI/UX STATUS

### 3.1 Production-ready
- Consistent visual language: blue accent, neutral surfaces, generous whitespace.
- Clear information hierarchy on every page.
- Mobile responsiveness across all breakpoints.
- Admin shell is purposeful, fast, and uses real form patterns (dialogs + inline tables).
- Contact form has the right friction: name, email, company (optional), phone (optional), service interest, message.

### 3.2 Strengths
- **Design:** Restrained, trustworthy, B2B-appropriate; gradient fallbacks for projects without covers keep the grid visually balanced.
- **Conversion:** WhatsApp + email CTAs are persistent (header, footer, contact); featured-project section on home funnels to `/projects`; CTA strip on home.
- **UX:** Filter chips on `/projects` reflect actual categories; toasts confirm every admin save; the admin inbox surfaces WhatsApp shortcuts so the founders can reply in their existing channel.

### 3.3 Improvement Opportunities (later, no changes now)
- Add subtle scroll-reveal motion (Framer Motion) on home sections.
- Add project detail pages (currently grid-only).
- Add a sticky "Get a quote" floating CTA on mobile.
- Improve empty states in admin (illustrations + "Create first" CTA).
- Skeleton loaders on public pages while TanStack Query hydrates.
- Dark mode support (tokens exist via shadcn; not wired in toggle).
- Better social share images per route (OG image generation).

---

## 4. CURRENT LIMITATIONS

| # | Limitation | Impact |
|---|---|---|
| 1 | No email notifications on new lead | Founders must open dashboard to see leads |
| 2 | No project **detail** pages (`/projects/$slug`) | Limits SEO and storytelling per case study |
| 3 | No blog / insights section | Misses long-tail SEO and authority building |
| 4 | No analytics (visitors, conversions, project views) | Cannot measure marketing ROI |
| 5 | No spam protection on contact form (no honeypot / rate limit / captcha) | Risk of bot submissions |
| 6 | No multi-image gallery per project (only single cover) | Limits portfolio richness |
| 7 | No social auth (Google) on `/auth` | Slightly higher friction for admins |
| 8 | No audit log of admin actions | No accountability trail |
| 9 | No file size / mime validation feedback on `ImageUpload` | Possible UX confusion |
| 10 | Storage uses 1-year signed URLs (not public) | URLs expire eventually; needs renewal strategy or public bucket |
| 11 | No SEO meta editor per project/service in admin | Each entry uses defaults |
| 12 | No password HIBP check, no 2FA | Admin account hardening |
| 13 | No backup/export of leads (CSV) | Manual data extraction painful |
| 14 | No client portal / proposal flow | Out of scope for v1 but a natural extension |
| 15 | No i18n | Single-language (English) |

---

## 5. BACKEND ROADMAP

### Phase 1 — Critical (1–2 weeks)
1. **Email notifications on new lead** — TanStack server route → Resend (or similar) → notify both founders + auto-reply to lead.
2. **Spam protection** — honeypot field + IP rate limit (e.g. 5 submissions / IP / hour via a `lead_throttle` table or Upstash).
3. **Project detail pages** (`/projects/$slug`) with multi-image gallery (`project_images` table) + dynamic OG image.
4. **Google OAuth** for admin sign-in (via Lovable broker).
5. **Storage hardening** — decide public bucket vs signed-URL renewal cron.
6. **Audit log** for admin mutations (`activity_logs` table + trigger).

### Phase 2 — Business (2–4 weeks)
7. **Analytics**: lightweight first-party pageview + event tracking (own `analytics` table) + admin dashboard charts (recharts).
8. **Lead pipeline upgrades**: assignee, follow-up date, conversion value, kanban view.
9. **CSV export** of leads + projects.
10. **SEO per-entity editor**: `seo_title`, `seo_description`, `og_image` on projects and services.
11. **Blog/Insights** module (`posts` + `post_tags`) with MDX-style rich content.
12. **Newsletter capture** (Mailchimp / Resend audiences).
13. **Testimonials request flow** — magic link a client to leave a review.

### Phase 3 — Nice-to-have (later)
14. Client portal (project status, invoices, deliverables).
15. Proposal/quote generator (PDF via server fn).
16. Multi-language (i18n + locale-aware routing).
17. AI-assisted content drafting (Lovable AI Gateway) for project case studies and blog drafts.
18. Dark mode toggle.
19. Public referrals / partner program.
20. Stripe-based deposit collection on `/contact`.

---

## 6. SUPABASE DATABASE DESIGN

**Existing tables (✓ built):** `profiles`, `user_roles`, `services`, `projects`, `testimonials`, `founders`, `site_settings`, `leads`.  
**Proposed additions (✗ to build):** `project_images`, `analytics_events`, `activity_logs`, `posts`, `lead_throttle`.

### 6.1 `profiles` ✓
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | = `auth.users.id` |
| display_name | text | seeded from metadata or email prefix |
| avatar_url | text | nullable |
| created_at / updated_at | timestamptz | |

RLS: own profile read/write; admins read all.

### 6.2 `user_roles` ✓
| Column | Type |
|---|---|
| id | uuid PK |
| user_id | uuid FK → `auth.users` ON DELETE CASCADE |
| role | `app_role` enum: `admin` \| `user` |
| UNIQUE (user_id, role) | |

Read via `public.has_role(uid, role)` security-definer fn. Never store role on `profiles`.

### 6.3 `founders` ✓
`name, role, bio, photo_url, skills text[], linkedin_url, github_url, sort_order, is_published`.

### 6.4 `projects` ✓
`slug UNIQUE, title, category, client, summary, tech text[], cover_url, gradient, live_url, year, is_featured, is_published, sort_order`.

### 6.5 `project_images` ✗ (new)
| Column | Type |
|---|---|
| id | uuid PK |
| project_id | uuid FK → `projects` ON DELETE CASCADE |
| url | text NOT NULL |
| alt | text |
| caption | text |
| sort_order | int DEFAULT 0 |
| created_at | timestamptz |

RLS: public SELECT where parent `projects.is_published`; admin all.

### 6.6 `services` ✓
`slug UNIQUE, title, summary, bullets text[], icon, sort_order, is_published`.

### 6.7 `testimonials` ✓
`name, role, company, business, project, rating int (1–5), quote, avatar_url, sort_order, is_published`.

### 6.8 `leads` (contact_leads) ✓
`name, email, company, phone, service, message, status enum, notes, source, created_at, updated_at`.  
RLS: anon INSERT with Zod length limits; admin SELECT/UPDATE/DELETE.

### 6.9 `site_settings` ✓
`key UNIQUE, value jsonb, updated_at`. Keys: `hero`, `trust_stats`, `contact`, `social`.

### 6.10 `analytics_events` ✗ (new)
| Column | Type |
|---|---|
| id | bigint identity PK |
| event_type | text (`pageview`, `project_view`, `cta_click`, `form_start`, `form_submit`) |
| path | text |
| referrer | text |
| project_id | uuid FK → `projects` NULL |
| session_id | text (cookie) |
| ip_hash | text (sha256 of IP + salt) |
| user_agent | text |
| country | text |
| created_at | timestamptz default now() |

RLS: anon INSERT (narrow column check); admin SELECT only. Index on `(created_at)`, `(event_type, created_at)`, `(project_id)`.

### 6.11 `activity_logs` ✗ (new)
| Column | Type |
|---|---|
| id | uuid PK |
| actor_id | uuid FK → `auth.users` |
| action | text (`create` / `update` / `delete` / `publish`) |
| entity | text (`project` / `service` / ...) |
| entity_id | uuid |
| diff | jsonb |
| created_at | timestamptz |

RLS: admin SELECT only; writes via trigger or server fn.

### 6.12 `posts` ✗ (Phase 2 blog)
`slug UNIQUE, title, excerpt, body_md, cover_url, author_id FK profiles, tags text[], seo_title, seo_description, published_at, is_published`.

### 6.13 `lead_throttle` ✗ (Phase 1 spam)
`ip_hash text, window_start timestamptz, count int`. Composite PK `(ip_hash, window_start)`.

**Universal rules:** every public table has explicit `GRANT` block + RLS + `updated_at` trigger.

---

## 7. ADMIN DASHBOARD PLAN

| Module | Purpose | Key Features | DB Interactions |
|---|---|---|---|
| **Overview** | At-a-glance health | Counts, recent leads, 7/30-day visitor sparkline (Phase 2) | reads all summary tables |
| **Projects** | Manage portfolio | CRUD ✓, multi-image gallery ✗, SEO fields ✗, reorder via drag ✗ | `projects`, `project_images` |
| **Services** | Manage offerings | CRUD ✓, icon picker ✗ | `services` |
| **Testimonials** | Social proof | CRUD ✓, request-review link ✗ | `testimonials` |
| **Founders** | About-page bios | CRUD ✓ | `founders` |
| **Leads** | Sales pipeline | List + filter ✓, notes ✓, assignee ✗, follow-up date ✗, CSV export ✗, kanban ✗ | `leads` |
| **Site Settings** | Global copy | Hero/stats/contact/social ✓; add: SEO defaults, favicon, OG image | `site_settings` |
| **Analytics** ✗ | Marketing intel | Visitors, top pages, top projects, conversion funnel | `analytics_events`, `leads` |
| **Activity log** ✗ | Audit | Who changed what, when | `activity_logs` |
| **Users & roles** ✗ | Team mgmt | Invite, grant `admin`/`user` | `auth.users`, `user_roles` |

---

## 8. CMS PLAN

Everything user-facing is editable via Supabase tables. Hardcoded remnants and their migration plan:

| Currently hardcoded | Where | Move to |
|---|---|---|
| Nav links, footer legal copy | `src/data/site.ts` | already redundant — DB `site_settings` is source of truth; remove `site.ts` after Phase 1 verification |
| Page meta titles/descriptions | route `head()` blocks | extend `site_settings` with `seo` key OR add `seo_*` columns per entity |
| Service Lucide icon name | DB string → mapped client-side | leave as-is, but add admin icon picker UI |
| Gradient presets for project cards | const in component | leave hardcoded (design decision, not content) |
| `/about` studio story prose | inline in `about.tsx` | add `site_settings.about` jsonb (`{ story, mission, values[] }`) |
| Home CTA copy | inline | add `site_settings.home_cta` jsonb |
| Pricing (not present yet) | n/a | new `pricing_tiers` table when feature added |

Editor surfaces to add: rich-text (TipTap) for `bio` / `about.story` / `posts.body_md`; an icon picker for services; an OG-image uploader per project/service/post.

---

## 9. AUTHENTICATION PLAN

### Current ✓
- Supabase email/password.
- `handle_new_user()` trigger: creates `profiles` row; first signup → `admin`, all others → `user`.
- `has_role(uid, role)` security-definer fn used in every RLS policy.
- Protected subtree under `_authenticated/` (managed `ssr:false` gate) + Lovable integration's `attachSupabaseAuth` global middleware.
- `useAuth` hook (session, user, isAdmin, signOut with cache teardown).

### To add
1. **Google OAuth** via `lovable.auth.signInWithOAuth("google", ...)` + `supabase--configure_social_auth`.
2. **Disable open signup** after the second founder signs up (toggle in Supabase Auth settings) OR gate sign-up behind an invite token table.
3. **HIBP password check** (Lovable Cloud → Users → Auth Settings).
4. **2FA** (TOTP) for admins (Supabase MFA).
5. **Invitation flow** — admin enters email → server fn sends magic link → on first login, role granted.
6. **Session UX** — show "Signed in as X" in admin header (already partially done).

---

## 10. CONTACT FORM IMPLEMENTATION

### Done ✓
- Zod-validated form posts directly to `public.leads` via Supabase publishable client.
- RLS allows anon INSERT only (with length caps); admin reads.
- Admin inbox with status workflow + WhatsApp/email deep-links.

### To add (Phase 1)
1. **Email notifications** — TanStack server fn `notifyNewLead` triggered post-insert (either client-side after success OR a Supabase `AFTER INSERT` trigger → `pg_net` → server route `/api/public/leads/notify`). Use Resend; send to both founders.
2. **Auto-responder** to lead with expected response time + WhatsApp link.
3. **Spam protection:**
   - hidden honeypot input — reject on server fn if filled,
   - IP rate limit via `lead_throttle` table or Upstash Redis,
   - optional Cloudflare Turnstile widget if abuse persists.
4. **UTM capture** — read `utm_source/medium/campaign` from URL → store in `leads.source` (jsonb) for attribution.
5. **Validation hardening** — strip control chars, normalize phone to E.164, lowercase email.

---

## 11. ANALYTICS PLAN

### 11.1 Visitor tracking
- Browser-side: tiny `track(event, props)` helper sends `pageview` on route change (TanStack `router.subscribe`) and `cta_click` / `form_start` / `form_submit` on interaction.
- Server route `POST /api/public/analytics` writes to `analytics_events` (publishable client, RLS allows anon INSERT with column whitelist).
- Hash IPs with a server-side salt; never store raw IP.

### 11.2 Lead tracking
- On `form_submit`, write event with `lead_id` and source/UTM.
- Join `leads ← analytics_events` to compute funnel (visitors → form_start → form_submit → contacted → won).

### 11.3 Project views
- On `/projects/$slug` mount, send `project_view` event with `project_id` — powers "most viewed" in admin and on the public page.

### 11.4 Admin dashboard reporting
- Recharts: line (daily visitors), bar (top pages), table (top referrers), funnel chart, country breakdown.
- Date range picker; cached via TanStack Query with 5-min stale.

### 11.5 Privacy
- No third-party trackers; no cookies beyond a first-party `session_id` (rotates 30 min). GDPR-friendly.

---

## 12. SECURITY AUDIT

### Risks identified
| # | Risk | Severity | Recommendation |
|---|---|---|---|
| 1 | Open public signup auto-grants `user` role; first signup becomes admin | **High** during seeding window, low after | After seeding, disable open signup OR add invite-only flow |
| 2 | No rate limit on `/contact` | Medium | Honeypot + IP throttle table; Turnstile if needed |
| 3 | No HIBP / 2FA on admins | Medium | Enable HIBP; require TOTP for `admin` |
| 4 | Storage uses long-lived signed URLs | Medium | Document renewal strategy or make bucket public with read-only policy |
| 5 | No CSP / security headers | Medium | Add `Content-Security-Policy`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` via root response headers |
| 6 | `service_role` key — must remain server-only | High if leaked | Confirmed only in `client.server.ts`, loaded inside handlers via `await import` |
| 7 | No audit log of admin mutations | Medium | `activity_logs` table + trigger |
| 8 | No input sanitization beyond Zod length | Low | When adding rich text, sanitize HTML server-side (DOMPurify / rehype-sanitize) |
| 9 | `leads.notes` writable only by admin ✓ | OK | — |
| 10 | RLS policies for analytics need narrow anon INSERT (column whitelist) | Medium | Use a SECURITY DEFINER fn `record_event(...)` instead of raw INSERT |

### Confirmed good
- RLS enabled on every public table.
- `has_role()` is `SECURITY DEFINER` with fixed `search_path = public`.
- Roles in separate `user_roles` table (no privilege escalation surface).
- All admin queries gated by `_authenticated/` layout + RLS.
- `requireSupabaseAuth` middleware available; bearer attached by `attachSupabaseAuth`.
- Secrets only in env, never in code.

---

## 13. PERFORMANCE AUDIT

### Observed
- Site loads quickly (Vite + Workers SSR).
- Public list pages do one Supabase round-trip each — fine for current volumes.

### Opportunities
1. **Image optimization** — current uploads stored as-is. Add server-side `sharp`-equivalent (Cloudflare Images, Supabase Image Transformations, or Vercel/Workers image resizing) for `width`/`format=webp`/`quality` URL params.
2. **`loading="lazy"`** on every `<img>` below the fold; `decoding="async"` everywhere; explicit `width`/`height` to prevent CLS.
3. **`preload` hero font + LCP image** via `<link rel="preload">` in `__root.tsx`.
4. **Route preloading** — TanStack Router preloads on hover by default; ensure `defaultPreload: "intent"` is set in router options.
5. **Query caching** — set sensible `staleTime` (e.g. 60s) on `cms.ts` queries to avoid refetch on every navigation.
6. **Bundle splitting** — admin routes already lazy via file routing; verify with `vite build --report`.
7. **Database** — add indexes: `projects(sort_order) WHERE is_published`, `leads(status, created_at DESC)`, future `analytics_events(created_at)`.
8. **Signed URLs** — cache in TanStack Query keyed by storage path to avoid re-signing per render.
9. **Avoid waterfalls** — `index.tsx` should fetch services+projects+testimonials+settings in parallel (already the case via independent `useQuery` calls; consider `useQueries` for batching).
10. **Sitemap** — cache response headers `Cache-Control: public, max-age=3600`.

---

## 14. CURSOR IMPLEMENTATION GUIDE

For each upcoming feature, here are the files, tables, and dependencies Cursor should create. Maintain the existing conventions: TanStack Start, file-based routes, `createServerFn` for app-internal server logic, server routes (`src/routes/api/public/*`) for webhooks/cron, Zod everywhere, TanStack Query for fetching, shadcn/ui for primitives.

### 14.1 Email notifications for new leads (Phase 1, P0)
- **Dependency:** `bun add resend zod`
- **Secrets:** `RESEND_API_KEY`, `NOTIFY_TO_EMAILS` (comma list)
- **Files:**
  - `src/lib/email.server.ts` — Resend client wrapper.
  - `src/lib/leads.functions.ts` — `notifyNewLead` `createServerFn` (no auth) called from `/contact` after successful insert. Sends 2 emails: internal alert + auto-reply.
  - Update `src/routes/contact.tsx` — after `supabase.from('leads').insert(...)` succeeds, call `useServerFn(notifyNewLead)`.
- **DB:** none (or trigger-based alt with `pg_net` + `/api/public/leads/notify` server route).

### 14.2 Spam protection (Phase 1, P0)
- **Files:**
  - `supabase/migrations/<ts>_lead_throttle.sql` — `lead_throttle` table + `try_throttle(ip_hash)` SECURITY DEFINER fn returning bool.
  - `src/lib/leads.functions.ts` — wrap insert in a server fn that hashes IP from headers, calls `try_throttle`, validates honeypot.
  - Update `src/routes/contact.tsx` — add `<input name="company_url" className="hidden" tabIndex={-1} />` honeypot; switch to server fn instead of direct client insert.

### 14.3 Project detail pages + gallery (Phase 1)
- **DB migration:** `project_images` table (see §6.5) + RLS + GRANTs.
- **Files:**
  - `src/routes/projects.$slug.tsx` — public route with `head()` deriving title/description/og:image from project + first gallery image; `loader` via `ensureQueryData`.
  - `src/lib/cms.ts` — `fetchProjectBySlug`, `fetchProjectImages`.
  - `src/components/site/ProjectGallery.tsx` — lightbox grid.
  - Admin update: extend `src/routes/_authenticated/admin/projects.tsx` to manage `project_images` (drag-to-reorder, upload multiple).
- **Sitemap:** include `/projects/$slug` per published project.

### 14.4 Google OAuth (Phase 1)
- Call deferred tool `supabase--configure_social_auth` for `google`.
- Update `src/routes/auth.tsx` — add "Continue with Google" button using `lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin })`.

### 14.5 Analytics (Phase 2)
- **DB migration:** `analytics_events` (§6.10) + `record_event(event_type, path, referrer, project_id, session_id, ip_hash, user_agent, country)` SECURITY DEFINER fn.
- **Files:**
  - `src/routes/api/public/analytics.ts` — POST endpoint calling `record_event`.
  - `src/lib/analytics.ts` — client `track()` helper; `useTrackPageviews()` hook subscribed to router.
  - Mount hook in `src/routes/__root.tsx`.
  - `src/routes/_authenticated/admin/analytics.tsx` — recharts dashboards.
  - `bun add recharts`.

### 14.6 Activity log (Phase 1/2)
- **DB:** `activity_logs` + Postgres triggers on `projects`, `services`, `testimonials`, `founders`, `site_settings`, `leads`.
- **Files:** `src/routes/_authenticated/admin/activity.tsx` with paginated table.

### 14.7 Blog (Phase 2)
- **DB:** `posts` (§6.12).
- **Files:**
  - `src/routes/blog.tsx`, `src/routes/blog.$slug.tsx`.
  - `src/routes/_authenticated/admin/posts.tsx`.
  - `bun add @tiptap/react @tiptap/starter-kit rehype-sanitize`.

### 14.8 CSV export
- Server fn `exportLeadsCsv` (auth + admin role check) returning `text/csv`.
- Admin button on `/admin/leads`.

### 14.9 SEO per-entity editor
- Migration: add `seo_title text, seo_description text, og_image text` to `projects`, `services`, future `posts`.
- Update detail-route `head()` to prefer these over defaults.

### 14.10 Image optimization
- Either enable Supabase Image Transformations and pass `?width=…&format=webp` in `cms.ts` helpers, or move to Cloudflare Images. Centralize in `src/lib/img.ts`.

### 14.11 Conventions Cursor must keep
- ❌ Do not create `src/pages/`, edit `routeTree.gen.ts`, or touch `src/integrations/supabase/{client,client.server,auth-middleware,auth-attacher,types}.ts`.
- ❌ Do not use Supabase Edge Functions for app-internal logic — use `createServerFn`.
- ✅ Every new public-schema table needs `CREATE TABLE` → `GRANT` → `ENABLE RLS` → `CREATE POLICY`, in that order, in a single migration.
- ✅ Read secrets only inside `.handler()` bodies (or `.server.ts` files loaded via dynamic `await import`).
- ✅ Public routes must NOT call `requireSupabaseAuth` server fns from loaders (prerender will 401).

---

## 15. FINAL STATUS REPORT

### Feature status matrix
| Feature | Status |
|---|---|
| Public marketing site (Home / Services / Projects / About / Testimonials / Contact) | ✅ Completed |
| Responsive design across breakpoints | ✅ Completed |
| SEO basics (per-route meta, sitemap, robots) | ✅ Completed |
| Contact form → DB | ✅ Completed |
| Authentication (email/password) | ✅ Completed |
| Admin shell + navigation | ✅ Completed |
| Admin CRUD: Projects / Services / Testimonials / Founders | ✅ Completed |
| Admin Site Settings (hero, stats, contact, social) | ✅ Completed |
| Admin Leads inbox + status workflow | ✅ Completed |
| Role-based access (RLS via `has_role`) | ✅ Completed |
| Storage uploads (signed URLs) | ✅ Completed |
| Email notifications on lead | ❌ Not started |
| Spam protection (honeypot/rate limit/captcha) | ❌ Not started |
| Project detail pages + gallery | ❌ Not started |
| Google OAuth for admins | ❌ Not started |
| Analytics (tracking + dashboard) | ❌ Not started |
| Activity log | ❌ Not started |
| Blog / insights | ❌ Not started |
| CSV export | ❌ Not started |
| Per-entity SEO editor | ⚠️ Partial (defaults only) |
| Image optimization pipeline | ⚠️ Partial (raw uploads) |
| 2FA / HIBP for admins | ❌ Not started |
| Security headers (CSP etc.) | ❌ Not started |
| Newsletter / referral / client portal | ❌ Not started |
| i18n | ❌ Not started |

### Overall completion estimate
- **Frontend (marketing site UI):** ~95%
- **Admin CMS:** ~80% (CRUD complete; missing audit, analytics, advanced lead pipeline, multi-image, SEO editor)
- **Backend integrations (email, spam, analytics, monitoring):** ~15%
- **Security hardening:** ~60%
- **Performance hardening:** ~70%

**Weighted overall project completion: ~65%**

The product is **demo-ready and lead-capture-ready today**. Phase 1 of the roadmap (email notifications, spam protection, project detail pages, Google OAuth, audit log) takes it to ~85% and "launch-ready." Phase 2 (analytics, blog, lead pipeline upgrades, SEO editor) takes it to ~95% and "growth-ready."

---

*End of handover document. Hand this file to the Cursor session along with the repository — no other context is required to continue development.*
