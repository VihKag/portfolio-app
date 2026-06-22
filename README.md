# Portfolio App

A multi-tenant portfolio builder. Each user gets a customizable public portfolio
(`/portfolio/:username`) to showcase projects, a resume/CV, memories & hobbies,
and a contact form.

**Stack:** React 19 · Vite · Tailwind CSS v4 · Radix UI · Supabase (Auth + Postgres + Storage)

## Features

| Area | What you can manage |
| --- | --- |
| **Profile** | Display name, bio, avatar, cover image |
| **Theme** | Accent color, background color |
| **Portfolio** | Image / project / blog / video items |
| **Resume / CV** | Experience, education, skills (grouped), certifications |
| **Memories & Hobbies** | Personal "about me" cards with optional photos |
| **Social links** | GitHub, LinkedIn, Twitter, Instagram, and more |
| **Contact** | Public contact form; messages arrive in the dashboard |

Every section is editable from the **Dashboard** and rendered on the public
portfolio page at `/portfolio/:username`.

## Getting started

```bash
npm install
npm run dev
```

Create a `.env.local` with your Supabase project credentials:

```env
VITE_PUBLIC_VIKASUPABASE_URL=https://<project>.supabase.co
VITE_PUBLIC_VIKASUPABASE_ANON_KEY=<anon-key>
```

## Project structure

```
src/
  components/
    dashboard/        # Dashboard tab panels
      resume-manager.jsx
      portfolio-manager.jsx
      profile-settings.jsx
      social-links-manager.jsx
      memories-hobbies.jsx
      theme-customizer.jsx
      contact-messages.jsx
      dashboard-header.jsx
    portfolio/        # Public-facing portfolio sections
      resume-section.jsx
      portfolio-grid.jsx
      hero-section.jsx
      contact-form.jsx
    layout/
      header.jsx
    ui/               # Reusable UI primitives (shadcn-style)
  pages/
    landing.jsx
    portfolio.jsx     # Public portfolio page (/portfolio/:username)
    dashboard.jsx
    auth/
      login.jsx
      signup.jsx
  lib/
    supabase/client.js
    types/index.js
    utils.js
scripts/              # Run these in Supabase SQL editor in order
```

## Database setup

Run the scripts in [`scripts/`](scripts/) against your Supabase project **in numeric order**
via the SQL editor.

| Script | Purpose |
| --- | --- |
| `001_create_portfolio_tables.sql` | Core tables: users, portfolio_items, contact_messages, social_links |
| `002_add_theme_color.sql` | `theme_color` column on users |
| `003_add_background_color.sql` | `background_color` column on users |
| `004_create_memories_hobbies.sql` | memories_hobbies table |
| `005_create_resume_tables.sql` | experiences, education, skills, certifications tables |
| `006_seed_cv_data.sql` | **Optional** — seeds an existing account with sample CV data |

All tables use Supabase Row Level Security: publicly readable, owner-writable.

### Seeding your CV

1. Sign up in the app with your email.
2. Edit `006_seed_cv_data.sql` and change `v_email` to your email.
3. Run it in the Supabase SQL editor.

## Routes

| Path | Description |
| --- | --- |
| `/` | Landing page |
| `/auth/login` | Sign in |
| `/auth/signup` | Create account |
| `/dashboard` | Manage your portfolio (auth required) |
| `/portfolio/:username` | Public portfolio |

## npm scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
