import { useCallback, useEffect, useRef, useState } from 'react';
import { T } from '../theme';
import { useLang } from '../i18n';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { fetchPosts, fetchPost, createPost, fetchMyLikedPostIds } from '../lib/posts';
import { Header } from '../components/Header';
import { Composer } from '../components/Composer';
import { PostCard } from '../components/PostCard';
import { Select } from '../components/ui/Field';
import { COUNTRIES } from '../lib/countries';

export function TimelinePage({ onOpenThread, onSettings }) {
  const { t, lang } = useLang();
  const { profile } = useAuth();
  const [posts, setPosts] = useState([]);
  const [likedIds, setLikedIds] = useState(new Set());
  const [languageFilter, setLanguageFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const filtersRef = useRef({ languageFilter, countryFilter });
  filtersRef.current = { languageFilter, countryFilter };

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const { data, error: err } = await fetchPosts({ language: languageFilter || undefined, country: countryFilter || undefined });
    if (err) {
      setError(t('feed.loadError'));
    } else {
      setPosts(data);
      const { data: liked } = await fetchMyLikedPostIds(data.map((p) => p.id));
      setLikedIds(new Set(liked));
    }
    setLoading(false);
  }, [languageFilter, countryFilter, t]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const channel = supabase
      .channel('posts-timeline')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, async (payload) => {
        const { languageFilter: lf, countryFilter: cf } = filtersRef.current;
        if (lf && payload.new.language !== lf) return;
        if (cf && payload.new.country !== cf) return;
        const { data } = await fetchPost(payload.new.id);
        if (data) setPosts((prev) => (prev.some((p) => p.id === data.id) ? prev : [data, ...prev]));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function handlePost(content) {
    const { error: err } = await createPost({ content, country: profile?.country || null, language: profile?.language || lang });
    return { error: err };
  }

  function handleLikeToggled(postId, liked) {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (liked) next.add(postId); else next.delete(postId);
      return next;
    });
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, like_count: Math.max(0, p.like_count + (liked ? 1 : -1)) } : p)));
  }

  function handleDeleted(postId) {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }

  return (
    <div style={{ minHeight: '100dvh', background: T.bg }}>
      <Header onSettings={onSettings} />
      <Composer placeholder={t('feed.placeholder')} submitLabel={t('feed.post')} busyLabel={t('feed.posting')} onSubmit={handlePost} />

      <div style={{ display: 'flex', gap: 8, padding: '10px 16px', background: T.bg }}>
        <Select value={languageFilter} onChange={(e) => setLanguageFilter(e.target.value)} style={{ minHeight: 36, fontSize: 13 }}>
          <option value="">{t('feed.allLanguages')}</option>
          <option value="ja">日本語</option>
          <option value="en">English</option>
          <option value="vi">Tiếng Việt</option>
        </Select>
        <Select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} style={{ minHeight: 36, fontSize: 13 }}>
          <option value="">{t('feed.allCountries')}</option>
          {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c[lang] || c.en}</option>)}
        </Select>
      </div>

      {loading && <p style={{ textAlign: 'center', fontFamily: T.sans, color: T.muted, padding: 24 }}>{t('common.loading')}</p>}
      {error && <p style={{ textAlign: 'center', fontFamily: T.sans, color: T.danger, padding: 24 }}>{error}</p>}
      {!loading && !error && posts.length === 0 && (
        <p style={{ textAlign: 'center', fontFamily: T.sans, color: T.muted, padding: '40px 24px', lineHeight: 1.7 }}>{t('feed.empty')}</p>
      )}
      {!loading && posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          liked={likedIds.has(post.id)}
          onOpenThread={onOpenThread}
          onDeleted={handleDeleted}
          onLikeToggled={handleLikeToggled}
        />
      ))}
    </div>
  );
}
