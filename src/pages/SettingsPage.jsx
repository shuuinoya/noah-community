import { T } from '../theme';
import { useLang, SUPPORTED_LANGS } from '../i18n';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';
import { Select, Label } from '../components/ui/Field';
import { Button } from '../components/ui/Button';

const LANG_LABEL = { ja: '日本語', en: 'English', vi: 'Tiếng Việt' };

export function SettingsPage({ onBack }) {
  const { t, lang, setLang } = useLang();
  const { profile, updateProfile, signOut } = useAuth();

  async function handleLanguageChange(next) {
    setLang(next);
    await updateProfile({ language: next });
  }

  async function handleLogout() {
    if (window.confirm(t('settings.logoutConfirm'))) await signOut();
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

        <Button variant="danger" onClick={handleLogout}>{t('settings.logout')}</Button>
      </div>
    </div>
  );
}
