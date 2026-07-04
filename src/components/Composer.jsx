import { useState } from 'react';
import { T } from '../theme';
import { useLang } from '../i18n';
import { TextArea } from './ui/Field';
import { Button } from './ui/Button';
import { isValidPostContent } from '../lib/validation';

export function Composer({ placeholder, submitLabel, busyLabel, onSubmit, fixed }) {
  const { t } = useLang();
  const [content, setContent] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (busy) return;
    if (!isValidPostContent(content)) {
      setError(content.trim() ? t('feed.charLimit') : t('feed.emptyPost'));
      return;
    }
    setError('');
    setBusy(true);
    const { error: err } = await onSubmit(content.trim());
    setBusy(false);
    if (err) setError(t('common.loadError'));
    else setContent('');
  }

  return (
    <div style={{
      padding: 16, background: T.bgElevated, borderBottom: `1px solid ${T.hairSoft}`,
      ...(fixed ? { position: 'sticky', bottom: 0, borderTop: `1px solid ${T.hairSoft}`, boxShadow: '0 -2px 12px rgba(45,59,78,0.05)' } : {}),
    }}>
      <TextArea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        maxLength={2000}
        disabled={busy}
      />
      {error && <p style={{ fontFamily: T.sans, fontSize: 12, color: T.danger, margin: '6px 0 0' }}>{error}</p>}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
        <Button onClick={handleSubmit} disabled={busy || !content.trim()} style={{ width: 'auto', padding: '0 24px' }}>
          {busy ? busyLabel : submitLabel}
        </Button>
      </div>
    </div>
  );
}
