# Portfolio App

A multi-tenant portfolio builder. Each user gets a customizable public portfolio
(`/portfolio/:username`) to showcase projects, a resume/CV, memories & hobbies,
and a contact form. Built with React 19, Vite, Tailwind CSS v4, and Supabase.

## Features

- **Profile** — avatar, cover image, bio, theme & background color.
- **Portfolio** — image / project / blog / video items.
- **Resume / CV** — experience, education, skills, and certifications.
- **Memories & Hobbies** — personal "about me" cards.
- **Social links** and a public **contact form**.
- **Dashboard** to manage all of the above.

## Getting started

```bash
npm install
npm run dev
```

Create a `.env.local` with your Supabase credentials:

```
VITE_PUBLIC_VIKASUPABASE_URL=your-project-url
VITE_PUBLIC_VIKASUPABASE_ANON_KEY=your-anon-key
```

## Database

Run the SQL scripts in [`scripts/`](scripts/) against your Supabase project in
numeric order. They create the tables, row-level security policies, and an
optional CV seed:

| Script | Purpose |
| --- | --- |
| `001_create_portfolio_tables.sql` | Core tables (users, portfolio_items, contact_messages, social_links) |
| `002_add_theme_color.sql` | Theme color column |
| `003_add_background_color.sql` | Background color column |
| `004_create_memories_hobbies.sql` | Memories & hobbies table |
| `005_create_resume_tables.sql` | Resume tables (experiences, education, skills, certifications) |
| `006_seed_cv_data.sql` | Optional: seed an account with sample CV data |

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint
