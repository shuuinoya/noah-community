import { useState } from 'react';
import { T } from '../theme';
import { useLang } from '../i18n';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/AuthLayout';
import { Button } from '../components/ui/Button';
import { Input, Label, ErrorText } from '../components/ui/Field';
import { isValidEmail } from '../lib/validation';

export function ForgotPasswordPage({ onNavigate }) {
  const { t } = useLang();
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!isValidEmail(email)) return setError(t('auth.invalidEmail'));
    setBusy(true);
    const { error: err } = await sendPasswordReset(email);
    setBusy(false);
    if (err) setError(t('auth.resetError'));
    else setSent(true);
  }

  return (
    <AuthLayout>
      <h1 style={{ fontFamily: T.serif, fontSize: 22, color: T.ink, margin: '0 0 16px' }}>{t('auth.resetPasswordTitle')}</h1>
      {sent ? (
        <p style={{ fontFamily: T.sans, fontSize: 15, color: T.ink, lineHeight: 1.6 }}>{t('auth.resetSent')}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <Label>{t('auth.email')}</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          </div>
          <ErrorText>{error}</ErrorText>
          <Button type="submit" disabled={busy}>{t('auth.resetPasswordButton')}</Button>
        </form>
      )}
      <Button variant="ghost" style={{ marginTop: 14 }} onClick={() => onNavigate('login')}>{t('auth.backToLogin')}</Button>
    </AuthLayout>
  );
}
