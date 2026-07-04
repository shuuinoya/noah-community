export function relativeTime(dateStr, lang, justNowLabel) {
  const date = new Date(dateStr);
  const diffSec = Math.round((date.getTime() - Date.now()) / 1000);
  if (Math.abs(diffSec) < 60) return justNowLabel;

  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });
  const divisions = [
    { amount: 60, unit: 'minute' },
    { amount: 24, unit: 'hour' },
    { amount: 7, unit: 'day' },
    { amount: 4.34524, unit: 'week' },
    { amount: 12, unit: 'month' },
    { amount: Infinity, unit: 'year' },
  ];
  let duration = diffSec / 60;
  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) return rtf.format(Math.round(duration), division.unit);
    duration /= division.amount;
  }
  return rtf.format(Math.round(duration), 'year');
}
