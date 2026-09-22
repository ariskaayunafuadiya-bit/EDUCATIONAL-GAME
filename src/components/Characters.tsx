import React from 'react';
import { CharacterId } from '../types';
import { GAME_ASSETS } from '../assets/gameAssets';

interface CharacterProps {
  id: CharacterId;
  size?: 'avatar' | 'sm' | 'md' | 'lg' | 'xl';
  isWalking?: boolean;
  facing?: 'left' | 'right';
  className?: string;
  isCheering?: boolean;
  showPedestal?: boolean;
}

export const CHARACTERS_DATA = [
  {
    id: 'fatimah' as CharacterId,
    name: 'Alya',
    gender: 'female' as const,
    title: 'Perempuan Berhijab • Cerdas & Ceria',
    description: 'Anak perempuan berhijab yang ramah, teliti, dan penuh rasa ingin tahu tentang sains dan energi di alam!',
    color: '#10B981',
    avatarBg: 'from-emerald-400 via-teal-500 to-emerald-600',
    borderBadge: 'border-emerald-400',
    traits: ['🔎 Pengamat Teliti', '🌿 Sahabat Alam', '⚡ Paham Energi'],
  },
  {
    id: 'ali' as CharacterId,
    name: 'Rafi',
    gender: 'male' as const,
    title: 'Laki-Laki • Petualang Tangguh & Cepat',
    description: 'Anak laki-laki yang berani, tangkas, dan selalu siap memecahkan misteri sains di dunia EDUVERSE!',
    color: '#0284C7',
    avatarBg: 'from-sky-400 via-blue-500 to-indigo-600',
    borderBadge: 'border-sky-400',
    traits: ['🚀 Pemberani', '💡 Cepat Tanggap', '🧭 Penjelajah Ulung'],
  },
];

export const CharacterView: React.FC<CharacterProps> = ({
  id,
  size = 'md',
  isWalking = false,
  facing = 'right',
  className = '',
  isCheering = false,
  showPedestal = false,
}) => {
  const imgSrc = id === 'fatimah' ? GAME_ASSETS.characters.fatimah : GAME_ASSETS.characters.ali;
  const name = id === 'fatimah' ? 'Alya' : 'Rafi';

  // Sizing definitions
  const sizeStyles = {
    avatar: 'w-10 h-10',
    sm: 'w-14 h-18 sm:w-16 sm:h-20',
    md: 'w-24 h-28',
    lg: 'w-36 h-44 sm:w-40 sm:h-48',
    xl: 'w-52 h-64',
  };

  const flipStyle = facing === 'left' ? '-scale-x-100' : 'scale-x-100';

  // Dynamic animation classes
  let animClass = '';
  if (isCheering) {
    animClass = 'animate-bounce';
  } else if (isWalking) {
    animClass = 'animate-[pulse_0.4s_ease-in-out_infinite]';
  }

  // Avatar mini mode (for TopHUD or list items)
  if (size === 'avatar') {
    return (
      <div
        className={`relative inline-block rounded-full overflow-hidden border-2 border-white shadow-md bg-white ${sizeStyles.avatar} ${className}`}
      >
        <img
          src={imgSrc}
          alt={name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top scale-110"
        />
      </div>
    );
  }

  // Small in-game map sprite mode (inside the forest world)
  if (size === 'sm') {
    return (
      <div className={`relative flex flex-col items-center select-none ${className}`}>
        {/* Character Figure */}
        <div
          className={`relative transition-transform duration-150 ${sizeStyles.sm} ${flipStyle} ${animClass}`}
        >
          <div className="w-full h-full rounded-2xl overflow-hidden bg-white/95 border-2 border-amber-300 shadow-xl ring-2 ring-emerald-600/30">
            <img
              src={imgSrc}
              alt={name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top"
            />
          </div>
          {/* Walking dust puff */}
          {isWalking && (
            <span className="absolute -bottom-1 -left-1 text-xs opacity-70 animate-ping">
              💨
            </span>
          )}
        </div>

        {/* Realistic Ground Shadow & Pedestal */}
        <div className="w-12 h-3 bg-black/40 rounded-full blur-[1.5px] -mt-1 shadow-inner" />
      </div>
    );
  }

  // Larger displays (Selection screen, Opening screen, Profile modal)
  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}
    >
      <div
        className={`relative transition-transform duration-200 ${sizeStyles[size]} ${flipStyle} ${animClass}`}
      >
        <div className="w-full h-full rounded-3xl overflow-hidden bg-white border-4 border-amber-300 shadow-2xl ring-4 ring-amber-400/20 group">
          <img
            src={imgSrc}
            alt={name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
          />
          {/* Subtle lighting shine */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-white/20 pointer-events-none" />
        </div>
      </div>

      {showPedestal && (
        <div className="w-24 h-4 bg-amber-900/20 rounded-full blur-xs mt-2" />
      )}
    </div>
  );
};
