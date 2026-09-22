export interface LevelDetail {
  level: number;
  title: string;
  emoji: string;
  minXp: number;
  maxXp: number;
}

export const LEVEL_TIERS: LevelDetail[] = [
  { level: 1, title: 'Penjelajah Pemula', emoji: '🌱', minXp: 0, maxXp: 30 },
  { level: 2, title: 'Penjelajah', emoji: '🌿', minXp: 30, maxXp: 60 },
  { level: 3, title: 'Detektif', emoji: '🔎', minXp: 60, maxXp: 100 },
  { level: 4, title: 'Petualang Hebat', emoji: '⭐', minXp: 100, maxXp: 150 },
  { level: 5, title: 'Master EDUVERSE', emoji: '👑', minXp: 150, maxXp: 999 },
];

export function getLevelDetail(xp: number): {
  currentLevel: LevelDetail;
  nextLevel: LevelDetail | null;
  progressPercent: number;
  xpNeededForNext: number;
  xpInTier: number;
  tierTotalXp: number;
} {
  const currentXp = Math.max(0, xp || 0);
  let tier = LEVEL_TIERS[0];
  for (let i = LEVEL_TIERS.length - 1; i >= 0; i--) {
    if (currentXp >= LEVEL_TIERS[i].minXp) {
      tier = LEVEL_TIERS[i];
      break;
    }
  }

  const nextTier = LEVEL_TIERS.find((t) => t.level === tier.level + 1) || null;
  const tierTotalXp = tier.maxXp - tier.minXp;
  const xpInTier = Math.max(0, currentXp - tier.minXp);
  const progressPercent = nextTier
    ? Math.min(100, Math.round((xpInTier / tierTotalXp) * 100))
    : 100;
  const xpNeededForNext = nextTier ? Math.max(0, tier.maxXp - currentXp) : 0;

  return {
    currentLevel: tier,
    nextLevel: nextTier,
    progressPercent,
    xpNeededForNext,
    xpInTier,
    tierTotalXp,
  };
}
