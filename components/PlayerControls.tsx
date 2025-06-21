
import React, { useState, useRef, useEffect } from 'react';
import { PlayIcon, PauseIcon }  from './icons/PlaybackIcons';

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
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
  duration,
  onSeek
}) => {
  const progressContainerRef = useRef<HTMLDivElement>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubPosition, setScrubPosition] = useState(0); // For visual feedback during scrub

  const handleSeekInteraction = (event: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    if (!progressContainerRef.current || duration === 0) return;
    const rect = progressContainerRef.current.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const progress = Math.max(0, Math.min(1, offsetX / rect.width));
    return progress * duration;
  };
  
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const newTime = handleSeekInteraction(event);
    if (newTime !== undefined) {
      setScrubPosition((newTime / duration) * 100);
      setIsScrubbing(true);
    }
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isScrubbing || !progressContainerRef.current || duration === 0) return;
      const newTime = handleSeekInteraction(event);
       if (newTime !== undefined) {
        setScrubPosition((newTime / duration) * 100);
        // Optionally update currentTime display live during scrub:
        // onSeek(newTime); // This might be too frequent, consider debouncing or updating on mouse up only.
      }
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (!isScrubbing) return;
      setIsScrubbing(false);
      const newTime = handleSeekInteraction(event);
      if (newTime !== undefined) {
        onSeek(newTime);
      }
    };

    if (isScrubbing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isScrubbing, duration, onSeek, handleSeekInteraction]);


  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const displayPercent = isScrubbing ? scrubPosition : progressPercent;

  return (
    <div className="w-full flex flex-col items-center gap-3 text-[var(--font-color)]">
      {/* Linear Progress Bar */}
      <div 
        ref={progressContainerRef}
        className="w-full h-4 flex items-center cursor-pointer relative group py-2" // Increased py for easier clicking
        onMouseDown={handleMouseDown}
        onClick={(e) => { // Allow click to seek if not scrubbing
            if(!isScrubbing) {
                const newTime = handleSeekInteraction(e);
                if (newTime !== undefined) onSeek(newTime);
            }
        }}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={currentTime}
        aria-label="Song progress"
      >
        {/* Track */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/15 rounded-sm" />
        {/* Filled Bar */}
        <div 
          className="h-1 rounded-sm relative z-[1] pointer-events-none"
          style={{ 
            width: `${displayPercent}%`, 
            backgroundColor: 'var(--c-primary)', 
            boxShadow: '0 0 8px var(--c-glow)' 
          }} 
        />
        {/* Scrubber */}
        <div 
          className="w-3.5 h-3.5 bg-white rounded-full absolute top-1/2 -translate-y-1/2 z-[2] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{ 
            left: `calc(${displayPercent}% - 7px)`, /* 7px is half of scrubber width 14px (3.5rem) */
            boxShadow: '0 0 10px 2px var(--c-glow)'
          }}
        />
      </div>

      {/* Controls Row */}
      <div className="w-full flex justify-between items-center">
        <div className="text-sm font-light opacity-70 w-[50px] text-center tabular-nums">
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

        <div className="text-sm font-light opacity-70 w-[50px] text-center tabular-nums">
          {formatTime(duration)}
        </div>
      </div>
    </div>
  );
};

export default PlayerControls;
