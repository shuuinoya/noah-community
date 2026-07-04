import { useEffect, useState } from 'react';
import { T } from './theme';
import { LangProvider, useLang } from './i18n';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { ProfileCompletePage } from './pages/ProfileCompletePage';
import { SettingsPage } from './pages/SettingsPage';
import { TimelinePage } from './pages/TimelinePage';
import { ThreadPage } from './pages/ThreadPage';

function LoadingScreen() {
  const { t } = useLang();
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.bg }}>
      <p style={{ fontFamily: T.sans, color: T.muted }}>{t('common.loading')}</p>
    </div>
  );
}

function AuthenticatedApp() {
  const [view, setView] = useState({ name: 'timeline' });

  if (view.name === 'settings') {
    return <SettingsPage onBack={() => setView({ name: 'timeline' })} />;
  }
  if (view.name === 'thread') {
    return <ThreadPage postId={view.postId} onBack={() => setView({ name: 'timeline' })} />;
  }
  return (
    <TimelinePage
      onOpenThread={(postId) => setView({ name: 'thread', postId })}
      onSettings={() => setView({ name: 'settings' })}
    />
  );
}

function UnauthenticatedApp() {
  const [view, setView] = useState('login');
  if (view === 'signup') return <SignupPage onNavigate={setView} />;
  if (view === 'forgotPassword') return <ForgotPasswordPage onNavigate={setView} />;
  return <LoginPage onNavigate={setView} />;
}

function Root() {
  const { loading, session, profile, recoveryMode } = useAuth();

  useEffect(() => {
    if (window.location.pathname === '/auth/callback' && !loading) {
      window.history.replaceState(null, '', '/');
    }
  }, [loading]);

  if (loading) return <LoadingScreen />;
  if (recoveryMode) return <ResetPasswordPage />;
  if (!session) return <UnauthenticatedApp />;
  if (!profile?.country) return <ProfileCompletePage />;
  return <AuthenticatedApp />;
}

export default function App() {
  return (
    <LangProvider>
      <AuthProvider>
        <Root />
      </AuthProvider>
    </LangProvider>
  );
}
