import { useState } from 'react';
import { Music, Play, Heart, Search } from 'lucide-react';
import { SONGS } from '../lib/songs';

interface TrackListProps {
  onTrackSelect: (track: string) => void;
  currentTrack: string | null;
  favorites: Set<string>;
  onToggleFavorite: (track: string) => void;
}

export function TrackList({ onTrackSelect, currentTrack, favorites, onToggleFavorite }: TrackListProps) {
  const [search, setSearch] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const filteredSongs = SONGS.filter(song => {
    const matchesSearch = song.toLowerCase().includes(search.toLowerCase());
    const matchesFavorites = !showFavoritesOnly || favorites.has(song);
    return matchesSearch && matchesFavorites;
  });

  return (
    <div className="w-80 bg-zinc-900/90 backdrop-blur-sm border-r border-cyan-500/20 flex flex-col h-screen">
      <div className="p-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-2 mb-4">
          <Music className="w-6 h-6 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">TRACKS</h2>
        </div>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tracks..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        <button
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            showFavoritesOnly
              ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
              : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:text-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-pink-400' : ''}`} />
          {showFavoritesOnly ? 'Showing Favorites' : 'Show All'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredSongs.map((song, index) => {
          const displayName = song.replace('.mp3', '');
          const isPlaying = currentTrack === song;
          const isFavorite = favorites.has(song);

          return (
            <div
              key={index}
              className={`group flex items-center gap-3 px-4 py-3 cursor-pointer transition-all border-b border-zinc-800/50 ${
                isPlaying
                  ? 'bg-cyan-500/10 border-l-4 border-l-cyan-500'
                  : 'hover:bg-zinc-800/50'
              }`}
            >
              <button
                onClick={() => onTrackSelect(song)}
                className="flex-1 flex items-center gap-3 text-left"
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    isPlaying ? 'bg-cyan-500 text-black' : 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700'
                  }`}
                >
                  <Play className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium truncate ${
                      isPlaying ? 'text-cyan-400' : 'text-white'
                    }`}
                  >
                    {displayName}
                  </p>
                </div>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(song);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFavorite ? 'fill-pink-500 text-pink-500' : 'text-zinc-500 hover:text-pink-400'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-cyan-500/20 text-center">
        <p className="text-xs text-zinc-500 font-mono">
          {filteredSongs.length} TRACKS LOADED
        </p>
      </div>
    </div>
  );
}
