import { useState } from 'react';
import { T } from '../theme';
import { useLang, SUPPORTED_LANGS } from '../i18n';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';
import { Select, Label, PasswordInput, ErrorText } from '../components/ui/Field';
import { Button } from '../components/ui/Button';
import { isValidPassword } from '../lib/validation';

const LANG_LABEL = { ja: '日本語', en: 'English', vi: 'Tiếng Việt' };

export function SettingsPage({ onBack }) {
  const { t, lang, setLang } = useLang();
  const { profile, updateProfile, updatePassword, signOut } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordBusy, setPasswordBusy] = useState(false);

  async function handleLanguageChange(next) {
    setLang(next);
    await updateProfile({ language: next });
  }

  async function handleLogout() {
    if (window.confirm(t('settings.logoutConfirm'))) await signOut();
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    if (!isValidPassword(newPassword)) return setPasswordError(t('auth.passwordTooShort'));
    if (newPassword !== confirmNewPassword) return setPasswordError(t('auth.passwordMismatch'));
    setPasswordBusy(true);
    const { error } = await updatePassword(newPassword);
    setPasswordBusy(false);
    if (error) setPasswordError(t('auth.signupError'));
    else {
      setPasswordSuccess(t('settings.passwordChanged'));
      setNewPassword('');
      setConfirmNewPassword('');
    }
  }

  return (
    <div style={{ minHeight: '100dvh', background: T.bg }}>
      <Header onBack={onBack} title={t('settings.title')} />
      <div style={{ padding: 16, maxWidth: 480, margin: '0 auto' }}>
        <div style={{ background: T.bgElevated, borderRadius: 16, padding: 16, marginBottom: 16, border: `1px solid ${T.hairSoft}` }}>
          <Label>{t('settings.account')}</Label>
          <p style={{ fontFamily: T.sans, fontSize: 14, color: T.ink, margin: 0 }}>{profile?.display_name}</p>
        </div>

        <div style={{ background: T.bgElevated, borderRadius: 16, padding: 16, marginBottom: 16, border: `1px solid ${T.hairSoft}` }}>
          <Label>{t('settings.changeLanguage')}</Label>
          <Select value={lang} onChange={(e) => handleLanguageChange(e.target.value)}>
            {SUPPORTED_LANGS.map((l) => <option key={l} value={l}>{LANG_LABEL[l]}</option>)}
          </Select>
        </div>

        <form onSubmit={handleChangePassword} style={{ background: T.bgElevated, borderRadius: 16, padding: 16, marginBottom: 16, border: `1px solid ${T.hairSoft}` }}>
          <Label>{t('settings.changePassword')}</Label>
          <div style={{ marginBottom: 10 }}>
            <PasswordInput
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t('settings.newPassword')}
              autoComplete="new-password"
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <PasswordInput
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder={t('settings.confirmNewPassword')}
              autoComplete="new-password"
            />
          </div>
          <ErrorText>{passwordError}</ErrorText>
          {passwordSuccess && <p style={{ fontFamily: T.sans, fontSize: 13, color: T.accentDeep, margin: '6px 0 0' }}>{passwordSuccess}</p>}
          <Button type="submit" variant="secondary" disabled={passwordBusy} style={{ marginTop: 10 }}>
            {t('settings.changePasswordButton')}
          </Button>
        </form>

        <Button variant="danger" onClick={handleLogout}>{t('settings.logout')}</Button>
      </div>
    </div>
  );
}
