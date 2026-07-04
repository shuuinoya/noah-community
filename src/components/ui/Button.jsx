import { T } from '../../theme';

export function Button({ children, variant = 'primary', disabled, style, ...props }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    minHeight: 44, padding: '0 20px', borderRadius: 12,
    fontFamily: T.sans, fontSize: 15, fontWeight: 600,
    border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1, transition: 'opacity .15s, transform .1s',
    width: '100%', boxSizing: 'border-box',
  };
  const variants = {
    primary: { background: T.accent, color: '#fff' },
    secondary: { background: T.accentPale, color: T.accentDeep },
    outline: { background: 'transparent', color: T.ink, border: `1px solid ${T.hair}` },
    danger: { background: T.dangerSoft, color: T.danger },
    ghost: { background: 'transparent', color: T.inkSoft, minHeight: 36, padding: '0 8px' },
  };
  return (
    <button disabled={disabled} style={{ ...base, ...variants[variant], ...style }} {...props}>
      {children}
    </button>
  );
}
