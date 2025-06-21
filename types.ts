
export interface Song {
  id: string;
  title: string;
  artist: string;
  src: string;
  cover: string;
}

export interface DynamicColors {
  primary: string;
  secondary: string;
  glow: string;
  font: string;
}

export interface AudioVisualizerData {
  bufferLength: number;
  dataArray: Uint8Array;
}
