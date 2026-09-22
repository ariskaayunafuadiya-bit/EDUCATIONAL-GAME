import React from 'react';
import { CharacterView } from './Characters';
import { sounds } from '../utils/audio';
import { Sparkles, Rocket, GraduationCap } from 'lucide-react';
import { GAME_ASSETS } from '../assets/gameAssets';

interface OpeningScreenProps {
  onStart: () => void;
  hasExistingSave: boolean;
  onContinue: () => void;
  studentName?: string;
  onOpenTeacherPortal?: () => void;
}

export const OpeningScreen: React.FC<OpeningScreenProps> = ({
  onStart,
  hasExistingSave,
  onContinue,
  studentName,
  onOpenTeacherPortal,
}) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between overflow-hidden select-none p-4 sm:p-6 bg-slate-900">
      {/* Real Cinematic 3D Landscape Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={GAME_ASSETS.backgrounds.heroOpening}
          alt="EDUVERSE World"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transform scale-105 filter brightness-105 contrast-105"
        />
        {/* Soft Vignette and Lighting Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-black/30 pointer-events-none" />
      </div>

      {/* Floating Animated Sparkles & Atmosphere */}
      <div className="absolute top-12 left-10 text-amber-200 text-lg animate-ping pointer-events-none z-10">✨</div>
      <div className="absolute top-24 right-16 text-yellow-100 text-xl animate-ping pointer-events-none z-10">✨</div>
      <div className="absolute bottom-32 left-1/4 text-emerald-200 text-sm animate-ping pointer-events-none z-10">✨</div>

      {/* Header Title Section */}
      <div className="mt-4 sm:mt-8 z-10 text-center max-w-2xl px-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/90 backdrop-blur-md border-2 border-amber-300 rounded-full text-amber-950 font-extrabold text-xs sm:text-sm shadow-xl mb-3">
          <Sparkles size={16} className="text-amber-500 animate-spin" />
          <span>Platform Petualangan Belajar MI Kelas 1–6</span>
        </div>

        {/* Main Logo / Title */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] font-['Fredoka',sans-serif]">
          EDUVERSE
        </h1>
        <p className="mt-2 text-xl sm:text-2xl md:text-3xl font-extrabold text-amber-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          &ldquo;Petualangan Belajar Tanpa Batas&rdquo;
        </p>
      </div>

      {/* Center 3D Characters Showcase */}
      <div className="relative w-full max-w-4xl my-auto py-4 flex items-end justify-center z-10">
        <div className="relative flex items-end justify-center gap-6 sm:gap-14">
          {/* Aisyah / Alya Character Card */}
          <div
            className="flex flex-col items-center group cursor-pointer transition-transform duration-300 hover:scale-105"
            onClick={() => sounds.playPop()}
          >
            <div className="relative">
              <CharacterView id="fatimah" size="lg" isCheering={true} />
              <div className="absolute -bottom-2 inset-x-0 mx-auto w-24 sm:w-28 py-1 bg-emerald-600 border-2 border-white text-white font-black text-xs sm:text-sm rounded-full shadow-lg text-center">
                👧 Alya
              </div>
            </div>
            <span className="mt-3 px-3 py-0.5 bg-black/60 backdrop-blur-sm text-emerald-200 text-[11px] font-bold rounded-full border border-emerald-400/50">
              Perempuan Berhijab
            </span>
          </div>

          {/* Center Welcome Bubble */}
          <div className="hidden md:flex flex-col items-center mb-10 bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl border-2 border-amber-300 shadow-2xl max-w-[210px] text-center animate-bounce">
            <span className="text-xl">🎒</span>
            <p className="text-xs font-black text-slate-800 leading-tight mt-1">
              Jelajahi dunia pengetahuan bersama kami!
            </p>
          </div>

          {/* Rafi Character Card */}
          <div
            className="flex flex-col items-center group cursor-pointer transition-transform duration-300 hover:scale-105"
            onClick={() => sounds.playPop()}
          >
            <div className="relative">
              <CharacterView id="ali" size="lg" isCheering={true} facing="left" />
              <div className="absolute -bottom-2 inset-x-0 mx-auto w-24 sm:w-28 py-1 bg-sky-600 border-2 border-white text-white font-black text-xs sm:text-sm rounded-full shadow-lg text-center">
                👦 Rafi
              </div>
            </div>
            <span className="mt-3 px-3 py-0.5 bg-black/60 backdrop-blur-sm text-sky-200 text-[11px] font-bold rounded-full border border-sky-400/50">
              Laki-Laki
            </span>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="z-10 w-full max-w-md flex flex-col items-center gap-3 pb-6">
        {hasExistingSave && (
          <button
            id="btn-continue-adventure"
            onClick={() => {
              sounds.playUnlock();
              onContinue();
            }}
            className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 border-2 border-white/80 text-white font-black text-base sm:text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 active:translate-y-0 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>⏩ Lanjutkan Petualangan ({studentName || 'Petualang'})</span>
          </button>
        )}

        <button
          id="btn-start-adventure"
          onClick={() => {
            sounds.playFanfare();
            onStart();
          }}
          className="w-full py-4 sm:py-5 px-6 rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-500 border-4 border-amber-200 text-white font-black text-xl sm:text-2xl shadow-[0_8px_0_#b45309] hover:shadow-[0_4px_0_#b45309] active:shadow-none transform active:translate-y-2 transition-all flex items-center justify-center gap-3 cursor-pointer group"
        >
          <Rocket size={28} className="group-hover:rotate-12 transition-transform" />
          <span>🚀 MULAI PETUALANGAN</span>
        </button>

        {onOpenTeacherPortal && (
          <button
            id="btn-open-teacher-portal"
            onClick={() => {
              sounds.playPop();
              onOpenTeacherPortal();
            }}
            className="mt-1 text-xs sm:text-sm font-black text-amber-200 hover:text-white bg-slate-950/80 hover:bg-slate-900 border border-amber-300/40 hover:border-amber-300 px-4 py-2 rounded-2xl shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <GraduationCap size={16} className="text-amber-400" />
            <span>👩‍🏫 Masuk Portal Guru MI (Kelola Materi & Game)</span>
          </button>
        )}

        <p className="text-white drop-shadow font-extrabold text-sm sm:text-base tracking-wide mt-1">
          Belajar • Bermain • Menjelajah
        </p>
      </div>
    </div>
  );
};
