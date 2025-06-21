
import React, { useRef, useEffect } from 'react';
import { AudioVisualizerData, DynamicColors } from '../types';

interface AudioVisualizerProps {
  data: AudioVisualizerData | null;
  isPlaying: boolean;
  colors: DynamicColors;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ data, isPlaying, colors }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas(); // Initial size
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data || !isPlaying) {
      // Clear canvas when not playing or no data
      const ctx = canvas?.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const { dataArray, bufferLength } = data;
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i] * 1.5; // Amplify effect

      const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
      gradient.addColorStop(0, colors.primary);
      gradient.addColorStop(0.5, colors.secondary);
      gradient.addColorStop(1, 'rgba(0,0,0,0)'); // Fade to transparent, adjusted from original
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight); // Centered a bit more

      x += barWidth + 1;
    }
  }, [data, isPlaying, colors]); // Re-draw when data, playing state, or colors change

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full h-full opacity-25 rounded-[30px] -z-[1]"
      style={{
        maskImage: 'linear-gradient(to top, black 40%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to top, black 40%, transparent 100%)',
      }}
    />
  );
};

export default AudioVisualizer;
