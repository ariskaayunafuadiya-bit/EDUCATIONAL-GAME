export type CharacterId = 'fatimah' | 'ali'; // Fatimah is Alya, Ali is Rafi

export interface CharacterInfo {
  id: CharacterId;
  name: string;
  gender: 'female' | 'male';
  title: string;
  description: string;
  color: string;
  avatarBg: string;
}

export type ClassGrade = 1 | 2 | 3 | 4 | 5 | 6;

export interface SubjectItem {
  id: string;
  name: string;
  emoji: string;
  color: string; // Tailwind color name or hex
  description: string;
  availableGrades: ClassGrade[];
  isCustom?: boolean;
}

export interface LessonCard {
  id?: string;
  title: string;
  subtitle: string;
  emoji: string;
  explanation: string;
  points?: string[];
}

export interface MateriItem {
  id: string;
  contentId: string;
  teacherId: string;
  classGrade: ClassGrade;
  classId: ClassGrade;
  subjectId: string;
  title: string;
  description: string;
  content: string; // Isi materi lengkap
  imageUrl?: string;
  videoUrl?: string;
  xpReward: number;
  status: 'Aktif' | 'Draft';
  isDemo?: boolean;
  cards?: LessonCard[];
  order: number;
  active: boolean;
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number; // 0, 1, 2, 3
  explanation: string;
}

export interface DetectiveItem {
  id: string;
  name: string;
  emoji: string;
  isCorrect: boolean;
  explanation: string;
  isElectrical?: boolean;
}

export interface GameItem {
  id: string;
  teacherId: string;
  classGrade: ClassGrade;
  subjectId: string;
  title: string;
  instruction: string;
  type: 'detective' | 'quiz';
  questions?: QuizQuestion[];
  detectiveItems?: DetectiveItem[];
  xpReward: number;
  badgeRewardId?: string;
  difficulty: 'mudah' | 'sedang' | 'sulit';
  active: boolean;
  createdAt: string;
}

export interface MisiItem {
  id: string;
  teacherId: string;
  classGrade: ClassGrade;
  subjectId: string;
  title: string;
  description: string;
  challenge: string;
  xpReward: number;
  badgeRewardId: string;
  active: boolean;
  createdAt: string;
}

export interface BadgeItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category?: string;
}

export interface TeacherAccount {
  id: string;
  name: string;
  email: string;
  school: string;
  subjectSpecialty: string;
  avatar: string;
}

export type TeacherProfile = TeacherAccount;

export interface StudentProgress {
  id: string;
  studentName: string;
  classGrade: ClassGrade;
  characterId: CharacterId;
  xp: number;
  level: number;
  badges: string[];
  completedMateriIds: string[];
  completedVideoIds: string[];
  completedGameIds: string[];
  completedMisiIds: string[];
  lastActive: string;
}

export interface GameState {
  studentName: string;
  characterId: CharacterId | null;
  selectedClass: ClassGrade;
  selectedSubjectId: string;
  selectedMateriId: string;
  xp: number;
  level: number;
  badges: string[]; // badge IDs
  completedMateriIds: string[];
  completedVideoIds: string[];
  completedGameIds: string[];
  completedMissionIds: string[];
  unlockedAreas: string[]; // e.g. ['desa', 'hutan', 'arena']
  soundEnabled: boolean;
  completedMateri?: boolean;
  completedVideo?: boolean;
  completedMission?: boolean;
}

export type ScreenType = 
  | 'OPENING'
  | 'CHARACTER_SELECT'
  | 'MAP'
  | 'HUTAN';

export interface WorldBuilding {
  id: 'pondok' | 'bioskop' | 'pos_detektif';
  title: string;
  subtitle: string;
  x: number; // percentage in world (0-100)
  y: number; // percentage in world (0-100)
  isLocked: boolean;
  lockReason?: string;
}
