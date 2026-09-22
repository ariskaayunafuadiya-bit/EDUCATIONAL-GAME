import React, { useState, useEffect } from 'react';
import { ScreenType, GameState, CharacterId, ClassGrade, TeacherAccount, MateriItem } from './types';
import {
  loadGameState,
  saveGameState,
  clearGameState,
  calculateLevel,
} from './utils/storage';
import { sounds } from './utils/audio';
import { ContentStore } from './utils/contentStore';

import { TopHUD } from './components/TopHUD';
import { OpeningScreen } from './components/OpeningScreen';
import { CharacterSelectScreen } from './components/CharacterSelectScreen';
import { MapScreen } from './components/MapScreen';
import { HutanPengetahuanScreen } from './components/HutanPengetahuanScreen';

import { PondokMateriModal } from './components/PondokMateriModal';
import { BioskopModal } from './components/BioskopModal';
import { PosDetektifModal } from './components/PosDetektifModal';
import { ArenaGameModal } from './components/ArenaGameModal';
import { ProfileModal } from './components/ProfileModal';
import { MisiModal } from './components/MisiModal';
import { ClassSubjectPickerModal } from './components/ClassSubjectPickerModal';
import { TeacherAuthModal } from './components/TeacherDashboard/TeacherAuthModal';
import { TeacherDashboardModal } from './components/TeacherDashboard/TeacherDashboardModal';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(loadGameState);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(() => {
    // If student has already chosen a character and name, start directly on Map
    const saved = loadGameState();
    return saved.characterId && saved.studentName ? 'MAP' : 'OPENING';
  });

  // Modal visibility states
  const [showPondok, setShowPondok] = useState(false);
  const [showBioskop, setShowBioskop] = useState(false);
  const [showPosDetektif, setShowPosDetektif] = useState(false);
  const [showArena, setShowArena] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMisi, setShowMisi] = useState(false);
  const [justUnlockedDetektif, setJustUnlockedDetektif] = useState(false);

  // Dynamic Learning Platform: Class & Subject Picker
  const [showWorldPicker, setShowWorldPicker] = useState(false);

  // Dynamic Learning Platform: Teacher Auth & Dashboard
  const [showTeacherAuth, setShowTeacherAuth] = useState(false);
  const [showTeacherDashboard, setShowTeacherDashboard] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState<TeacherAccount | null>(() =>
    ContentStore.getCurrentTeacher()
  );

  // Current selected class and subject
  const selectedClass: ClassGrade = gameState.selectedClass || 4;
  const selectedSubjectId = gameState.selectedSubjectId || 'ipas';

  // Dynamic content items active for current selected class and subject
  const [activeMateri, setActiveMateri] = useState<MateriItem | null>(() =>
    ContentStore.getMateri(selectedClass, selectedSubjectId)[0] || null
  );
  const [activeGame, setActiveGame] = useState(() =>
    ContentStore.getGames(selectedClass, selectedSubjectId)[0] || null
  );
  const [activeMisi, setActiveMisi] = useState(() =>
    ContentStore.getMisi(selectedClass, selectedSubjectId)[0] || null
  );

  // Sync active items when class or subject changes
  useEffect(() => {
    const m = ContentStore.getMateri(selectedClass, selectedSubjectId);
    const g = ContentStore.getGames(selectedClass, selectedSubjectId);
    const mi = ContentStore.getMisi(selectedClass, selectedSubjectId);

    // If there's a specific selectedMateriId, pick it, otherwise pick the first
    const chosenMateri = gameState.selectedMateriId
      ? m.find((item) => item.id === gameState.selectedMateriId) || m[0] || null
      : m[0] || null;

    setActiveMateri(chosenMateri);
    setActiveGame(g[0] || null);
    setActiveMisi(mi[0] || null);
  }, [selectedClass, selectedSubjectId, gameState.selectedMateriId]);

  // Sync sound setting with audio engine
  useEffect(() => {
    sounds.enabled = gameState.soundEnabled;
  }, [gameState.soundEnabled]);

  // Save to localStorage whenever gameState changes
  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  // Toggle Sound
  const handleToggleSound = () => {
    setGameState((prev) => ({
      ...prev,
      soundEnabled: !prev.soundEnabled,
    }));
  };

  // Reset Game
  const handleResetProgress = () => {
    const fresh = clearGameState();
    setGameState(fresh);
    setShowProfile(false);
    setShowPondok(false);
    setShowBioskop(false);
    setShowPosDetektif(false);
    setShowArena(false);
    setShowMisi(false);
    setShowWorldPicker(false);
    setJustUnlockedDetektif(false);
    setCurrentScreen('OPENING');
  };

  // Step 1: Finish Character Selection -> Prompt Class & Subject Picker
  const handleConfirmCharacter = (charId: CharacterId, name: string) => {
    setGameState((prev) => ({
      ...prev,
      characterId: charId,
      studentName: name,
    }));
    // Open the class & subject picker so student decides their learning journey!
    setShowWorldPicker(true);
  };

  // Step 2: Confirm Class & Subject selection -> Go to MAP
  const handleSelectWorld = (classGrade: ClassGrade, subjectId: string, materiId?: string) => {
    const targetMateri = materiId
      ? ContentStore.getMateriById(materiId)
      : ContentStore.getMateriByClassAndSubject(classGrade, subjectId)[0] || null;

    setGameState((prev) => ({
      ...prev,
      selectedClass: classGrade,
      selectedSubjectId: subjectId,
      selectedMateriId: targetMateri ? targetMateri.id : '',
      // Fresh progress flags for this chosen adventure
      completedMateri: false,
      completedVideo: false,
      completedMission: false,
    }));
    setShowWorldPicker(false);
    setCurrentScreen('MAP');
    sounds.playUnlock();
  };

  // Complete Pondok Materi
  const handleCompleteMateri = () => {
    const xpReward = activeMateri?.xpReward || 20;
    const materiId = activeMateri?.id || 'demo_materi';

    setGameState((prev) => {
      const alreadyEarned = prev.completedMateri || prev.completedMateriIds?.includes(materiId);
      const newXp = alreadyEarned ? prev.xp : prev.xp + xpReward;
      const updatedBadges = prev.badges.includes('pembelajar_giat')
        ? prev.badges
        : [...prev.badges, 'pembelajar_giat'];
      const updatedMateriIds = prev.completedMateriIds?.includes(materiId)
        ? prev.completedMateriIds
        : [...(prev.completedMateriIds || []), materiId];

      return {
        ...prev,
        xp: newXp,
        level: calculateLevel(newXp),
        completedMateri: true,
        completedMateriIds: updatedMateriIds,
        badges: updatedBadges,
      };
    });

    setJustUnlockedDetektif(true);
    sounds.playUnlock();
  };

  // Complete Bioskop Belajar
  const handleCompleteVideo = () => {
    const materiId = activeMateri?.id || 'demo_video';

    setGameState((prev) => {
      const alreadyEarned = prev.completedVideo || prev.completedVideoIds?.includes(materiId);
      const newXp = alreadyEarned ? prev.xp : prev.xp + 10;
      const updatedBadges = prev.badges.includes('penonton_cerdas')
        ? prev.badges
        : [...prev.badges, 'penonton_cerdas'];
      const updatedVideoIds = prev.completedVideoIds?.includes(materiId)
        ? prev.completedVideoIds
        : [...(prev.completedVideoIds || []), materiId];

      return {
        ...prev,
        xp: newXp,
        level: calculateLevel(newXp),
        completedVideo: true,
        completedVideoIds: updatedVideoIds,
        badges: updatedBadges,
      };
    });

    sounds.playXpGain();
    setShowBioskop(false);
  };

  // Complete Detective / Quiz Mission
  const handleCompleteMission = (awardedXp: number) => {
    const gameId = activeGame?.id || 'demo_game';

    setGameState((prev) => {
      const newXp = prev.xp + awardedXp;
      const updatedBadges = prev.badges.includes('detektif_energi')
        ? prev.badges
        : [...prev.badges, 'detektif_energi'];
      const updatedAreas = prev.unlockedAreas.includes('arena')
        ? prev.unlockedAreas
        : [...prev.unlockedAreas, 'arena'];
      const updatedGameIds = prev.completedGameIds?.includes(gameId)
        ? prev.completedGameIds
        : [...(prev.completedGameIds || []), gameId];

      return {
        ...prev,
        xp: newXp,
        level: calculateLevel(newXp),
        completedMission: true,
        completedGameIds: updatedGameIds,
        completedMissionIds: [...(prev.completedMissionIds || []), gameId],
        badges: updatedBadges,
        unlockedAreas: updatedAreas,
      };
    });

    setShowPosDetektif(false);
    setCurrentScreen('MAP');
  };

  // Add Bonus XP from Arena Game
  const handleAddBonusXp = (amount: number) => {
    setGameState((prev) => {
      const newXp = prev.xp + amount;
      return {
        ...prev,
        xp: newXp,
        level: calculateLevel(newXp),
      };
    });
  };

  // Open Teacher Portal handler
  const handleOpenTeacherPortal = () => {
    if (currentTeacher) {
      setShowTeacherDashboard(true);
    } else {
      setShowTeacherAuth(true);
    }
  };

  // Check completion flags (supports dynamic item IDs or global fallback)
  const isMateriDone = Boolean(
    gameState.completedMateri ||
    (activeMateri && gameState.completedMateriIds?.includes(activeMateri.id))
  );
  const isVideoDone = Boolean(
    gameState.completedVideo ||
    (activeMateri && gameState.completedVideoIds?.includes(activeMateri.id))
  );
  const isMissionDone = Boolean(
    gameState.completedMission ||
    (activeGame && gameState.completedGameIds?.includes(activeGame.id))
  );

  return (
    <div className="min-h-screen w-full bg-amber-50 text-slate-800 flex flex-col font-['Nunito',sans-serif]">
      {/* Top HUD is visible on MAP and HUTAN screens */}
      {currentScreen !== 'OPENING' && currentScreen !== 'CHARACTER_SELECT' && (
        <TopHUD
          studentName={gameState.studentName}
          characterId={gameState.characterId}
          xp={gameState.xp}
          level={gameState.level}
          badgeCount={gameState.badges.length}
          soundEnabled={gameState.soundEnabled}
          onToggleSound={handleToggleSound}
          onOpenMap={() => setCurrentScreen('MAP')}
          onOpenProfile={() => setShowProfile(true)}
          onOpenMisi={() => setShowMisi(true)}
          onOpenBadges={() => setShowProfile(true)}
          currentScreen={currentScreen}
          hasActiveMisiNotification={!isMissionDone}
          selectedClass={selectedClass}
          selectedSubjectId={selectedSubjectId}
          onOpenWorldPicker={() => setShowWorldPicker(true)}
          onOpenTeacherPortal={handleOpenTeacherPortal}
        />
      )}

      {/* Main Screen Router */}
      <main className="flex-1 w-full flex flex-col">
        {currentScreen === 'OPENING' && (
          <OpeningScreen
            onStart={() => setCurrentScreen('CHARACTER_SELECT')}
            hasExistingSave={Boolean(gameState.characterId && gameState.studentName)}
            onContinue={() => setCurrentScreen('MAP')}
            studentName={gameState.studentName}
            onOpenTeacherPortal={handleOpenTeacherPortal}
          />
        )}

        {currentScreen === 'CHARACTER_SELECT' && (
          <CharacterSelectScreen
            onConfirm={handleConfirmCharacter}
            initialCharacter={gameState.characterId}
            initialName={gameState.studentName}
            onBackToHome={() => setCurrentScreen('OPENING')}
          />
        )}

        {currentScreen === 'MAP' && (
          <MapScreen
            unlockedAreas={gameState.unlockedAreas}
            onEnterForest={() => setCurrentScreen('HUTAN')}
            onOpenArena={() => setShowArena(true)}
            completedMission={isMissionDone}
            studentName={gameState.studentName}
            selectedClass={selectedClass}
            selectedSubjectId={selectedSubjectId}
            activeMateri={activeMateri}
            onOpenWorldPicker={() => setShowWorldPicker(true)}
          />
        )}

        {currentScreen === 'HUTAN' && gameState.characterId && (
          <HutanPengetahuanScreen
            characterId={gameState.characterId}
            studentName={gameState.studentName}
            completedMateri={isMateriDone}
            completedVideo={isVideoDone}
            completedMission={isMissionDone}
            onOpenPondok={() => setShowPondok(true)}
            onOpenBioskop={() => setShowBioskop(true)}
            onOpenPosDetektif={() => setShowPosDetektif(true)}
            justUnlockedDetektif={justUnlockedDetektif}
            onDismissUnlockBanner={() => setJustUnlockedDetektif(false)}
            activeMateri={activeMateri}
            activeGame={activeGame}
            onOpenWorldPicker={() => setShowWorldPicker(true)}
          />
        )}
      </main>

      {/* ======================================================== */}
      {/* MODALS AND POPUPS                                        */}
      {/* ======================================================== */}
      {/* Pondok Materi Modal (Dynamic Content) */}
      {showPondok && (
        <PondokMateriModal
          onClose={() => setShowPondok(false)}
          onComplete={handleCompleteMateri}
          alreadyCompleted={isMateriDone}
          activeMateri={activeMateri}
        />
      )}

      {/* Bioskop Belajar Modal (Dynamic Video) */}
      {showBioskop && (
        <BioskopModal
          onClose={() => setShowBioskop(false)}
          onComplete={handleCompleteVideo}
          alreadyCompleted={isVideoDone}
          activeMateri={activeMateri}
        />
      )}

      {/* Pos Detektif / Game Arena Modal (Dynamic Game Quiz / Detective) */}
      {showPosDetektif && (
        <PosDetektifModal
          onClose={() => setShowPosDetektif(false)}
          onMissionComplete={handleCompleteMission}
          alreadyCompleted={isMissionDone}
          activeGame={activeGame}
        />
      )}

      {/* Arena Game Modal */}
      {showArena && (
        <ArenaGameModal
          onClose={() => setShowArena(false)}
          onAddBonusXp={handleAddBonusXp}
          studentName={gameState.studentName}
        />
      )}

      {/* Profile Modal */}
      {showProfile && (
        <ProfileModal
          onClose={() => setShowProfile(false)}
          studentName={gameState.studentName}
          characterId={gameState.characterId}
          xp={gameState.xp}
          level={gameState.level}
          badges={gameState.badges}
          soundEnabled={gameState.soundEnabled}
          onToggleSound={handleToggleSound}
          onResetProgress={handleResetProgress}
        />
      )}

      {/* Misi Log Modal (Dynamic Titles & Rewards) */}
      {showMisi && (
        <MisiModal
          onClose={() => setShowMisi(false)}
          completedMateri={isMateriDone}
          completedVideo={isVideoDone}
          completedMission={isMissionDone}
          onNavigateTo={(target) => {
            if (target === 'pondok') setShowPondok(true);
            else if (target === 'bioskop') setShowBioskop(true);
            else if (target === 'pos_detektif') setShowPosDetektif(true);
            else if (target === 'map') setCurrentScreen('MAP');
          }}
          currentScreen={currentScreen}
          activeMateri={activeMateri}
          activeGame={activeGame}
          activeMisi={activeMisi}
        />
      )}

      {/* Class & Subject Selector Modal (Dunia Petualangan Belajar MI) */}
      {showWorldPicker && (
        <ClassSubjectPickerModal
          currentClass={selectedClass}
          currentSubjectId={selectedSubjectId}
          currentMateriId={gameState.selectedMateriId || ''}
          onSelectWorld={handleSelectWorld}
          onClose={() => {
            setShowWorldPicker(false);
            if (currentScreen === 'CHARACTER_SELECT') {
              setCurrentScreen('MAP');
            }
          }}
        />
      )}

      {/* Teacher Authentication Modal */}
      {showTeacherAuth && (
        <TeacherAuthModal
          onClose={() => setShowTeacherAuth(false)}
          onAuthenticated={(teacher: TeacherAccount) => {
            setCurrentTeacher(teacher);
            setShowTeacherAuth(false);
            setShowTeacherDashboard(true);
          }}
        />
      )}

      {/* Teacher Dashboard Modal */}
      {showTeacherDashboard && currentTeacher && (
        <TeacherDashboardModal
          teacher={currentTeacher}
          onClose={() => setShowTeacherDashboard(false)}
          onLogout={() => {
            ContentStore.logoutTeacher();
            setCurrentTeacher(null);
            setShowTeacherDashboard(false);
          }}
          onStartStudentLesson={(materi: MateriItem) => {
            setSelectedClass(materi.classGrade);
            setSelectedSubjectId(materi.subjectId);
            setActiveMateri(materi);
            setGameState((prev) => ({
              ...prev,
              selectedClass: materi.classGrade,
              selectedSubjectId: materi.subjectId,
              selectedMateriId: materi.id,
            }));
            setShowTeacherDashboard(false);
            setShowPondok(true);
          }}
          onContentUpdated={() => {
            // Refresh currently active content
            const m = ContentStore.getMateri(selectedClass, selectedSubjectId);
            const g = ContentStore.getGames(selectedClass, selectedSubjectId);
            const mi = ContentStore.getMisi(selectedClass, selectedSubjectId);
            setActiveMateri(m[0] || null);
            setActiveGame(g[0] || null);
            setActiveMisi(mi[0] || null);
          }}
        />
      )}
    </div>
  );
}
