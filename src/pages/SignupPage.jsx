import { useState } from 'react';
import { T } from '../theme';
import { useLang } from '../i18n';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/AuthLayout';
import { Button } from '../components/ui/Button';
import { Input, PasswordInput, Select, Label, ErrorText } from '../components/ui/Field';
import { GoogleIcon } from '../components/Icon';
import { COUNTRIES } from '../lib/countries';
import { isValidEmail, isValidName, isValidPassword } from '../lib/validation';
import { GOOGLE_LOGIN_ENABLED } from '../lib/features';

export function SignupPage({ onNavigate }) {
  const { t, lang } = useLang();
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState('');
  const [language, setLanguage] = useState(lang);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!isValidName(name)) return setError(t('auth.nameRequired'));
    if (!isValidEmail(email)) return setError(t('auth.invalidEmail'));
    if (!isValidPassword(password)) return setError(t('auth.passwordTooShort'));
    if (password !== confirmPassword) return setError(t('auth.passwordMismatch'));

    setBusy(true);
    const { error: err } = await signUpWithEmail({ name: name.trim(), email, password, country: country || null, language });
    setBusy(false);
    if (err) setError(t('auth.signupError'));
    else setDone(true);
  }

  async function handleGoogle() {
    setError('');
    const { error: err } = await signInWithGoogle();
    if (err) setError(t('auth.signupError'));
  }

  if (done) {
    return (
      <AuthLayout>
        <p style={{ fontFamily: T.sans, fontSize: 15, color: T.ink, textAlign: 'center', lineHeight: 1.6 }}>
          {t('auth.confirmEmailSent')}
        </p>
        <Button variant="secondary" style={{ marginTop: 16 }} onClick={() => onNavigate('login')}>{t('auth.backToLogin')}</Button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h1 style={{ fontFamily: T.serif, fontSize: 22, color: T.ink, margin: '0 0 16px' }}>{t('auth.signup')}</h1>

      {GOOGLE_LOGIN_ENABLED && (
        <>
          <Button type="button" variant="outline" onClick={handleGoogle} style={{ marginBottom: 16 }}>
            <GoogleIcon /> {t('auth.continueWithGoogle')}
          </Button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0 16px' }}>
            <div style={{ flex: 1, height: 1, background: T.hair }} />
            <span style={{ fontFamily: T.sans, fontSize: 12, color: T.muted }}>{t('auth.orSignupWithEmail')}</span>
            <div style={{ flex: 1, height: 1, background: T.hair }} />
          </div>
        </>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 14 }}>
          <Label>{t('auth.name')}</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} required />
        </div>
        <div style={{ marginBottom: 14 }}>
          <Label>{t('auth.email')}</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        </div>
        <div style={{ marginBottom: 14 }}>
          <Label>{t('auth.password')}</Label>
          <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required />
        </div>
        <div style={{ marginBottom: 14 }}>
          <Label>{t('auth.confirmPassword')}</Label>
          <PasswordInput value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" required />
        </div>
        <div style={{ marginBottom: 14 }}>
          <Label>{t('auth.country')}</Label>
          <Select value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="">{t('auth.selectCountry')}</option>
            {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c[lang] || c.en}</option>)}
          </Select>
        </div>
        <div style={{ marginBottom: 6 }}>
          <Label>{t('auth.language')}</Label>
          <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="ja">日本語</option>
            <option value="en">English</option>
            <option value="vi">Tiếng Việt</option>
          </Select>
        </div>
        <p style={{ fontFamily: T.sans, fontSize: 12, color: T.muted, margin: '0 0 14px' }}>{t('auth.skipLanguage')}</p>

        <ErrorText>{error}</ErrorText>
        <Button type="submit" disabled={busy} style={{ marginTop: 4 }}>{t('auth.signupButton')}</Button>
      </form>

      <p style={{ textAlign: 'center', fontFamily: T.sans, fontSize: 13, color: T.inkSoft, marginTop: 18 }}>
        {t('auth.haveAccount')}{' '}
        <button type="button" onClick={() => onNavigate('login')} style={{
          background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700,
          fontFamily: T.sans, fontSize: 13, color: T.accentDeep, padding: 0,
        }}>{t('auth.login')}</button>
      </p>
    </AuthLayout>
  );
}
