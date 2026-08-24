# Laybrotech Admin Dashboard

## Supabase Environment

Create `.env` at the project root, next to `package.json`:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

After changing `.env`, restart the Vite dev server. Frontend environment variables must never use Supabase service-role or secret keys.
