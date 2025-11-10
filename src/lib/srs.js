// Basitleştirilmiş SM-2 SRS çekirdeği
export const Qualities = {
  AGAIN: "again",
  HARD: "hard",
  GOOD: "good",
  EASY: "easy",
};

export function initReviewState(cardId) {
  return {
    cardId,
    ease: 2.3,
    intervalDays: 0,
    due: Date.now(),
    lapses: 0,
  };
}

export function scheduleNext(prev, quality) {
  const now = Date.now();
  let { ease, intervalDays, lapses } = prev;

  if (quality === Qualities.AGAIN) {
    ease = Math.max(1.7, ease - 0.3);
    intervalDays = 0;
    lapses += 1;
  } else if (quality === Qualities.HARD) {
    ease = Math.max(1.7, ease - 0.15);
    intervalDays = Math.max(1, Math.ceil((intervalDays || 1) * 1.2));
  } else if (quality === Qualities.GOOD) {
    if (intervalDays === 0) intervalDays = 1;
    else if (intervalDays === 1) intervalDays = 3;
    else intervalDays = Math.ceil(intervalDays * ease);
  } else if (quality === Qualities.EASY) {
    ease = ease + 0.05;
    intervalDays = Math.ceil((intervalDays || 1) * (ease + 0.15));
  }

  return {
    ...prev,
    ease: Number(ease.toFixed(2)),
    intervalDays,
    due: now + intervalDays * 24 * 60 * 60 * 1000,
    lapses,
  };
}
