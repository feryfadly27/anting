import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_API_KEY || "";

console.log('🔍 Supabase Client Init:', {
  url: supabaseUrl || '❌ MISSING',
  key: supabaseAnonKey ? '✅ Found' : '❌ MISSING',
  env: import.meta.env.MODE,
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase credentials missing! Check your .env file.");
  console.error("Required: VITE_SUPABASE_PROJECT_URL and VITE_SUPABASE_API_KEY");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
