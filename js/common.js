import { getScore, saveScore, updateQuestionScore, resetScore } from './state.js';

let currentQuestion = null;
let difficulty = 1; // Default difficulty
let currentPageName = ''; // To store the current page's name

const EMOJIS = {
    "情報量計算": "&#x1F4BE;",
    "進数変換": "&#x1F504;",
    "2進数の計算": "&#x2795;",
    "データ量の計算": "&#x1F5BC;️",
    "圧縮の計算": "&#x1F4A0;"
}

function renderDifficultySelector() {
    let stars = '';
    for (let i = 1; i <= 3; i++) {
        stars += `<span class="star ${i <= difficulty ? 'selected' : ''}" data-difficulty="${i}">${i <= difficulty ? '★' : '☆'}</span>`;
    }
    return `<div class="difficulty-selector text-center mb-3">${stars}</div>`;
}

function renderQuestion(question) {
  if (!question) {
    return "<div class='text-center p-4'><p>&#x1F446; 上の「&#x1F3B2; 新しい問題」ボタンを押して問題を開始してください &#x1F446;</p></div>";
  }
  return `
    <div class="p-3 card shadow-sm">
      <div class="card-body">
        <p class="lead text-center mb-4">${question.question}</p>
        <div class="input-group">
          <input type="text" class="form-control" placeholder="&#x1F4DD; 回答を入力" id="user-answer">
          <button class="btn btn-primary" type="button" id="submit-answer">&#x2705; 解答</button>
        </div>
        <div id="result" class="mt-3"></div>
      </div>
    </div>
  `;
}

function renderScore() {
    const allScores = getScore();
    const pageScores = allScores[currentPageName] || {};
    const difficultyScores = pageScores[difficulty] || {};

    let totalCorrect = 0;
    let totalIncorrect = 0;

    // Sum up scores for the current page and difficulty across all question types
    for (const questionType in difficultyScores) {
        totalCorrect += difficultyScores[questionType].correct;
        totalIncorrect += difficultyScores[questionType].incorrect;
    }

    return `
      <div class="mt-4 p-3 bg-white rounded shadow-sm d-flex justify-content-between align-items-center">
        <div class="d-flex gap-3">
            <span>&#x1F44D; 正解: ${totalCorrect}</span>
            <span>&#x1F44E; 不正解: ${totalIncorrect}</span>
        </div>
        <button class="btn btn-outline-danger btn-sm" data-action="reset-score">&#x1F5D1; スコアリセット</button>
      </div>
    `;
}

function renderExplanation(resultElement) {
    if(currentQuestion.explanation) {
        resultElement.innerHTML = `<div class="alert alert-info mt-2">&#x1F4A1; <strong>解説:</strong> ${currentQuestion.explanation}</div>`;
    } else {
        resultElement.innerHTML = '';
    }
}

function showFeedback(isCorrect) {
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'feedback-overlay';
    if (isCorrect) {
        feedbackDiv.innerHTML = '<span class="feedback-text correct">&#x1F389; 正解！</span>';
    } else {
        feedbackDiv.innerHTML = '<span class="feedback-text incorrect">&#x1F914; 不正解...</span>';
    }
    document.body.appendChild(feedbackDiv);

    setTimeout(() => {
        feedbackDiv.classList.add('hide');
        feedbackDiv.addEventListener('transitionend', () => feedbackDiv.remove());
    }, 1000);
}

function render(appElement, title) {
  const emoji = EMOJIS[title] || '';
  appElement.innerHTML = `
    <style>
        .difficulty-selector .star {
            font-size: 2rem;
            cursor: pointer;
            color: #ffc107;
        }
        .difficulty-selector .star:not(.selected) {
            color: #e0e0e0;
        }
        .feedback-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
            z-index: 1000;
            opacity: 1;
            transition: opacity 0.3s ease-out;
        }
        .feedback-overlay.hide {
            opacity: 0;
        }
        .feedback-text {
            font-size: 4rem;
            font-weight: bold;
            padding: 30px 60px;
            border-radius: 15px;
            color: white;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            animation: pop-in 0.3s ease-out;
        }
        .feedback-text.correct {
            background-color: #28a745; /* Bootstrap success green */
        }
        .feedback-text.incorrect {
            background-color: #dc3545; /* Bootstrap danger red */
        }
        @keyframes pop-in {
            from { transform: scale(0.5); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
    </style>
    <div class="p-3">
        <a href="../index.html" class="btn btn-outline-secondary btn-sm mb-3">&#x21A9;️ トップに戻る</a>
        <h1 class="text-center mb-2">${emoji} ${title} ${emoji}</h1>
        ${renderDifficultySelector()}
        <main class="p-1">
        <div class="d-grid gap-2 mb-4">
            <button class="btn btn-primary btn-lg" data-action="generate-question">&#x1F3B2; 新しい問題</button>
        </div>
        <div id="question-container">
            ${renderQuestion(currentQuestion)}
        </div>
        ${renderScore()}
        </main>
    </div>
  `;
}

export function initializePage(pageName, title, questionGenerators) {
    const appElement = document.getElementById('app');
    currentPageName = pageName; // Set the current page name

    function generateQuestion() {
        const generator = questionGenerators[Math.floor(Math.random() * questionGenerators.length)];
        currentQuestion = generator(difficulty);
    }

    function handleSubmit() {
        const userAnswer = document.getElementById('user-answer');
        if (!userAnswer || userAnswer.value === '') {
            alert('回答を入力してください！');
            return;
        }
        const resultElement = document.getElementById('result');
        const isCorrect = String(userAnswer.value).trim() === String(currentQuestion.answer);

        updateQuestionScore(currentPageName, difficulty, currentQuestion.type, isCorrect);

        showFeedback(isCorrect); // Show the poppy feedback
        renderExplanation(resultElement); // Render the explanation below

        userAnswer.disabled = true;
        document.getElementById('submit-answer').disabled = true;
        
        setTimeout(() => {
            currentQuestion = null;
            mainRender();
        }, 3000); // Display result for 3 seconds
    }

    function handleEvent(e) {
        const target = e.target;

        if (target.matches('.star')) {
            difficulty = parseInt(target.dataset.difficulty, 10);
            currentQuestion = null; // Clear question when difficulty changes
            mainRender();
        }

        const actionTarget = target.closest('[data-action], #submit-answer');
        if (!actionTarget) return;

        if (actionTarget.matches('[data-action="generate-question"]')) {
            generateQuestion();
            mainRender();
        }

        if (actionTarget.id === 'submit-answer') {
            handleSubmit();
        }

        if (actionTarget.matches('[data-action="reset-score"]')) {
            if (confirm('本当にスコアをリセットしますか？')) {
                resetScore(currentPageName, difficulty);
                mainRender();
            }
        }
    }

    function mainRender() {
        render(appElement, title);
    }

    appElement.addEventListener('click', handleEvent);
    mainRender();
}