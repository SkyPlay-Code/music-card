
import React, { useRef, useEffect } from 'react';
import { Song } from '../types';

interface AlbumArtDisplayProps {
  song: Song;
  onImageLoad?: (imgElement: HTMLImageElement) => void;
}

const AlbumArtDisplay: React.FC<AlbumArtDisplayProps> = ({ song, onImageLoad }) => {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const currentImgRef = imgRef.current;
    if (currentImgRef && onImageLoad) {
      const handleLoad = () => {
        onImageLoad(currentImgRef);
      };

      // Check if image is already completed (e.g. cached)
      if (currentImgRef.complete) {
        handleLoad();
      } else {
        currentImgRef.addEventListener('load', handleLoad);
      }
      
      return () => {
        if (currentImgRef) {
          currentImgRef.removeEventListener('load', handleLoad);
        }
      };
    }
  }, [song.cover, onImageLoad]); // Re-run if song.cover or onImageLoad changes

  return (
    <div className="relative w-[200px] h-[200px] group [perspective:1000px]">
      <img 
        ref={imgRef}
        src={song.cover} 
        alt={`${song.title} cover art`}
        crossOrigin="anonymous" // Crucial for ColorThief
        className="w-full h-full rounded-[20px] shadow-[0_10px_20px_rgba(0,0,0,0.25)] transition-transform duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] transform-gpu group-hover:translate-z-[20px] group-hover:rotate-x-[5deg] group-hover:rotate-y-[-10deg]" 
      />
      {/* Circular progress bar removed */}
    </div>
  );
};

export default AlbumArtDisplay;
