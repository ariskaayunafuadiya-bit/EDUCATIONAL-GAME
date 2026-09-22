import React from 'react';
import { CharacterId, ClassGrade } from '../types';
import { CharacterView } from './Characters';
import { sounds } from '../utils/audio';
import { getLevelDetail } from '../utils/levels';
import { Volume2, VolumeX, Compass, GraduationCap } from 'lucide-react';
import { ContentStore } from '../utils/contentStore';

interface TopHUDProps {
  studentName: string;
  characterId: CharacterId | null;
  xp: number;
  level: number;
  badgeCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenMap: () => void;
  onOpenProfile: () => void;
  onOpenMisi: () => void;
  onOpenBadges?: () => void;
  currentScreen: string;
  hasActiveMisiNotification?: boolean;
  selectedClass?: ClassGrade;
  selectedSubjectId?: string;
  onOpenWorldPicker?: () => void;
  onOpenTeacherPortal?: () => void;
}

export const TopHUD: React.FC<TopHUDProps> = ({
  studentName,
  characterId,
  xp,
  level: _level,
  badgeCount,
  soundEnabled,
  onToggleSound,
  onOpenMap,
  onOpenProfile,
  onOpenMisi,
  onOpenBadges,
  currentScreen,
  hasActiveMisiNotification,
  selectedClass = 4,
  selectedSubjectId = 'ipas',
  onOpenWorldPicker,
  onOpenTeacherPortal,
}) => {
  const levelData = getLevelDetail(xp);
  const currentLevel = levelData.currentLevel;

  const subject = ContentStore.getSubjects().find((s) => s.id === selectedSubjectId);

  return (
    <header className="sticky top-0 z-40 w-full px-2 sm:px-4 md:px-6 py-2 bg-white/95 backdrop-blur-md border-b-2 border-amber-200/90 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Player Profile Pill & Level Info */}
        <div className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300/80 px-2.5 py-1.5 rounded-2xl shadow-xs">
          <div
            onClick={() => {
              sounds.playPop();
              onOpenProfile();
            }}
            className="cursor-pointer relative w-10 h-10 rounded-xl bg-gradient-to-b from-sky-300 to-sky-500 border-2 border-white shadow flex items-center justify-center overflow-hidden hover:scale-105 active:scale-95 transition-transform shrink-0"
            title="Buka Profil Petualang"
          >
            {characterId ? (
              <CharacterView id={characterId} size="avatar" className="scale-125 translate-y-1" />
            ) : (
              <span className="text-lg">🎒</span>
            )}
            <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[9px] font-black px-1 rounded-full border border-white">
              Lv.{currentLevel.level}
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-black text-slate-900 leading-tight truncate max-w-[90px] sm:max-w-[120px]">
                👤 {studentName || 'Petualang'}
              </span>
              <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 hidden xs:inline-block">
                {currentLevel.emoji} {currentLevel.title}
              </span>
            </div>

            {/* Level progress bar */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-16 sm:w-20 h-2 bg-amber-200/80 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${levelData.progressPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-amber-900">
                {levelData.xpInTier}/{levelData.tierTotalXp} XP
              </span>
            </div>
          </div>
        </div>

        {/* Center: Dynamic World Realm Selector Badge */}
        {onOpenWorldPicker && (
          <button
            onClick={() => {
              sounds.playPop();
              onOpenWorldPicker();
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border-2 border-emerald-300 hover:border-emerald-500 shadow-xs transition transform hover:scale-105 active:scale-95 cursor-pointer text-left"
            title="Ganti Kelas & Mata Pelajaran"
          >
            <div className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-sm shadow-xs shrink-0">
              <Compass size={16} />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-[9px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                  Kelas {selectedClass}
                </span>
                <span className="text-[9px] font-black uppercase tracking-wider text-teal-700">
                  Dunia Belajar ▾
                </span>
              </div>
              <p className="text-xs font-black text-slate-800 leading-tight font-['Fredoka',sans-serif]">
                {subject ? `${subject.emoji} ${subject.name}` : 'Pilih Map Belajar'}
              </p>
            </div>
          </button>
        )}

        {/* Center-Right: Stats Badges (XP & Badges) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* XP Pill */}
          <div
            id="hud-xp-badge"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-gradient-to-b from-amber-100 to-amber-200/90 border-2 border-amber-300 rounded-xl shadow-xs"
          >
            <span className="text-base sm:text-lg animate-spin-slow">⭐</span>
            <div className="flex flex-col leading-none">
              <span className="text-[9px] uppercase font-black text-amber-800 tracking-wider">XP</span>
              <span className="text-xs sm:text-sm font-black text-amber-950 font-['Fredoka',sans-serif]">
                {xp}
              </span>
            </div>
          </div>

          {/* Badge Count Pill */}
          <div
            id="hud-badges-badge"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-gradient-to-b from-purple-100 to-purple-200/90 border-2 border-purple-300 rounded-xl shadow-xs"
          >
            <span className="text-base sm:text-lg">🏅</span>
            <div className="flex flex-col leading-none">
              <span className="text-[9px] uppercase font-black text-purple-800 tracking-wider">Badge</span>
              <span className="text-xs sm:text-sm font-black text-purple-950 font-['Fredoka',sans-serif]">
                {badgeCount}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* 🗺️ Peta Button */}
          <button
            id="btn-hud-peta"
            onClick={() => {
              sounds.playPop();
              onOpenMap();
            }}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl border-2 font-black text-xs sm:text-sm flex items-center gap-1 shadow-xs active:scale-95 transition cursor-pointer ${
              currentScreen === 'MAP'
                ? 'bg-emerald-500 border-emerald-600 text-white'
                : 'bg-gradient-to-b from-emerald-100 to-emerald-200 hover:from-emerald-200 hover:to-emerald-300 border-emerald-400 text-emerald-950'
            }`}
            title="Buka Peta Petualangan"
          >
            <span>🗺️</span>
            <span className="hidden sm:inline font-bold">PETA</span>
          </button>

          {/* 🔎 Misi Button */}
          <button
            id="btn-hud-misi"
            onClick={() => {
              sounds.playPop();
              onOpenMisi();
            }}
            className="relative px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-b from-yellow-200 to-amber-300 hover:from-yellow-300 hover:to-amber-400 border-2 border-amber-400 text-amber-950 font-bold text-xs sm:text-sm flex items-center gap-1 shadow-xs active:scale-95 transition cursor-pointer"
            title="Lihat Misi Petualangan"
          >
            <span>🔎</span>
            <span className="hidden sm:inline">MISI</span>
            {hasActiveMisiNotification && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 border-2 border-white rounded-full animate-ping" />
            )}
          </button>

          {/* 🏅 Badge Button */}
          <button
            id="btn-hud-badge"
            onClick={() => {
              sounds.playPop();
              if (onOpenBadges) onOpenBadges();
              else onOpenProfile();
            }}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-b from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 border-2 border-purple-400 text-purple-950 font-bold text-xs sm:text-sm flex items-center gap-1 shadow-xs active:scale-95 transition cursor-pointer"
            title="Lihat Koleksi Badge / Lencana"
          >
            <span>🏅</span>
            <span className="hidden sm:inline">BADGE</span>
          </button>

          {/* 👤 Profil Button */}
          <button
            id="btn-hud-profil"
            onClick={() => {
              sounds.playPop();
              onOpenProfile();
            }}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-b from-sky-100 to-sky-200 hover:from-sky-200 hover:to-sky-300 border-2 border-sky-400 text-sky-950 font-bold text-xs sm:text-sm flex items-center gap-1 shadow-xs active:scale-95 transition cursor-pointer"
            title="Lihat Profil Petualang"
          >
            <span>👤</span>
            <span className="hidden sm:inline">PROFIL</span>
          </button>

          {/* 👩‍🏫 Portal Guru Button */}
          {onOpenTeacherPortal && (
            <button
              onClick={() => {
                sounds.playPop();
                onOpenTeacherPortal();
              }}
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-b from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-black text-xs flex items-center gap-1 shadow-xs active:scale-95 transition cursor-pointer"
              title="Masuk ke Portal Dashboard Guru MI"
            >
              <GraduationCap size={15} />
              <span className="hidden md:inline">GURU</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            id="btn-hud-sound"
            onClick={() => {
              sounds.playPop();
              onToggleSound();
            }}
            className="w-8.5 h-8.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 transition active:scale-95 shadow-xs cursor-pointer ml-0.5"
            title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? <Volume2 size={16} className="text-emerald-600" /> : <VolumeX size={16} className="text-slate-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
