
import React from 'react';

interface IconProps {
  className?: string;
}

export const PlayIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M8 5v14l11-7z"/>
  </svg>
);

export const PauseIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
  </svg>
);

export const MoreVerticalIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
  </svg>
);
