
import React, { useState, useEffect, useRef } from 'react';
import { MoreVerticalIcon } from './icons/PlaybackIcons';

interface MoreOptionsButtonProps {
  songSrc: string;
  songTitle: string;
  songArtist: string;
}

const MoreOptionsButton: React.FC<MoreOptionsButtonProps> = ({ songSrc, songTitle, songArtist }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  const handleDownloadSong = () => {
    const link = document.createElement('a');
    link.href = songSrc;
    // Sanitize title and artist for a friendly filename
    const friendlyFileNameBase = `${songArtist} - ${songTitle}`;
    const fileExtension = songSrc.split('.').pop() || 'mp3';
    const friendlyFileName = `${friendlyFileNameBase.replace(/[\\/:*?"<>|]/g, '_')}.${fileExtension}`;
    link.download = friendlyFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsOpen(false); // Close menu after action
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + songSrc).then(() => {
      alert("Song link copied!"); // Consider a less obtrusive notification
    }).catch(err => {
      console.error('Failed to copy link: ', err);
      alert("Failed to copy link.");
    });
    setIsOpen(false);
  };

  return (
    <div className="absolute top-[25px] right-[25px] z-20" ref={menuRef}>
      <button 
        onClick={toggleMenu} 
        className="cursor-pointer group"
        aria-label="More options"
        aria-expanded={isOpen}
        aria-controls="options-menu-list"
      >
        <MoreVerticalIcon className="w-6 h-6 fill-white/50 group-hover:fill-white transition-colors" />
      </button>
      {isOpen && (
        <div 
          id="options-menu-list"
          className="absolute top-full right-0 mt-2 w-max bg-[#1e142d]/80 backdrop-blur-[10px] rounded-[10px] p-1.5 flex flex-col gap-1 shadow-lg transform transition-all duration-300 ease-in-out origin-top-right text-[var(--font-color)] animate-[scale-up_0.2s_ease-out]"
          style={{animationName: 'scale-up-fade-in', animationDuration: '0.2s', animationTimingFunction: 'ease-out'}}
          role="menu"
        > 
        <style>{`
            @keyframes scale-up-fade-in {
                0% { opacity: 0; transform: scale(0.9) translateY(10px); }
                100% { opacity: 1; transform: scale(1) translateY(0); }
            }
        `}</style>
          <button onClick={handleDownloadSong} role="menuitem" className="text-left px-4 py-2 text-sm rounded-[5px] hover:bg-[var(--c-glow)] transition-colors">Download Song</button>
          <button onClick={handleCopyLink} role="menuitem" className="text-left px-4 py-2 text-sm rounded-[5px] hover:bg-[var(--c-glow)] transition-colors">Copy Link</button>
          <button onClick={() => setIsOpen(false)} role="menuitem" className="text-left px-4 py-2 text-sm rounded-[5px] hover:bg-[var(--c-glow)] transition-colors">View Artist</button>
          <button onClick={() => setIsOpen(false)} role="menuitem" className="text-left px-4 py-2 text-sm rounded-[5px] hover:bg-[var(--c-glow)] transition-colors">Add to Playlist</button>
        </div>
      )}
    </div>
  );
};

export default MoreOptionsButton;
