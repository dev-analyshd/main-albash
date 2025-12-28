# Project

This repository contains the Albash project.

## Environment variables

- Do NOT commit secrets (service role keys, private keys, API secrets) into the repository.
- Keep secrets in your local `.env.local` (which should be in `.gitignore`) or in your hosting provider's secure environment variables.

Important variables used by this project:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only; never commit)

If you accidentally commit a service role key, rotate it immediately in the Supabase dashboard.
