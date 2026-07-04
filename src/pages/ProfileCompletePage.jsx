import { useState } from 'react';
import { T } from '../theme';
import { useLang } from '../i18n';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/AuthLayout';
import { Button } from '../components/ui/Button';
import { Select, Label, ErrorText } from '../components/ui/Field';
import { COUNTRIES } from '../lib/countries';

export function ProfileCompletePage() {
  const { t, lang } = useLang();
  const { updateProfile, signOut } = useAuth();
  const [country, setCountry] = useState('');
  const [language, setLanguage] = useState(lang);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    setError('');
    if (!country) return setError(t('auth.selectCountry'));
    setBusy(true);
    const { error: err } = await updateProfile({ country, language });
    setBusy(false);
    if (err) setError(t('auth.signupError'));
  }

  async function handleSkip() {
    setBusy(true);
    await updateProfile({ language });
    setBusy(false);
  }

  return (
    <AuthLayout>
      <h1 style={{ fontFamily: T.serif, fontSize: 22, color: T.ink, margin: '0 0 4px' }}>{t('auth.completeProfile')}</h1>
      <p style={{ fontFamily: T.sans, fontSize: 13, color: T.inkSoft, margin: '0 0 20px' }}>{t('auth.completeProfileSubtitle')}</p>

      <form onSubmit={handleSave}>
        <div style={{ marginBottom: 14 }}>
          <Label>{t('auth.country')}</Label>
          <Select value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="">{t('auth.selectCountry')}</option>
            {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c[lang] || c.en}</option>)}
          </Select>
        </div>
        <div style={{ marginBottom: 14 }}>
          <Label>{t('auth.language')}</Label>
          <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="ja">日本語</option>
            <option value="en">English</option>
            <option value="vi">Tiếng Việt</option>
          </Select>
        </div>
        <ErrorText>{error}</ErrorText>
        <Button type="submit" disabled={busy} style={{ marginBottom: 10 }}>{t('auth.save')}</Button>
        <Button type="button" variant="ghost" disabled={busy} onClick={handleSkip}>{t('auth.skip')}</Button>
      </form>

      <Button variant="ghost" style={{ marginTop: 10 }} onClick={signOut}>{t('settings.logout')}</Button>
    </AuthLayout>
  );
}
