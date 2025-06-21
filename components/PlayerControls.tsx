
import React from 'react';
import { PlayIcon, PauseIcon }  from './icons/PlaybackIcons';

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  currentTime: number;
  duration: number;
  // onSeek: (time: number) => void; // Future: for interactive progress bar
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const PlayerControls: React.FC<PlayerControlsProps> = ({ 
  isPlaying, 
  onPlayPause, 
  currentTime, 
  duration 
}) => {
  return (
    <div className="w-full flex justify-between items-center text-[var(--font-color)]">
      <div className="text-sm font-light opacity-70 w-[50px] text-center">
        {formatTime(currentTime)}
      </div>
      
      <button 
        onClick={onPlayPause}
        className="relative w-[60px] h-[60px] rounded-full flex justify-center items-center cursor-pointer transition-all duration-300 ease-in-out bg-gradient-to-br from-white/20 to-transparent border-2 border-white/20 backdrop-blur-[5px] hover:scale-110 hover:shadow-[0_0_20px_var(--c-glow)] group"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <PauseIcon className="w-6 h-6 fill-[var(--font-color)]" /> : <PlayIcon className="w-6 h-6 fill-[var(--font-color)]" />}
        {isPlaying && (
          <div className="absolute inset-[-6px] rounded-full border-2 border-[var(--c-glow)] opacity-60 animate-aetherial-pulse z-[-1]" />
        )}
      </button>

      <div className="text-sm font-light opacity-70 w-[50px] text-center">
        {formatTime(duration)}
      </div>
    </div>
  );
};

export default PlayerControls;
