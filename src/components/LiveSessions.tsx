import { useEffect, useState } from 'react';
import { Radio, Users, Plus, Play, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface LiveSession {
  id: string;
  session_name: string;
  participant_count: number;
  max_participants: number;
  current_track: string | null;
  is_active: boolean;
  host: {
    display_name: string;
    username: string;
  };
}

interface LiveSessionsProps {
  onJoinSession?: (session: LiveSession) => void;
}

export function LiveSessions({ onJoinSession }: LiveSessionsProps) {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sessionName, setSessionName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadSessions();

    const channel = supabase
      .channel('live_sessions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'live_sessions',
        },
        () => {
          loadSessions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('live_sessions')
        .select(`
          id,
          session_name,
          participant_count,
          max_participants,
          current_track,
          is_active,
          host:user_profiles!host_id(display_name, username)
        `)
        .eq('is_active', true)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const createSession = async () => {
    if (!user || !sessionName.trim()) return;

    setIsCreating(true);
    try {
      const { data, error } = await supabase
        .from('live_sessions')
        .insert({
          host_id: user.id,
          session_name: sessionName.trim(),
          is_public: true,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;

      setShowCreateModal(false);
      setSessionName('');
      loadSessions();
    } catch (error: any) {
      console.error('Error creating session:', error);
      alert('Failed to create session: ' + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const joinSession = async (session: LiveSession) => {
    if (!user) return;

    try {
      await supabase
        .from('live_sessions')
        .update({
          participant_count: session.participant_count + 1,
        })
        .eq('id', session.id);

      if (onJoinSession) {
        onJoinSession(session);
      }

      alert(`Joined ${session.session_name}!`);
    } catch (error) {
      console.error('Error joining session:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 text-transparent bg-clip-text flex items-center gap-3">
              <Radio className="w-10 h-10 text-cyan-400" />
              LIVE SESSIONS
            </h1>
            <p className="text-zinc-400">Join or host real-time listening parties</p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-lg font-bold hover:from-cyan-600 hover:to-purple-600 transition-all shadow-lg shadow-cyan-500/30"
          >
            <Plus className="w-5 h-5" />
            Host Session
          </button>
        </div>

        {sessions.length === 0 ? (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-12 text-center">
            <Radio className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400 text-lg">No active sessions</p>
            <p className="text-zinc-600 text-sm mt-2">Be the first to host a listening party!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="bg-zinc-900 border border-cyan-500/20 rounded-lg p-6 hover:border-cyan-500/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-xl mb-1">{session.session_name}</h3>
                    <p className="text-sm text-zinc-400">by @{session.host.username}</p>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                </div>

                {session.current_track && (
                  <div className="bg-zinc-800 rounded-lg p-3 mb-4 flex items-center gap-2">
                    <Play className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm truncate">{session.current_track.replace('.mp3', '')}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-400 text-sm">
                    <Users className="w-4 h-4" />
                    <span>
                      {session.participant_count} / {session.max_participants}
                    </span>
                  </div>

                  <button
                    onClick={() => joinSession(session)}
                    disabled={session.participant_count >= session.max_participants}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Join
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-cyan-500/30 rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Create Live Session</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-zinc-400 text-sm font-medium mb-2">
                  Session Name
                </label>
                <input
                  type="text"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Friday Night Vibes"
                  autoFocus
                />
              </div>

              <button
                onClick={createSession}
                disabled={!sessionName.trim() || isCreating}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold py-3 rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? 'CREATING...' : 'START SESSION'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
