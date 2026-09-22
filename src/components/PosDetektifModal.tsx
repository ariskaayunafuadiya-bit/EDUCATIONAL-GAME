import React, { useState } from 'react';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { X, Check, Award, Search, Sparkles, AlertCircle, ArrowRight, HelpCircle } from 'lucide-react';
import { GameItem, DetectiveItem, ClassGrade } from '../types';
import { ContentStore } from '../utils/contentStore';

interface PosDetektifModalProps {
  onClose: () => void;
  onMissionComplete: (awardedXp: number) => void;
  alreadyCompleted: boolean;
  activeGame?: GameItem | null;
}

const DEFAULT_DETECTIVE_ITEMS: DetectiveItem[] = [
  {
    id: 'lampu',
    name: 'Lampu',
    emoji: '💡',
    isCorrect: true,
    isElectrical: true,
    explanation: 'Lampu menggunakan energi listrik dari aliran arus kabel untuk menyalakan filamen/LED dan menerangi ruangan.',
  },
  {
    id: 'kipas',
    name: 'Kipas',
    emoji: '🌀',
    isCorrect: true,
    isElectrical: true,
    explanation: 'Kipas menggunakan energi listrik untuk memutar motor dinamo baling-baling dan menghasilkan angin sejuk.',
  },
  {
    id: 'televisi',
    name: 'Televisi',
    emoji: '📺',
    isCorrect: true,
    isElectrical: true,
    explanation: 'Televisi membutuhkan energi listrik untuk menyalakan panel layar bergambar dan pengeras suara.',
  },
  {
    id: 'senter',
    name: 'Senter',
    emoji: '🔦',
    isCorrect: true,
    isElectrical: true,
    explanation: 'Senter menggunakan energi listrik kimia yang tersimpan di dalam batu baterai untuk menyalakan bohlam.',
  },
  {
    id: 'sepeda',
    name: 'Sepeda',
    emoji: '🚲',
    isCorrect: false,
    isElectrical: false,
    explanation: 'Sepeda bergerak menggunakan energi otot dari kayuhan kaki kita, bukan mengalirkan energi listrik!',
  },
  {
    id: 'buku',
    name: 'Buku',
    emoji: '📖',
    isCorrect: false,
    isElectrical: false,
    explanation: 'Buku adalah benda dari kertas yang kita baca dengan mata, tidak membutuhkan aliran energi listrik.',
  },
];

export const PosDetektifModal: React.FC<PosDetektifModalProps> = ({
  onClose,
  onMissionComplete,
  alreadyCompleted,
  activeGame,
}) => {
  // If no activeGame provided, get from store
  const game = activeGame || ContentStore.getGames()[0];
  const isQuizMode = game?.type === 'quiz' && game?.questions && game.questions.length > 0;

  // --- DETECTIVE MODE STATE ---
  const detectiveItems = game?.detectiveItems || DEFAULT_DETECTIVE_ITEMS;
  const isTargetItem = (i: DetectiveItem) => Boolean(i.isCorrect || i.isElectrical);

  const [selectedItemIds, setSelectedItemIds] = useState<string[]>(
    alreadyCompleted ? detectiveItems.filter((i: DetectiveItem) => isTargetItem(i)).map((i: DetectiveItem) => i.id) : []
  );
  const [feedback, setFeedback] = useState<{
    title: string;
    headline: string;
    explanation: string;
    isCorrect: boolean;
    itemName: string;
  } | null>(null);
  const [isVictory, setIsVictory] = useState<boolean>(false);

  // --- QUIZ MODE STATE ---
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const questions = game?.questions || [];
  const currentQuestion = questions[currentQIndex];

  // -----------------------------------------------------------
  // DETECTIVE LOGIC
  // -----------------------------------------------------------
  const totalCorrectDetective = detectiveItems.filter((i: DetectiveItem) => isTargetItem(i)).length;
  const foundElectricalCount = selectedItemIds.filter((id) => {
    const item = detectiveItems.find((i: DetectiveItem) => i.id === id);
    return item ? isTargetItem(item) : false;
  }).length;

  const handleSelectItem = (item: DetectiveItem) => {
    if (isVictory) return;

    if (isTargetItem(item)) {
      sounds.playCorrect();
      if (!selectedItemIds.includes(item.id)) {
        const nextSelected = [...selectedItemIds, item.id];
        setSelectedItemIds(nextSelected);

        const newFoundCount = nextSelected.filter((id) => {
          const it = detectiveItems.find((i: DetectiveItem) => i.id === id);
          return it ? isTargetItem(it) : false;
        }).length;

        setFeedback({
          title: 'BERHASIL MENEMUKAN!',
          headline: `Hebat! ${item.name} adalah jawaban yang tepat!`,
          explanation: item.explanation,
          isCorrect: true,
          itemName: item.name,
        });

        if (newFoundCount === totalCorrectDetective) {
          setTimeout(() => {
            triggerVictory();
          }, 800);
        }
      } else {
        setFeedback({
          title: 'BENDA INI SUDAH DITEMUKAN',
          headline: `${item.name} sudah berhasil kamu kumpulkan!`,
          explanation: item.explanation,
          isCorrect: true,
          itemName: item.name,
        });
      }
    } else {
      sounds.playWrong();
      setFeedback({
        title: 'UPS, KURANG TEPAT!',
        headline: `${item.name} BUKAN benda yang menggunakan energi listrik!`,
        explanation: item.explanation,
        isCorrect: false,
        itemName: item.name,
      });
    }
  };

  // -----------------------------------------------------------
  // QUIZ LOGIC
  // -----------------------------------------------------------
  const handleSelectQuizOption = (optionIndex: number) => {
    if (quizAnswered) return;

    setSelectedAnswerIndex(optionIndex);
    setQuizAnswered(true);

    const isCorrect = optionIndex === currentQuestion.correctIndex;
    if (isCorrect) {
      sounds.playCorrect();
      setScore((prev) => prev + 1);
    } else {
      sounds.playWrong();
    }
  };

  const handleNextQuestion = () => {
    sounds.playPop();
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedAnswerIndex(null);
      setQuizAnswered(false);
    } else {
      setQuizFinished(true);
      triggerVictory();
    }
  };

  const triggerVictory = () => {
    sounds.playFanfare();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
    });
    setIsVictory(true);
    onMissionComplete(game?.xpReward || 30);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-md animate-fade-in select-none overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-600 px-5 py-3.5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
              {isQuizMode ? '🎮' : '🔍'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-widest text-amber-200 bg-purple-900/40 px-2 py-0.5 rounded-full inline-block">
                  {isQuizMode ? 'Game Kuis Petualangan' : 'Pos Detektif Edukasi'} • Kelas {game?.classGrade || 4}
                </span>
                <span className="text-xs font-black bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded-full">
                  ⭐ +{game?.xpReward || 30} XP
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black font-['Fredoka',sans-serif] leading-tight">
                {game?.title || 'Tantangan Arena Eduverse'}
              </h3>
            </div>
          </div>

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
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* ========================================================= */}
          {/* MODE 1: QUIZ GAME (Multiple Choice) */}
          {/* ========================================================= */}
          {isQuizMode && !quizFinished && currentQuestion && (
            <div className="space-y-4">
              {/* Question Progress Bar */}
              <div className="flex items-center justify-between text-xs font-black text-slate-500">
                <span>
                  Pertanyaan {currentQIndex + 1} dari {questions.length}
                </span>
                <span className="text-indigo-600">Skor: {score} Benar</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-300"
                  style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/80 border-2 border-indigo-200 shadow-xs">
                <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider block mb-1">
                  Soal #{currentQIndex + 1}
                </span>
                <h4 className="text-base sm:text-lg font-black text-slate-900 font-['Fredoka',sans-serif] leading-snug">
                  {currentQuestion.question}
                </h4>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentQuestion.options.map((opt: string, oIdx: number) => {
                  const isSelected = selectedAnswerIndex === oIdx;
                  const isCorrect = oIdx === currentQuestion.correctIndex;
                  const showResult = quizAnswered;

                  let btnStyle = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800';
                  if (showResult) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-300';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-rose-50 border-rose-400 text-rose-900';
                    } else {
                      btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={quizAnswered}
                      onClick={() => handleSelectQuizOption(oIdx)}
                      className={`p-3.5 rounded-2xl border-2 text-left font-bold text-xs sm:text-sm flex items-center gap-3 transition transform active:scale-95 cursor-pointer shadow-xs ${btnStyle}`}
                    >
                      <span className="w-7 h-7 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-xs shrink-0">
                        {['A', 'B', 'C', 'D'][oIdx]}
                      </span>
                      <span className="flex-1 leading-snug">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation upon answering */}
              {quizAnswered && (
                <div
                  className={`p-3.5 rounded-2xl border-2 animate-fade-in ${
                    selectedAnswerIndex === currentQuestion.correctIndex
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-amber-50 border-amber-300 text-amber-900'
                  }`}
                >
                  <p className="text-xs font-bold leading-relaxed">
                    <span className="font-black">
                      {selectedAnswerIndex === currentQuestion.correctIndex
                        ? '🎉 Jawaban Tepat! '
                        : '💡 Catatan Belajar: '}
                    </span>
                    {currentQuestion.explanation || 'Tetap semangat dalam belajar!'}
                  </p>
                </div>
              )}

              {/* Next Button */}
              {quizAnswered && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNextQuestion}
                    className="py-2.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md cursor-pointer transform hover:scale-105 transition"
                  >
                    <span>{currentQIndex < questions.length - 1 ? 'Pertanyaan Berikutnya →' : 'Selesaikan Kuis 🎉'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* MODE 2: DETECTIVE GAME (Grid of Items) */}
          {/* ========================================================= */}
          {!isQuizMode && !isVictory && (
            <div className="space-y-4">
              {/* Mission Instruction Header */}
              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3.5 flex items-start gap-3">
                <span className="text-2xl">🕵️</span>
                <div>
                  <h4 className="text-sm font-black text-slate-800 font-['Fredoka',sans-serif]">
                    Misi Detektif Cilik
                  </h4>
                  <p className="text-xs font-bold text-slate-600 mt-0.5">
                    {game?.instruction ||
                      `Temukan benda yang menggunakan energi listrik di bawah ini! Klik pada kartu yang tepat.`}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-xs font-black text-amber-900">
                    <span>
                      Ditemukan: {foundElectricalCount} dari {totalCorrectDetective} Benda Listrik
                    </span>
                    <div className="flex gap-1">
                      {Array.from({ length: totalCorrectDetective }).map((_, idx) => (
                        <span
                          key={idx}
                          className={`w-3 h-3 rounded-full ${
                            idx < foundElectricalCount ? 'bg-amber-500' : 'bg-amber-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Item Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {detectiveItems.map((item: DetectiveItem) => {
                  const isFound = selectedItemIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      className={`p-3.5 rounded-2xl border-2 flex flex-col items-center text-center transition-all transform hover:scale-105 active:scale-95 cursor-pointer shadow-xs ${
                        isFound
                          ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300'
                          : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-amber-300'
                      }`}
                    >
                      <span className="text-4xl mb-1.5">{item.emoji}</span>
                      <h5 className="text-sm font-black text-slate-800 font-['Fredoka',sans-serif]">
                        {item.name}
                      </h5>
                      <span
                        className={`mt-1.5 text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          isFound
                            ? 'bg-emerald-200 text-emerald-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {isFound ? '✓ Ditemukan' : 'Periksa'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Real-time Feedback Card */}
              {feedback && (
                <div
                  className={`p-3.5 rounded-2xl border-2 animate-fade-in ${
                    feedback.isCorrect
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-rose-50 border-rose-300 text-rose-950'
                  }`}
                >
                  <h5 className="text-xs font-black uppercase tracking-wide">
                    {feedback.title}
                  </h5>
                  <p className="text-xs font-bold mt-0.5">{feedback.explanation}</p>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* VICTORY CELEBRATION SCREEN */}
          {/* ========================================================= */}
          {(isVictory || quizFinished) && (
            <div className="text-center py-6 px-4 space-y-4 animate-fade-in">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-5xl mx-auto shadow-xl animate-bounce">
                🏆
              </div>

              <div>
                <h4 className="text-2xl font-black text-slate-900 font-['Fredoka',sans-serif]">
                  Luar Biasa! Misi Selesai!
                </h4>
                <p className="text-xs sm:text-sm font-bold text-slate-600 max-w-sm mx-auto mt-1">
                  Kamu telah menyelesaikan tantangan game ini dengan cemerlang dan mengumpulkan XP untuk petualanganmu!
                </p>
              </div>

              <div className="inline-flex items-center gap-3 bg-emerald-100 border border-emerald-300 px-5 py-2.5 rounded-2xl">
                <span className="text-2xl">⭐</span>
                <div className="text-left">
                  <span className="text-[10px] uppercase font-black tracking-widest text-emerald-800 block">
                    HADIAH PETUALANG
                  </span>
                  <span className="text-lg font-black text-emerald-950 font-['Fredoka',sans-serif]">
                    +{game?.xpReward || 30} XP Telah Ditambahkan!
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    sounds.playPop();
                    onClose();
                  }}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm shadow-md cursor-pointer transform hover:scale-105 transition"
                >
                  Lanjutkan Petualangan →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
