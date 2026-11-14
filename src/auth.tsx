import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { Session, SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null;

export interface AuthUser {
  name: string;
  avatarUrl: string | null;
}

interface AuthState {
  enabled: boolean;
  loading: boolean;
  user: AuthUser | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthState>({
  enabled: false,
  loading: false,
  user: null,
  signIn: async () => {},
  signOut: async () => {},
});

function toUser(s: Session | null): AuthUser | null {
  if (!s) return null;
  const m = s.user.user_metadata as Record<string, unknown>;
  const pick = (k: string): string | null => (typeof m[k] === 'string' ? (m[k] as string) : null);
  return {
    name: pick('full_name') ?? pick('name') ?? pick('user_name') ?? 'Pengguna',
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
        if (supabase) await supabase.auth.signInWithOAuth({ provider: 'discord', options: { redirectTo: window.location.origin } });
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
