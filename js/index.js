import { getScore } from './state.js';

document.addEventListener('DOMContentLoaded', () => {
    const allScores = getScore();

    const pageNames = ["amount", "conversion", "calc", "data_amount", "compression"];

    pageNames.forEach(pageName => {
        let pageTotalCorrect = 0;
        let pageTotalIncorrect = 0;

        for (let difficulty = 1; difficulty <= 3; difficulty++) {
            let difficultyCorrect = 0;
            let difficultyIncorrect = 0;

            const pageScores = allScores[pageName] || {};
            const difficultyScores = pageScores[difficulty] || {};

            for (const questionType in difficultyScores) {
                difficultyCorrect += difficultyScores[questionType].correct;
                difficultyIncorrect += difficultyScores[questionType].incorrect;
            }

            pageTotalCorrect += difficultyCorrect;
            pageTotalIncorrect += difficultyIncorrect;

            const scoreElement = document.getElementById(`score-${pageName}-${difficulty}`);
            if (scoreElement) {
                if (difficultyCorrect > 0 || difficultyIncorrect > 0) {
                    scoreElement.innerHTML = `★${difficulty}: <span class="score-correct">正${difficultyCorrect}</span> <span class="score-incorrect">誤${difficultyIncorrect}</span>`;
                } else {
                    scoreElement.textContent = `★${difficulty}: 未挑戦`;
                }
            }
        }

        const totalScoreElement = document.getElementById(`score-${pageName}-total`);
        if (totalScoreElement) {
            if (pageTotalCorrect > 0 || pageTotalIncorrect > 0) {
                totalScoreElement.innerHTML = `合計: <span class="score-correct">正${pageTotalCorrect}</span> <span class="score-incorrect">誤${pageTotalIncorrect}</span>`;
            } else {
                totalScoreElement.textContent = `合計: 未挑戦`;
            }
        }
    });
});