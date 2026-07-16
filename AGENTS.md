# Nikah Muyassar — Development Setup

## Commands
```bash
npm run dev        # Start development server
npm run build      # Production build
npm run lint       # Run ESLint
```

## Tech Stack
- **Frontend:** Next.js 14 App Router + TypeScript + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + Realtime)
- **Storage:** Cloudinary
- **Email:** Resend
- **UI:** Custom shadcn/ui components + Framer Motion

## Environment Variables
See `.env.local` — all required vars:

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (server-only)
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` — Cloudinary cloud name
- `CLOUDINARY_API_KEY` — Cloudinary API key
- `CLOUDINARY_API_SECRET` — Cloudinary API secret
- `RESEND_API_KEY` — Resend API key
- `NEXT_PUBLIC_APP_URL` — Application URL

## Database Setup
1. Create Supabase project
2. Run `supabase/schema.sql` in SQL Editor
3. Run `supabase/seed.sql` for sample data
4. Enable RLS on all tables
5. Configure Auth providers (Email + Google OAuth)

## Project Structure
```
src/
├── app/
│   ├── (public)/         → Landing, About, How It Works, etc.
│   ├── (auth)/           → Login, Register, Verify Email
│   ├── (applicant)/      → Apply form, Dashboard
│   ├── (sponsor)/        → Browse, Pledge, Dashboard
│   ├── (admin)/          → Admin Dashboard, Users, FAQs
│   └── api/              → All API routes
├── components/
│   ├── ui/               → Button, Card, Input, Modal, etc.
│   └── layout/           → Navbar, Footer, DashboardLayout
├── lib/                  → supabase client, utils, constants, validations
├── types/                → Database TypeScript types
└── middleware.ts          → Route protection
```

## Roles
- `applicant` — Submit applications, track status
- `sponsor` — Browse approved apps, make pledges
- `reviewer` — Review applications, schedule meetings
- `admin` — Full platform access
