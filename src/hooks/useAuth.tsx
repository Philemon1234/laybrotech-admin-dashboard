import { type Session, type User } from '@supabase/supabase-js';
import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { supabase, supabaseConfigError } from '../lib/supabase';

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function cleanAuthError(message: string) {
  if (/email not confirmed/i.test(message)) return 'Email not confirmed. Confirm this admin user in Supabase Authentication, then try again.';
  if (/invalid login credentials/i.test(message)) return 'Invalid login credentials. Check the admin email and password in Supabase Authentication.';
  if (/failed to fetch|network/i.test(message)) return 'Network request failed. Check the Supabase project URL and your connection.';
  return message || 'Unexpected authentication error.';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(!supabaseConfigError);

  const applySession = useCallback(async (nextSession: Session | null) => {
    if (!nextSession) {
      setSession(null);
      setIsAdmin(false);
      return false;
    }

    const { data: allowed, error: adminError } = await supabase.rpc('is_blog_admin');
    if (adminError) {
      console.error('Unable to verify blog admin access:', adminError.message);
      setSession(null);
      setIsAdmin(false);
      return false;
    }

    if (allowed !== true) {
      setSession(null);
      setIsAdmin(false);
      return false;
    }

    const { error: readError } = await supabase.from('blog_categories').select('id', { head: true, count: 'exact' });
    if (readError) {
      console.error('Unable to verify blog data access:', readError.message);
      setSession(null);
      setIsAdmin(false);
      return false;
    }

    setSession(nextSession);
    setIsAdmin(true);
    return true;
  }, []);

  const refreshSession = useCallback(async () => {
    if (supabaseConfigError) {
      setSession(null);
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      await applySession(data.session);
    } catch (error) {
      console.error('Unable to load Supabase session:', error);
      setSession(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, [applySession]);

  useEffect(() => {
    if (supabaseConfigError) {
      setSession(null);
      setIsAdmin(false);
      setLoading(false);
      return undefined;
    }

    void refreshSession();

    const { data: listener } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (event === 'SIGNED_OUT') {
        setSession(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      void applySession(nextSession).finally(() => setLoading(false));
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [applySession, refreshSession]);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    user: session?.user ?? null,
    isAdmin,
    loading,
    async signIn(email, password) {
      if (supabaseConfigError) return { error: supabaseConfigError };

      setLoading(true);
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { error: cleanAuthError(error.message) };

        const authorized = await applySession(data.session);
        if (!authorized) {
          await supabase.auth.signOut();
          return { error: 'This account is not authorized for the Laybrotech blog dashboard, or the Supabase blog setup has not been run.' };
        }

        return { error: null };
      } catch (error) {
        const message = error instanceof Error ? error.message : '';
        return { error: cleanAuthError(message) };
      } finally {
        setLoading(false);
      }
    },
    async signOut() {
      if (supabaseConfigError) return;
      await supabase.auth.signOut();
      setSession(null);
      setIsAdmin(false);
    },
  }), [applySession, session, isAdmin, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}

