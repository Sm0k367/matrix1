import { useState, useRef, useEffect } from 'react';
import { Visualizer } from './components/Visualizer';
import { TrackList } from './components/TrackList';
import { PosterGenerator } from './components/PosterGenerator';
import { Sparkles, Image as ImageIcon, UserCircle, Radio, Play, Pause, Volume2, VolumeX, AlertCircle, X } from 'lucide-react';

type View = 'visualizer' | 'gallery' | 'profile' | 'sessions';

function MainApp() {
  const [currentView, setCurrentView] = useState<View>('visualizer');
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [realmData, setRealmData] = useState<{
    seed: number;
    realmType: string;
    realmMode: number;
    color: string;
  } | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    const handlePause = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handleError = () => {
      console.error('Audio playback error');
      setIsPlaying(false);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  const handleTrackSelect = async (track: string) => {
    setCurrentTrack(track);
    if (audioRef.current) {
      const encodedTrack = encodeURIComponent(track);
      audioRef.current.src = `/${encodedTrack}`;
      audioRef.current.load();

      try {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
        }
      } catch (err: any) {
        console.error('Error playing audio:', err);
        setIsPlaying(false);
      }
    }
  };

  const toggleFavorite = (track: string) => {
    const newFavorites = new Set(favorites);
    if (favorites.has(track)) {
      newFavorites.delete(track);
    } else {
      newFavorites.add(track);
    }
    setFavorites(newFavorites);
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white overflow-hidden">
      {showBanner && (
        <div className="bg-cyan-900/30 border-b border-cyan-500/30 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-cyan-400 flex-shrink-0" />
            <div className="text-sm">
              <span className="text-cyan-400 font-bold">67 Tracks Loaded</span>
              <span className="text-cyan-200 ml-2">
                Click any track to start playback. If you don't hear audio, check your browser's volume and permissions.
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
      <nav className="bg-zinc-900 border-b border-cyan-500/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-cyan-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 text-transparent bg-clip-text">
              SMOKE MATRIX
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('visualizer')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                currentView === 'visualizer'
                  ? 'bg-cyan-500 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              Visualizer
            </button>
            <button
              onClick={() => setCurrentView('gallery')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                currentView === 'gallery'
                  ? 'bg-cyan-500 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <ImageIcon className="w-5 h-5" />
              Gallery
            </button>
            <button
              onClick={() => setCurrentView('sessions')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                currentView === 'sessions'
                  ? 'bg-cyan-500 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Radio className="w-5 h-5" />
              Live
            </button>
            <button
              onClick={() => setCurrentView('profile')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                currentView === 'profile'
                  ? 'bg-cyan-500 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <UserCircle className="w-5 h-5" />
              Profile
            </button>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {currentView === 'visualizer' && (
          <>
            <TrackList
              onTrackSelect={handleTrackSelect}
              currentTrack={currentTrack}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
            <div className="flex-1 relative">
              <Visualizer
                currentTrack={currentTrack}
                audioElement={audioRef.current}
                onRealmChange={setRealmData}
              />
              <PosterGenerator
                currentTrack={currentTrack}
                realmData={realmData}
                canvasElement={canvasRef.current || (document.querySelector('canvas') as HTMLCanvasElement)}
              />
            </div>
          </>
        )}

        {currentView === 'gallery' && (
          <div className="flex-1 overflow-y-auto flex items-center justify-center">
            <div className="text-zinc-400 text-xl font-mono">Gallery coming soon...</div>
          </div>
        )}

        {currentView === 'profile' && (
          <div className="flex-1 overflow-y-auto flex items-center justify-center">
            <div className="text-zinc-400 text-xl font-mono">Profile coming soon...</div>
          </div>
        )}

        {currentView === 'sessions' && (
          <div className="flex-1 overflow-y-auto flex items-center justify-center">
            <div className="text-zinc-400 text-xl font-mono">Live Sessions coming soon...</div>
          </div>
        )}
      </div>

      {currentTrack && (
        <div className="bg-zinc-900 border-t border-cyan-500/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={togglePlayPause}
                className="w-10 h-10 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white flex items-center justify-center transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              <div className="flex-1">
                <p className="font-bold text-white truncate">
                  {currentTrack.replace('.mp3', '').toUpperCase()}
                </p>
                <p className="text-sm text-zinc-400">{realmData?.realmType || 'Loading...'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  setIsMuted(false);
                }}
                className="w-24"
              />
            </div>
          </div>
        </div>
      )}

      <audio ref={audioRef} preload="auto" crossOrigin="anonymous" />
    </div>
  );
}

function App() {
  return <MainApp />;
}

export default App;
