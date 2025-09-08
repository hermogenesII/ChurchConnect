# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack (opens at http://localhost:3000)
- `npm run build` - Build production application with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint to check code quality

## Project Architecture

This is a Next.js 15 application using the App Router architecture with TypeScript and Tailwind CSS.

### Tech Stack
- **Framework**: Next.js 15.5.2 with App Router
- **Runtime**: React 19.1.0
- **Styling**: Tailwind CSS v4
- **Data Fetching**: TanStack Query (React Query)
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Build Tool**: Turbopack (enabled for both dev and build)
- **Fonts**: Geist Sans and Geist Mono via `next/font/google`
- **Linting**: ESLint with Next.js TypeScript configuration

### Project Structure
- `src/app/` - App Router pages and layouts
  - `layout.tsx` - Root layout with font configuration
  - `page.tsx` - Home page component
  - `globals.css` - Global styles with Tailwind CSS
- TypeScript path mapping: `@/*` maps to `./src/*`

### Key Configurations
- **TypeScript**: Strict mode enabled with ES2017 target
- **ESLint**: Uses Next.js core web vitals and TypeScript rules
- **Next.js**: Default configuration ready for customization
- **Tailwind**: PostCSS configuration for v4

## Application Design

### User Types & Roles
1. **Normal User (Member)** - Mobile-first experience
   - Primary device: Mobile phones
   - View church events, announcements, sermons
   - RSVP to events, submit prayer requests
   - Access member directory (limited)

2. **Church Admin** - Desktop-optimized experience
   - Primary device: Desktop/large screens
   - Create/edit events and announcements
   - Manage members and communications
   - View analytics and reports

3. **System Admin** - Desktop-optimized experience
   - Primary device: Desktop/large screens
   - Manage multiple churches (multi-tenant)
   - User role management and system configuration

### Responsive Design Strategy
- **Mobile-First**: Bottom navigation, card layouts, touch-friendly buttons (44px min)
- **Desktop-First**: Sidebar navigation, table/grid layouts, keyboard shortcuts
- **Breakpoints**: `xs: 375px, sm: 640px, md: 768px, lg: 1024px (admin threshold), xl: 1280px`

### Planned Architecture
```
src/
├── app/
│   ├── (auth)/           # Authentication pages
│   ├── (dashboard)/
│   │   ├── member/       # Mobile-optimized member views
│   │   ├── admin/        # Desktop-optimized admin views
│   │   └── system/       # System admin views
│   └── api/              # API routes with role-based access
├── hooks/
│   ├── queries/          # TanStack Query hooks
│   │   ├── member/       # Mobile-optimized queries
│   │   ├── admin/        # Desktop-optimized queries
│   │   └── shared/       # Common queries
│   └── mutations/        # Data mutation hooks
└── middleware.ts         # Route protection & role validation
```

### TanStack Query Configuration
- **Member queries**: 2min stale time, refetch on window focus (mobile app switching)
- **Admin queries**: 30sec stale time, 30sec refetch interval (real-time dashboards)
- Mobile-friendly retry strategy (max 2 retries)
- Offline-first with query persistence for members

### Supabase Setup
- **Authentication**: Built-in auth with role-based access control (RLS)
- **Database**: PostgreSQL with real-time subscriptions
- **Storage**: File uploads for events, profiles, church assets
- **Edge Functions**: Server-side logic for complex operations

### Database Schema (Supabase)
```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT,
  name TEXT,
  role user_role DEFAULT 'MEMBER',
  church_id UUID REFERENCES churches,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Churches table (multi-tenant support)
CREATE TABLE churches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  settings JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE churches ENABLE ROW LEVEL SECURITY;
```


### Environment Variables (Required)
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Theme: "Sacred Harmony"
- **Colors**: `primary-600` (blue), `secondary-500` (gold), `accent-600` (green), `spiritual-600` (purple)
- **Mobile detection**: `useMobile()` hook available at `@/hooks`

### Development Notes
- **Mobile breakpoint**: < 1024px (lg breakpoint) is considered mobile
- **User roles**: MEMBER (mobile), CHURCH_ADMIN (desktop), SYSTEM_ADMIN (desktop)