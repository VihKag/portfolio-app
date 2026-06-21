-- Seed the portfolio with Nguyen Vinh Khang's CV data.
--
-- Prerequisite: an account must already exist (sign up in the app first) with the
-- email below. This script looks that account up by email, then fills in the
-- profile, projects, social links, and the resume tables.
--
-- Safe to re-run: it clears the seeded rows for this user before inserting.

DO $$
DECLARE
  v_email TEXT := 'nvkhang191@gmail.com';
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id FROM public.users WHERE email = v_email;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No user found with email %. Sign up in the app first, then re-run this script.', v_email;
  END IF;

  ----------------------------------------------------------------------------
  -- Profile
  ----------------------------------------------------------------------------
  UPDATE public.users
  SET
    full_name = 'Nguyễn Vinh Khang',
    username = COALESCE(NULLIF(username, ''), 'vihkag'),
    bio = 'Software Engineer & Fullstack Developer with 1 year of experience maintaining and enhancing enterprise business applications using ASP.NET, C#, and SQL Server. Skilled in workflow automation, business process optimization, SQL query performance tuning, and building RESTful APIs with Spring Boot and ReactJS.',
    theme_color = COALESCE(theme_color, '#14b8a6'),
    background_color = COALESCE(background_color, '#0e0e16')
  WHERE id = v_user_id;

  ----------------------------------------------------------------------------
  -- Clear previously seeded rows (idempotent re-runs)
  ----------------------------------------------------------------------------
  DELETE FROM public.experiences WHERE user_id = v_user_id;
  DELETE FROM public.education WHERE user_id = v_user_id;
  DELETE FROM public.skills WHERE user_id = v_user_id;
  DELETE FROM public.certifications WHERE user_id = v_user_id;
  DELETE FROM public.social_links WHERE user_id = v_user_id AND platform IN ('github');
  DELETE FROM public.portfolio_items WHERE user_id = v_user_id AND title = 'BPM System';

  ----------------------------------------------------------------------------
  -- Experience
  ----------------------------------------------------------------------------
  INSERT INTO public.experiences (user_id, title, company, location, start_date, end_date, description, sort_order) VALUES
  (v_user_id,
   'Software Engineer',
   'Lac Ty Company Limited',
   'Ho Chi Minh City — Enterprise BPM & Internal Systems',
   '05/2025',
   'Present',
   'Maintained and enhanced an enterprise BPM platform handling 500+ daily workflow transactions.' || chr(10) ||
   'Designed and optimized SQL Server stored procedures, achieving up to 30% reduction in query execution time via indexing and query plan analysis.' || chr(10) ||
   'Resolved 30+ production incidents through systematic root-cause analysis.' || chr(10) ||
   'Integrated ERP links to gather requirements and provide customized reporting modules for procurement and production departments.' || chr(10) ||
   'Participated in full SDLC: requirements review, unit testing, UAT support, and deployments across DEV / TEST / PROD environments.',
   0);

  ----------------------------------------------------------------------------
  -- Education
  ----------------------------------------------------------------------------
  INSERT INTO public.education (user_id, degree, school, location, start_date, end_date, details, sort_order) VALUES
  (v_user_id,
   'B.Sc. Information Technology',
   'Ho Chi Minh City University of Technology and Education (HCMUTE)',
   'Ho Chi Minh City',
   '10/2020',
   '01/2025',
   'GPA: 3.15 / 4.0' || chr(10) ||
   'TOEIC 680' || chr(10) ||
   'Relevant coursework: Data Structures & Algorithms, Database Systems, Software Engineering, Object-Oriented Programming, Computer Networks.',
   0);

  ----------------------------------------------------------------------------
  -- Skills
  ----------------------------------------------------------------------------
  INSERT INTO public.skills (user_id, category, items, sort_order) VALUES
  (v_user_id, 'Languages',       ARRAY['Java', 'C#', 'TypeScript', 'JavaScript', 'SQL'], 0),
  (v_user_id, 'Back-End',        ARRAY['Spring Boot', 'ASP.NET', 'RESTful API', 'JWT', 'Prisma ORM'], 1),
  (v_user_id, 'Front-End',       ARRAY['ReactJS', 'Tailwind', 'shadcn/ui', 'Recharts'], 2),
  (v_user_id, 'Database',        ARRAY['SQL Server', 'Stored Procedures', 'Indexing', 'Query Tuning', 'Supabase PostgreSQL'], 3),
  (v_user_id, 'Auth & Security', ARRAY['JWT (access/refresh)', 'Google OAuth'], 4),
  (v_user_id, 'Cloud',           ARRAY['Supabase Storage', 'Stripe Billing', 'Nodemailer/SMTP', 'PWA', 'GCP basics'], 5),
  (v_user_id, 'Tools',           ARRAY['Git', 'GitHub', 'Postman', 'VS Code', 'IntelliJ IDEA', 'Jira'], 6),
  (v_user_id, 'Concepts',        ARRAY['Agile/Scrum', 'OOP', 'MVC', 'CI/CD basics'], 7);

  ----------------------------------------------------------------------------
  -- Certifications
  ----------------------------------------------------------------------------
  INSERT INTO public.certifications (user_id, name, issuer, sort_order) VALUES
  (v_user_id, 'Big Data and Machine Learning Fundamentals', 'Google Cloud', 0),
  (v_user_id, 'Core Infrastructure Fundamentals', 'Google Cloud', 1);

  ----------------------------------------------------------------------------
  -- Featured project
  ----------------------------------------------------------------------------
  INSERT INTO public.portfolio_items (user_id, title, description, content_type, project_url, tags, featured) VALUES
  (v_user_id,
   'BPM System',
   'A production-ready Business Process Management platform with a Form Builder, node-based Workflow Designer (conditional/parallel branching), Approval Engine, HR management, and Admin Dashboard. Drag-and-drop forms persist via Prisma ORM to Supabase PostgreSQL, with an enterprise auth stack (bcrypt + JWT access/refresh tokens, httpOnly cookies, Google OAuth).',
   'project',
   'https://github.com/VihKag/bpm-system-design',
   ARRAY['Next.js', 'React', 'TypeScript', 'Tailwind', 'Prisma', 'Supabase PostgreSQL'],
   TRUE);

  ----------------------------------------------------------------------------
  -- Social links
  ----------------------------------------------------------------------------
  INSERT INTO public.social_links (user_id, platform, url) VALUES
  (v_user_id, 'github', 'https://github.com/VihKag');

END $$;
