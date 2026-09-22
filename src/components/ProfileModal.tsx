import React from 'react';
import { CharacterId } from '../types';
import { CharacterView, CHARACTERS_DATA } from './Characters';
import { sounds } from '../utils/audio';
import { getLevelDetail } from '../utils/levels';
import { X, Award, RotateCcw, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface ProfileModalProps {
  onClose: () => void;
  studentName: string;
  characterId: CharacterId | null;
  xp: number;
  level: number;
  badges: string[];
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetProgress: () => void;
}

const ALL_BADGES = [
  {
    id: 'detektif_energi',
    title: 'Detektif Energi',
    description: 'Menemukan benda-benda pengguna energi listrik di Hutan Pengetahuan.',
    icon: '⚡',
  },
  {
    id: 'pembelajar_giat',
    title: 'Pembelajar IPAS',
    description: 'Menuntaskan kartu materi energi di Pondok Materi.',
    icon: '📚',
  },
  {
    id: 'penonton_cerdas',
    title: 'Siswa Penasaran',
    description: 'Menonton video animasi sains di Bioskop Belajar.',
    icon: '🎬',
  },
  {
    id: 'penjelajah_alam',
    title: 'Penjelajah Rimba',
    description: 'Menjelajahi setiap sudut Hutan Pengetahuan EDUVERSE.',
    icon: '🌲',
  },
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  onClose,
  studentName,
  characterId,
  xp,
  level: _level,
  badges,
  soundEnabled,
  onToggleSound,
  onResetProgress,
}) => {
  const charData = CHARACTERS_DATA.find((c) => c.id === characterId);
  const levelData = getLevelDetail(xp);
  const currentTier = levelData.currentLevel;
  const nextTier = levelData.nextLevel;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-white rounded-3xl max-w-md w-full border-4 border-amber-300 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 px-5 py-3 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👤</span>
            <div>
              <h3 className="text-lg sm:text-xl font-black font-['Fredoka',sans-serif] leading-tight">
                Profil Petualang
              </h3>
              <p className="text-xs text-sky-100 font-bold">
                Data Pencapaian & Karakter Siswa
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* Avatar & Name Card */}
          <div className="bg-gradient-to-b from-sky-50 to-amber-50 border-2 border-sky-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
            <div className="w-24 h-28 rounded-2xl bg-gradient-to-b from-sky-300 to-blue-400 flex items-center justify-center p-1 border-2 border-white shadow overflow-hidden shrink-0">
              {characterId && <CharacterView id={characterId} size="md" isCheering={true} />}
            </div>
            <div className="flex-1">
              <span className="text-[10px] uppercase font-black tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full inline-block mb-1">
                {charData?.title || 'Petualang Edukasi'}
              </span>
              <h4 className="text-xl font-black text-slate-800 font-['Fredoka',sans-serif] leading-tight">
                {studentName || 'Petualang'}
              </h4>
              <p className="text-xs text-slate-600 font-bold mt-0.5">
                Karakter: {charData?.name || (characterId === 'fatimah' ? 'Alya' : 'Rafi')}
              </p>

              <div className="flex items-center gap-2 mt-2">
                <span className="px-2.5 py-1 rounded-xl bg-amber-200 text-amber-950 font-black text-xs border border-amber-300">
                  {currentTier.emoji} Lv.{currentTier.level} {currentTier.title}
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-emerald-200 text-emerald-950 font-black text-xs border border-emerald-300">
                  ⭐ {xp} XP
                </span>
              </div>
            </div>
          </div>

          {/* Level Progression Card */}
          <div className="p-3.5 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-100 border-2 border-amber-300 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs font-black text-amber-950">
              <span className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-500" />
                <span>Level {currentTier.level}: {currentTier.title}</span>
              </span>
              {nextTier ? (
                <span className="text-amber-800 font-bold">
                  Next: Lv.{nextTier.level} {nextTier.title}
                </span>
              ) : (
                <span className="text-emerald-700 font-bold">Level Maksimum 👑</span>
              )}
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-white rounded-full overflow-hidden p-0.5 border border-amber-300 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-yellow-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${levelData.progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
              <span>{levelData.xpInTier} / {levelData.tierTotalXp} XP di Level ini</span>
              {nextTier ? (
                <span className="text-amber-900 font-black">
                  Butuh {levelData.xpNeededForNext} XP lagi
                </span>
              ) : (
                <span className="text-emerald-800 font-black">Selamat! Kamu Master!</span>
              )}
            </div>
          </div>

          {/* Badges Collection */}
          <div>
            <h5 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Award size={16} className="text-amber-500" />
              <span>Koleksi Lencana Penghargaan ({badges.length}/{ALL_BADGES.length})</span>
            </h5>

            <div className="grid grid-cols-2 gap-2.5">
              {ALL_BADGES.map((b) => {
                const isEarned = badges.includes(b.id);
                return (
                  <div
                    key={b.id}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center text-center transition ${
                      isEarned
                        ? 'bg-amber-50/90 border-amber-300 shadow-sm'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-1.5 shadow-xs ${
                        isEarned
                          ? 'bg-amber-200 text-amber-900 border border-amber-400'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {b.icon}
                    </div>
                    <span className="text-xs font-black text-slate-800 leading-tight">
                      {b.title}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1 leading-tight">
                      {isEarned ? '✓ Terbuka' : '🔒 Masih Terkunci'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Settings & Reset */}
          <div className="pt-2 border-t border-slate-200 space-y-2">
            <button
              onClick={() => {
                sounds.playPop();
                onToggleSound();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-between transition cursor-pointer"
            >
              <div className="flex items-center gap-2">
                {soundEnabled ? <Volume2 size={16} className="text-emerald-600" /> : <VolumeX size={16} />}
                <span>Efek Suara Game</span>
              </div>
              <span className="font-black text-slate-900">
                {soundEnabled ? 'Menyala' : 'Mati'}
              </span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Mulai ulang petualangan dari awal? Semua XP dan lencana akan direset.')) {
                  sounds.playPop();
                  onResetProgress();
                }
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Reset Data / Mulai Baru</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
