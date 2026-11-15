import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

export interface AuthUser {
  id: string;
  name: string;
  avatarUrl: string | null;
}

interface AuthState {
  enabled: boolean;
  loading: boolean;
  user: AuthUser | null;
  signIn: () => Promise<string | null>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthState>({
  enabled: false,
  loading: false,
  user: null,
  signIn: async () => null,
  signOut: async () => {},
});

function toUser(s: Session | null): AuthUser | null {
  if (!s) return null;
  const m = s.user.user_metadata as Record<string, unknown>;
  const pick = (k: string): string | null => (typeof m[k] === 'string' ? (m[k] as string) : null);
  return {
    id: s.user.id,
    name: pick('full_name') ?? pick('name') ?? pick('user_name') ?? 'Anggota',
    avatarUrl: pick('avatar_url') ?? pick('picture'),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(supabase !== null);

  useEffect(() => {
    if (!supabase) return undefined;
    supabase.auth
      .getSession()
      .then(({ data }) => setSession(data.session))
      .catch(() => setSession(null))
      .finally(() => setLoading(false));
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      enabled: supabase !== null,
      loading,
      user: toUser(session),
      signIn: async () => {
        if (!supabase) return 'Login belum dikonfigurasi.';
        const { error } = await supabase.auth.signInWithOAuth({ provider: 'discord', options: { redirectTo: window.location.origin } });
        return error ? error.message : null;
      },
      signOut: async () => {
        if (supabase) await supabase.auth.signOut();
      },
    }),
    [session, loading],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = (): AuthState => useContext(Ctx);
