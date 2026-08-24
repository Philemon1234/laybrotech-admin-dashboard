import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { env } from './env';

export const supabaseConfigStatus = env.supabaseConfigStatus;
export const supabaseConfigError = supabaseConfigStatus.error;
export const isSupabaseConfigured = !supabaseConfigError;

const unavailableSupabase = new Proxy({}, {
  get() {
    throw new Error(supabaseConfigError || 'Supabase configuration is incomplete.');
  },
}) as SupabaseClient;

export const supabase = isSupabaseConfigured ? createClient(
  env.supabaseUrl,
  env.supabaseKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storageKey: 'laybrotech-admin-auth',
    },
  },
) : unavailableSupabase;
