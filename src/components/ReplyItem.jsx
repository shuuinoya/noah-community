import { T } from '../theme';
import { useLang } from '../i18n';
import { useAuth } from '../context/AuthContext';
import { Icon } from './Icon';
import { Avatar } from './Avatar';
import { relativeTime } from '../lib/format';
import { deleteReply } from '../lib/posts';

export function ReplyItem({ reply, onDeleted }) {
  const { t, lang } = useLang();
  const { user } = useAuth();
  const isOwn = user?.id === reply.user_id;
  const name = reply.profiles?.display_name || '—';

  async function handleDelete() {
    if (!window.confirm(t('feed.deleteReplyConfirm'))) return;
    const { error } = await deleteReply(reply.id);
    if (!error) onDeleted(reply.id);
  }

  return (
    <div style={{ display: 'flex', gap: 10, padding: '12px 16px', borderBottom: `1px solid ${T.hairSoft}` }}>
      <Avatar name={name} size={32} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 13, color: T.ink }}>{name}</span>
          <span style={{ fontFamily: T.sans, fontSize: 11, color: T.muted }}>{relativeTime(reply.created_at, lang, t('feed.justNow'))}</span>
          {isOwn && (
            <button onClick={handleDelete} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: T.muted, padding: 4 }}>
              <Icon name="trash" size={14} />
            </button>
          )}
        </div>
        <p style={{ fontFamily: T.sans, fontSize: 14, color: T.ink, lineHeight: 1.6, margin: '4px 0 0', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {reply.content}
        </p>
      </div>
    </div>
  );
}
