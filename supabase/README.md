# Supabase — TMSDriver

This app connects to the **same** Supabase project as Admin — do not run
`schema.sql` again here, it's just kept as a local reference copy
(source of truth setup happens once from `admin/supabase`).

## Setup

1. Get the project URL + anon key from the same Supabase project used by Admin
   (Project Settings → API).
2. Add them to this app's env config (e.g. `.env`):
   ```
   SUPABASE_URL=your-supabase-project-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
3. Driver logs in with the phone/password Admin set for them — this maps to
   an `auth.users` row with `profiles.role = 'driver'`.
4. RLS ensures a logged-in driver only ever sees their own profile, their
   assigned loads, and their own location/POD uploads — no extra filtering
   needed in app code beyond querying by their own driver id.
