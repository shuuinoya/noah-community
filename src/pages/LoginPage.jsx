import { useState } from 'react';
import { T } from '../theme';
import { useLang } from '../i18n';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/AuthLayout';
import { Button } from '../components/ui/Button';
import { Input, Label, ErrorText } from '../components/ui/Field';
import { GoogleIcon } from '../components/Icon';
import { isValidEmail } from '../lib/validation';

export function LoginPage({ onNavigate }) {
  const { t } = useLang();
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!isValidEmail(email)) return setError(t('auth.invalidEmail'));
    setBusy(true);
    const { error: err } = await signInWithEmail({ email, password });
    setBusy(false);
    if (err) setError(t('auth.loginError'));
  }

  async function handleGoogle() {
    setError('');
    const { error: err } = await signInWithGoogle();
    if (err) setError(t('auth.loginError'));
  }

  return (
    <AuthLayout>
      <h1 style={{ fontFamily: T.serif, fontSize: 22, color: T.ink, margin: '0 0 4px' }}>{t('auth.welcome')}</h1>
      <p style={{ fontFamily: T.sans, fontSize: 13, color: T.inkSoft, margin: '0 0 20px' }}>{t('auth.welcomeSubtitle')}</p>

      <Button type="button" variant="outline" onClick={handleGoogle} style={{ marginBottom: 16 }}>
        <GoogleIcon /> {t('auth.continueWithGoogle')}
      </Button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0 16px' }}>
        <div style={{ flex: 1, height: 1, background: T.hair }} />
        <span style={{ fontFamily: T.sans, fontSize: 12, color: T.muted }}>{t('auth.orLoginWithEmail')}</span>
        <div style={{ flex: 1, height: 1, background: T.hair }} />
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 14 }}>
          <Label>{t('auth.email')}</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        </div>
        <div style={{ marginBottom: 8 }}>
          <Label>{t('auth.password')}</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </div>
        <div style={{ textAlign: 'right', marginBottom: 14 }}>
          <button type="button" onClick={() => onNavigate('forgotPassword')} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: T.sans, fontSize: 13, color: T.accentDeep, padding: 0,
          }}>{t('auth.forgotPassword')}</button>
        </div>
        <ErrorText>{error}</ErrorText>
        <Button type="submit" disabled={busy} style={{ marginTop: 10 }}>{t('auth.loginButton')}</Button>
      </form>

      <p style={{ textAlign: 'center', fontFamily: T.sans, fontSize: 13, color: T.inkSoft, marginTop: 18 }}>
        {t('auth.noAccount')}{' '}
        <button type="button" onClick={() => onNavigate('signup')} style={{
          background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700,
          fontFamily: T.sans, fontSize: 13, color: T.accentDeep, padding: 0,
        }}>{t('auth.signup')}</button>
      </p>
    </AuthLayout>
  );
}
