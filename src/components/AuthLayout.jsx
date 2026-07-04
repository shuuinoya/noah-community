import { T } from '../theme';
import { useLang, SUPPORTED_LANGS } from '../i18n';

const LANG_LABEL = { ja: '日本語', en: 'English', vi: 'Tiếng Việt' };

export function AuthLayout({ children }) {
  const { t, lang, setLang } = useLang();
  return (
    <div style={{
      minHeight: '100dvh', background: T.bg, display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '32px 20px', boxSizing: 'border-box',
    }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: T.serif, fontSize: 34, color: T.ink, letterSpacing: 0.5 }}>{t('app.name')}</span>
            <span style={{
              fontFamily: T.sans, fontSize: 10, fontWeight: 700, letterSpacing: 1,
              color: T.accentDeep, background: T.accentSoft,
              padding: '3px 8px', borderRadius: 999,
            }}>{t('app.badge')}</span>
          </div>
          <p style={{ fontFamily: T.sans, fontSize: 14, color: T.inkSoft, marginTop: 8 }}>{t('app.subtitle')}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 14 }}>
            {SUPPORTED_LANGS.map((l) => (
              <button key={l} onClick={() => setLang(l)} type="button" style={{
                fontFamily: T.sans, fontSize: 12, fontWeight: lang === l ? 700 : 500,
                padding: '6px 10px', borderRadius: 999, cursor: 'pointer',
                border: `1px solid ${lang === l ? T.accent : T.hair}`,
                background: lang === l ? T.accentSoft : 'transparent',
                color: lang === l ? T.accentDeep : T.inkSoft,
              }}>{LANG_LABEL[l]}</button>
            ))}
          </div>
        </div>
        <div style={{
          background: T.bgElevated, borderRadius: 20, padding: 24,
          boxShadow: '0 4px 24px rgba(45,59,78,0.06)', border: `1px solid ${T.hairSoft}`,
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}
