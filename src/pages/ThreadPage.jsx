import { useEffect, useRef, useState } from 'react';
import { T } from '../theme';
import { useLang } from '../i18n';
import { supabase } from '../lib/supabase';
import { fetchPost, fetchReplies, fetchReply, createReply, fetchMyLikedPostIds } from '../lib/posts';
import { Header } from '../components/Header';
import { Composer } from '../components/Composer';
import { PostCard } from '../components/PostCard';
import { ReplyItem } from '../components/ReplyItem';

export function ThreadPage({ postId, onBack }) {
  const { t } = useLang();
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError('');
      const [{ data: p, error: pErr }, { data: r, error: rErr }] = await Promise.all([
        fetchPost(postId),
        fetchReplies(postId),
      ]);
      if (!active) return;
      if (pErr || rErr) { setError(t('feed.loadError')); setLoading(false); return; }
      setPost(p);
      setReplies(r);
      const { data: likedIds } = await fetchMyLikedPostIds([postId]);
      if (active) setLiked(likedIds.includes(postId));
      setLoading(false);
    })();
    return () => { active = false; };
  }, [postId, t]);

  useEffect(() => {
    const channel = supabase
      .channel(`thread-${postId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'replies', filter: `post_id=eq.${postId}` }, async (payload) => {
        const { data } = await fetchReply(payload.new.id);
        if (!data) return;
        setReplies((prev) => (prev.some((r) => r.id === data.id) ? prev : [...prev, data]));
        setPost((prev) => (prev ? { ...prev, reply_count: (prev.reply_count || 0) + 1 } : prev));
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [postId]);

  async function handleReply(content) {
    const { error: err } = await createReply({ postId, content });
    return { error: err };
  }

  function handleReplyDeleted(replyId) {
    setReplies((prev) => prev.filter((r) => r.id !== replyId));
    setPost((prev) => (prev ? { ...prev, reply_count: Math.max(0, (prev.reply_count || 0) - 1) } : prev));
  }

  function noop() {}

  function handleLikeToggled(_postId, nextLiked) {
    setLiked(nextLiked);
    setPost((prev) => (prev ? { ...prev, like_count: Math.max(0, prev.like_count + (nextLiked ? 1 : -1)) } : prev));
  }

  return (
    <div style={{ minHeight: '100dvh', background: T.bg, display: 'flex', flexDirection: 'column' }}>
      <Header onBack={onBack} title={t('feed.replies')} />

      {loading && <p style={{ textAlign: 'center', fontFamily: T.sans, color: T.muted, padding: 24 }}>{t('common.loading')}</p>}
      {error && <p style={{ textAlign: 'center', fontFamily: T.sans, color: T.danger, padding: 24 }}>{error}</p>}

      {!loading && !error && post && (
        <>
          <PostCard post={post} liked={liked} onOpenThread={noop} onDeleted={onBack} onLikeToggled={handleLikeToggled} />
          <div style={{ flex: 1 }}>
            {replies.map((reply) => (
              <ReplyItem key={reply.id} reply={reply} onDeleted={handleReplyDeleted} />
            ))}
            <div ref={bottomRef} />
          </div>
          <Composer placeholder={t('feed.replyPlaceholder')} submitLabel={t('feed.send')} busyLabel={t('feed.posting')} onSubmit={handleReply} fixed />
        </>
      )}
    </div>
  );
}
