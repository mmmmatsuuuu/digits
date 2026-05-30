import { navigate } from '../router.js';
import { getDarkMode, toggleDarkMode } from '../lib/state.js';
import { makeInfBitQuestion, makeBitInfQuestion } from '../lib/questions.js';

const TIME_ADD = 6000;    // 正解で追加するms
const TIME_START = 30000; // 初期時間 30秒

function randomQuestion() {
  return Math.random() < 0.5 ? makeInfBitQuestion(1) : makeBitInfQuestion(1);
}

export function renderGameSurvivor(appEl) {
  const state = {
    timeLeft: TIME_START, // ms
    score: 0,
    bestScore: 0,
    problem: randomQuestion(),
    feedback: null, // { text, ok }
    gameOver: false,
  };

  let tickTimer = null;

  // ============================================================
  // ゲームロジック
  // ============================================================

  function tick() {
    if (!appEl.querySelector('#timer-bar')) {
      clearInterval(tickTimer);
      return;
    }
    if (state.gameOver) return;

    state.timeLeft -= 100;

    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      state.gameOver = true;
      clearInterval(tickTimer);
      updateTimer();
      showGameOver();
      return;
    }

    updateTimer();
  }

  function handleAnswer(raw) {
    if (state.gameOver || !raw.trim()) return;

    const userNum = Number(raw.trim());
    const correct = userNum === state.problem.answer;

    if (correct) {
      state.score++;
      state.timeLeft = Math.min(TIME_START, state.timeLeft + TIME_ADD);
      state.problem = randomQuestion();
      showFeedback(`+${TIME_ADD / 1000}秒！`, true);
    } else {
      showFeedback(`❌ 答え: ${state.problem.answer}`, false);
    }

    updateProblem();
    updateScore();
    clearInput();
  }

  function showFeedback(text, ok) {
    state.feedback = { text, ok };
    updateFeedback();
    setTimeout(() => {
      state.feedback = null;
      updateFeedback();
    }, 1000);
  }

  // ============================================================
  // DOM 更新
  // ============================================================

  function updateTimer() {
    const barEl = appEl.querySelector('#timer-bar');
    const numEl = appEl.querySelector('#timer-num');
    if (!barEl || !numEl) return;

    const pct = (state.timeLeft / TIME_START) * 100;
    barEl.style.width = pct + '%';

    // 残り時間によって色を変える
    barEl.className = `h-full rounded-full transition-all duration-100 ${
      pct > 50 ? 'bg-blue-500' : pct > 25 ? 'bg-yellow-500' : 'bg-red-500'
    }`;

    numEl.textContent = (state.timeLeft / 1000).toFixed(1) + '秒';
    numEl.className = `text-4xl font-bold font-mono tabular-nums ${
      pct > 50 ? 'text-blue-600 dark:text-blue-400'
      : pct > 25 ? 'text-yellow-600 dark:text-yellow-400'
      : 'text-red-600 dark:text-red-400'
    }`;
  }

  function updateProblem() {
    const el = appEl.querySelector('#problem-text');
    const unitEl = appEl.querySelector('#problem-unit');
    if (el) el.textContent = state.problem.question;
    if (unitEl) unitEl.textContent = `単位: ${state.problem.unit}`;
  }

  function updateScore() {
    const el = appEl.querySelector('#score-display');
    if (el) el.textContent = state.score;
  }

  function updateFeedback() {
    const el = appEl.querySelector('#feedback-text');
    if (!el) return;
    el.textContent = state.feedback?.text ?? '';
    el.className = `text-sm font-bold h-5 ${
      state.feedback?.ok
        ? 'text-green-500 dark:text-green-400'
        : 'text-red-500 dark:text-red-400'
    }`;
  }

  function clearInput() {
    const el = appEl.querySelector('#answer-input');
    if (el) { el.value = ''; el.focus(); }
  }

  function showGameOver() {
    const overlay = appEl.querySelector('#gameover-overlay');
    const finalEl = appEl.querySelector('#final-score');
    const timeEl = appEl.querySelector('#final-time');
    if (overlay) overlay.classList.remove('hidden');
    if (finalEl) finalEl.textContent = state.score;
    if (timeEl) timeEl.textContent = (TIME_START / 1000) + '秒スタート';
  }

  // ============================================================
  // 初期レンダリング
  // ============================================================

  function renderInitial() {
    const isDark = getDarkMode();
    appEl.innerHTML = `
      <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">

        <header class="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-100 dark:border-gray-800">
          <div class="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <button id="btn-back"
                class="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                     stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </button>
              <h1 class="font-bold text-gray-800 dark:text-gray-100 text-base">⏱️ タイマーサバイバル</h1>
            </div>
            <button id="dark-toggle"
              class="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   stroke-width="1.5" stroke="currentColor" class="w-5 h-5 ${isDark ? 'hidden' : ''}">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   stroke-width="1.5" stroke="currentColor" class="w-5 h-5 ${isDark ? '' : 'hidden'}">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
              </svg>
            </button>
          </div>
        </header>

        <main class="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-5">

          <!-- タイマー表示 -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 text-center">
            <p class="text-xs text-gray-400 dark:text-gray-500 mb-1">残り時間</p>
            <p id="timer-num" class="text-4xl font-bold font-mono tabular-nums text-blue-600 dark:text-blue-400 mb-3">
              ${(TIME_START / 1000).toFixed(1)}秒
            </p>
            <div class="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div id="timer-bar" class="h-full rounded-full bg-blue-500 transition-all duration-100" style="width: 100%"></div>
            </div>
            <p class="text-xs text-gray-400 dark:text-gray-500 mt-2">正解で <strong class="text-blue-500">+${TIME_ADD / 1000}秒</strong> 回復</p>
          </div>

          <!-- スコア -->
          <div class="flex justify-center">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 px-6 py-3 text-center">
              <p class="text-xs text-gray-400 dark:text-gray-500">正解数</p>
              <p class="text-3xl font-bold font-mono text-gray-800 dark:text-gray-100">
                <span id="score-display">0</span>
              </p>
            </div>
          </div>

          <!-- 問題エリア -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
            <div class="flex items-start gap-2 mb-3">
              <span class="text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full flex-shrink-0">問題</span>
              <p id="problem-text" class="text-sm font-medium text-gray-800 dark:text-gray-100 leading-relaxed"></p>
            </div>
            <p id="problem-unit" class="text-xs text-gray-400 dark:text-gray-500 mb-3"></p>

            <div class="flex gap-2">
              <input
                id="answer-input"
                type="number"
                inputmode="numeric"
                placeholder="答えを入力..."
                autocomplete="off"
                class="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600
                       bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
                       text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button id="submit-btn"
                class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-bold
                       rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-400">
                回答
              </button>
            </div>

            <div id="feedback-text" class="mt-2 text-sm font-bold h-5"></div>
          </div>
        </main>

        <!-- ゲームオーバーオーバーレイ -->
        <div id="gameover-overlay" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mx-4 w-full max-w-sm text-center">
            <p class="text-5xl mb-3">⏰</p>
            <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">タイムアップ！</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-1" id="final-time"></p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
              正解数: <strong class="text-gray-800 dark:text-gray-100 text-2xl" id="final-score">0</strong> 問
            </p>
            <div class="flex flex-col gap-2">
              <button id="retry-btn"
                class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
                もう一度
              </button>
              <button id="back-to-select"
                class="w-full py-3 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
                ゲーム選択へ
              </button>
            </div>
          </div>
        </div>

      </div>
    `;

    appEl.querySelector('#btn-back').addEventListener('click', () => {
      clearInterval(tickTimer);
      navigate('/game');
    });
    appEl.querySelector('#dark-toggle').addEventListener('click', () => {
      clearInterval(tickTimer);
      toggleDarkMode();
      renderGameSurvivor(appEl);
    });

    const input = appEl.querySelector('#answer-input');
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') handleAnswer(input.value);
    });
    appEl.querySelector('#submit-btn').addEventListener('click', () => handleAnswer(input.value));

    appEl.querySelector('#retry-btn').addEventListener('click', () => {
      clearInterval(tickTimer);
      renderGameSurvivor(appEl);
    });
    appEl.querySelector('#back-to-select').addEventListener('click', () => {
      clearInterval(tickTimer);
      navigate('/game');
    });

    updateProblem();
    tickTimer = setInterval(tick, 100);
    input.focus();
  }

  renderInitial();
}
