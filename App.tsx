
import React from 'react';
import MusicPlayer from './components/MusicPlayer';
import { Song, DynamicColors } from './types';

// Updated paths to point to assets in the public/songs/cradles/ directory
const initialSong: Song = {
  id: 'cradles-suburban',
  title: "Cradles",
  artist: "Sub Urban",
  src: "/songs/cradles/spotifydown.com - Cradles.mp3", 
  cover: "/songs/cradles/song-cover.jpg",
};

// These will serve as fallback or initial state before dynamic colors are loaded
const fallbackColors: DynamicColors = {
  primary: "#8E44AD", // Purple
  secondary: "#E74C3C", // Red-Orange
  glow: "rgba(231, 76, 60, 0.7)", // Secondary with alpha
  font: "#f0e8ff",
};

const App: React.FC = () => {
  return (
    <div 
        className="flex justify-center items-center min-h-screen bg-[#120e1a] text-[var(--font-color)] overflow-hidden"
        style={{ '--font-color': fallbackColors.font } as React.CSSProperties} 
    >
      <MusicPlayer initialSong={initialSong} initialColors={fallbackColors} />
    </div>
  );
};

export default App;
