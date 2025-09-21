import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Session, User, AuthError, SignUpWithPasswordCredentials } from '@supabase/supabase-js';
import { supabase } from '../../../services/supabaseClient';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (credentials: SignUpWithPasswordCredentials) => Promise<{ user: User | null; error: AuthError | null; }>;
  signInWithPassword: (credentials: SignUpWithPasswordCredentials) => Promise<{ session: Session | null; error: AuthError | null; }>;
  signOut: () => Promise<{ error: AuthError | null; }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (credentials: SignUpWithPasswordCredentials) => {
    const { data, error } = await supabase.auth.signUp(credentials);
    return { user: data.user, error };
  };

  const signInWithPassword = async (credentials: SignUpWithPasswordCredentials) => {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    return { session: data.session, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signInWithPassword,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
