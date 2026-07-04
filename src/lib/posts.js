import { supabase } from './supabase';

const POST_SELECT = '*, profiles:user_id (display_name, avatar_url)';

export async function fetchPosts({ language, country } = {}) {
  let query = supabase.from('posts').select(POST_SELECT).order('created_at', { ascending: false });
  if (language) query = query.eq('language', language);
  if (country) query = query.eq('country', country);
  const { data, error } = await query;
  return { data: data || [], error };
}

export async function fetchPost(postId) {
  const { data, error } = await supabase.from('posts').select(POST_SELECT).eq('id', postId).maybeSingle();
  return { data, error };
}

export async function createPost({ content, country, language }) {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('posts')
    .insert({ user_id: user.id, content, country, language })
    .select(POST_SELECT)
    .single();
  return { data, error };
}

export async function deletePost(postId) {
  const { error } = await supabase.from('posts').delete().eq('id', postId);
  return { error };
}

const REPLY_SELECT = '*, profiles:user_id (display_name, avatar_url)';

export async function fetchReplies(postId) {
  const { data, error } = await supabase
    .from('replies')
    .select(REPLY_SELECT)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });
  return { data: data || [], error };
}

export async function createReply({ postId, content }) {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('replies')
    .insert({ post_id: postId, user_id: user.id, content })
    .select(REPLY_SELECT)
    .single();
  return { data, error };
}

export async function deleteReply(replyId) {
  const { error } = await supabase.from('replies').delete().eq('id', replyId);
  return { error };
}

export async function fetchMyLikedPostIds(postIds) {
  if (!postIds?.length) return { data: [], error: null };
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('post_likes')
    .select('post_id')
    .eq('user_id', user.id)
    .in('post_id', postIds);
  return { data: (data || []).map((r) => r.post_id), error };
}

export async function likePost(postId) {
  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id });
  return { error };
}

export async function unlikePost(postId) {
  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id);
  return { error };
}
