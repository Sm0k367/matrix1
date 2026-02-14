import { useEffect, useState } from 'react';
import { User as UserIcon, LogOut, Image, Award, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface UserProfile {
  username: string;
  display_name: string;
  bio: string | null;
  total_posters: number;
  total_realms_explored: number;
  achievement_points: number;
}

interface Poster {
  id: string;
  image_url: string;
  track_name: string;
  realm_type: string;
  created_at: string;
}

export function Profile() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posters, setPosters] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadPosters();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPosters = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('generated_posters')
        .select('id, image_url, track_name, realm_type, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(12);

      if (error) throw error;
      setPosters(data || []);
    } catch (error) {
      console.error('Error loading posters:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-400 text-xl font-mono">LOADING PROFILE...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-400 text-xl font-mono">PROFILE NOT FOUND</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-zinc-900/50 border border-cyan-500/20 rounded-2xl p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                <UserIcon className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">{profile.display_name}</h1>
                <p className="text-zinc-400 text-lg">@{profile.username}</p>
                {profile.bio && <p className="text-zinc-300 mt-2">{profile.bio}</p>}
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-zinc-800/50 rounded-lg p-4 border border-cyan-500/10">
              <div className="flex items-center gap-3 mb-2">
                <Image className="w-5 h-5 text-cyan-400" />
                <span className="text-zinc-400 text-sm">Posters Created</span>
              </div>
              <p className="text-3xl font-bold text-cyan-400">{profile.total_posters}</p>
            </div>

            <div className="bg-zinc-800/50 rounded-lg p-4 border border-purple-500/10">
              <div className="flex items-center gap-3 mb-2">
                <Settings className="w-5 h-5 text-purple-400" />
                <span className="text-zinc-400 text-sm">Realms Explored</span>
              </div>
              <p className="text-3xl font-bold text-purple-400">{profile.total_realms_explored}</p>
            </div>

            <div className="bg-zinc-800/50 rounded-lg p-4 border border-pink-500/10">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-5 h-5 text-pink-400" />
                <span className="text-zinc-400 text-sm">Achievement Points</span>
              </div>
              <p className="text-3xl font-bold text-pink-400">{profile.achievement_points}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Your Posters</h2>

          {posters.length === 0 ? (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-12 text-center">
              <Image className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-400 text-lg">No posters yet</p>
              <p className="text-zinc-600 text-sm mt-2">Start creating by generating your first poster!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {posters.map((poster) => (
                <div
                  key={poster.id}
                  className="group relative aspect-[9/16] rounded-lg overflow-hidden border border-cyan-500/20 hover:border-cyan-500/50 transition-all"
                >
                  <img
                    src={poster.image_url}
                    alt={poster.track_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-bold text-sm truncate">{poster.track_name.replace('.mp3', '')}</p>
                      <p className="text-cyan-400 text-xs">{poster.realm_type}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
