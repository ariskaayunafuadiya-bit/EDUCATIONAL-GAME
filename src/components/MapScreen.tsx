import React, { useState } from 'react';
import { sounds } from '../utils/audio';
import { Lock, Unlock, Play, Sparkles, Home, Trees, Film, Compass, Gamepad2, Trophy, Puzzle, Palmtree, Castle, X } from 'lucide-react';
import { GAME_ASSETS } from '../assets/gameAssets';
import { ClassGrade, MateriItem } from '../types';
import { ContentStore } from '../utils/contentStore';

interface MapLocation {
  id: 'desa' | 'hutan' | 'bioskop' | 'desa_misi' | 'arena' | 'gua_puzzle' | 'pulau_tantangan' | 'menara' | 'istana_quest';
  name: string;
  badge: string;
  icon: React.ReactNode;
  emoji: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  description: string;
  bgGradient: string;
  borderColor: string;
}

interface MapScreenProps {
  unlockedAreas: string[];
  onEnterForest: () => void;
  onOpenArena: () => void;
  completedMission: boolean;
  studentName: string;
  selectedClass?: ClassGrade;
  selectedSubjectId?: string;
  activeMateri?: MateriItem | null;
  onOpenWorldPicker?: () => void;
}

const MAP_LOCATIONS: MapLocation[] = [
  {
    id: 'desa',
    name: 'Desa Petualang',
    badge: 'Desa Awal • TERBUKA',
    icon: <Home className="text-amber-700" size={24} />,
    emoji: '🏠',
    x: 14,
    y: 70,
    description: 'Titik awal berkumpul para petualang muda EDUVERSE. Tempat yang hangat, ramah, dan damai.',
    bgGradient: 'from-amber-400 to-orange-400',
    borderColor: 'border-amber-500',
  },
  {
    id: 'hutan',
    name: 'Hutan Pengetahuan',
    badge: 'Dunia Utama • TERBUKA',
    icon: <Trees className="text-emerald-700" size={24} />,
    emoji: '🌳',
    x: 38,
    y: 46,
    description: 'Hutan rimbun penuh misteri sains! Kunjungi Pondok Materi, Bioskop Belajar, dan Pos Detektif.',
    bgGradient: 'from-emerald-400 to-green-500',
    borderColor: 'border-emerald-600',
  },
  {
    id: 'bioskop',
    name: 'Bioskop Belajar',
    badge: 'Di dalam Hutan',
    icon: <Film className="text-sky-700" size={24} />,
    emoji: '🎬',
    x: 58,
    y: 28,
    description: 'Bioskop animasi edukatif sains. Kamu dapat memasukinya secara langsung melalui Hutan Pengetahuan!',
    bgGradient: 'from-sky-400 to-blue-500',
    borderColor: 'border-sky-500',
  },
  {
    id: 'desa_misi',
    name: 'Desa Misi',
    badge: '🔒 TERKUNCI',
    icon: <Compass className="text-purple-700" size={24} />,
    emoji: '🔎',
    x: 18,
    y: 26,
    description: 'Pusat tantangan detektif sains tingkat lanjut. Selesaikan petualangan di Hutan terlebih dahulu!',
    bgGradient: 'from-purple-300 to-indigo-400',
    borderColor: 'border-purple-400',
  },
  {
    id: 'arena',
    name: 'Arena Game',
    badge: 'Arena Bermain',
    icon: <Gamepad2 className="text-rose-700" size={24} />,
    emoji: '🎮',
    x: 68,
    y: 56,
    description: 'Arena permainan kuis dan mini-game sains berhadiah bintang XP ekstra!',
    bgGradient: 'from-rose-400 to-pink-500',
    borderColor: 'border-rose-500',
  },
  {
    id: 'gua_puzzle',
    name: 'Gua Puzzle',
    badge: '🔒 TERKUNCI',
    icon: <Puzzle className="text-teal-700" size={24} />,
    emoji: '🧩',
    x: 38,
    y: 80,
    description: 'Gua misterius dengan teka-teki logika sains kuno. Membutuhkan lencana petualang untuk dibuka.',
    bgGradient: 'from-teal-400 to-cyan-500',
    borderColor: 'border-teal-500',
  },
  {
    id: 'pulau_tantangan',
    name: 'Pulau Tantangan',
    badge: '🔒 TERKUNCI',
    icon: <Palmtree className="text-yellow-700" size={24} />,
    emoji: '🏝️',
    x: 86,
    y: 26,
    description: 'Pulau eksotis di seberang samudra dengan serangkaian mini-quest fisika dan biologi!',
    bgGradient: 'from-yellow-400 to-amber-500',
    borderColor: 'border-yellow-500',
  },
  {
    id: 'menara',
    name: 'Menara Prestasi',
    badge: '🔒 TERKUNCI',
    icon: <Trophy className="text-amber-700" size={24} />,
    emoji: '🏆',
    x: 60,
    y: 84,
    description: 'Puncak tertinggi EDUVERSE bagi peraih lencana terbanyak untuk dinobatkan sebagai Juara Sains.',
    bgGradient: 'from-yellow-300 to-amber-500',
    borderColor: 'border-amber-400',
  },
  {
    id: 'istana_quest',
    name: 'Istana Final Quest',
    badge: '🔒 TERKUNCI',
    icon: <Castle className="text-indigo-700" size={24} />,
    emoji: '🏰',
    x: 86,
    y: 78,
    description: 'Istana megah tempat ujian pamungkas seluruh materi kurikulum IPAS kelas 4!',
    bgGradient: 'from-indigo-400 to-purple-600',
    borderColor: 'border-indigo-500',
  },
];

export const MapScreen: React.FC<MapScreenProps> = ({
  unlockedAreas,
  onEnterForest,
  onOpenArena,
  completedMission,
  studentName,
  selectedClass = 4,
  selectedSubjectId = 'ipas',
  activeMateri,
  onOpenWorldPicker,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [showVillageModal, setShowVillageModal] = useState(false);

  const subject = ContentStore.getSubjects().find((s) => s.id === selectedSubjectId);

  const handleLocationClick = (loc: MapLocation) => {
    sounds.playPop();
    const isUnlocked = unlockedAreas.includes(loc.id);

    if (loc.id === 'hutan') {
      onEnterForest();
      return;
    }

    if (loc.id === 'arena' && isUnlocked) {
      onOpenArena();
      return;
    }

    if (loc.id === 'desa') {
      setShowVillageModal(true);
      return;
    }

    // Otherwise show details / locked info
    setSelectedLocation(loc);
  };

  return (
    <div className="relative min-h-[calc(100vh-65px)] w-full overflow-hidden flex flex-col items-center justify-between p-2 sm:p-5 select-none bg-slate-900">
      {/* Real Panoramic Fantasy Island Map Backdrop */}
      <div className="absolute inset-0 z-0">
        <img
          src={GAME_ASSETS.backgrounds.worldMap}
          alt="EDUVERSE World Map"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter brightness-95 contrast-105"
        />
        {/* Soft overlay gradient to ensure UI legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/50 pointer-events-none" />
      </div>

      {/* Floating Animated Clouds */}
      <div className="absolute top-4 left-6 text-4xl opacity-70 animate-pulse pointer-events-none z-10">☁️</div>
      <div className="absolute top-12 right-12 text-3xl opacity-60 pointer-events-none z-10">☁️</div>

      {/* Map Header Banner */}
      <div className="relative z-10 text-center mb-2">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/95 backdrop-blur-md border-2 border-amber-400 shadow-xl">
          <span className="text-xl">🗺️</span>
          <h2 className="text-xl sm:text-2xl font-black text-amber-950 font-['Fredoka',sans-serif]">
            Peta Petualangan EDUVERSE
          </h2>
        </div>
        {completedMission && (
          <div className="mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-xl border-2 border-white animate-bounce">
            <span>🎉</span>
            <span>AREA BARU TERBUKA! &ldquo;Arena Game telah terbuka!&rdquo;</span>
          </div>
        )}
        <div className="block mt-1">
          <span className="text-xs font-black text-white bg-black/60 backdrop-blur-sm px-3.5 py-1 rounded-full border border-white/20 shadow">
            Pilih lokasi untuk memulai penjelajahan!
          </span>
        </div>

        {onOpenWorldPicker && (
          <div className="mt-2 flex justify-center">
            <button
              onClick={() => {
                sounds.playPop();
                onOpenWorldPicker();
              }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-amber-950/85 hover:bg-amber-900 border-2 border-amber-300 text-white font-black text-xs sm:text-sm shadow-xl backdrop-blur-sm cursor-pointer transition transform hover:scale-105 active:scale-95"
            >
              <span>🧭</span>
              <span>Dunia Aktif: Kelas {selectedClass} • {subject ? `${subject.emoji} ${subject.name}` : 'Materi'}</span>
              <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-black">
                Ganti Dunia ▾
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Interactive Map Board Overlay */}
      <div className="relative z-10 w-full max-w-4xl aspect-[4/3] sm:aspect-[16/10] rounded-3xl sm:rounded-[45px] border-4 sm:border-6 border-amber-300/80 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden p-3 sm:p-5 bg-black/20 backdrop-blur-[1px]">
        {/* Inner glow frame */}
        <div className="absolute inset-0 border-2 border-white/30 rounded-3xl pointer-events-none" />

        {/* SVG Dotted Navigation Trails connecting spots */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {/* Path Desa (14, 70) to Hutan (38, 46) */}
          <path
            d="M 14% 70% Q 24% 60% 38% 46%"
            fill="none"
            stroke="#FEF3C7"
            strokeWidth="4.5"
            strokeDasharray="8 8"
            className="drop-shadow"
          />
          {/* Path Desa (14, 70) to Desa Misi (18, 26) */}
          <path
            d="M 14% 70% Q 12% 48% 18% 26%"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeDasharray="5 5"
            opacity="0.6"
          />
          {/* Path Desa (14, 70) to Gua Puzzle (38, 80) */}
          <path
            d="M 14% 70% Q 25% 78% 38% 80%"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeDasharray="5 5"
            opacity="0.6"
          />
          {/* Path Hutan (38, 46) to Bioskop (58, 28) */}
          <path
            d="M 38% 46% Q 48% 34% 58% 28%"
            fill="none"
            stroke="#FEF3C7"
            strokeWidth="4"
            strokeDasharray="6 6"
            className="drop-shadow"
          />
          {/* Path Hutan (38, 46) to Arena Game (68, 56) */}
          <path
            d="M 38% 46% Q 54% 54% 68% 56%"
            fill="none"
            stroke="#FEF3C7"
            strokeWidth="4.5"
            strokeDasharray="8 8"
            className="drop-shadow"
          />
          {/* Path Bioskop (58, 28) to Pulau Tantangan (86, 26) */}
          <path
            d="M 58% 28% Q 72% 24% 86% 26%"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeDasharray="5 5"
            opacity="0.6"
          />
          {/* Path Gua Puzzle (38, 80) to Menara Prestasi (60, 84) */}
          <path
            d="M 38% 80% Q 50% 84% 60% 84%"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeDasharray="5 5"
            opacity="0.6"
          />
          {/* Path Arena Game (68, 56) to Menara (60, 84) */}
          <path
            d="M 68% 56% Q 65% 72% 60% 84%"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeDasharray="5 5"
            opacity="0.6"
          />
          {/* Path Arena Game (68, 56) to Istana Final Quest (86, 78) */}
          <path
            d="M 68% 56% Q 78% 66% 86% 78%"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeDasharray="5 5"
            opacity="0.6"
          />
          {/* Path Menara (60, 84) to Istana Final Quest (86, 78) */}
          <path
            d="M 60% 84% Q 74% 86% 86% 78%"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeDasharray="5 5"
            opacity="0.6"
          />
        </svg>

        {/* Map Compass Rose */}
        <div className="absolute top-3 right-3 sm:top-5 sm:right-5 w-12 h-12 sm:w-16 sm:h-16 bg-white/90 backdrop-blur-md rounded-full border-2 border-amber-400 flex items-center justify-center shadow-xl pointer-events-none z-20">
          <div className="text-center">
            <span className="text-[10px] font-black text-amber-800 block -mb-1">U</span>
            <Compass size={24} className="text-amber-700 animate-spin-slow" />
          </div>
        </div>

        {/* Interactive Location Markers */}
        {MAP_LOCATIONS.map((loc) => {
          const isUnlocked = unlockedAreas.includes(loc.id);
          const isHutan = loc.id === 'hutan';
          const isArena = loc.id === 'arena';

          return (
            <div
              key={loc.id}
              id={`map-loc-${loc.id}`}
              style={{
                left: `${loc.x}%`,
                top: `${loc.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              onClick={() => handleLocationClick(loc)}
              className="absolute z-20 flex flex-col items-center group cursor-pointer"
            >
              {/* Pulsing ring indicator for active primary objective */}
              {isUnlocked && (isHutan || (isArena && completedMission)) && (
                <div className="absolute -inset-2.5 bg-amber-400/50 rounded-full animate-ping pointer-events-none" />
              )}

              {/* Pin Icon Bubble */}
              <div
                className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl p-1.5 flex items-center justify-center transition-all duration-300 transform group-hover:scale-115 group-active:scale-95 shadow-2xl border-4 ${
                  isUnlocked
                    ? `bg-gradient-to-b ${loc.bgGradient} ${loc.borderColor} text-white ring-4 ring-amber-300/60`
                    : 'bg-slate-700 border-slate-600 text-slate-300 opacity-90'
                }`}
              >
                {/* World Icon */}
                <span className="text-2xl sm:text-3xl filter drop-shadow">
                  {loc.emoji}
                </span>

                {/* Lock or Unlock badge */}
                <div
                  className={`absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-md ${
                    isUnlocked
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-900 text-amber-300 border border-slate-700'
                  }`}
                >
                  {isUnlocked ? <Unlock size={12} strokeWidth={3} /> : <Lock size={12} strokeWidth={3} />}
                </div>

                {/* Sparkle badge for unlocked forest */}
                {isUnlocked && isHutan && (
                  <Sparkles
                    size={16}
                    className="absolute -bottom-1 -left-1 text-yellow-300 animate-spin"
                  />
                )}
              </div>

              {/* Location Label Pill */}
              <div
                className={`mt-1 sm:mt-1.5 px-3 py-1 rounded-full font-black text-[11px] sm:text-xs tracking-tight shadow-xl whitespace-nowrap transition-transform group-hover:-translate-y-0.5 border ${
                  isUnlocked
                    ? 'bg-white text-slate-900 border-amber-300'
                    : 'bg-slate-900/90 text-slate-300 border-slate-700'
                }`}
              >
                {loc.name}
              </div>

              {/* Enter Button Tag for Hutan */}
              {isHutan && (
                <div className="mt-1 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 font-black text-[10px] shadow-lg animate-bounce">
                  <Play size={10} fill="currentColor" />
                  <span>MASUK</span>
                </div>
              )}

              {/* Special Tag for Unlocked Arena */}
              {isArena && isUnlocked && (
                <div className="mt-1 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-black text-[10px] shadow-lg animate-bounce">
                  <span>✨ TERBUKA!</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Guidance Box */}
      <div className="relative z-10 mt-2 text-center max-w-md bg-white/95 backdrop-blur-md border-2 border-emerald-400 px-4 py-2 rounded-2xl shadow-xl">
        <p className="text-xs sm:text-sm font-extrabold text-emerald-950">
          💡 Tips: Klik <span className="text-emerald-700 underline font-black">🌳 Hutan Pengetahuan</span> untuk mulai petualangan sains pertamamu!
        </p>
      </div>

      {/* Modal Details for Locked or other locations */}
      {selectedLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border-4 border-amber-300 shadow-2xl text-center relative">
            <button
              onClick={() => {
                sounds.playPop();
                setSelectedLocation(null);
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center"
            >
              <X size={18} />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-3xl mx-auto flex items-center justify-center mb-3">
              {selectedLocation.emoji}
            </div>

            <h3 className="text-xl font-black text-slate-800 font-['Fredoka',sans-serif]">
              {selectedLocation.name}
            </h3>

            <div className="my-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              {unlockedAreas.includes(selectedLocation.id) ? (
                <>
                  <Unlock size={14} className="text-emerald-500" />
                  <span className="text-emerald-600">Area Terbuka</span>
                </>
              ) : (
                <>
                  <Lock size={14} className="text-rose-500" />
                  <span className="text-rose-600">Area Masih Terkunci 🔒</span>
                </>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 my-3 leading-relaxed">
              {selectedLocation.description}
            </p>

            {!unlockedAreas.includes(selectedLocation.id) && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 font-bold mb-4">
                ⭐ Selesaikan misi di Hutan Pengetahuan untuk membuka area baru di EDUVERSE!
              </div>
            )}

            <button
              onClick={() => {
                sounds.playPop();
                setSelectedLocation(null);
              }}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow cursor-pointer"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}

      {/* Modal Desa Petualang */}
      {showVillageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border-4 border-amber-400 shadow-2xl text-center relative">
            <button
              onClick={() => {
                sounds.playPop();
                setShowVillageModal(false);
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center"
            >
              <X size={18} />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-3xl mx-auto flex items-center justify-center mb-3">
              🏠
            </div>

            <h3 className="text-2xl font-black text-slate-800 font-['Fredoka',sans-serif]">
              Desa Petualang
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-0.5 rounded-full inline-block mt-1">
              Pusat Warga EDUVERSE
            </span>

            <div className="my-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left">
              <p className="text-sm font-bold text-slate-800">
                👋 Halo petualang hebat, <span className="text-amber-600">{studentName || 'Siswa Pintar'}</span>!
              </p>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Selamat datang di Desa Petualang! Hutan Pengetahuan di timur sedang membutuhkan bantuan detektif sains. Ayo masuk ke Hutan Pengetahuan untuk belajar tentang aneka energi dan kumpulkan XP pertamamu!
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  sounds.playPop();
                  setShowVillageModal(false);
                }}
                className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm cursor-pointer"
              >
                Tetap di Sini
              </button>
              <button
                onClick={() => {
                  sounds.playPop();
                  setShowVillageModal(false);
                  onEnterForest();
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-sm shadow-md cursor-pointer"
              >
                🌳 Pergi ke Hutan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
