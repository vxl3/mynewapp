# احجزلي (Ahjezli) — Phase 2: User Management & Dashboard Foundation

منصة الحجز الذكية الأولى في العالم العربي — **أساس إنتاجي متكامل** (المرحلتان 1 و 2).
The smart booking platform for the Arab world — **complete production foundation (Phases 1 & 2)**.

> Phase 1 delivered architecture, schema, auth skeleton and UI system.
> Phase 2 delivers the **complete user management system** and **functional
> dashboards** for all three roles, wired to a real PostgreSQL database.
> Booking business logic is intentionally deferred to Phase 3 — but every
> model it needs is already in place.

---

## ✨ Tech Stack

| Layer        | Technology                                             |
| ------------ | ------------------------------------------------------ |
| Framework    | Next.js 15 (App Router, RSC)                           |
| Language     | TypeScript (strict)                                    |
| UI           | React 19, Tailwind CSS, shadcn/ui, Framer Motion        |
| Data         | Prisma ORM + PostgreSQL                                |
| Auth         | Auth.js (NextAuth v5) — JWT sessions, refresh tokens   |
| State        | TanStack Query (server state), Zustand (client state)  |
| Forms        | React Hook Form + Zod                                  |
| i18n         | i18next — Arabic (RTL) / English (LTR), instant switch |
| Realtime     | Socket.IO (infrastructure prepared)                    |
| Quality      | ESLint, Prettier, strict TypeScript                    |

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env   # fill DATABASE_URL + secrets

# 3. Start PostgreSQL and create the database, then:
npx prisma migrate dev --name init
npx prisma db seed      # roles, permissions, categories, admin

# 4. Run the dev server
npm run dev             # http://localhost:3000
```

**Seed super admin:** `admin@ahjezli.app` / `Admin@123456` — *change immediately in production.*

### Scripts

| Command               | Purpose                                   |
| --------------------- | ----------------------------------------- |
| `npm run dev`         | Development server                        |
| `npm run build`       | Production build                          |
| `npm run start`       | Serve production build                    |
| `npm run lint`        | ESLint (CI step)                          |
| `npm run typecheck`   | `tsc --noEmit`                            |
| `npm run format`      | Prettier write                            |
| `npm run prisma:generate` | Regenerate Prisma client              |
| `npm run db:seed`     | Seed bootstrap data                       |
| `npm run socket`      | Standalone Socket.IO server (smoke test)  |

---

## 📁 Project Structure

```
src/
├── app/                    # App Router routes
│   ├── (auth)/             # login, register, forgot/reset, verify
│   ├── api/                # REST endpoints (auth, health, /v1 for mobile)
│   ├── dashboard/          # Customer dashboard (role-protected)
│   ├── business/           # Business dashboard (role-protected)
│   ├── admin/              # Super-admin dashboard (role-protected)
│   ├── layout.tsx          # Root layout (fonts, providers)
│   └── globals.css         # Design tokens (luxury / glassmorphism)
├── components/
│   ├── ui/                 # shadcn-style primitives (40+)
│   ├── shared/             # logo, theme & language switchers
│   ├── auth/               # auth forms
│   ├── landing/            # marketing homepage sections
│   └── dashboard/          # shells, nav, placeholder modules
├── config/                 # site, RBAC roles & permissions
├── hooks/                  # useMediaQuery, useMounted
├── lib/                    # prisma, security, tokens, i18n, api-client…
├── middleware.ts           # route protection + rate limiting
├── providers/              # theme, query, session, locale
├── server/                 # Socket.IO infrastructure
├── store/                  # Zustand stores
├── translations/           # ar.json / en.json
└── types/                  # shared domain types
prisma/
├── schema.prisma           # ~35 normalized models (see below)
└── seed.ts
```

---

## 🗄️ Database Schema

Normalized PostgreSQL schema covering every future phase:

**Identity & RBAC** — `User`, `Role`, `Permission`, `UserRole`, `RolePermission`,
`Account`, `Session`, `VerificationToken`, `PasswordResetToken`, `RefreshToken`

**Catalog** — `Category` (unlimited, hierarchical), `Language`, `Country`, `City`

**Business domain** — `Business`, `Branch`, `Service`, `Employee`, `ServiceEmployee`,
`BusinessHour`

**Bookings** — `Booking`, `Review`

**Messaging** — `Message`, `Notification`

**Monetization** — `Plan`, `Subscription`, `Coupon`, `CouponRedemption`,
`LoyaltyAccount`, `LoyaltyTransaction`, `Referral`

**Billing** — `PaymentRecord`, `Invoice`

**Media** — `File`, `Image`

**Ops** — `Setting`, `AuditLog`, `ActivityLog`, `AiSetting`

---

## 👥 What Phase 2 adds

**Authentication (complete)**
- Register Customer / Business Owner (Super Admin is seed-only — never public)
- Login / Logout with role-based redirects (Customer→`/dashboard`, Owner→`/business`, Admin→`/admin`)
- Email verification, forgot/reset password, "remember me" (30-day session)
- Account lockout after repeated failures, secure sessions, refresh-token rotation
- Google OAuth (env-gated) + Apple & phone sign-in prepared at the schema level

**User profile** — avatar, name, phone, country/city, address, bio, language,
theme, notification settings, password change, connected devices/active sessions,
and account-deletion requests.

**Dashboards**
- **Customer**: overview, profile, bookings (upcoming/history), favorites,
  messages, notifications, coupons, loyalty, referral, settings, security
- **Business**: overview, my businesses, business profile, branches, employees,
  services, working hours, gallery, reviews, messages, statistics, subscription,
  settings
- **Admin**: overview, users, business owners, businesses, categories, cities,
  countries, subscriptions, coupons, notifications (broadcast), reports,
  audit logs, roles, permissions, languages, AI settings, system settings

**Route protection** — guests redirected to sign-in; cross-role access returns a
custom **403** page; dedicated **404** and **500** pages.

**Validation** — Zod schemas shared between React Hook Form (client) and server
actions (server), with professional messages.

**Database** — new `Device`, `Favorite` and `AccountDeletionRequest` models plus
profile fields on `User`; everything normalized, no duplicated models.

## 🔐 Security (OWASP-aligned)

- **Secure headers** — CSP, HSTS, `X-Frame-Options: DENY`, nosniff, Referrer-Policy
- **Rate limiting** — sliding-window limiter on auth endpoints (middleware)
- **Password hashing** — bcrypt (cost 12)
- **Account lockout** — after 5 failed attempts (15 min)
- **RBAC** — role + permission matrix enforced in middleware & API layer
- **CSRF/XSS/SQLi** — SameSite cookies, sanitization + validation (Zod),
  parameterized Prisma queries, HTML entity escaping
- **Refresh-token rotation** — hashed storage, single-use, revoked on reset
- **Audit logging** — immutable `AuditLog` trail helper

---

## 🌐 Internationalization

- **Arabic (RTL)** and **English (LTR)** via i18next
- Instant switching flips `dir` and `lang` on `<html>` — no reload
- All UI strings centralized in `src/translations/{ar,en}.json`

## 🎨 Theming

- Dark / Light / System modes via `next-themes`
- User preference persisted (`ahjezli-preferences`)
- Luxury glassmorphism design system with CSS-variable tokens

## 📱 Future Mobile Apps

The versioned REST namespace `/api/v1/*` is the stable contract for the future
Android & iOS clients (JWT access + refresh tokens already implemented).

---

## 📌 Roadmap

- ✅ **Phase 1** — architecture, schema, auth skeleton, UI system, landing page
- ✅ **Phase 2** — user management, complete auth, functional dashboards, RBAC, admin
- ⏭ **Phase 3** — business management & booking system, realtime (Socket.IO)
- ⏭ **Phase 4** — payments, invoicing, AI assistant, loyalty automation, mobile apps

---

© احجزلي — All rights reserved.
