import React, { useState } from 'react';
import { ClassGrade, SubjectItem, MateriItem } from '../types';
import { CLASS_GRADES, ContentStore } from '../utils/contentStore';
import { sounds } from '../utils/audio';
import { X, Sparkles, BookOpen, ChevronRight, Award, Compass, ArrowLeft } from 'lucide-react';

interface ClassSubjectPickerModalProps {
  currentClass: ClassGrade;
  currentSubjectId: string;
  currentMateriId: string;
  onSelectWorld: (classGrade: ClassGrade, subjectId: string, materiId: string) => void;
  onClose?: () => void;
  isInitialSetup?: boolean; // if true, force them to pick before entering adventure
}

export const ClassSubjectPickerModal: React.FC<ClassSubjectPickerModalProps> = ({
  currentClass,
  currentSubjectId,
  currentMateriId,
  onSelectWorld,
  onClose,
  isInitialSetup = false,
}) => {
  const [step, setStep] = useState<'CLASS' | 'SUBJECT' | 'TOPIC'>('CLASS');
  const [selectedClass, setSelectedClass] = useState<ClassGrade>(currentClass || 4);
  const [selectedSubject, setSelectedSubject] = useState<SubjectItem | null>(() => {
    const subjects = ContentStore.getSubjects();
    return subjects.find((s) => s.id === currentSubjectId) || subjects[0] || null;
  });

  const subjects = ContentStore.getSubjects().filter((s) =>
    s.availableGrades.includes(selectedClass)
  );

  const materiList = selectedSubject
    ? ContentStore.getMateriByClassAndSubject(selectedClass, selectedSubject.id)
    : [];

  const handleChooseClass = (grade: ClassGrade) => {
    sounds.playPop();
    setSelectedClass(grade);
    setStep('SUBJECT');
  };

  const handleChooseSubject = (subject: SubjectItem) => {
    sounds.playPop();
    setSelectedSubject(subject);
    const availableMateri = ContentStore.getMateriByClassAndSubject(selectedClass, subject.id);
    if (availableMateri.length > 0) {
      setStep('TOPIC');
    } else {
      // Auto create or fallback
      onSelectWorld(selectedClass, subject.id, '');
      if (onClose) onClose();
    }
  };

  const handleChooseTopic = (materi: MateriItem) => {
    sounds.playUnlock();
    if (selectedSubject) {
      onSelectWorld(selectedClass, selectedSubject.id, materi.id);
      if (onClose) onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-md animate-fade-in select-none overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden my-auto">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-600 px-5 py-4 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
              🧭
            </div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-amber-100 bg-amber-700/40 px-2 py-0.5 rounded-full inline-block">
                Petualangan Belajar Eduverse
              </span>
              <h3 className="text-xl font-black font-['Fredoka',sans-serif] leading-tight">
                {step === 'CLASS' && 'PILIH KELAS PETUALANGAN'}
                {step === 'SUBJECT' && `MATA PELAJARAN • KELAS ${selectedClass}`}
                {step === 'TOPIC' && `PILIH TOPIK MATERI • ${selectedSubject?.name}`}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {step !== 'CLASS' && (
              <button
                onClick={() => {
                  sounds.playPop();
                  if (step === 'TOPIC') setStep('SUBJECT');
                  else if (step === 'SUBJECT') setStep('CLASS');
                }}
                className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-black flex items-center gap-1 cursor-pointer transition"
              >
                <ArrowLeft size={14} />
                <span>Kembali</span>
              </button>
            )}

            {!isInitialSetup && onClose && (
              <button
                onClick={() => {
                  sounds.playPop();
                  onClose();
                }}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
                title="Tutup"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto space-y-4">
          {/* STEP 1: CLASS SELECTION */}
          {step === 'CLASS' && (
            <div className="space-y-4">
              <div className="text-center max-w-md mx-auto">
                <p className="text-xs sm:text-sm font-bold text-slate-600">
                  Pilih tingkat kelasmu untuk menjelajahi materi pembelajaran dan tantangan seru sesuai kurikulum MI!
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {CLASS_GRADES.map((cg) => {
                  const isSelected = selectedClass === cg.grade;
                  return (
                    <button
                      key={cg.grade}
                      onClick={() => handleChooseClass(cg.grade)}
                      className={`group p-4 rounded-2xl border-3 flex flex-col items-center text-center transition-all transform hover:scale-105 active:scale-95 cursor-pointer relative shadow-sm ${
                        isSelected
                          ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-300'
                          : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-amber-300'
                      }`}
                    >
                      <span className="text-4xl mb-2 filter drop-shadow group-hover:scale-110 transition-transform">
                        {cg.icon}
                      </span>
                      <h4 className="text-base sm:text-lg font-black text-slate-800 font-['Fredoka',sans-serif]">
                        {cg.label}
                      </h4>
                      <p className="text-[11px] font-bold text-slate-500 mt-1 line-clamp-2">
                        {cg.description}
                      </p>
                      <span className="mt-2.5 text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        Jelajahi →
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: SUBJECT SELECTION */}
          {step === 'SUBJECT' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{CLASS_GRADES.find((c) => c.grade === selectedClass)?.icon}</span>
                  <div>
                    <h4 className="text-sm font-black text-slate-800">
                      Mata Pelajaran untuk Kelas {selectedClass}
                    </h4>
                    <p className="text-xs text-slate-500 font-bold">
                      Pilih dunia ilmu yang ingin kamu masuki hari ini:
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setStep('CLASS')}
                  className="text-xs font-black text-amber-700 hover:text-amber-800 underline cursor-pointer"
                >
                  Ganti Kelas
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {subjects.map((sub) => {
                  const availableMateriCount = ContentStore.getMateriByClassAndSubject(selectedClass, sub.id).length;
                  const isCurrent = selectedSubject?.id === sub.id;

                  return (
                    <button
                      key={sub.id}
                      onClick={() => handleChooseSubject(sub)}
                      className={`group p-3.5 rounded-2xl border-2 flex flex-col items-center text-center transition-all transform hover:scale-105 active:scale-95 cursor-pointer shadow-xs ${
                        isCurrent
                          ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-300'
                          : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-amber-100 to-orange-100 flex items-center justify-center text-2xl mb-2 shadow-xs group-hover:rotate-6 transition-transform">
                        {sub.emoji}
                      </div>
                      <h5 className="text-sm font-black text-slate-800 font-['Fredoka',sans-serif] leading-tight">
                        {sub.name}
                      </h5>
                      <p className="text-[10px] text-slate-500 font-bold mt-1 line-clamp-1">
                        {sub.description}
                      </p>
                      <div className="mt-2 flex items-center gap-1 text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <span>{availableMateriCount > 0 ? `${availableMateriCount} Topik` : 'Buka Petualangan'}</span>
                        <ChevronRight size={10} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: TOPIC / MATERI SELECTION */}
          {step === 'TOPIC' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3.5 flex items-center gap-3">
                <span className="text-3xl">{selectedSubject?.emoji}</span>
                <div>
                  <h4 className="text-sm font-black text-slate-900 font-['Fredoka',sans-serif]">
                    Dunia {selectedSubject?.name} (Kelas {selectedClass})
                  </h4>
                  <p className="text-xs text-slate-600 font-bold">
                    Pilih petualangan topik yang ingin kamu pelajari di Hutan Pengetahuan:
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {materiList.map((m) => {
                  const isCurrentActive = currentMateriId === m.id;
                  const game = ContentStore.getGameByClassAndSubject(selectedClass, m.subjectId);

                  return (
                    <div
                      key={m.id}
                      onClick={() => handleChooseTopic(m)}
                      className={`p-4 rounded-2xl border-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                        isCurrentActive
                          ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300'
                          : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl shrink-0">
                          {m.cards[0]?.emoji || '📖'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-base font-black text-slate-900 font-['Fredoka',sans-serif]">
                              {m.title}
                            </h5>
                            {isCurrentActive && (
                              <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-emerald-500 text-white rounded-full">
                                Sedang Aktif
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-bold text-slate-600 mt-0.5">
                            {m.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="text-[10px] font-black bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md border border-amber-300">
                              ⭐ +{m.xpReward} XP Materi
                            </span>
                            {game && (
                              <span className="text-[10px] font-black bg-purple-100 text-purple-900 px-2 py-0.5 rounded-md border border-purple-300">
                                🎮 Game: {game.title}
                              </span>
                            )}
                            <span className="text-[10px] font-bold text-slate-500">
                              📚 {m.cards.length} Kartu Belajar
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChooseTopic(m);
                        }}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <span>Masuki Petualangan</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  );
                })}

                {materiList.length === 0 && (
                  <div className="text-center py-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <span className="text-4xl">📝</span>
                    <h5 className="text-base font-black text-slate-700 mt-2">
                      Belum Ada Materi untuk Kelas Ini
                    </h5>
                    <p className="text-xs text-slate-500 font-bold max-w-sm mx-auto mt-1">
                      Bapak/Ibu Guru dapat menambahkan materi, video, game, dan misi melalui menu Portal Guru.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-600">
          <div className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-amber-500" />
            <span>Eduverse: Petualangan Belajar Kelas 1–6 MI</span>
          </div>
          <span className="text-[11px] text-slate-500">
            XP dan Badge kamu tersimpan untuk semua mata pelajaran!
          </span>
        </div>
      </div>
    </div>
  );
};
