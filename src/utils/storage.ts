import { GameState } from '../types';
import { getLevelDetail } from './levels';
import { ContentStore } from './contentStore';

const STORAGE_KEY = 'eduverse_game_data_v2';

export const INITIAL_GAME_STATE: GameState = {
  studentName: '',
  characterId: null,
  selectedClass: 4,
  selectedSubjectId: 'ipas',
  selectedMateriId: 'materi_ipas_energi',
  xp: 0,
  level: 1,
  badges: [],
  completedMateriIds: [],
  completedVideoIds: [],
  completedGameIds: [],
  completedMissionIds: [],
  unlockedAreas: ['desa', 'hutan'],
  soundEnabled: true,
};

export function calculateLevel(xp: number): number {
  return getLevelDetail(xp).currentLevel.level;
}

export function loadGameState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('eduverse_game_data_v1');
    if (!raw) return INITIAL_GAME_STATE;
    const parsed = JSON.parse(raw);
    
    // Migrasi data v1 jika ada
    const completedMateriIds = parsed.completedMateriIds || (parsed.completedMateri ? ['materi_ipas_energi'] : []);
    const completedVideoIds = parsed.completedVideoIds || (parsed.completedVideo ? ['materi_ipas_energi'] : []);
    const completedGameIds = parsed.completedGameIds || (parsed.completedMission ? ['game_ipas_energi'] : []);
    const completedMissionIds = parsed.completedMissionIds || (parsed.completedMission ? ['misi_ipas_1'] : []);

    return {
      ...INITIAL_GAME_STATE,
      ...parsed,
      selectedClass: parsed.selectedClass || 4,
      selectedSubjectId: parsed.selectedSubjectId || 'ipas',
      selectedMateriId: parsed.selectedMateriId || 'materi_ipas_energi',
      completedMateriIds,
      completedVideoIds,
      completedGameIds,
      completedMissionIds,
      level: calculateLevel(parsed.xp || 0),
    };
  } catch (e) {
    console.error('Failed to load EDUVERSE game data from localStorage', e);
    return INITIAL_GAME_STATE;
  }
}

export function saveGameState(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    // Jika nama siswa ada, sinkronkan ke daftar siswa guru
    if (state.studentName && state.studentName.trim().length > 0) {
      ContentStore.saveStudentProgress({
        id: `stu_${state.studentName.toLowerCase().replace(/\s+/g, '_')}`,
        studentName: state.studentName,
        classGrade: state.selectedClass,
        characterId: state.characterId || 'fatimah',
        xp: state.xp,
        level: calculateLevel(state.xp),
        badges: state.badges,
        completedMateriIds: state.completedMateriIds,
        completedVideoIds: state.completedVideoIds,
        completedGameIds: state.completedGameIds,
        completedMisiIds: state.completedMissionIds,
        lastActive: new Date().toISOString(),
      });
    }
  } catch (e) {
    console.error('Failed to save EDUVERSE game data to localStorage', e);
  }
}

export function clearGameState(): GameState {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to reset EDUVERSE game data', e);
  }
  return INITIAL_GAME_STATE;
}
