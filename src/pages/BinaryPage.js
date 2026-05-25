import { navigate } from '../router.js';
import { getDarkMode, toggleDarkMode } from '../lib/state.js';

// ============================================================
// ユーティリティ
// ============================================================

/** ビット配列 → 10進数 */
function bitsToDecimal(bits) {
  return bits.reduce((acc, bit, i) => acc + bit * Math.pow(2, bits.length - 1 - i), 0);
}

/** 10進数 → ASCII文字（表示可能な範囲のみ） */
function decimalToAscii(n) {
  if (n >= 32 && n <= 126) return String.fromCharCode(n);
  return null;
}

/** チャレンジ用のランダムな目標値を生成（1〜15） */
function generateChallengeTarget() {
  return Math.floor(Math.random() * 15) + 1;
}

// ============================================================
// HTML ビルダー
// ============================================================

/** 電球ボタン */
function buildBulb(isOn, index, section) {
  return `
    <button
      data-bulb-section="${section}"
      data-bulb-index="${index}"
      aria-label="${isOn ? 'オン' : 'オフ'}の電球、クリックで切り替え"
      class="flex flex-col items-center gap-1.5 group select-none"
    >
      <div class="
        relative w-11 h-11 rounded-full transition-all duration-200 flex items-center justify-center text-xl
        ${isOn
          ? 'bg-yellow-300 dark:bg-yellow-400 shadow-md shadow-yellow-300/70 dark:shadow-yellow-400/50 scale-110'
          : 'bg-gray-200 dark:bg-gray-700 opacity-60 hover:opacity-80 group-hover:scale-105'}
      ">
        ${isOn ? '💡' : '⚫'}
      </div>
      <span class="text-sm font-bold font-mono leading-none
        ${isOn ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400 dark:text-gray-500'}
      ">
        ${isOn ? '1' : '0'}
      </span>
    </button>
  `;
}

/** セクション①：コイン（1ビット） */
function buildCoinSection(coinState) {
  const isFront = coinState === 1;
  return `
    <section class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <!-- タイトル -->
      <div class="flex items-center gap-2 mb-1">
        <span class="text-lg">🪙</span>
        <h2 class="font-bold text-gray-800 dark:text-gray-100 text-base">1枚のコイン ＝ 1ビット</h2>
      </div>
      <p class="text-xs text-gray-400 dark:text-gray-500 mb-5">
        コンピューターは「電気が流れている」か「流れていない」の2状態だけで情報を表します。
        コインの表裏と同じです！
      </p>

      <!-- コイン -->
      <div class="flex flex-col items-center gap-4">
        <div class="coin-wrapper" id="coin-wrapper">
          <div class="coin ${isFront ? '' : 'is-flipped'}" id="coin">
            <div class="coin-face coin-front">
              <div class="flex flex-col items-center justify-center h-full gap-1">
                <span class="text-3xl">⭐</span>
                <span class="text-xs font-bold text-yellow-800">おもて</span>
              </div>
            </div>
            <div class="coin-face coin-back">
              <div class="flex flex-col items-center justify-center h-full gap-1">
                <span class="text-3xl">🔵</span>
                <span class="text-xs font-bold text-blue-800">うら</span>
              </div>
            </div>
          </div>
        </div>

        <button
          id="flip-coin"
          class="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-sm font-bold
                 rounded-xl shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
        >
          コインを投げる 🪙
        </button>

        <!-- 結果表示 -->
        <div class="flex items-center gap-6 mt-1">
          <div class="flex flex-col items-center">
            <span class="text-xs text-gray-400 dark:text-gray-500 mb-1">状態</span>
            <span class="text-lg font-bold ${isFront ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400'}">
              ${isFront ? 'おもて' : 'うら'}
            </span>
          </div>
          <div class="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>
          <div class="flex flex-col items-center">
            <span class="text-xs text-gray-400 dark:text-gray-500 mb-1">デジタル値</span>
            <span class="text-3xl font-bold font-mono ${isFront ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}">
              ${isFront ? '1' : '0'}
            </span>
          </div>
        </div>
      </div>

      <!-- まとめ -->
      <div class="mt-5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 text-xs text-amber-700 dark:text-amber-300">
        💡 <strong>ポイント：</strong>2つの状態（表 / 裏）＝ 2つの数字（1 / 0）。これが「<strong>ビット（bit）</strong>」の基本です。
      </div>
    </section>
  `;
}

/** セクション②：電球4つ（4ビット） */
function buildBulbs4Section(bits) {
  const decimal = bitsToDecimal(bits);
  const binary  = bits.join('');
  return `
    <section class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div class="flex items-center gap-2 mb-1">
        <span class="text-lg">💡</span>
        <h2 class="font-bold text-gray-800 dark:text-gray-100 text-base">電球4つ ＝ 4ビット</h2>
      </div>
      <p class="text-xs text-gray-400 dark:text-gray-500 mb-5">
        電球をタップして ON / OFF を切り替えてみよう。
        4つの電球だけで <strong class="text-gray-700 dark:text-gray-300">0〜15の16通り</strong> の数を表せます！
      </p>

      <!-- 電球 -->
      <div class="flex justify-center gap-4 mb-5">
        ${bits.map((b, i) => buildBulb(b === 1, i, '4')).join('')}
      </div>

      <!-- 値表示 -->
      <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="text-xs text-gray-500 dark:text-gray-400">2進数</span>
          <span class="font-mono font-bold text-lg tracking-widest text-indigo-600 dark:text-indigo-400">${binary}</span>
        </div>
        <div class="h-px bg-gray-200 dark:bg-gray-600"></div>
        <div class="flex items-center justify-between">
          <span class="text-xs text-gray-500 dark:text-gray-400">10進数</span>
          <span class="font-mono font-bold text-2xl text-gray-800 dark:text-gray-100">${decimal}</span>
        </div>
      </div>

      <!-- まとめ -->
      <div class="mt-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-3 text-xs text-indigo-700 dark:text-indigo-300">
        💡 <strong>ポイント：</strong>ビットが増えるほど表現できる数が増えます。4ビットなら 2<sup>4</sup> ＝ <strong>16通り</strong>！
      </div>
    </section>
  `;
}

/** セクション③：電球8つ（1バイト・ASCII） */
function buildBulbs8Section(bits) {
  const decimal = bitsToDecimal(bits);
  const ascii   = decimalToAscii(decimal);
  const binary  = bits.join('');

  return `
    <section class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div class="flex items-center gap-2 mb-1">
        <span class="text-lg">🔤</span>
        <h2 class="font-bold text-gray-800 dark:text-gray-100 text-base">電球8つ ＝ 1バイト（文字に変換！）</h2>
      </div>
      <p class="text-xs text-gray-400 dark:text-gray-500 mb-5">
        8つの電球（1バイト）を使うと 0〜255 の256通りを表現でき、
        アルファベットや記号などの<strong class="text-gray-700 dark:text-gray-300">文字</strong>を表せます！
      </p>

      <!-- 電球（上4つ・下4つで2段） -->
      <div class="flex justify-center gap-3 mb-2">
        ${bits.slice(0, 4).map((b, i) => buildBulb(b === 1, i, '8')).join('')}
      </div>
      <div class="flex justify-center gap-3 mb-5">
        ${bits.slice(4).map((b, i) => buildBulb(b === 1, i + 4, '8')).join('')}
      </div>

      <!-- 値表示 -->
      <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="text-xs text-gray-500 dark:text-gray-400">2進数</span>
          <span class="font-mono font-bold text-base tracking-widest text-indigo-600 dark:text-indigo-400">${binary}</span>
        </div>
        <div class="h-px bg-gray-200 dark:bg-gray-600"></div>
        <div class="flex items-center justify-between">
          <span class="text-xs text-gray-500 dark:text-gray-400">10進数</span>
          <span class="font-mono font-bold text-2xl text-gray-800 dark:text-gray-100">${decimal}</span>
        </div>
        <div class="h-px bg-gray-200 dark:bg-gray-600"></div>
        <div class="flex items-center justify-between">
          <span class="text-xs text-gray-500 dark:text-gray-400">文字（ASCII）</span>
          <span class="font-mono font-bold text-2xl
            ${ascii ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-300 dark:text-gray-600'}
          ">
            ${ascii ?? '―'}
          </span>
        </div>
      </div>

      <!-- ヒント -->
      <p class="mt-3 text-xs text-gray-400 dark:text-gray-500 text-center">
        ヒント：<span class="font-mono text-emerald-600 dark:text-emerald-400">01000001</span> にすると… 「A」になるよ！
      </p>

      <!-- まとめ -->
      <div class="mt-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 text-xs text-emerald-700 dark:text-emerald-300">
        💡 <strong>ポイント：</strong>8ビット ＝ 1バイト。コンピューターが文字を覚えるときは、このように数字に変換して記録しています。
      </div>
    </section>
  `;
}

/** セクション④：チャレンジモード */
function buildChallengeSection(bits, target, solved, streak) {
  const current = bitsToDecimal(bits);
  const isCorrect = current === target;

  return `
    <section class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div class="flex items-center justify-between mb-1">
        <div class="flex items-center gap-2">
          <span class="text-lg">🎯</span>
          <h2 class="font-bold text-gray-800 dark:text-gray-100 text-base">チャレンジ！</h2>
        </div>
        ${streak > 0 ? `<span class="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-bold px-2 py-0.5 rounded-full">🔥 ${streak}問連続正解</span>` : ''}
      </div>
      <p class="text-xs text-gray-400 dark:text-gray-500 mb-5">
        電球を並べて、下の数字と同じ値を作ろう！
      </p>

      <!-- 目標値 -->
      <div class="flex justify-center mb-5">
        <div class="bg-violet-50 dark:bg-violet-900/20 border-2 border-violet-300 dark:border-violet-700 rounded-2xl px-8 py-4 text-center">
          <p class="text-xs text-violet-500 dark:text-violet-400 mb-1">作りたい数字</p>
          <p class="text-5xl font-bold font-mono text-violet-700 dark:text-violet-300">${target}</p>
        </div>
      </div>

      <!-- 電球 -->
      <div class="flex justify-center gap-4 mb-4">
        ${bits.map((b, i) => buildBulb(b === 1, i, 'c')).join('')}
      </div>

      <!-- 現在の値 -->
      <div class="flex justify-center gap-6 mb-4 text-sm">
        <span class="text-gray-400 dark:text-gray-500">現在の値：</span>
        <span class="font-mono font-bold text-lg ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}">${current}</span>
      </div>

      <!-- 正解フィードバック -->
      ${isCorrect ? `
        <div class="bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-xl p-4 text-center mb-4 animate-bounce-once">
          <p class="text-2xl mb-1">🎉</p>
          <p class="font-bold text-green-700 dark:text-green-300">せいかい！</p>
          <p class="text-xs text-green-600 dark:text-green-400 mt-1">
            ${target} ＝ ${bits.join('')}（2進数）
          </p>
        </div>
        <button
          id="next-challenge"
          class="w-full py-3 bg-violet-600 hover:bg-violet-700 active:scale-95 text-white text-sm font-bold
                 rounded-xl shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2"
        >
          次の問題へ →
        </button>
      ` : `
        <div class="h-px bg-gray-100 dark:bg-gray-700 mb-4"></div>
        <p class="text-center text-xs text-gray-400 dark:text-gray-500">電球を押して ${target} を作ってみよう！</p>
      `}
    </section>
  `;
}

// ============================================================
// ページ本体
// ============================================================

export function renderBinaryPage(appEl) {

  // ---- ページ内ステート ----
  const state = {
    coin: 0,                               // 0=裏, 1=表
    coinFlipping: false,
    bulbs4: [0, 0, 0, 0],
    bulbs8: [0, 0, 0, 0, 0, 0, 0, 0],
    challengeBits: [0, 0, 0, 0],
    challengeTarget: generateChallengeTarget(),
    challengeSolved: false,
    challengeStreak: 0,
  };

  // ---- レンダリング ----
  function render() {
    const isDark = getDarkMode();

    appEl.innerHTML = `
      <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">

        <!-- ヘッダー -->
        <header class="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-100 dark:border-gray-800">
          <div class="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <button id="btn-back"
                class="w-9 h-9 flex items-center justify-center rounded-xl
                       text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="トップへ戻る">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                     stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </button>
              <h1 class="font-bold text-gray-800 dark:text-gray-100 text-base tracking-tight">
                🔢 デジタルの仕組み体験
              </h1>
            </div>
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
        </header>

        <!-- メインコンテンツ -->
        <main class="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">

          <!-- リード文 -->
          <p class="text-sm text-gray-500 dark:text-gray-400">
            コンピューターは <strong class="text-gray-700 dark:text-gray-200">0 と 1 だけ</strong> で
            すべての情報を表現しています。体で感じながら学んでみよう！
          </p>

          ${buildCoinSection(state.coin)}
          ${buildBulbs4Section(state.bulbs4)}
          ${buildBulbs8Section(state.bulbs8)}
          ${buildChallengeSection(state.challengeBits, state.challengeTarget, state.challengeSolved, state.challengeStreak)}

        </main>
      </div>
    `;

    attachEvents();
  }

  // ---- イベント設定 ----
  function attachEvents() {
    // 戻るボタン
    appEl.querySelector('#btn-back').addEventListener('click', () => navigate('/'));

    // ダークモードトグル
    appEl.querySelector('#dark-toggle').addEventListener('click', () => {
      toggleDarkMode();
      render();
    });

    // コイン投げ
    appEl.querySelector('#flip-coin').addEventListener('click', () => {
      if (state.coinFlipping) return;
      state.coinFlipping = true;
      const coin = appEl.querySelector('#coin');
      coin.classList.add('is-animating');
      // アニメーション中に値をランダムに決定
      setTimeout(() => {
        state.coin = Math.round(Math.random());
        coin.classList.remove('is-animating');
        state.coinFlipping = false;
        // コイン部分だけ再描画
        const coinSection = appEl.querySelector('#coin-section-result');
        if (coinSection) {
          coinSection.innerHTML = buildCoinResult(state.coin);
        }
        // 表/裏の向きを反映
        if (state.coin === 1) {
          coin.classList.remove('is-flipped');
        } else {
          coin.classList.add('is-flipped');
        }
      }, 600);
    });

    // 電球4（セクション②）
    appEl.querySelectorAll('[data-bulb-section="4"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.bulbIndex);
        state.bulbs4[idx] = state.bulbs4[idx] === 1 ? 0 : 1;
        render();
      });
    });

    // 電球8（セクション③）
    appEl.querySelectorAll('[data-bulb-section="8"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.bulbIndex);
        state.bulbs8[idx] = state.bulbs8[idx] === 1 ? 0 : 1;
        render();
      });
    });

    // チャレンジ電球
    appEl.querySelectorAll('[data-bulb-section="c"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.bulbIndex);
        state.challengeBits[idx] = state.challengeBits[idx] === 1 ? 0 : 1;
        state.challengeSolved = bitsToDecimal(state.challengeBits) === state.challengeTarget;
        if (state.challengeSolved) state.challengeStreak++;
        render();
      });
    });

    // 次のチャレンジ
    const nextBtn = appEl.querySelector('#next-challenge');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        state.challengeBits = [0, 0, 0, 0];
        state.challengeTarget = generateChallengeTarget();
        state.challengeSolved = false;
        render();
      });
    }
  }

  render();
}

/** コイン結果部分（部分更新用、現在は使用しない） */
function buildCoinResult(coinState) {
  const isFront = coinState === 1;
  return `
    <div class="${isFront ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400'} font-bold text-lg">
      ${isFront ? 'おもて' : 'うら'}
    </div>
    <div class="font-bold font-mono text-3xl ${isFront ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}">
      ${isFront ? '1' : '0'}
    </div>
  `;
}
