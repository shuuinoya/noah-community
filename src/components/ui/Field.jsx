import { useState } from 'react';
import { T } from '../../theme';
import { Icon } from '../Icon';

const baseStyle = {
  width: '100%', boxSizing: 'border-box', minHeight: 44,
  padding: '10px 14px', borderRadius: 12,
  border: `1px solid ${T.hair}`, background: T.bgElevated,
  fontFamily: T.sans, fontSize: 15, color: T.ink, outline: 'none',
};

export function Input({ style, ...props }) {
  return <input style={{ ...baseStyle, ...style }} {...props} />;
}

export function PasswordInput({ style, ...props }) {
  const [visible, setVisible] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <input
        type={visible ? 'text' : 'password'}
        style={{ ...baseStyle, paddingRight: 44, ...style }}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        style={{
          position: 'absolute', right: 4, top: 0, bottom: 0, width: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'none', border: 'none', cursor: 'pointer', color: T.muted,
        }}
      >
        <Icon name={visible ? 'eyeOff' : 'eye'} size={18} />
      </button>
    </div>
  );
}

export function Select({ style, children, ...props }) {
  return <select style={{ ...baseStyle, ...style }} {...props}>{children}</select>;
}

export function TextArea({ style, ...props }) {
  return <textarea style={{ ...baseStyle, minHeight: 88, resize: 'vertical', lineHeight: 1.5, ...style }} {...props} />;
}

export function Label({ children }) {
  return (
    <label style={{
      display: 'block', fontFamily: T.sans, fontSize: 11, color: T.muted,
      marginBottom: 8, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase',
    }}>{children}</label>
  );
}

export function ErrorText({ children }) {
  if (!children) return null;
  return <p style={{ fontFamily: T.sans, fontSize: 13, color: T.danger, margin: '6px 0 0' }}>{children}</p>;
}
