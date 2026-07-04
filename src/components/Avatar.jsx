import { T } from '../theme';

export function Avatar({ name, size = 40 }) {
  const initial = (name || '?').trim().charAt(0).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: T.accentSoft, color: T.accentDeep,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: T.sans, fontWeight: 700, fontSize: size * 0.42,
      flexShrink: 0,
    }}>
      {initial}
    </div>
  );
}
