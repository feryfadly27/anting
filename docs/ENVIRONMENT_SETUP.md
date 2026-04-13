# Environment Variables Setup

## Required Environment Variables

This project requires Supabase credentials to be configured in your `.env` file.

### For Development

Create a `.env` file in the root directory with the following variables:

```bash
# Server-side only (loaders/actions)
SUPABASE_PROJECT_URL=https://your-project-id.supabase.co
SUPABASE_API_KEY=your_anon_key_here

# Client-side (browser) - Required for client-side database calls
# ⚠️ IMPORTANT: Only use the PUBLIC anon key here, never service role key!
VITE_SUPABASE_PROJECT_URL=https://your-project-id.supabase.co
VITE_SUPABASE_API_KEY=your_anon_key_here
```

### How to Get Your Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following values:
   - **Project URL** → Use for both `SUPABASE_PROJECT_URL` and `VITE_SUPABASE_PROJECT_URL`
   - **Anon/Public Key** → Use for both `SUPABASE_API_KEY` and `VITE_SUPABASE_API_KEY`

### Security Notes

- **NEVER** use the `service_role` key in client-side variables (VITE_*)
- The `VITE_*` prefixed variables are **publicly accessible** in the browser
- Only use the public `anon` key for client-side access
- Server-side variables (without VITE_ prefix) can use either anon or service role key
- Enable Row Level Security (RLS) on all Supabase tables to protect your data

### Why Two Sets of Variables?

- **Server-side** (`SUPABASE_*`): Used in loaders/actions (Node.js environment)
- **Client-side** (`VITE_SUPABASE_*`): Used in React components (browser environment)

The app automatically detects the environment and uses the appropriate credentials:
- In loaders/actions → uses `process.env.SUPABASE_*`
- In components → uses `import.meta.env.VITE_SUPABASE_*`

### Troubleshooting

**Error: `process is not defined`**
- You're missing the `VITE_*` prefixed environment variables
- Make sure you have both sets of variables configured

**Error: `Error loading route module`**
- Check that your `.env` file exists in the root directory
- Restart the development server after adding environment variables

**Database connection fails**
- Verify your credentials are correct
- Check that your Supabase project is active
- Ensure RLS policies allow the operations you're trying to perform
