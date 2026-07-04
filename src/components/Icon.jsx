// Icon set — subset reused from noah-ikuji's ICONS object, plus a few added
// for auth/community (mail, globe, send, logout, google).
const ICONS = {
  home: 'M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-9z',
  chat: 'M4 5h16v10H8l-4 4V5z',
  heart: 'M12 21s-9-6-9-12a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-9 12-9 12z',
  heartFilled: 'M12 21s-9-6-9-12a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-9 12-9 12z',
  person: 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 9a7 7 0 0 1 14 0',
  settings: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0-5v3m0 12v3m9-9h-3M5 12H2m17-7l-2 2M7 17l-2 2m14 0l-2-2M7 7L5 5',
  key: 'M21 7a4 4 0 1 0-5.8 3.6L4 21h3l2-2v-2h2v-2h2l3.2-3.2A4 4 0 0 0 21 7zm-4 0a1 1 0 1 0 0-0.01z',
  chevronLeft: 'M15 18l-6-6 6-6',
  chevronRight: 'M9 6l6 6-6 6',
  chevronDown: 'M6 9l6 6 6-6',
  close: 'M5 5l14 14M19 5L5 19',
  check: 'M4 12l5 5L20 6',
  plus: 'M12 5v14M5 12h14',
  trash: 'M3 6h18m-2 0v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6m3-3h6',
  edit: 'M4 20h4L18 6a1.5 1.5 0 0 0-4-4L4 16v4zm12-16l4 4',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
  search: 'M21 21l-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z',
  sparkles: 'M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z',
  warning: 'M12 3l10 17H2L12 3zm0 7v5m0 3v0.1',
  mail: 'M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm0 0l8 7 8-7',
  globe: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm-8 8h16M12 4a11 11 0 0 1 0 16M12 4a11 11 0 0 0 0 16',
  send: 'M3 12l18-8-6 18-3-7-9-3z',
  logout: 'M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4m5-4l4-4-4-4m4 4H9',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  eyeOff: 'M3 3l18 18M10.6 10.6a3 3 0 0 0 4.24 4.24M7.4 7.5C4.9 9 3 12 3 12s4 7 10 7c1.6 0 3-.4 4.2-1.1M17.4 17.4C19.7 15.8 21 12 21 12s-1.1-2-3-3.6M9.9 5.2A10.4 10.4 0 0 1 12 5c6 0 10 7 10 7a17.9 17.9 0 0 1-2 2.7',
};

export function Icon({ name, size = 18, stroke = 1.5, fill = 'none', style }) {
  const d = ICONS[name];
  if (!d) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
      stroke="currentColor" strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
      aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export function GoogleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }} aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.3 35.4 26.8 36 24 36c-5.3 0-9.7-3.1-11.3-7.6l-6.5 5C9.6 39.6 16.3 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.3 5.3C39.8 37.1 44 31.4 44 24c0-1.3-.1-2.7-.4-3.5z"/>
    </svg>
  );
}
