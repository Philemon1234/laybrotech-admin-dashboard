const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? '';
const rawSupabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() ?? '';
const rawSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? '';

const supabaseUrl = rawSupabaseUrl.replace(/\/$/, '');
const supabaseKey = rawSupabasePublishableKey || rawSupabaseAnonKey;
const urlLooksValid = /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(supabaseUrl);

const missing = [
  !supabaseUrl ? 'VITE_SUPABASE_URL' : '',
  !supabaseKey ? 'VITE_SUPABASE_PUBLISHABLE_KEY' : '',
].filter(Boolean);

const configError = missing.length > 0 || !urlLooksValid
  ? 'Admin configuration is incomplete. Please restart the development server or check the environment configuration.'
  : '';

export const env = {
  supabaseUrl,
  supabaseKey,
  supabaseConfigStatus: {
    hasUrl: Boolean(supabaseUrl),
    hasKey: Boolean(supabaseKey),
    urlLooksValid,
    missing,
    mode: import.meta.env.MODE,
    usesLegacyAnonKeyFallback: Boolean(!rawSupabasePublishableKey && rawSupabaseAnonKey),
    error: configError,
  },
};

if (import.meta.env.DEV && configError) {
  console.error('[Laybrotech Admin] Supabase configuration issue', {
    hasUrl: env.supabaseConfigStatus.hasUrl,
    hasKey: env.supabaseConfigStatus.hasKey,
    urlLooksValid: env.supabaseConfigStatus.urlLooksValid,
    missing: env.supabaseConfigStatus.missing,
    expected: ['VITE_SUPABASE_URL', 'VITE_SUPABASE_PUBLISHABLE_KEY'],
    legacyKeyFallbackSupported: true,
  });
}
