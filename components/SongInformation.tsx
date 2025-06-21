
import React from 'react';

interface SongInformationProps {
  title: string;
  artist: string;
}

const SongInformation: React.FC<SongInformationProps> = ({ title, artist }) => {
  return (
    <div className="text-center text-[var(--font-color)]">
      <h1 className="text-2xl font-semibold text-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">{title}</h1>
      <p className="text-base font-light opacity-70">{artist}</p>
    </div>
  );
};

export default SongInformation;
