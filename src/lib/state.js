// ============================================================
// 永続スコア管理（localStorage）
// ============================================================

const SCORE_KEY = 'digital_calc_score';

export function getScore() {
  try {
    const raw = localStorage.getItem(SCORE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveScore(scoreData) {
  localStorage.setItem(SCORE_KEY, JSON.stringify(scoreData));
}

export function updateQuestionScore(pageName, difficulty, questionType, isCorrect) {
  const data = getScore();
  data[pageName]                               ??= {};
  data[pageName][difficulty]                   ??= {};
  data[pageName][difficulty][questionType]     ??= { correct: 0, incorrect: 0 };

  if (isCorrect) {
    data[pageName][difficulty][questionType].correct++;
  } else {
    data[pageName][difficulty][questionType].incorrect++;
  }
  saveScore(data);
}

/**
 * スコアリセット
 * @param {string|null} pageName  - null で全リセット
 * @param {number|null} difficulty - null でカテゴリ全難易度リセット
 */
export function resetScore(pageName = null, difficulty = null) {
  let data = getScore();
  if (pageName && difficulty) {
    delete data[pageName]?.[difficulty];
  } else if (pageName) {
    delete data[pageName];
  } else {
    data = {};
  }
  saveScore(data);
}

/**
 * カテゴリの集計スコアを返す
 * { totalCorrect, totalIncorrect, byDifficulty: { 1: {...}, 2: {...}, 3: {...} } }
 */
export function getCategoryStats(pageName) {
  const data = getScore();
  const pageData = data[pageName] || {};
  const byDifficulty = {};
  let totalCorrect = 0;
  let totalIncorrect = 0;

  for (let d = 1; d <= 3; d++) {
    let dCorrect = 0;
    let dIncorrect = 0;
    const diffData = pageData[d] || {};
    for (const qt in diffData) {
      dCorrect   += diffData[qt].correct;
      dIncorrect += diffData[qt].incorrect;
    }
    byDifficulty[d] = { correct: dCorrect, incorrect: dIncorrect };
    totalCorrect   += dCorrect;
    totalIncorrect += dIncorrect;
  }

  return { totalCorrect, totalIncorrect, byDifficulty };
}

// ============================================================
// セッション状態（in-memory）
// ============================================================

let session = {
  total: 0,
  correct: 0,
  streak: 0,
  maxStreak: 0,
  startTime: null,
  byDifficulty: { 1: { correct: 0, total: 0 }, 2: { correct: 0, total: 0 }, 3: { correct: 0, total: 0 } },
};

export function initSession() {
  session = {
    total: 0,
    correct: 0,
    streak: 0,
    maxStreak: 0,
    startTime: Date.now(),
    byDifficulty: { 1: { correct: 0, total: 0 }, 2: { correct: 0, total: 0 }, 3: { correct: 0, total: 0 } },
  };
}

export function recordAnswer(isCorrect, difficulty) {
  session.total++;
  session.byDifficulty[difficulty] ??= { correct: 0, total: 0 };
  session.byDifficulty[difficulty].total++;

  if (isCorrect) {
    session.correct++;
    session.streak++;
    session.byDifficulty[difficulty].correct++;
    if (session.streak > session.maxStreak) session.maxStreak = session.streak;
  } else {
    session.streak = 0;
  }
}

export function getSession() {
  return { ...session };
}

// ============================================================
// ダークモード
// ============================================================

export function getDarkMode() {
  return localStorage.getItem('darkMode') === 'true';
}

export function setDarkMode(value) {
  localStorage.setItem('darkMode', String(value));
  if (value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export function toggleDarkMode() {
  setDarkMode(!getDarkMode());
}
