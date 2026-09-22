import React, { useState } from 'react';
import { CharacterId } from '../types';
import { CharacterView, CHARACTERS_DATA } from './Characters';
import { sounds } from '../utils/audio';
import { Check, ArrowRight, User, Sparkles } from 'lucide-react';
import { GAME_ASSETS } from '../assets/gameAssets';

interface CharacterSelectProps {
  onConfirm: (characterId: CharacterId, studentName: string) => void;
  initialCharacter?: CharacterId | null;
  initialName?: string;
  onBackToHome?: () => void;
}

export const CharacterSelectScreen: React.FC<CharacterSelectProps> = ({
  onConfirm,
  initialCharacter = null,
  initialName = '',
  onBackToHome,
}) => {
  const [selectedId, setSelectedId] = useState<CharacterId | null>(initialCharacter || 'fatimah');
  const [name, setName] = useState<string>(initialName);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [showProfileCard, setShowProfileCard] = useState<boolean>(false);

  const handleSelectCharacter = (id: CharacterId) => {
    sounds.playPop();
    setSelectedId(id);
  };

  const handleProceed = () => {
    const trimmedName = name.trim();
    if (!selectedId) {
      sounds.playWrong();
      setErrorMsg('Silakan pilih salah satu karakter petualang terlebih dahulu!');
      return;
    }
    if (!trimmedName) {
      sounds.playWrong();
      setErrorMsg('Silakan masukkan nama petualang terlebih dahulu!');
      return;
    }

    sounds.playUnlock();
    setShowProfileCard(true);
  };

  const handleConfirmProfile = () => {
    sounds.playFanfare();
    if (selectedId && name.trim()) {
      onConfirm(selectedId, name.trim());
    }
  };

  const selectedCharData = CHARACTERS_DATA.find((c) => c.id === selectedId);

  return (
    <div className="relative min-h-screen w-full bg-slate-900 py-8 px-4 sm:px-6 flex flex-col items-center justify-center select-none overflow-x-hidden">
      {/* Background with Real Atmospheric Depth */}
      <div className="absolute inset-0 z-0">
        <img
          src={GAME_ASSETS.backgrounds.heroOpening}
          alt="Adventure Background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter blur-xs brightness-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/80 to-slate-950/90" />
      </div>

      {/* Top Header */}
      <div className="relative z-10 text-center max-w-xl mb-6">
        {onBackToHome && (
          <button
            onClick={() => {
              sounds.playPop();
              onBackToHome();
            }}
            className="mb-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold shadow-sm transition backdrop-blur-sm cursor-pointer"
          >
            ← Kembali ke Menu Utama
          </button>
        )}

        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-400 text-amber-950 font-extrabold text-xs uppercase tracking-wider mb-2 shadow">
          <Sparkles size={14} className="text-amber-800" />
          <span>Pilih Sahabat Petualang</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white drop-shadow-md font-['Fredoka',sans-serif] uppercase tracking-wide">
          SIAPA PETUALANGMU?
        </h1>
        <p className="text-slate-200 font-medium text-sm sm:text-base mt-2">
          Pilih salah satu karakter dan tuliskan namamu untuk memulai penjelajahan seru!
        </p>
      </div>

      {/* Characters Cards Container */}
      <div className="relative z-10 w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
        {CHARACTERS_DATA.map((char) => {
          const isSelected = selectedId === char.id;
          return (
            <div
              key={char.id}
              id={`card-character-${char.id}`}
              onClick={() => handleSelectCharacter(char.id)}
              className={`relative cursor-pointer rounded-3xl p-5 sm:p-6 transition-all duration-300 flex flex-col items-center text-center border-4 ${
                isSelected
                  ? 'bg-white border-amber-400 shadow-2xl scale-[1.03] ring-4 ring-amber-300/60'
                  : 'bg-white/90 border-slate-300 hover:border-amber-300 hover:bg-white shadow-lg'
              }`}
            >
              {/* Checkmark badge */}
              {isSelected && (
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg animate-bounce z-20">
                  <Check size={20} strokeWidth={3} />
                </div>
              )}

              {/* Character 3D Avatar Box */}
              <div
                className={`relative w-36 h-44 sm:w-40 sm:h-48 rounded-2xl bg-gradient-to-b ${char.avatarBg} flex items-center justify-center p-2 mb-3 shadow-inner overflow-hidden`}
              >
                <CharacterView id={char.id} size="lg" isCheering={isSelected} />
              </div>

              {/* Character Details */}
              <h2 className="text-2xl font-black text-slate-800 font-['Fredoka',sans-serif] flex items-center gap-1.5">
                <span>{char.id === 'fatimah' ? '👧' : '👦'}</span>
                <span>{char.name}</span>
              </h2>
              <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-black text-white ${
                char.id === 'fatimah' ? 'bg-emerald-600' : 'bg-sky-600'
              }`}>
                {char.id === 'fatimah' ? 'Alya — perempuan berhijab' : 'Rafi — laki-laki'}
              </span>

              <p className="text-xs text-slate-600 mt-2 line-clamp-2 px-1 leading-relaxed">
                {char.description}
              </p>

              {/* Trait badges */}
              <div className="flex flex-wrap justify-center gap-1 mt-3">
                {char.traits?.map((trait, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {trait}
                  </span>
                ))}
              </div>

              {/* Choose button inside card */}
              <button
                type="button"
                id={`btn-select-${char.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectCharacter(char.id);
                }}
                className={`mt-4 w-full py-2.5 px-4 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md font-black'
                    : 'bg-slate-100 hover:bg-amber-100 text-slate-700 border border-slate-300'
                }`}
              >
                {isSelected ? '✓ KARAKTER TERPILIH' : 'PILIH KARAKTER INI'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Name Input Box */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-300 shadow-xl mb-6">
        <label
          htmlFor="student-name-input"
          className="block text-slate-800 font-extrabold text-sm sm:text-base mb-2 flex items-center gap-2"
        >
          <User size={18} className="text-amber-500" />
          <span>Masukkan nama petualang</span>
        </label>
        <div className="relative">
          <input
            id="student-name-input"
            type="text"
            maxLength={25}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            placeholder="Masukkan nama petualang..."
            className="w-full py-3.5 px-4 rounded-2xl border-2 border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200 text-slate-800 font-bold text-base outline-none transition bg-amber-50/50 shadow-inner"
          />
        </div>

        {errorMsg && (
          <p className="text-rose-600 font-bold text-xs mt-2 text-center animate-shake">
            ⚠️ {errorMsg}
          </p>
        )}
      </div>

      {/* LANJUTKAN Button */}
      <div className="relative z-10 w-full max-w-md">
        <button
          id="btn-continue-to-map"
          onClick={handleProceed}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 border-4 border-emerald-300 text-white font-black text-lg sm:text-xl shadow-[0_6px_0_#065f46] hover:shadow-[0_2px_0_#065f46] active:shadow-none transform active:translate-y-1.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>LANJUTKAN</span>
          <ArrowRight size={22} />
        </button>
      </div>

      {/* 2. Small Profile Panel (Panel Kecil Profil Petualang) */}
      {showProfileCard && selectedCharData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in select-none">
          <div className="bg-white rounded-3xl max-w-sm w-full border-4 border-amber-400 shadow-2xl overflow-hidden p-5 flex flex-col items-center text-center animate-scale-up">
            <div className="w-12 h-12 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-2xl mb-2">
              🎉
            </div>
            <h3 className="text-xl font-black text-slate-800 font-['Fredoka',sans-serif]">
              Profil Petualang Siap!
            </h3>
            <p className="text-xs text-slate-500 font-bold mb-4">
              Selamat bergabung di petualangan EDUVERSE
            </p>

            {/* Panel Kecil Info */}
            <div className="w-full bg-gradient-to-b from-amber-50 to-sky-50 border-2 border-amber-200 rounded-2xl p-4 mb-5 shadow-inner text-left space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-16 h-20 rounded-xl bg-gradient-to-b from-sky-300 to-blue-400 border border-white shadow flex items-center justify-center overflow-hidden shrink-0">
                  <CharacterView id={selectedCharData.id} size="avatar" isCheering={true} className="scale-150" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
                    Nama Siswa
                  </span>
                  <h4 className="text-lg font-black text-slate-900 leading-tight">
                    {name.trim()}
                  </h4>
                  <span className="text-xs font-bold text-sky-700">
                    Karakter: {selectedCharData.name} ({selectedCharData.id === 'fatimah' ? 'Alya' : 'Rafi'})
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-amber-200/80 text-center">
                <div className="bg-white/80 rounded-xl p-1.5 border border-amber-200 shadow-xs">
                  <span className="text-[10px] font-black text-amber-800 block">⭐ XP</span>
                  <span className="text-sm font-black text-slate-800">0</span>
                </div>
                <div className="bg-white/80 rounded-xl p-1.5 border border-amber-200 shadow-xs">
                  <span className="text-[10px] font-black text-emerald-800 block">🏅 Badge</span>
                  <span className="text-sm font-black text-slate-800">0</span>
                </div>
                <div className="bg-white/80 rounded-xl p-1.5 border border-amber-200 shadow-xs">
                  <span className="text-[10px] font-black text-purple-800 block">🎯 Level</span>
                  <span className="text-sm font-black text-slate-800">1</span>
                </div>
              </div>
            </div>

            <button
              id="btn-confirm-profile-proceed"
              onClick={handleConfirmProfile}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-base shadow-lg cursor-pointer transform hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2"
            >
              <span>BUKA PETA PETUALANGAN</span>
              <span>🗺️</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
