import { getScore, saveScore, resetScore } from './state.js';

let currentQuestion = null;
let score = getScore();

const EMOJIS = {
    "情報量計算": "&#x1F4BE;",
    "進数変換": "&#x1F504;",
    "2進数の計算": "&#x2795;",
    "データ量の計算（画像）": "&#x1F5BC;️"
}

function renderQuestion(question) {
  if (!question) {
    return "<div class='text-center p-4'><p>&#x1F446; 上の「&#x1F3B2; 出題」ボタンを押して問題を開始してください &#x1F446;</p></div>";
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
    return `
      <div class="mt-4 p-3 bg-white rounded shadow-sm d-flex justify-content-between align-items-center">
        <div class="d-flex gap-3">
            <span>&#x1F44D; 正解: ${score.correct}</span>
            <span>&#x1F44E; 不正解: ${score.incorrect}</span>
        </div>
        <button class="btn btn-outline-danger btn-sm" data-action="reset-score">&#x1F5D1; スコアリセット</button>
      </div>
    `;
}

function renderResult(resultElement, isCorrect) {
    let content = '';
    if (isCorrect) {
        content = `<div class="alert alert-success">&#x1F389; 正解！素晴らしい！ &#x1F389;</div>`;
    } else {
        content = `<div class="alert alert-danger">&#x1F914; うーん、惜しい！ 正しい答えは <strong>${currentQuestion.answer}</strong> です。</div>`;
    }

    if(currentQuestion.explanation) {
        content += `<div class="alert alert-info mt-2">&#x1F4A1; <strong>解説:</strong> ${currentQuestion.explanation}</div>`;
    }

    resultElement.innerHTML = content;
}

function render(appElement, title) {
  const emoji = EMOJIS[title] || '';
  appElement.innerHTML = `
    <div class="p-3">
        <a href="../index.html" class="btn btn-outline-secondary btn-sm mb-3">&#x21A9;️ トップに戻る</a>
        <h1 class="text-center mb-4">${emoji} ${title} ${emoji}</h1>
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

export function initializePage(title, questionGenerators) {
    const appElement = document.getElementById('app');

    function generateQuestion() {
        const generator = questionGenerators[Math.floor(Math.random() * questionGenerators.length)];
        currentQuestion = generator();
    }

    function handleSubmit() {
        const userAnswer = document.getElementById('user-answer');
        if (!userAnswer || userAnswer.value === '') {
            alert('回答を入力してください！');
            return;
        }
        const resultElement = document.getElementById('result');
        const isCorrect = String(userAnswer.value).trim() === String(currentQuestion.answer);

        if (isCorrect) {
            score.correct++;
        } else {
            score.incorrect++;
        }
        saveScore(score);

        renderResult(resultElement, isCorrect);
        userAnswer.disabled = true;
        document.getElementById('submit-answer').disabled = true;
    }

    function handleEvent(e) {
        const target = e.target.closest('[data-action], #submit-answer');
        if (!target) return;

        if (target.matches('[data-action="generate-question"]')) {
            generateQuestion();
            mainRender();
        }

        if (target.id === 'submit-answer') {
            handleSubmit();
        }

        if (target.matches('[data-action="reset-score"]')) {
            if (confirm('本当にスコアをリセットしますか？')) {
                resetScore();
                score = getScore();
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