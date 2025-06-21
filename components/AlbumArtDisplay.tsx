
import React from 'react';
import { Song } from '../types';

interface AlbumArtDisplayProps {
  song: Song;
  currentTime: number;
  duration: number;
}

const AlbumArtDisplay: React.FC<AlbumArtDisplayProps> = ({ song, currentTime, duration }) => {
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const progress = duration > 0 ? (currentTime / duration) : 0;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="relative w-[200px] h-[200px] group [perspective:1000px]">
      <img 
        src={song.cover} 
        alt={`${song.title} cover art`}
        className="w-full h-full rounded-[20px] shadow-[0_10px_20px_rgba(0,0,0,0.25)] transition-transform duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] transform-gpu group-hover:translate-z-[20px] group-hover:rotate-x-[5deg] group-hover:rotate-y-[-10deg]" 
      />
      <svg className="absolute top-[-10px] left-[-10px] w-[220px] h-[220px] transform -rotate-90 z-[5]" viewBox="0 0 220 220">
        <circle 
          className="stroke-white/10"
          fill="transparent"
          strokeWidth="6"
          r={radius}
          cx="110"
          cy="110"
        />
        <circle
          className="stroke-[var(--c-glow)] transition-[stroke-dashoffset] duration-200 linear"
          fill="transparent"
          strokeWidth="6"
          strokeLinecap="round"
          r={radius}
          cx="110"
          cy="110"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
          }}
        />
      </svg>
    </div>
  );
};

export default AlbumArtDisplay;
