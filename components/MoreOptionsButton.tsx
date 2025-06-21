
import React, { useState, useEffect, useRef } from 'react';
import { MoreVerticalIcon } from './icons/PlaybackIcons';

const MoreOptionsButton: React.FC = () => {
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

  const handleCopyLink = () => {
    // Replace with actual song link logic
    const songLink = "https://example.com/current-song.mp3"; 
    navigator.clipboard.writeText(songLink).then(() => {
      alert("Link copied!"); // Consider a less obtrusive notification
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
      >
        <MoreVerticalIcon className="w-6 h-6 fill-white/50 group-hover:fill-white transition-colors" />
      </button>
      {isOpen && (
        <div 
          className="absolute top-full right-0 mt-2 w-max bg-[#1e142d]/80 backdrop-blur-[10px] rounded-[10px] p-1.5 flex flex-col gap-1 shadow-lg transform transition-all duration-300 ease-in-out origin-top-right text-[var(--font-color)] animate-[scale-up_0.2s_ease-out]"
          style={{animationName: 'scale-up-fade-in', animationDuration: '0.2s', animationTimingFunction: 'ease-out'}}
        > 
        {/* Basic keyframe for entry since Tailwind doesn't have one-shot entry anims easily without variants */}
        <style>{`
            @keyframes scale-up-fade-in {
                0% { opacity: 0; transform: scale(0.9) translateY(10px); }
                100% { opacity: 1; transform: scale(1) translateY(0); }
            }
        `}</style>
          <button onClick={handleCopyLink} className="text-left px-4 py-2 text-sm rounded-[5px] hover:bg-[var(--c-glow)] transition-colors">Copy Link</button>
          <button onClick={() => setIsOpen(false)} className="text-left px-4 py-2 text-sm rounded-[5px] hover:bg-[var(--c-glow)] transition-colors">View Artist</button>
          <button onClick={() => setIsOpen(false)} className="text-left px-4 py-2 text-sm rounded-[5px] hover:bg-[var(--c-glow)] transition-colors">Add to Playlist</button>
        </div>
      )}
    </div>
  );
};

export default MoreOptionsButton;
