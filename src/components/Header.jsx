import { T } from '../theme';
import { useLang } from '../i18n';
import { Icon } from './Icon';

export function Header({ onBack, onSettings, title }) {
  const { t } = useLang();
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 10,
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '14px 16px', background: T.bg,
      borderBottom: `1px solid ${T.hairSoft}`, minHeight: 44, boxSizing: 'border-box',
    }}>
      {onBack ? (
        <button onClick={onBack} style={navBtnStyle} aria-label={t('common.back')}>
          <Icon name="chevronLeft" size={20} />
        </button>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: T.serif, fontSize: 20, color: T.ink }}>{t('app.name')}</span>
          <span style={{
            fontFamily: T.sans, fontSize: 9, fontWeight: 700, letterSpacing: 1,
            color: T.accentDeep, background: T.accentSoft, padding: '2px 7px', borderRadius: 999,
          }}>{t('app.badge')}</span>
        </div>
      )}
      {title && <span style={{ fontFamily: T.sans, fontSize: 16, fontWeight: 700, color: T.ink }}>{title}</span>}
      {onSettings && (
        <button onClick={onSettings} style={{ ...navBtnStyle, marginLeft: 'auto' }} aria-label={t('settings.title')}>
          <Icon name="settings" size={20} />
        </button>
      )}
    </div>
  );
}

const navBtnStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: 44, height: 44, background: 'none', border: 'none', cursor: 'pointer', color: '#2D3B4E',
};
