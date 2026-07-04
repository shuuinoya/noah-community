import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useLang } from '../i18n';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { setLang } = useLang();
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recoveryMode, setRecoveryMode] = useState(false);

  const loadProfile = useCallback(async (userId) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    setProfile(data || null);
    if (data?.language) setLang(data.language);
    return data;
  }, [setLang]);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      if (data.session) await loadProfile(data.session.user.id);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!active) return;
      setSession(newSession);
      if (event === 'PASSWORD_RECOVERY') setRecoveryMode(true);
      if (newSession) {
        await loadProfile(newSession.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signUpWithEmail = useCallback(async ({ name, email, password, country, language }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: name, country, language } },
    });
    return { error };
  }, []);

  const signInWithEmail = useCallback(async ({ email, password }) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    return { error };
  }, []);

  const sendPasswordReset = useCallback(async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });
    return { error };
  }, []);

  const updatePassword = useCallback(async (password) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (!error) setRecoveryMode(false);
    return { error };
  }, []);

  const updateProfile = useCallback(async (patch) => {
    if (!session) return { error: new Error('Not signed in') };
    const { data, error } = await supabase
      .from('profiles')
      .update(patch)
      .eq('id', session.user.id)
      .select()
      .maybeSingle();
    if (!error && data) {
      setProfile(data);
      if (patch.language) setLang(patch.language);
    }
    return { error };
  }, [session, setLang]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
  }, []);

  const value = useMemo(() => ({
    session,
    user: session?.user || null,
    profile,
    loading,
    recoveryMode,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    sendPasswordReset,
    updatePassword,
    updateProfile,
    signOut,
  }), [session, profile, loading, recoveryMode, signUpWithEmail, signInWithEmail, signInWithGoogle, sendPasswordReset, updatePassword, updateProfile, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
