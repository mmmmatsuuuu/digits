import { getCategoryById, checkAnswer } from '../lib/categories.js';
import { updateQuestionScore, getCategoryStats, initSession, recordAnswer, getSession, toggleDarkMode, getDarkMode } from '../lib/state.js';
import { navigate } from '../router.js';

// render() のたびに appEl.addEventListener を重ねないよう、
// AbortController でクリックハンドラーを1本だけ保持する
let _pageAbortCtrl = null;

// ============================================================
// クイズページ ローカル状態
// ============================================================

let state = {
  categoryId: null,
  category: null,
  difficulty: 1,
  currentQuestion: null,
  answered: false,
  wasCorrect: false,
  showHint: false,
  appEl: null,
};

function resetState(categoryId) {
  const category = getCategoryById(categoryId);
  state = {
    categoryId,
    category,
    difficulty: 1,
    currentQuestion: null,
    answered: false,
    wasCorrect: false,
    showHint: false,
    appEl: state.appEl,
  };
  initSession();
}

// ============================================================
// 問題生成
// ============================================================

function generateQuestion() {
  const { category, difficulty } = state;
  const gen = category.generators[Math.floor(Math.random() * category.generators.length)];
  state.currentQuestion = gen(difficulty);
  state.answered  = false;
  state.wasCorrect = false;
  state.showHint  = false;
}

// ============================================================
// レンダリング
// ============================================================

function formatTime(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return m > 0 ? `${m}分${s % 60}秒` : `${s}秒`;
}

function renderDifficultySelector() {
  const { difficulty } = state;
  return `
    <div class="flex items-center gap-1.5" role="group" aria-label="難易度選択">
      ${[1, 2, 3].map(d => `
        <button
          data-action="set-difficulty" data-difficulty="${d}"
          class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150
                 ${d === difficulty
                   ? 'bg-brand-600 text-white shadow-sm'
                   : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                 }"
          aria-pressed="${d === difficulty}"
        >${'★'.repeat(d)}</button>
      `).join('')}
    </div>
  `;
}

function renderStreak() {
  const { streak } = getSession();
  if (streak < 2) return '';
  return `
    <div class="flex items-center gap-1 text-orange-500 dark:text-orange-400 font-bold text-sm">
      <span>🔥</span>
      <span>${streak} 連続正解</span>
    </div>
  `;
}

function renderScoreBar() {
  const stats = getCategoryStats(state.categoryId);
  const { total, correct } = getSession();
  const pct = total > 0 ? Math.round(correct / total * 100) : 0;

  return `
    <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-medium text-gray-500 dark:text-gray-400">今回のセッション</span>
        <span class="text-xs font-bold text-gray-700 dark:text-gray-200">${correct}/${total}問正解 ${total > 0 ? `(${pct}%)` : ''}</span>
      </div>
      <div class="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div class="bg-green-500 h-full rounded-full transition-all duration-500" style="width:${pct}%"></div>
      </div>
      <div class="flex gap-4 mt-3 pt-3 border-t border-gray-50 dark:border-gray-700">
        ${[1,2,3].map(d => {
          const ds = stats.byDifficulty[d];
          const dt = ds.correct + ds.incorrect;
          return `<span class="text-xs text-gray-400 dark:text-gray-500">
            ★${d}: ${dt === 0 ? '未挑戦' : `<span class="text-green-600 dark:text-green-400">正${ds.correct}</span> <span class="text-red-500 dark:text-red-400">誤${ds.incorrect}</span>`}
          </span>`;
        }).join('')}
      </div>
    </div>
  `;
}

function renderQuestionCard() {
  const { currentQuestion, answered, wasCorrect, showHint, category, difficulty } = state;

  if (!currentQuestion) {
    return `
      <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 text-center">
        <div class="text-5xl mb-4">📝</div>
        <p class="text-gray-500 dark:text-gray-400 mb-6">「新しい問題」を押して練習を始めましょう</p>
        <button data-action="next-question"
          class="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition-colors shadow-sm">
          新しい問題
        </button>
      </div>
    `;
  }

  const hint = category.hints?.[currentQuestion.type] ?? null;

  // 問題文を改行対応（\n → <br>）
  const questionHtml = currentQuestion.question
    .split('\n')
    .map(line => `<span>${escapeHtml(line)}</span>`)
    .join('<br>');

  return `
    <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">

      <!-- フィードバックバナー -->
      ${answered ? `
        <div class="px-5 py-3 flex items-center gap-2
                    ${wasCorrect
                      ? 'bg-green-50 dark:bg-green-900/30 border-b border-green-100 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/30 border-b border-red-100 dark:border-red-800'}">
          <span class="text-lg">${wasCorrect ? '✅' : '❌'}</span>
          <span class="font-bold text-sm ${wasCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}">
            ${wasCorrect ? '正解！' : `不正解　正しい答え: ${currentQuestion.answer}${currentQuestion.unit ? ' ' + currentQuestion.unit : ''}`}
          </span>
        </div>
      ` : ''}

      <div class="p-5">
        <!-- 問題文 -->
        <div class="mb-5">
          <p class="text-gray-800 dark:text-gray-100 font-medium leading-relaxed font-mono text-sm md:text-base">
            ${questionHtml}
          </p>
        </div>

        <!-- 回答エリア（未回答時） -->
        ${!answered ? `
          <div class="space-y-2">
            <div class="flex gap-2 items-stretch">
              <div class="flex-1">
                <input
                  type="text" id="answer-input"
                  placeholder="回答を入力..."
                  class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
                         placeholder:text-gray-300 dark:placeholder:text-gray-500
                         focus:outline-none focus:border-brand-500 dark:focus:border-brand-400
                         font-mono text-sm transition-colors"
                  autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
                >
              </div>
              ${currentQuestion.unit ? `
                <span class="flex items-center px-3 bg-gray-100 dark:bg-gray-700
                             rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400
                             border border-gray-200 dark:border-gray-600 whitespace-nowrap">
                  ${escapeHtml(currentQuestion.unit)}
                </span>
              ` : ''}
              <button id="submit-btn" data-action="submit"
                class="px-5 py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 dark:disabled:bg-gray-600
                       text-white font-medium rounded-xl transition-colors shadow-sm whitespace-nowrap text-sm">
                解答
              </button>
            </div>

            <!-- 単位がある場合の補足 -->
            ${currentQuestion.unit
              ? `<p class="text-xs text-gray-400 dark:text-gray-500 pl-1">💡 数値のみ入力してください（単位「${escapeHtml(currentQuestion.unit)}」は自動で付きます）</p>`
              : ''}

            <!-- フォーマットヒント -->
            ${!currentQuestion.unit && currentQuestion.formatHint
              ? `<p class="text-xs text-gray-400 dark:text-gray-500 pl-1">📌 ${escapeHtml(currentQuestion.formatHint)}</p>`
              : ''}

            <!-- バリデーションエラー -->
            <p id="validation-error" class="text-xs text-red-500 dark:text-red-400 pl-1 hidden"></p>

            <!-- ヒントボタン -->
            ${hint ? `
              <button data-action="toggle-hint"
                class="text-xs text-brand-500 dark:text-brand-400 hover:underline flex items-center gap-1 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
                ${showHint ? 'ヒントを閉じる' : 'ヒントを見る'}
              </button>
              ${showHint ? `
                <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700
                            rounded-xl p-3 text-xs text-amber-800 dark:text-amber-300 whitespace-pre-line">
                  ${escapeHtml(hint)}
                </div>
              ` : ''}
            ` : ''}
          </div>
        ` : `
          <!-- 回答後エリア -->
          <div class="space-y-3">
            <!-- 解説 -->
            ${currentQuestion.explanation ? `
              <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800
                          rounded-xl p-4 text-sm text-blue-800 dark:text-blue-300 whitespace-pre-line leading-relaxed">
                <p class="font-semibold mb-1.5 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                       stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                  </svg>
                  解説
                </p>
                ${escapeHtml(currentQuestion.explanation)}
              </div>
            ` : ''}

            <!-- アクションボタン -->
            <div class="flex flex-col sm:flex-row gap-2 pt-1">
              <button data-action="retry"
                class="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600
                       text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                もう一度この問題
              </button>
              <button data-action="next-question"
                class="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700
                       text-sm text-white font-medium transition-colors shadow-sm">
                次の問題へ →
              </button>
            </div>
            <button data-action="end-session"
              class="w-full py-2.5 rounded-xl border border-gray-200 dark:border-gray-600
                     text-sm text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400
                     hover:border-red-300 dark:hover:border-red-600 transition-colors">
              練習を終わる
            </button>
          </div>
        `}
      </div>
    </div>
  `;
}

function renderSessionSummaryModal() {
  const sess  = getSession();
  const total = sess.total;
  const pct   = total > 0 ? Math.round(sess.correct / total * 100) : 0;
  const elapsed = sess.startTime ? Date.now() - sess.startTime : 0;

  const gradeEmoji = pct >= 90 ? '🏆' : pct >= 70 ? '🎉' : pct >= 50 ? '👍' : '💪';
  const gradeMsg   = pct >= 90 ? '素晴らしい！' : pct >= 70 ? 'よくできました！' : pct >= 50 ? 'もう少し練習しましょう' : '引き続き頑張りましょう！';

  const diffRows = [1, 2, 3].map(d => {
    const ds = sess.byDifficulty?.[d] ?? { correct: 0, total: 0 };
    if (ds.total === 0) return '';
    const dp = Math.round(ds.correct / ds.total * 100);
    return `
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-500 dark:text-gray-400">★${d}</span>
        <span class="font-medium text-gray-700 dark:text-gray-200">
          ${ds.correct}/${ds.total}問 (${dp}%)
        </span>
      </div>
    `;
  }).filter(Boolean).join('');

  return `
    <div id="summary-modal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div class="relative z-10 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 mx-4 w-full max-w-sm text-center">
        <div class="text-5xl mb-3">${gradeEmoji}</div>
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">練習お疲れ様でした！</h2>
        <p class="text-sm text-gray-400 dark:text-gray-500 mb-5">${gradeMsg}</p>

        <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-4 text-left space-y-2">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">正解率</span>
            <span class="font-bold text-2xl ${pct >= 70 ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-200'}">${pct}%</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">正解数</span>
            <span class="font-medium text-gray-700 dark:text-gray-200">${sess.correct} / ${total} 問</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">最大連続正解</span>
            <span class="font-medium text-gray-700 dark:text-gray-200">${sess.maxStreak} 問</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">練習時間</span>
            <span class="font-medium text-gray-700 dark:text-gray-200">${formatTime(elapsed)}</span>
          </div>
          ${diffRows ? `
            <div class="pt-2 mt-2 border-t border-gray-200 dark:border-gray-600 space-y-1.5">
              <p class="text-xs text-gray-400 dark:text-gray-500 mb-1">難易度別</p>
              ${diffRows}
            </div>
          ` : ''}
        </div>

        <div class="flex flex-col gap-2">
          <button data-action="restart-session"
            class="py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors">
            続けて練習する
          </button>
          <button data-action="go-top"
            class="py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                   text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            トップに戻る
          </button>
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// メインレンダー
// ============================================================

function render(showSummary = false) {
  const { category, categoryId, difficulty, appEl } = state;
  const isDark = getDarkMode();

  appEl.innerHTML = `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">

      <!-- ヘッダー -->
      <header class="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-100 dark:border-gray-800">
        <div class="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <!-- トップへ戻る -->
          <button data-action="go-top"
            class="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400
                   hover:text-brand-600 dark:hover:text-brand-400 transition-colors shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke-width="2" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            トップ
          </button>

          <span class="text-gray-200 dark:text-gray-700">|</span>

          <!-- カテゴリ名 -->
          <h1 class="font-bold text-gray-800 dark:text-gray-100 text-sm flex-1 truncate">
            ${category.name}
          </h1>

          <!-- ストリーク -->
          <div id="streak-display">${renderStreak()}</div>

          <!-- ダークモードトグル -->
          <button data-action="toggle-dark" aria-label="ダークモード切替"
            class="w-8 h-8 flex items-center justify-center rounded-lg
                   text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke-width="1.5" stroke="currentColor" class="w-4 h-4 ${isDark ? 'hidden' : ''}">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke-width="1.5" stroke="currentColor" class="w-4 h-4 ${isDark ? '' : 'hidden'}">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
            </svg>
          </button>
        </div>
      </header>

      <!-- メインコンテンツ -->
      <main class="max-w-2xl mx-auto px-4 py-5 space-y-4">

        <!-- 難易度 + 新しい問題 -->
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-400 dark:text-gray-500 shrink-0">難易度</span>
            ${renderDifficultySelector()}
          </div>
          ${!state.answered ? `
            <button data-action="next-question"
              class="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700
                     text-white text-sm font-medium transition-colors shadow-sm shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              新しい問題
            </button>
          ` : ''}
        </div>

        <!-- 問題カード -->
        <div id="question-area">
          ${renderQuestionCard()}
        </div>

        <!-- スコアパネル -->
        ${renderScoreBar()}

      </main>
    </div>

    ${showSummary ? renderSessionSummaryModal() : ''}
  `;

  attachEvents();
}

// ============================================================
// イベントハンドラー
// ============================================================

/**
 * appEl 全体へ登録するクリックハンドラー（1本だけ保持）。
 * renderQuizPage() が AbortController で管理する。
 */
function handleClick(e) {
  const target = e.target.closest('[data-action]');
  if (!target) return;

  switch (target.dataset.action) {
    case 'set-difficulty': {
      const d = parseInt(target.dataset.difficulty, 10);
      if (d !== state.difficulty) {
        state.difficulty = d;
        render();
      }
      break;
    }
    case 'next-question':
      generateQuestion();
      render();
      break;

    case 'retry':
      state.answered   = false;
      state.wasCorrect = false;
      state.showHint   = false;
      render();
      break;

    case 'toggle-hint':
      state.showHint = !state.showHint;
      render();
      break;

    case 'toggle-dark':
      toggleDarkMode();
      render();
      break;

    case 'go-top':
      navigate('/');
      break;

    case 'end-session':
      render(true);
      break;

    case 'restart-session':
      resetState(state.categoryId);
      render();
      break;
  }
}

/**
 * render() のたびに呼ばれる軽量な per-render セットアップ。
 * input / submit-btn は innerHTML で毎回入れ替わるため、
 * ここで付け直しても二重登録にならない。
 */
function attachEvents() {
  const { appEl } = state;

  const input = appEl.querySelector('#answer-input');
  if (input) {
    input.focus();
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') handleSubmit();
    });
  }

  const submitBtn = appEl.querySelector('#submit-btn');
  if (submitBtn) {
    submitBtn.addEventListener('click', handleSubmit);
  }
}

function handleSubmit() {
  const input = state.appEl.querySelector('#answer-input');
  const errorEl = state.appEl.querySelector('#validation-error');

  if (!input || input.value.trim() === '') {
    if (errorEl) {
      errorEl.textContent = '回答を入力してください';
      errorEl.classList.remove('hidden');
    }
    input?.focus();
    return;
  }

  const isCorrect = checkAnswer(input.value, state.currentQuestion);

  // スコア更新
  updateQuestionScore(state.categoryId, state.difficulty, state.currentQuestion.type, isCorrect);
  recordAnswer(isCorrect, state.difficulty);

  state.answered  = true;
  state.wasCorrect = isCorrect;

  render();
}

// ============================================================
// HTML エスケープユーティリティ
// ============================================================

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ============================================================
// エントリーポイント
// ============================================================

export function renderQuizPage(appEl, categoryId) {
  const category = getCategoryById(categoryId);
  if (!category) {
    navigate('/');
    return;
  }

  // カテゴリが変わった場合のみ state リセット
  if (state.categoryId !== categoryId || state.appEl !== appEl) {
    state.appEl = appEl;
    resetState(categoryId);
  } else {
    state.appEl = appEl;
  }

  // appEl への click リスナーは1本だけ保持する。
  // 以前の登録を AbortController で解除してから再登録する。
  if (_pageAbortCtrl) _pageAbortCtrl.abort();
  _pageAbortCtrl = new AbortController();
  appEl.addEventListener('click', handleClick, { signal: _pageAbortCtrl.signal });

  render();
}
