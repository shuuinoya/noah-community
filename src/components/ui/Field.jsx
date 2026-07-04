import { T } from '../../theme';

const baseStyle = {
  width: '100%', boxSizing: 'border-box', minHeight: 44,
  padding: '10px 14px', borderRadius: 12,
  border: `1px solid ${T.hair}`, background: T.bgElevated,
  fontFamily: T.sans, fontSize: 15, color: T.ink, outline: 'none',
};

export function Input({ style, ...props }) {
  return <input style={{ ...baseStyle, ...style }} {...props} />;
}

export function Select({ style, children, ...props }) {
  return <select style={{ ...baseStyle, ...style }} {...props}>{children}</select>;
}

export function TextArea({ style, ...props }) {
  return <textarea style={{ ...baseStyle, minHeight: 88, resize: 'vertical', lineHeight: 1.5, ...style }} {...props} />;
}

export function Label({ children }) {
  return <label style={{ display: 'block', fontFamily: T.sans, fontSize: 13, color: T.inkSoft, marginBottom: 6, fontWeight: 600 }}>{children}</label>;
}

export function ErrorText({ children }) {
  if (!children) return null;
  return <p style={{ fontFamily: T.sans, fontSize: 13, color: T.danger, margin: '6px 0 0' }}>{children}</p>;
}
