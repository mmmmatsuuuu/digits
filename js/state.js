const SCORE_KEY = 'digital_calc_score';

export function getScore() {
  const score = localStorage.getItem(SCORE_KEY);
  if (score) {
    return JSON.parse(score);
  } else {
    return {}; // Return an empty object for the new structure
  }
}

export function saveScore(scoreData) {
  localStorage.setItem(SCORE_KEY, JSON.stringify(scoreData));
}

export function updateQuestionScore(pageName, difficulty, questionType, isCorrect) {
    const scoreData = getScore();

    if (!scoreData[pageName]) {
        scoreData[pageName] = {};
    }
    if (!scoreData[pageName][difficulty]) {
        scoreData[pageName][difficulty] = {};
    }
    if (!scoreData[pageName][difficulty][questionType]) {
        scoreData[pageName][difficulty][questionType] = { correct: 0, incorrect: 0 };
    }

    if (isCorrect) {
        scoreData[pageName][difficulty][questionType].correct++;
    } else {
        scoreData[pageName][difficulty][questionType].incorrect++;
    }
    saveScore(scoreData);
}

export function resetScore(pageName = null, difficulty = null) {
    let scoreData = getScore();
    if (pageName && difficulty) {
        // Reset specific page and difficulty
        if (scoreData[pageName] && scoreData[pageName][difficulty]) {
            delete scoreData[pageName][difficulty];
        }
    } else if (pageName) {
        // Reset specific page
        if (scoreData[pageName]) {
            delete scoreData[pageName];
        }
    } else {
        // Reset all scores
        scoreData = {};
    }
    saveScore(scoreData);
}