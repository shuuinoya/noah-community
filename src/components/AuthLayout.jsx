import { T } from '../theme';
import { useLang, SUPPORTED_LANGS } from '../i18n';

const LANG_LABEL = { ja: '日本語', en: 'English', vi: 'Tiếng Việt' };

export function AuthLayout({ children }) {
  const { t, lang, setLang } = useLang();
  return (
    <div style={{
      minHeight: '100dvh',
      background: `linear-gradient(180deg, ${T.accentPale} 0%, ${T.bg} 55%)`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '32px 20px', boxSizing: 'border-box',
    }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', borderRadius: 999,
            border: `1px solid ${T.hair}`, background: T.bgElevated, padding: 3,
          }}>
            {SUPPORTED_LANGS.map((l) => (
              <button key={l} onClick={() => setLang(l)} type="button" style={{
                fontFamily: T.sans, fontSize: 12, fontWeight: lang === l ? 700 : 500,
                padding: '7px 14px', borderRadius: 999, cursor: 'pointer', border: 'none',
                background: lang === l ? T.accent : 'transparent',
                color: lang === l ? '#fff' : T.inkSoft,
                transition: 'background .15s, color .15s',
              }}>{LANG_LABEL[l]}</button>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ flex: 1, maxWidth: 40, height: 1, background: T.muted, opacity: 0.5 }} />
            <span style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 700, letterSpacing: 3, color: T.muted }}>{t('app.name').toUpperCase()}</span>
            <span style={{
              fontFamily: T.sans, fontSize: 9, fontWeight: 700, letterSpacing: 1,
              color: T.accentDeep, background: T.accentSoft, padding: '2px 7px', borderRadius: 999,
            }}>{t('app.badge')}</span>
            <span style={{ flex: 1, maxWidth: 40, height: 1, background: T.muted, opacity: 0.5 }} />
          </div>
          <p style={{
            fontFamily: T.serif, fontStyle: 'italic', fontSize: 28, color: T.accentDeep,
            margin: 0, lineHeight: 1.3,
          }}>{t('app.subtitle')}</p>
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
