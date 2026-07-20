# Nikah Muyassar — Development Setup

## Commands
```bash
npm run dev              # Start development server
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Run ESLint
npm run mobile:sync      # Build web + sync to native projects
npm run mobile:android   # Build + sync + open Android Studio
npm run mobile:ios       # Build + sync + open Xcode (Mac only)
npm run mobile:update    # Update Capacitor native platforms
```

## Tech Stack
- **Frontend:** Next.js 14 App Router + TypeScript + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + Realtime)
- **Storage:** Cloudinary
- **Email:** Resend
- **Mobile:** Capacitor (Android + iOS native wrappers)
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
├── middleware.ts          → Route protection
android/                  → Android native project (Capacitor)
ios/                      → iOS native project (Capacitor)
capacitor.config.ts       → Capacitor configuration
```

## Roles
- `applicant` — Submit applications, track status
- `sponsor` — Browse approved apps, make pledges
- `reviewer` — Review applications, schedule meetings
- `admin` — Full platform access

## Mobile App Development

The mobile app uses **Capacitor** to wrap the web app as a native Android/iOS application.
It loads the live Vercel URL as a full-screen WebView, so all backend functionality works identically.

### Configuration (`capacitor.config.ts`)
- Points to `https://nikah-muyassar.vercel.app`
- Splash screen: teal background, gold spinner, 2s duration
- Status bar: dark content on teal background
- Supports push notifications

### First-Time Setup
```bash
npm install                    # Already done
npx cap copy                   # Copy web build to native projects
npx cap open android           # Opens Android Studio
npx cap open ios               # Opens Xcode (macOS only)
```

### After Every Code Update
```bash
npm run mobile:sync
```

### Building for Release

**Android (APK/AAB):**
1. Open Android Studio: `npx cap open android`
2. Build → Generate Signed Bundle/APK
3. Create keystore (or use existing)
4. Output: `.aab` (Play Store) or `.apk` (direct install)

**iOS (IPA):**
1. Open Xcode: `npx cap open ios` (macOS only)
2. Product → Archive
3. Distribute App → App Store Connect

### Publishing to App Stores

| Store | Requirements | Cost |
|-------|-------------|------|
| **Google Play** | Developer account ($25 one-time), screenshots, privacy policy | $25 |
| **Apple App Store** | Mac + Xcode, developer account ($99/year), screenshots | $99/year |

### Useful Capacitor Commands
```bash
npx cap ls                   # List installed platforms
npx cap sync                 # Sync all platforms
npx cap copy                 # Copy web build to native
npx cap update               # Update native plugins
npx cap open android         # Open Android Studio
npx cap open ios             # Open Xcode
```

## Deployment
- **Web:** Auto-deployed to Vercel on push to `main`
- **Android:** Manual build + upload to Google Play Console
- **iOS:** Manual build + upload to App Store Connect (macOS required)
