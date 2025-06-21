
import React from 'react';
import MusicPlayer from './components/MusicPlayer';
import { Song, DynamicColors } from './types';

const initialSong: Song = {
  id: 'cradles-suburban',
  title: "Cradles",
  artist: "Sub Urban",
  src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Placeholder, ensure CORS enabled for Audio API
  cover: "https://picsum.photos/id/450/200/200", // Placeholder
};

const initialColors: DynamicColors = {
  primary: "#8E44AD", // Purple
  secondary: "#E74C3C", // Red-Orange
  glow: "rgba(231, 76, 60, 0.7)", // Secondary with alpha
  font: "#f0e8ff",
};

const App: React.FC = () => {
  return (
    <div 
        className="flex justify-center items-center min-h-screen bg-[#120e1a] text-[var(--font-color)] overflow-hidden"
        style={{ '--c-font': initialColors.font } as React.CSSProperties} /* Set font color globally for body */
    >
      <MusicPlayer initialSong={initialSong} initialColors={initialColors} />
    </div>
  );
};

export default App;
