import { useEffect, useState } from 'react';
import { Heart, MessageCircle, Eye, X, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface GalleryPost {
  id: string;
  title: string;
  description: string | null;
  like_count: number;
  comment_count: number;
  view_count: number;
  created_at: string;
  poster: {
    image_url: string;
    track_name: string;
    realm_type: string;
    dna_seed: string;
  };
  profile: {
    display_name: string;
    username: string;
  };
  user_has_liked?: boolean;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profile: {
    display_name: string;
    username: string;
  };
}

export function Gallery() {
  const [posts, setPosts] = useState<GalleryPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<GalleryPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [sendingComment, setSendingComment] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadGallery();
  }, [user]);

  const loadGallery = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_posts')
        .select(`
          id,
          title,
          description,
          like_count,
          comment_count,
          view_count,
          created_at,
          poster:generated_posters(image_url, track_name, realm_type, dna_seed),
          profile:user_profiles(display_name, username)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      if (user) {
        const postIds = data?.map(p => p.id) || [];
        const { data: likesData } = await supabase
          .from('post_likes')
          .select('post_id')
          .in('post_id', postIds)
          .eq('user_id', user.id);

        const likedPostIds = new Set(likesData?.map(l => l.post_id) || []);

        setPosts(
          data?.map(post => ({
            ...post,
            user_has_liked: likedPostIds.has(post.id),
          })) || []
        );
      } else {
        setPosts(data || []);
      }
    } catch (error) {
      console.error('Error loading gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (post: GalleryPost) => {
    if (!user) return;

    try {
      if (post.user_has_liked) {
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', user.id);

        setPosts(posts.map(p =>
          p.id === post.id
            ? { ...p, like_count: p.like_count - 1, user_has_liked: false }
            : p
        ));
      } else {
        await supabase.from('post_likes').insert({
          post_id: post.id,
          user_id: user.id,
        });

        setPosts(posts.map(p =>
          p.id === post.id
            ? { ...p, like_count: p.like_count + 1, user_has_liked: true }
            : p
        ));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const openPost = async (post: GalleryPost) => {
    setSelectedPost(post);
    loadComments(post.id);

    await supabase
      .from('gallery_posts')
      .update({ view_count: post.view_count + 1 })
      .eq('id', post.id);
  };

  const loadComments = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .select(`
          id,
          content,
          created_at,
          profile:user_profiles(display_name, username)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const sendComment = async () => {
    if (!user || !selectedPost || !newComment.trim()) return;

    setSendingComment(true);
    try {
      const { error } = await supabase.from('post_comments').insert({
        post_id: selectedPost.id,
        user_id: user.id,
        content: newComment.trim(),
      });

      if (error) throw error;

      setNewComment('');
      loadComments(selectedPost.id);
    } catch (error) {
      console.error('Error sending comment:', error);
    } finally {
      setSendingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-400 text-xl font-mono">LOADING GALLERY...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 text-transparent bg-clip-text">
          COMMUNITY GALLERY
        </h1>
        <p className="text-zinc-400 mb-8">Explore creations from the multiverse</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-zinc-900 border border-cyan-500/20 rounded-lg overflow-hidden hover:border-cyan-500/50 transition-all group cursor-pointer"
              onClick={() => openPost(post)}
            >
              <div className="relative aspect-[9/16] overflow-hidden">
                <img
                  src={post.poster.image_url}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-4">
                <h3 className="font-bold text-lg mb-1 truncate">{post.title}</h3>
                <p className="text-sm text-zinc-400 mb-3">by @{post.profile.username}</p>

                <div className="flex items-center gap-4 text-sm text-zinc-500">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(post);
                    }}
                    className="flex items-center gap-1 hover:text-pink-400 transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 ${post.user_has_liked ? 'fill-pink-500 text-pink-500' : ''}`}
                    />
                    {post.like_count}
                  </button>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {post.comment_count}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {post.view_count}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedPost && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-cyan-500/30 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{selectedPost.title}</h2>
                <p className="text-zinc-400">by @{selectedPost.profile.username}</p>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              <div className="w-1/2 p-6 flex items-center justify-center bg-black">
                <img
                  src={selectedPost.poster.image_url}
                  alt={selectedPost.title}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              </div>

              <div className="w-1/2 flex flex-col">
                <div className="p-6 space-y-4">
                  {selectedPost.description && (
                    <p className="text-zinc-300">{selectedPost.description}</p>
                  )}

                  <div className="flex gap-4 text-sm">
                    <button
                      onClick={() => toggleLike(selectedPost)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                    >
                      <Heart
                        className={`w-5 h-5 ${selectedPost.user_has_liked ? 'fill-pink-500 text-pink-500' : ''}`}
                      />
                      {selectedPost.like_count}
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-zinc-800 rounded-lg p-4">
                      <p className="font-medium text-sm text-cyan-400 mb-1">
                        @{comment.profile.username}
                      </p>
                      <p className="text-white">{comment.content}</p>
                    </div>
                  ))}
                </div>

                <div className="p-6 border-t border-zinc-800">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendComment()}
                      placeholder="Add a comment..."
                      className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                    <button
                      onClick={sendComment}
                      disabled={!newComment.trim() || sendingComment}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
