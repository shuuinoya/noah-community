import { useState } from 'react';
import { T } from '../theme';
import { useLang } from '../i18n';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/AuthLayout';
import { Button } from '../components/ui/Button';
import { Input, Label, ErrorText } from '../components/ui/Field';
import { isValidPassword } from '../lib/validation';

export function ResetPasswordPage() {
  const { t } = useLang();
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!isValidPassword(password)) return setError(t('auth.passwordTooShort'));
    if (password !== confirmPassword) return setError(t('auth.passwordMismatch'));
    setBusy(true);
    const { error: err } = await updatePassword(password);
    setBusy(false);
    if (err) setError(t('auth.signupError'));
    else setDone(true);
  }

  return (
    <AuthLayout>
      <h1 style={{ fontFamily: T.serif, fontSize: 22, color: T.ink, margin: '0 0 16px' }}>{t('auth.resetPasswordTitle')}</h1>
      {done ? (
        <p style={{ fontFamily: T.sans, fontSize: 15, color: T.ink, lineHeight: 1.6 }}>{t('common.confirm')}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <Label>{t('auth.password')}</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required />
          </div>
          <div style={{ marginBottom: 14 }}>
            <Label>{t('auth.confirmPassword')}</Label>
            <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" required />
          </div>
          <ErrorText>{error}</ErrorText>
          <Button type="submit" disabled={busy}>{t('auth.save')}</Button>
        </form>
      )}
    </AuthLayout>
  );
}
