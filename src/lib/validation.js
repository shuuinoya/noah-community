const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email) {
  return EMAIL_RE.test((email || '').trim());
}

export function isValidName(name) {
  const len = (name || '').trim().length;
  return len >= 1 && len <= 40;
}

export function isValidPassword(password) {
  return (password || '').length >= 6;
}

export function isValidPostContent(content) {
  const len = (content || '').trim().length;
  return len >= 1 && len <= 2000;
}
