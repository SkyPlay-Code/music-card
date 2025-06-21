
import React, { useState, useRef, useEffect, useCallback } from 'react';
import ColorThief from 'colorthief';
import { Song, DynamicColors, AudioVisualizerData } from '../types';
import AlbumArtDisplay from './AlbumArtDisplay';
import SongInformation from './SongInformation';
import PlayerControls from './PlayerControls';
import AudioVisualizer from './AudioVisualizer';
import MoreOptionsButton from './MoreOptionsButton';

interface MusicPlayerProps {
  initialSong: Song;
  initialColors: DynamicColors;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ initialSong, initialColors }) => {
  const [song, setSong] = useState<Song>(initialSong);
  const [colors, setColors] = useState<DynamicColors>(initialColors);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [visualizerData, setVisualizerData] = useState<AudioVisualizerData | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  const playerStyle: React.CSSProperties = {
    '--c-primary': colors.primary,
    '--c-secondary': colors.secondary,
    '--c-glow': colors.glow,
    '--font-color': colors.font,
  } as React.CSSProperties;

  const setupAudioContext = useCallback(() => {
    if (!audioRef.current || audioContextRef.current) return;
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = context;
    const analyser = context.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;
    if (!sourceRef.current) {
         sourceRef.current = context.createMediaElementSource(audioRef.current);
         sourceRef.current.connect(analyser);
         analyser.connect(context.destination);
    }
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    setVisualizerData({ bufferLength, dataArray });
  }, []);

  const visualizerLoop = useCallback(() => {
    if (!analyserRef.current || !visualizerData) {
      animationFrameIdRef.current = requestAnimationFrame(visualizerLoop);
      return;
    }
    analyserRef.current.getByteFrequencyData(visualizerData.dataArray);
    setVisualizerData(prev => prev ? { ...prev, dataArray: new Uint8Array(visualizerData.dataArray) } : null);
    animationFrameIdRef.current = requestAnimationFrame(visualizerLoop);
  }, [visualizerData]);

  useEffect(() => {
    if (isPlaying && visualizerData) {
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
      animationFrameIdRef.current = requestAnimationFrame(visualizerLoop);
    } else {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    }
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isPlaying, visualizerLoop, visualizerData]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    if (audio.readyState >= 1) {
        handleLoadedMetadata();
    }
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [song.src]);

  const handleImageLoadForColorExtraction = useCallback((imgElement: HTMLImageElement) => {
    try {
      const colorThief = new ColorThief();
      const palette = colorThief.getPalette(imgElement, 2); // Get 2 colors
      if (palette && palette.length >= 2) {
        const primaryRgb = palette[0];
        const secondaryRgb = palette[1];
        setColors({
          primary: `rgb(${primaryRgb[0]}, ${primaryRgb[1]}, ${primaryRgb[2]})`,
          secondary: `rgb(${secondaryRgb[0]}, ${secondaryRgb[1]}, ${secondaryRgb[2]})`,
          glow: `rgba(${primaryRgb[0]}, ${primaryRgb[1]}, ${primaryRgb[2]}, 0.7)`,
          font: initialColors.font, // Keep font static or make it dynamic too
        });
      } else {
         console.warn("ColorThief could not extract a palette, using fallback colors.");
         setColors(initialColors);
      }
    } catch (error) {
      console.error('Error extracting colors with ColorThief:', error);
      setColors(initialColors); // Fallback to initial colors on error
    }
  }, [initialColors]); // initialColors is stable

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (!audioContextRef.current) {
      setupAudioContext();
    }
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      audioRef.current.play().catch(error => console.error("Error playing audio:", error));
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, setupAudioContext]);

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  useEffect(() => {
    // Reset song-specific state when song changes
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load(); // Important to load new src
    }
    // Colors will be updated by handleImageLoadForColorExtraction via AlbumArtDisplay's onLoad
  }, [song.id]);


  return (
    <>
      <div 
        className="fixed inset-0 w-full h-full opacity-30 blur-[100px] animate-aurora-flow -z-10"
        style={{
          background: `radial-gradient(circle at 20% 20%, var(--c-primary), transparent 50%),
                      radial-gradient(circle at 80% 70%, var(--c-secondary), transparent 50%)`,
          ...playerStyle
        }}
      />

      <div 
        style={playerStyle}
        className={`relative w-80 p-[25px] rounded-[30px] bg-[#161120]/40 backdrop-blur-[25px] border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.3)] flex flex-col items-center gap-4 transition-shadow duration-300 ease-in-out z-10 ${isPlaying ? 'shadow-[0_0_45px_var(--c-glow)]' : ''} text-[var(--font-color)]`}
      >
        <AudioVisualizer 
            data={visualizerData} 
            isPlaying={isPlaying} 
            colors={colors}
        />
        <MoreOptionsButton 
          songSrc={song.src}
          songTitle={song.title}
          songArtist={song.artist}
        />
        
        <AlbumArtDisplay 
            song={song} 
            onImageLoad={handleImageLoadForColorExtraction}
        />
        <SongInformation title={song.title} artist={song.artist} />
        {/* Linear Progress Bar is now part of PlayerControls */}
        <PlayerControls
            isPlaying={isPlaying}
            onPlayPause={togglePlay}
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
        />
        <audio ref={audioRef} src={song.src} crossOrigin="anonymous" className="hidden"></audio>
      </div>
    </>
  );
};

export default MusicPlayer;
