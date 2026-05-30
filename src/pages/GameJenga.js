import { navigate } from '../router.js';
import { getDarkMode, toggleDarkMode } from '../lib/state.js';
import { makeInfBitQuestion, makeBitInfQuestion } from '../lib/questions.js';

const BLOCKS_START = 5;
const BLOCKS_ADD = 1;
const BLOCKS_REMOVE = 3;
const BLOCKS_MAX_DISPLAY = 18; // 画面に表示する最大段数
const GOAL = 20;               // このブロック数に達したらクリア

function randomQuestion() {
  return Math.random() < 0.5 ? makeInfBitQuestion(1) : makeBitInfQuestion(1);
}

export function renderGameJenga(appEl) {
  const state = {
    blocks: BLOCKS_START,
    maxBlocks: BLOCKS_START,
    problem: randomQuestion(),
    feedback: null,   // { text, ok }
    shaking: false,
    gameOver: false,
    cleared: false,
    totalCorrect: 0,
    totalWrong: 0,
  };

  // ============================================================
  // ゲームロジック
  // ============================================================

  function handleAnswer(raw) {
    if (state.gameOver || state.cleared || !raw.trim()) return;

    const userNum = Number(raw.trim());
    const correct = userNum === state.problem.answer;

    if (correct) {
      state.blocks += BLOCKS_ADD;
      state.totalCorrect++;
      if (state.blocks > state.maxBlocks) state.maxBlocks = state.blocks;
      state.problem = randomQuestion();
      showFeedback(`+${BLOCKS_ADD}段 積み上がった！`, true);

      if (state.blocks >= GOAL) {
        state.cleared = true;
        updateAll();
        showResult();
        return;
      }
    } else {
      state.blocks = Math.max(0, state.blocks - BLOCKS_REMOVE);
      state.totalWrong++;
      triggerShake();
      showFeedback(`-${BLOCKS_REMOVE}段 崩れた…（答え: ${state.problem.answer}）`, false);

      if (state.blocks <= 0) {
        state.blocks = 0;
        state.gameOver = true;
        updateAll();
        showResult();
        return;
      }
    }

    updateAll();
    clearInput();
  }

  function showFeedback(text, ok) {
    state.feedback = { text, ok };
    updateFeedback();
    setTimeout(() => {
      state.feedback = null;
      updateFeedback();
    }, 1200);
  }

  function triggerShake() {
    state.shaking = true;
    const tower = appEl.querySelector('#tower-container');
    if (tower) {
      tower.classList.add('animate-shake');
      setTimeout(() => {
        tower.classList.remove('animate-shake');
        state.shaking = false;
      }, 500);
    }
  }

  // ============================================================
  // DOM 更新
  // ============================================================

  function buildTower() {
    const displayCount = Math.min(state.blocks, BLOCKS_MAX_DISPLAY);
    const overflow = state.blocks > BLOCKS_MAX_DISPLAY;

    const blocks = Array.from({ length: displayCount }, (_, i) => {
      const fromTop = displayCount - 1 - i;
      // 上に近い段ほど細くする（視覚的な奥行き）
      const width = Math.max(60, 100 - fromTop * 1.5);
      const hue = 120 - (fromTop / BLOCKS_MAX_DISPLAY) * 60; // 緑→黄緑
      return `
        <div class="rounded transition-all duration-200 mx-auto"
             style="width: ${width}%; height: 14px; background: hsl(${hue}, 65%, 50%); margin-bottom: 2px; opacity: ${0.7 + (i / displayCount) * 0.3}">
        </div>
      `;
    }).join('');

    const overflowBadge = overflow
      ? `<p class="text-xs text-gray-400 dark:text-gray-500 mb-1">…上に ${state.blocks - BLOCKS_MAX_DISPLAY} 段</p>`
      : '';

    return overflowBadge + blocks;
  }

  function updateAll() {
    updateTower();
    updateStats();
    updateProblem();
    updateFeedback();
  }

  function updateTower() {
    const container = appEl.querySelector('#tower-blocks');
    const heightEl = appEl.querySelector('#block-count');
    const goalBar = appEl.querySelector('#goal-bar');
    if (!container) return;

    container.innerHTML = state.blocks === 0
      ? '<p class="text-gray-400 dark:text-gray-500 text-sm">タワーが崩壊した…</p>'
      : buildTower();

    if (heightEl) heightEl.textContent = state.blocks;
    if (goalBar) {
      const pct = Math.min(100, (state.blocks / GOAL) * 100);
      goalBar.style.width = pct + '%';
    }
  }

  function updateStats() {
    const maxEl = appEl.querySelector('#max-blocks');
    if (maxEl) maxEl.textContent = state.maxBlocks;
  }

  function updateProblem() {
    const el = appEl.querySelector('#problem-text');
    const unitEl = appEl.querySelector('#problem-unit');
    if (el) el.textContent = state.problem.question;
    if (unitEl) unitEl.textContent = `単位: ${state.problem.unit}`;
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

  function showResult() {
    const overlay = appEl.querySelector('#result-overlay');
    if (!overlay) return;
    overlay.classList.remove('hidden');

    const emojiEl = overlay.querySelector('#result-emoji');
    const titleEl = overlay.querySelector('#result-title');
    const msgEl = overlay.querySelector('#result-msg');
    if (emojiEl) emojiEl.textContent = state.cleared ? '🎉' : '💥';
    if (titleEl) titleEl.textContent = state.cleared ? 'タワー完成！' : 'タワー崩壊…';
    if (msgEl) msgEl.innerHTML = `
      最高段数: <strong class="text-gray-800 dark:text-gray-100 text-xl">${state.maxBlocks}</strong> 段<br>
      <span class="text-xs">正解 ${state.totalCorrect} / 不正解 ${state.totalWrong}</span>
    `;
  }

  // ============================================================
  // 初期レンダリング
  // ============================================================

  function renderInitial() {
    const isDark = getDarkMode();
    appEl.innerHTML = `
      <style>
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-6px); }
          40%       { transform: translateX(6px); }
          60%       { transform: translateX(-4px); }
          80%       { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.45s ease-in-out; }
      </style>

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
              <h1 class="font-bold text-gray-800 dark:text-gray-100 text-base">🗼 ビットタワー</h1>
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

        <main class="max-w-2xl mx-auto px-4 py-4 flex flex-col gap-4">

          <!-- ステータス -->
          <div class="flex gap-3">
            <div class="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 text-center">
              <p class="text-xs text-gray-400 dark:text-gray-500">現在</p>
              <p class="text-2xl font-bold font-mono text-gray-800 dark:text-gray-100">
                <span id="block-count">${BLOCKS_START}</span><span class="text-sm text-gray-400"> 段</span>
              </p>
            </div>
            <div class="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 text-center">
              <p class="text-xs text-gray-400 dark:text-gray-500">最高</p>
              <p class="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                <span id="max-blocks">${BLOCKS_START}</span><span class="text-sm text-gray-400"> 段</span>
              </p>
            </div>
          </div>

          <!-- ゴールプログレスバー -->
          <div>
            <div class="flex justify-between text-xs text-gray-400 dark:text-gray-500 mb-1">
              <span>進捗</span>
              <span>ゴール: ${GOAL}段</span>
            </div>
            <div class="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div id="goal-bar" class="h-full bg-emerald-500 rounded-full transition-all duration-300"
                   style="width: ${(BLOCKS_START / GOAL) * 100}%"></div>
            </div>
          </div>

          <!-- タワー表示エリア -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4"
               style="min-height: 200px;">
            <div id="tower-container" class="flex flex-col-reverse justify-start" style="min-height: 180px;">
              <!-- 地面 -->
              <div class="h-2 bg-gray-300 dark:bg-gray-600 rounded-full mt-2"></div>
              <!-- ブロック群（動的更新） -->
              <div id="tower-blocks" class="flex flex-col-reverse gap-0.5">
                ${buildTower()}
              </div>
            </div>
          </div>

          <!-- 問題エリア -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
            <div class="flex items-start gap-2 mb-1">
              <span class="text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full flex-shrink-0">問題</span>
              <p id="problem-text" class="text-sm font-medium text-gray-800 dark:text-gray-100 leading-relaxed"></p>
            </div>
            <p id="problem-unit" class="text-xs text-gray-400 dark:text-gray-500 mb-3"></p>

            <div class="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-3">
              <span class="text-green-500 font-bold">✓ 正解 +${BLOCKS_ADD}段</span>
              <span class="mx-1">／</span>
              <span class="text-red-400 font-bold">✗ 不正解 -${BLOCKS_REMOVE}段</span>
            </div>

            <div class="flex gap-2">
              <input
                id="answer-input"
                type="number"
                inputmode="numeric"
                placeholder="答えを入力..."
                autocomplete="off"
                class="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600
                       bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
                       text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <button id="submit-btn"
                class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-bold
                       rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400">
                積む
              </button>
            </div>

            <div id="feedback-text" class="mt-2 text-sm font-bold h-5"></div>
          </div>
        </main>

        <!-- リザルトオーバーレイ -->
        <div id="result-overlay" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mx-4 w-full max-w-sm text-center">
            <p id="result-emoji" class="text-5xl mb-3">🎉</p>
            <h2 id="result-title" class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2"></h2>
            <p id="result-msg" class="text-sm text-gray-500 dark:text-gray-400 mb-6"></p>
            <div class="flex flex-col gap-2">
              <button id="retry-btn"
                class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors">
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

    appEl.querySelector('#btn-back').addEventListener('click', () => navigate('/game'));
    appEl.querySelector('#dark-toggle').addEventListener('click', () => {
      toggleDarkMode();
      renderGameJenga(appEl);
    });

    const input = appEl.querySelector('#answer-input');
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') handleAnswer(input.value);
    });
    appEl.querySelector('#submit-btn').addEventListener('click', () => handleAnswer(input.value));

    appEl.querySelector('#retry-btn').addEventListener('click', () => renderGameJenga(appEl));
    appEl.querySelector('#back-to-select').addEventListener('click', () => navigate('/game'));

    updateProblem();
    input.focus();
  }

  renderInitial();
}
