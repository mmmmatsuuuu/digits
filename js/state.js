const SCORE_KEY = 'digital_calc_score';

export function getScore() {
  const score = localStorage.getItem(SCORE_KEY);
  if (score) {
    return JSON.parse(score);
  } else {
    return { correct: 0, incorrect: 0 };
  }
}

export function saveScore(score) {
  localStorage.setItem(SCORE_KEY, JSON.stringify(score));
}

export function resetScore() {
    localStorage.removeItem(SCORE_KEY);
}