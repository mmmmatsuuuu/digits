import { CATEGORIES } from '../lib/categories.js';
import { getCategoryStats, resetScore, toggleDarkMode, getDarkMode } from '../lib/state.js';
import { navigate } from '../router.js';

// カテゴリのカラーテーマ (Tailwind セーフリスト)
const COLOR_MAP = {
  indigo:  { bg: 'bg-indigo-100 dark:bg-indigo-900/30',  icon: 'text-indigo-600 dark:text-indigo-400',  bar: 'bg-indigo-500', badge: 'bg-indigo-600' },
  violet:  { bg: 'bg-violet-100 dark:bg-violet-900/30',  icon: 'text-violet-600 dark:text-violet-400',  bar: 'bg-violet-500', badge: 'bg-violet-600' },
  blue:    { bg: 'bg-blue-100 dark:bg-blue-900/30',      icon: 'text-blue-600 dark:text-blue-400',      bar: 'bg-blue-500',   badge: 'bg-blue-600' },
  cyan:    { bg: 'bg-cyan-100 dark:bg-cyan-900/30',      icon: 'text-cyan-600 dark:text-cyan-400',      bar: 'bg-cyan-500',   badge: 'bg-cyan-600' },
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30',icon: 'text-emerald-600 dark:text-emerald-400',bar: 'bg-emerald-500',badge: 'bg-emerald-600' },
};

function renderCategoryCard(cat) {
  const stats  = getCategoryStats(cat.id);
  const total  = stats.totalCorrect + stats.totalIncorrect;
  const pct    = total > 0 ? Math.round(stats.totalCorrect / total * 100) : 0;
  const colors = COLOR_MAP[cat.color];
  const untried = total === 0;

  const difficultyRows = [1, 2, 3].map(d => {
    const ds = stats.byDifficulty[d];
    const dTotal = ds.correct + ds.incorrect;
    if (dTotal === 0) {
      return `<span class="text-xs text-gray-400 dark:text-gray-500">★${d}: 未挑戦</span>`;
    }
    return `<span class="text-xs text-gray-500 dark:text-gray-400">
      ★${d}: <span class="text-green-600 dark:text-green-400 font-medium">正${ds.correct}</span>
            <span class="text-red-500 dark:text-red-400 font-medium">誤${ds.incorrect}</span>
    </span>`;
  }).join('');

  return `
    <button
      data-navigate="/quiz/${cat.id}"
      class="group w-full text-left bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md
             border border-gray-100 dark:border-gray-700 transition-all duration-200
             hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2
             dark:focus:ring-offset-gray-900 p-5"
      aria-label="${cat.name}の練習を開始"
    >
      <div class="flex items-start gap-4">
        <!-- アイコン -->
        <div class="flex-shrink-0 w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center ${colors.icon}">
          ${cat.icon}
        </div>

        <!-- テキスト -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-0.5">
            <h2 class="font-bold text-gray-800 dark:text-gray-100 text-base">${cat.name}</h2>
            ${untried
              ? `<span class="text-xs text-gray-400 dark:text-gray-500">未挑戦</span>`
              : `<span class="text-sm font-bold ${pct >= 70 ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-300'}">${pct}%</span>`
            }
          </div>
          <p class="text-xs text-gray-400 dark:text-gray-500 mb-3">${cat.description}</p>

          <!-- プログレスバー -->
          <div class="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
            <div
              class="${colors.bar} h-full rounded-full transition-all duration-500"
              style="width: ${pct}%"
            ></div>
          </div>

          <!-- 難易度別スコア -->
          <div class="flex gap-3 flex-wrap">
            ${difficultyRows}
          </div>
        </div>

        <!-- 矢印 -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
             stroke="currentColor" class="flex-shrink-0 w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-brand-500 transition-colors mt-1">
          <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </div>
    </button>
  `;
}

function renderResetModal() {
  return `
    <div id="reset-modal" class="fixed inset-0 z-50 hidden items-center justify-center">
      <!-- バックドロップ -->
      <div id="reset-backdrop" class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <!-- モーダル本体 -->
      <div class="relative z-10 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mx-4 w-full max-w-sm">
        <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">スコアをリセット</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-5">リセットする範囲を選んでください。</p>
        <div class="flex flex-col gap-2 mb-5" id="reset-options">
          ${CATEGORIES.map(c => `
            <button data-reset="${c.id}"
              class="text-left px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                     hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20
                     text-sm text-gray-700 dark:text-gray-300 transition-colors">
              ${c.name} のスコアをリセット
            </button>
          `).join('')}
          <button data-reset="all"
            class="text-left px-4 py-2.5 rounded-xl border border-red-300 dark:border-red-700
                   bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40
                   text-sm font-medium text-red-600 dark:text-red-400 transition-colors">
            すべてのスコアをリセット
          </button>
        </div>
        <button id="reset-cancel"
          class="w-full py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
          キャンセル
        </button>
      </div>
    </div>
  `;
}

export function renderTopPage(appEl) {
  const isDark = getDarkMode();

  appEl.innerHTML = `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <!-- ヘッダー -->
      <header class="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-100 dark:border-gray-800">
        <div class="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 class="font-bold text-gray-800 dark:text-gray-100 text-base tracking-tight">
            💻 デジタル計算トレーニング
          </h1>
          <div class="flex items-center gap-2">
            <!-- スコアリセット -->
            <button id="open-reset"
              class="text-xs text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400
                     px-2 py-1 rounded-lg transition-colors">
              スコアリセット
            </button>
            <!-- ダークモードトグル -->
            <button id="dark-toggle" aria-label="ダークモード切替"
              class="w-9 h-9 flex items-center justify-center rounded-xl
                     text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <svg id="icon-sun" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   stroke-width="1.5" stroke="currentColor" class="w-5 h-5 ${isDark ? 'hidden' : ''}">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
              <svg id="icon-moon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   stroke-width="1.5" stroke="currentColor" class="w-5 h-5 ${isDark ? '' : 'hidden'}">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <!-- メインコンテンツ -->
      <main class="max-w-2xl mx-auto px-4 py-6">

        <!-- 1. デジタルの仕組み体験バナー -->
        <button
          data-navigate="/binary"
          class="w-full text-left mb-8 rounded-2xl overflow-hidden shadow-sm hover:shadow-md
                 border border-amber-200 dark:border-amber-800
                 bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/20
                 transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          aria-label="デジタルの仕組み体験ページへ"
        >
          <div class="p-5 flex items-center gap-4">
            <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-400/30 dark:bg-amber-500/20 flex items-center justify-center text-2xl">
              🔢
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-0.5">
                <h2 class="font-bold text-amber-800 dark:text-amber-200 text-base">デジタルの仕組み体験</h2>
                <span class="text-xs bg-amber-400 dark:bg-amber-600 text-white font-bold px-2 py-0.5 rounded-full">NEW</span>
              </div>
              <p class="text-xs text-amber-700/70 dark:text-amber-300/70">
                コインや電球で「0と1」を体感しよう！コンピューターの情報表現の基本をインタラクティブに学べます
              </p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                 stroke="currentColor" class="flex-shrink-0 w-4 h-4 text-amber-400 dark:text-amber-500">
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </button>

        <!-- 2. 計算トレーニング セクション -->
        <div class="flex items-center gap-3 mb-4">
          <h2 class="font-bold text-gray-700 dark:text-gray-200 text-sm tracking-wide">計算トレーニング</h2>
          <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">学習したいカテゴリを選んでください</p>
        <div class="flex flex-col gap-3 mb-10">
          ${CATEGORIES.map(renderCategoryCard).join('')}
        </div>

        <!-- 3. ゲームモード セクション -->
        <div class="flex items-center gap-3 mb-4">
          <h2 class="font-bold text-gray-700 dark:text-gray-200 text-sm tracking-wide">ゲームモード</h2>
          <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <button
          data-navigate="/game/hacker"
          class="w-full text-left rounded-2xl overflow-hidden border border-red-200 dark:border-red-800
                 bg-gradient-to-br from-slate-900 to-red-950
                 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200
                 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          aria-label="サイバー防衛ゲームへ"
        >
          <div class="p-5 flex items-center gap-4">
            <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-2xl">
              🛡️
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-0.5">
                <h3 class="font-bold text-white text-base">サイバー防衛</h3>
                <span class="text-xs bg-red-500 text-white font-bold px-2 py-0.5 rounded-full">NEW</span>
              </div>
              <p class="text-xs text-red-300/80">ハッカーの侵入からサーバーを守れ！★1〜★3 の難易度</p>
            </div>
            <div class="flex items-center gap-2 text-base mr-1">
              <span>🦠</span><span>🎯🦠</span><span class="text-red-400">🧑‍💻</span>
            </div>
          </div>
        </button>

      </main>

      ${renderResetModal()}
    </div>
  `;

  // ----- イベント -----

  // カテゴリカードのナビゲーション
  appEl.querySelectorAll('[data-navigate]').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.navigate));
  });

  // ダークモードトグル
  appEl.querySelector('#dark-toggle').addEventListener('click', () => {
    toggleDarkMode();
    renderTopPage(appEl); // 再描画（アイコン切替のため）
  });

  // リセットモーダル
  const modal = appEl.querySelector('#reset-modal');
  const openReset = () => {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  };
  const closeReset = () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  };

  appEl.querySelector('#open-reset').addEventListener('click', openReset);
  appEl.querySelector('#reset-cancel').addEventListener('click', closeReset);
  appEl.querySelector('#reset-backdrop').addEventListener('click', closeReset);

  appEl.querySelectorAll('[data-reset]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.reset;
      const label = target === 'all' ? '全スコア' : `${CATEGORIES.find(c => c.id === target)?.name}のスコア`;
      if (confirm(`${label}をリセットしますか？この操作は元に戻せません。`)) {
        if (target === 'all') {
          resetScore();
        } else {
          resetScore(target);
        }
        closeReset();
        renderTopPage(appEl);
      }
    });
  });
}
