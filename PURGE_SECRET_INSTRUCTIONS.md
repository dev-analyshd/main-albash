# Purge Secrets from Git History

This file documents a safe sequence to remove secrets from history, push a cleaned mirror, and rotate exposed keys.

IMPORTANT: Git history rewriting is destructive. All collaborators must re-clone after a force-push.

## Summary of steps (what I'll do now if you confirm)
- Create a comprehensive `replacements.txt` that covers Supabase, Stripe, Infura, Alchemy, NFT.Storage, Paystack, and Flutterwave secrets.
- Create a bare mirror clone and run `git-filter-repo` to replace secrets with `***REDACTED_*` placeholders.
- Expire reflog and run `git gc` to remove old objects.
- Force-push the cleaned mirror to GitHub (this step is blocked by GitHub Push Protection if secrets remain in history).
- Rotate all exposed secrets in their provider dashboards and update environment variables.

## Immediate actions you may need to perform in GitHub (push-protection)

If GitHub blocks the force-push with "Push cannot contain secrets", do one of the following (you must have repo admin access):

1) Temporarily disable push protection for this repo:

  - Go to your repository Settings → Code security and analysis → Push protection.
  - Disable push protection or temporarily allow the blocked push.

2) Use the GitHub secret scanning "Unblock" flow for the specific commit:

  - Visit the URL shown in the push error (example: `https://github.com/<owner>/<repo>/security/secret-scanning/unblock-secret/<token>`).
  - Follow the web UI to allow the specific secret then retry the push.

3) If you prefer not to touch repo settings, provide all secrets found in history and I will add them to `replacements.txt` so `git-filter-repo` can replace them all before pushing.

## Rotating keys (after a successful history rewrite)

Rotate these immediately to invalidate exposed secrets:

- Supabase Service Role Key: Project Settings → API → Service Role → Revoke + Generate
- Stripe API keys: Dashboard → Developers → API keys → Rotate/Regenerate secret keys
- Infura / Alchemy keys: Dashboard → API keys → Regenerate
- NFT.Storage token: Regenerate token from nft.storage account
- Paystack / Flutterwave: Regenerate secret keys in their dashboards

After rotation, update environment variables in:

- Local `.env.local` (do NOT commit)
- Hosting platform (Vercel/Netlify/Render/Heroku) — set `SUPABASE_SERVICE_ROLE_KEY` and other secrets in project settings

## Prevent future leaks

- Add `.env.local` and other env files to `.gitignore` (done).
- Use repository secrets or environment variables in hosting rather than committing keys.
- Add a CI check or Git hook to block commits containing sensitive patterns.

## If you'd like me to continue now

Reply with `yes` to: I have repo admin access and approve a temporary force-push. I will then run `git-filter-repo` on a mirror, attempt a force-push, and report any GitHub push protection messages so we can iterate.

If you prefer to handle GitHub push protection yourself, reply with `rotate-only` and I'll stop at preparing `replacements.txt` and instructions for rotating keys.

