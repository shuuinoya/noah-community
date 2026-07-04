import { useState } from 'react';
import { T } from '../theme';
import { useLang } from '../i18n';
import { useAuth } from '../context/AuthContext';
import { Icon } from './Icon';
import { Avatar } from './Avatar';
import { relativeTime } from '../lib/format';
import { likePost, unlikePost, deletePost } from '../lib/posts';

export function PostCard({ post, liked, onOpenThread, onDeleted, onLikeToggled }) {
  const { t, lang } = useLang();
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const isOwn = user?.id === post.user_id;
  const name = post.profiles?.display_name || '—';

  async function handleLike(e) {
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    const { error } = liked ? await unlikePost(post.id) : await likePost(post.id);
    setBusy(false);
    if (!error) onLikeToggled(post.id, !liked);
  }

  async function handleDelete(e) {
    e.stopPropagation();
    if (!window.confirm(t('feed.deleteConfirm'))) return;
    const { error } = await deletePost(post.id);
    if (!error) onDeleted(post.id);
  }

  return (
    <div
      onClick={() => onOpenThread(post.id)}
      style={{
        display: 'flex', gap: 12, padding: '16px', cursor: 'pointer',
        borderBottom: `1px solid ${T.hairSoft}`, background: T.bgElevated,
      }}
    >
      <Avatar name={name} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 14, color: T.ink }}>{name}</span>
          <span style={{ fontFamily: T.sans, fontSize: 12, color: T.muted }}>{relativeTime(post.created_at, lang, t('feed.justNow'))}</span>
        </div>
        <p style={{
          fontFamily: T.sans, fontSize: 15, color: T.ink, lineHeight: 1.6,
          margin: '6px 0 10px', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
        }}>{post.content}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <button onClick={(e) => { e.stopPropagation(); onOpenThread(post.id); }} style={iconBtnStyle}>
            <Icon name="chat" size={16} /> <span style={countStyle}>{post.reply_count || 0}</span>
          </button>
          <button onClick={handleLike} disabled={busy} style={{ ...iconBtnStyle, color: liked ? T.danger : T.inkSoft }}>
            <Icon name="heart" size={16} fill={liked ? 'currentColor' : 'none'} /> <span style={countStyle}>{post.like_count || 0}</span>
          </button>
          {isOwn && (
            <button onClick={handleDelete} style={{ ...iconBtnStyle, marginLeft: 'auto' }}>
              <Icon name="trash" size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const iconBtnStyle = {
  display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
  cursor: 'pointer', color: '#5B6B82', padding: 4, minHeight: 32,
};
const countStyle = { fontFamily: T.sans, fontSize: 13 };
