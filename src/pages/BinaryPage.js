import { navigate } from '../router.js';
import { getDarkMode, toggleDarkMode } from '../lib/state.js';

// ============================================================
// ユーティリティ
// ============================================================

function bitsToDecimal(bits) {
  return bits.reduce((acc, bit, i) => acc + bit * Math.pow(2, bits.length - 1 - i), 0);
}

function decimalToAscii(n) {
  if (n >= 32 && n <= 126) return String.fromCharCode(n);
  return null;
}

function generateChallengeTarget() {
  return Math.floor(Math.random() * 15) + 1;
}

// ============================================================
// モード設定
// ============================================================

const MODE_CONFIG = {
  lightbulb: {
    name: '電球',
    emoji: '💡',
    onLabel: '点灯',
    offLabel: '消灯',
    intro: '電球が「ついている（1）」か「消えている（0）」かで情報を表します。',
  },
  coin: {
    name: 'コイン',
    emoji: '🪙',
    onLabel: '表（おもて）',
    offLabel: '裏（うら）',
    intro: 'コインの「表（1）」か「裏（0）」かで情報を表します。',
  },
  card: {
    name: 'カード',
    emoji: '🃏',
    onLabel: '表向き',
    offLabel: '裏向き',
    intro: 'カードの「表向き（1）」か「裏向き（0）」かで情報を表します。',
  },
};

// ============================================================
// 電球 SVG ヘルパー
// ============================================================

/**
 * 電球形状の SVG を返す
 * - isOn=true  : ガラス部分が明るい黄色、フィラメントが琥珀色（点灯）
 * - isOn=false : ガラス部分が透明（輪郭のみ）、フィラメントがグレー（消灯）
 * @param {boolean} isOn
 * @param {number}  width  SVG の幅（高さは自動算出）
 */
function svgBulb(isOn, width = 22) {
  const h      = Math.round(width * 1.18);
  const stroke = isOn ? '#92400E' : '#9CA3AF';
  const fill   = isOn ? '#FEF9C3' : 'none';
  const showBase = width >= 15;
  return `<svg width="${width}" height="${h}" viewBox="0 0 22 26" xmlns="http://www.w3.org/2000/svg" style="overflow:visible">
    <path d="M11 1.5C6.3 1.5 2.5 5.3 2.5 10C2.5 13.2 4.3 15.9 6.8 17.4L6.8 20.5L15.2 20.5L15.2 17.4C17.7 15.9 19.5 13.2 19.5 10C19.5 5.3 15.7 1.5 11 1.5Z"
          fill="${fill}" stroke="${stroke}" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M8.5 15 Q11 12.5 13.5 15" stroke="${stroke}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    ${showBase ? `
    <rect x="6.8" y="20.5" width="8.4" height="2"   rx="0.8" fill="${stroke}" opacity="0.8"/>
    <rect x="7.8" y="22.5" width="6.4" height="1.8" rx="0.8" fill="${stroke}" opacity="0.6"/>
    <rect x="8.8" y="24.3" width="4.4" height="1.5" rx="0.7" fill="${stroke}" opacity="0.4"/>
    ` : ''}
  </svg>`;
}

// ============================================================
// ビットユニットビルダー（小・各セクション共通）
// ============================================================

/**
 * @param {boolean} isOn
 * @param {number}  index
 * @param {string}  section  '1' | '4' | '8' | 'c'
 * @param {string}  mode     'lightbulb' | 'coin' | 'card'
 * @param {boolean} disabled
 * @param {string}  size     'sm'（通常）| 'xs'（8ビット1列用）
 */
function buildBitUnit(isOn, index, section, mode, disabled = false, size = 'sm') {
  const disabledClass = disabled ? 'opacity-60 pointer-events-none' : '';
  const attrs  = `data-bit-section="${section}" data-bit-index="${index}" ${disabled ? 'disabled' : ''}`;
  const textSz = size === 'xs' ? 'text-xs' : 'text-sm';
  const btnCls = `flex flex-col items-center gap-1 group select-none ${disabledClass}`;

  switch (mode) {
    case 'coin': {
      const cntSz = size === 'xs' ? 'w-8 h-8' : 'w-11 h-11';
      const lblSz = size === 'xs' ? 'text-[10px]' : 'text-xs';
      return `
        <button ${attrs} class="${btnCls}" aria-label="${isOn ? '表（1）' : '裏（0）'}のコイン">
          <div class="${cntSz} rounded-full flex items-center justify-center border-2 transition-all duration-150
            ${isOn
              ? 'bg-gradient-to-br from-yellow-300 to-amber-500 border-amber-600 shadow-md shadow-amber-300/50 scale-110'
              : 'bg-gradient-to-br from-gray-300 to-slate-400 dark:from-gray-600 dark:to-slate-700 border-gray-400 dark:border-gray-600 group-hover:scale-105'}
          ">
            <span class="${lblSz} font-bold leading-none ${isOn ? 'text-amber-900' : 'text-gray-600 dark:text-gray-300'}">
              ${isOn ? '表' : '裏'}
            </span>
          </div>
          <span class="${textSz} font-bold font-mono leading-none
            ${isOn ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}
          ">${isOn ? '1' : '0'}</span>
        </button>
      `;
    }

    case 'card': {
      const szW   = size === 'xs' ? 'w-6' : 'w-9';
      const szH   = size === 'xs' ? 'h-9' : 'h-12';
      const icnSz = size === 'xs' ? 'text-sm' : 'text-lg';
      return `
        <button ${attrs} class="${btnCls}" aria-label="${isOn ? '表向き（1）' : '裏向き（0）'}のカード">
          <div class="${szW} ${szH} rounded flex items-center justify-center transition-all duration-150
            ${isOn
              ? 'bg-white dark:bg-gray-100 shadow-md border border-gray-200 scale-105'
              : 'card-back-pattern shadow border border-blue-700 group-hover:scale-105'}
          ">
            ${isOn
              ? `<span class="text-red-600 dark:text-red-500 ${icnSz} leading-none">♠</span>`
              : `<span class="text-white/70 text-[10px] font-bold">裏</span>`}
          </div>
          <span class="${textSz} font-bold font-mono leading-none
            ${isOn ? 'text-rose-600 dark:text-rose-400' : 'text-blue-500 dark:text-blue-400'}
          ">${isOn ? '1' : '0'}</span>
        </button>
      `;
    }

    default: { // lightbulb
      const cntSz = size === 'xs' ? 'w-8 h-8' : 'w-11 h-11';
      const svgW  = size === 'xs' ? 17 : 22;
      return `
        <button ${attrs} class="${btnCls}" aria-label="${isOn ? '点灯中（1）' : '消灯中（0）'}の電球">
          <div class="${cntSz} rounded-full flex items-center justify-center transition-all duration-150
            ${isOn
              ? 'bg-yellow-300 dark:bg-yellow-400 shadow-md shadow-yellow-300/70 dark:shadow-yellow-400/50 scale-110'
              : 'bg-gray-100 dark:bg-gray-800 opacity-60 group-hover:opacity-80 group-hover:scale-105'}
          ">
            ${svgBulb(isOn, svgW)}
          </div>
          <span class="${textSz} font-bold font-mono leading-none
            ${isOn ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400 dark:text-gray-500'}
          ">${isOn ? '1' : '0'}</span>
        </button>
      `;
    }
  }
}

// ============================================================
// ビットユニットビルダー（大・セクション①用）
// ============================================================

function buildLargeBitUnit(isOn, index, section, mode) {
  switch (mode) {
    case 'coin':
      return `
        <button data-bit-section="${section}" data-bit-index="${index}"
          class="flex flex-col items-center gap-2 group select-none"
          aria-label="${isOn ? '表（1）' : '裏（0）'}、クリックで切り替え">
          <div class="w-20 h-20 rounded-full flex items-center justify-center border-4 transition-all duration-200
            ${isOn
              ? 'bg-gradient-to-br from-yellow-300 to-amber-500 border-amber-600 shadow-lg shadow-amber-300/60 scale-105'
              : 'bg-gradient-to-br from-gray-300 to-slate-400 dark:from-gray-600 dark:to-slate-700 border-gray-400 dark:border-gray-600 group-hover:scale-105'}
          ">
            <span class="text-2xl font-bold ${isOn ? 'text-amber-900' : 'text-gray-600 dark:text-gray-300'}">
              ${isOn ? '表' : '裏'}
            </span>
          </div>
          <span class="text-xl font-bold font-mono ${isOn ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}">
            ${isOn ? '1' : '0'}
          </span>
        </button>
      `;

    case 'card':
      return `
        <button data-bit-section="${section}" data-bit-index="${index}"
          class="flex flex-col items-center gap-2 group select-none"
          aria-label="${isOn ? '表向き（1）' : '裏向き（0）'}、クリックで切り替え">
          <div class="w-16 h-24 rounded-lg flex items-center justify-center transition-all duration-200
            ${isOn
              ? 'bg-white dark:bg-gray-100 shadow-lg border-2 border-gray-200 scale-105'
              : 'card-back-pattern shadow-md border-2 border-blue-700 group-hover:scale-105'}
          ">
            ${isOn
              ? '<span class="text-red-600 dark:text-red-500 text-4xl">♠</span>'
              : '<span class="text-white font-bold text-sm">裏</span>'}
          </div>
          <span class="text-xl font-bold font-mono ${isOn ? 'text-rose-600 dark:text-rose-400' : 'text-blue-500 dark:text-blue-400'}">
            ${isOn ? '1' : '0'}
          </span>
        </button>
      `;

    default: // lightbulb
      return `
        <button data-bit-section="${section}" data-bit-index="${index}"
          class="flex flex-col items-center gap-2 group select-none"
          aria-label="${isOn ? '点灯中（1）' : '消灯中（0）'}、クリックで切り替え">
          <div class="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200
            ${isOn
              ? 'bg-yellow-300 dark:bg-yellow-400 shadow-lg shadow-yellow-300/70 dark:shadow-yellow-400/50 scale-105'
              : 'bg-gray-100 dark:bg-gray-800 opacity-60 group-hover:scale-105'}
          ">
            ${svgBulb(isOn, 36)}
          </div>
          <span class="text-xl font-bold font-mono ${isOn ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400 dark:text-gray-500'}">
            ${isOn ? '1' : '0'}
          </span>
        </button>
      `;
  }
}

// ============================================================
// モード切り替えタブ
// ============================================================

function buildModeSwitcher(currentMode) {
  return `
    <div class="flex gap-1.5 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
      ${Object.entries(MODE_CONFIG).map(([key, cfg]) => {
        const isActive = key === currentMode;
        return `
          <button data-set-mode="${key}"
            class="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-sm font-medium transition-all duration-150
              ${isActive
                ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'}
            ">
            <span>${cfg.emoji}</span><span>${cfg.name}</span>
          </button>
        `;
      }).join('')}
    </div>
  `;
}

// ============================================================
// セクション①：1ビット
// ============================================================

function buildSection1(bits, mode) {
  const cfg  = MODE_CONFIG[mode];
  const isOn = bits[0] === 1;
  return `
    <section class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div class="flex items-center gap-2 mb-1">
        <span class="text-lg">${cfg.emoji}</span>
        <h2 class="font-bold text-gray-800 dark:text-gray-100 text-base">${cfg.name}1つ ＝ 1ビット</h2>
      </div>
      <p class="text-xs text-gray-400 dark:text-gray-500 mb-6">${cfg.intro}</p>

      <div class="flex justify-center mb-6">
        ${buildLargeBitUnit(isOn, 0, '1', mode)}
      </div>

      <div class="flex justify-center gap-8 mb-4">
        <div class="flex flex-col items-center gap-1">
          <span class="text-xs text-gray-400 dark:text-gray-500">状態</span>
          <span class="font-bold text-base ${isOn ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}">
            ${isOn ? cfg.onLabel : cfg.offLabel}
          </span>
        </div>
        <div class="h-10 w-px bg-gray-200 dark:bg-gray-700 self-center"></div>
        <div class="flex flex-col items-center gap-1">
          <span class="text-xs text-gray-400 dark:text-gray-500">デジタル値</span>
          <span class="font-bold font-mono text-3xl ${isOn ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}">
            ${isOn ? '1' : '0'}
          </span>
        </div>
      </div>

      <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 text-xs text-amber-700 dark:text-amber-300">
        💡 <strong>ポイント：</strong>2つの状態（${cfg.onLabel} / ${cfg.offLabel}）＝ 2つの数字（1 / 0）。これが「<strong>ビット（bit）</strong>」の基本です。
      </div>
    </section>
  `;
}

// ============================================================
// セクション②：4ビット
// ============================================================

function buildSection4(bits, mode) {
  const cfg     = MODE_CONFIG[mode];
  const decimal = bitsToDecimal(bits);
  const binary  = bits.join('');
  return `
    <section class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div class="flex items-center gap-2 mb-1">
        <span class="text-lg">${cfg.emoji}</span>
        <h2 class="font-bold text-gray-800 dark:text-gray-100 text-base">${cfg.name}4つ ＝ 4ビット</h2>
      </div>
      <p class="text-xs text-gray-400 dark:text-gray-500 mb-5">
        タップして ${cfg.onLabel} / ${cfg.offLabel} を切り替えてみよう。
        4つで <strong class="text-gray-700 dark:text-gray-300">0〜15 の 16通り</strong> を表せます！
      </p>

      <div class="flex justify-center gap-4 mb-5">
        ${bits.map((b, i) => buildBitUnit(b === 1, i, '4', mode)).join('')}
      </div>

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

      <div class="mt-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-3 text-xs text-indigo-700 dark:text-indigo-300">
        💡 <strong>ポイント：</strong>ビットが増えると表現できる数が増えます。4ビットなら 2<sup>4</sup> ＝ <strong>16通り</strong>！
      </div>
    </section>
  `;
}

// ============================================================
// セクション③：8ビット（1バイト）― 1列表示
// ============================================================

function buildSection8(bits, mode) {
  const cfg     = MODE_CONFIG[mode];
  const decimal = bitsToDecimal(bits);
  const ascii   = decimalToAscii(decimal);
  const binary  = bits.join('');

  return `
    <section class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div class="flex items-center gap-2 mb-1">
        <span class="text-lg">🔤</span>
        <h2 class="font-bold text-gray-800 dark:text-gray-100 text-base">${cfg.name}8つ ＝ 1バイト（文字に変換！）</h2>
      </div>
      <p class="text-xs text-gray-400 dark:text-gray-500 mb-5">
        8つ（1バイト）で 0〜255 の256通りを表現でき、
        <strong class="text-gray-700 dark:text-gray-300">アルファベットや記号</strong>を表せます！
      </p>

      <!-- 8ビット 1列（前半4・後半4 をセパレーターで区切り）-->
      <div class="flex items-start justify-center gap-1 mb-5 overflow-x-auto pb-1">
        <div class="flex gap-1.5">
          ${bits.slice(0, 4).map((b, i) => buildBitUnit(b === 1, i, '8', mode, false, 'xs')).join('')}
        </div>
        <div class="flex-shrink-0 w-3 flex justify-center" style="padding-top:14px">
          <div class="w-px h-5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>
        <div class="flex gap-1.5">
          ${bits.slice(4).map((b, i) => buildBitUnit(b === 1, i + 4, '8', mode, false, 'xs')).join('')}
        </div>
      </div>

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

      <p class="mt-3 text-xs text-gray-400 dark:text-gray-500 text-center">
        ヒント：<span class="font-mono text-emerald-600 dark:text-emerald-400">01000001</span> にすると… 「A」になるよ！
      </p>

      <div class="mt-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 text-xs text-emerald-700 dark:text-emerald-300">
        💡 <strong>ポイント：</strong>8ビット ＝ 1バイト。コンピューターが文字を記録するときは、このように数字に変換しています。
      </div>
    </section>
  `;
}

// ============================================================
// セクション④：チャレンジモード
// ============================================================

function buildChallenge(bits, target, answered, correct, streak, mode) {
  const cfg          = MODE_CONFIG[mode];
  const targetBinary = target.toString(2).padStart(4, '0');

  return `
    <section class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div class="flex items-center justify-between mb-1">
        <div class="flex items-center gap-2">
          <span class="text-lg">🎯</span>
          <h2 class="font-bold text-gray-800 dark:text-gray-100 text-base">チャレンジ！</h2>
        </div>
        ${streak > 0
          ? `<span class="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-bold px-2 py-0.5 rounded-full">🔥 ${streak}問連続正解</span>`
          : ''}
      </div>
      <p class="text-xs text-gray-400 dark:text-gray-500 mb-5">
        ${cfg.name}を並べて下の数字を作ろう。「これだ！」と思ったら <strong class="text-gray-700 dark:text-gray-200">回答ボタン</strong> を押して確定！
      </p>

      <!-- 目標値 -->
      <div class="flex justify-center mb-5">
        <div class="bg-violet-50 dark:bg-violet-900/20 border-2 border-violet-300 dark:border-violet-700 rounded-2xl px-8 py-4 text-center">
          <p class="text-xs text-violet-500 dark:text-violet-400 mb-1">作りたい数字</p>
          <p class="text-5xl font-bold font-mono text-violet-700 dark:text-violet-300">${target}</p>
        </div>
      </div>

      <!-- ビット操作エリア -->
      <div class="flex justify-center gap-4 mb-6">
        ${bits.map((b, i) => buildBitUnit(b === 1, i, 'c', mode, answered)).join('')}
      </div>

      <!-- 回答前：回答ボタン -->
      ${!answered ? `
        <button id="submit-challenge"
          class="w-full py-3 bg-violet-600 hover:bg-violet-700 active:scale-95 text-white text-sm font-bold
                 rounded-xl shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2">
          回答する ✓
        </button>
      ` : ''}

      <!-- 回答後：フィードバック -->
      ${answered ? `
        <div class="${correct
          ? 'bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700'
          : 'bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700'
        } rounded-xl p-4 text-center mb-4">
          <p class="text-2xl mb-1">${correct ? '🎉' : '😢'}</p>
          <p class="font-bold ${correct ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}">
            ${correct ? 'せいかい！' : 'ざんねん…'}
          </p>
          <p class="text-xs mt-1 ${correct ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">
            ${correct
              ? `${target} ＝ ${targetBinary}（2進数）`
              : `正解は <span class="font-mono font-bold">${targetBinary}</span>（2進数）＝ ${target} でした！`}
          </p>
          ${!correct ? `
            <p class="text-xs mt-1.5 text-orange-500 dark:text-orange-400 font-medium">
              💥 連続正解がリセットされました
            </p>
          ` : ''}
        </div>
        <button id="next-challenge"
          class="w-full py-3 active:scale-95 text-white text-sm font-bold rounded-xl shadow transition-all duration-150
                 focus:outline-none focus:ring-2 focus:ring-offset-2
                 ${correct
                   ? 'bg-violet-600 hover:bg-violet-700 focus:ring-violet-400'
                   : 'bg-gray-500 hover:bg-gray-600 focus:ring-gray-400'}
          ">
          次の問題へ →
        </button>
      ` : ''}
    </section>
  `;
}

// ============================================================
// ページ本体
// ============================================================

export function renderBinaryPage(appEl) {

  const state = {
    mode: 'lightbulb',
    bits1: [0],
    bits4: [0, 0, 0, 0],
    bits8: [0, 0, 0, 0, 0, 0, 0, 0],
    challengeBits:     [0, 0, 0, 0],
    challengeTarget:   generateChallengeTarget(),
    challengeAnswered: false,
    challengeCorrect:  false,
    challengeStreak:   0,
  };

  function render() {
    const isDark = getDarkMode();
    appEl.innerHTML = `
      <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">

        <!-- ヘッダー -->
        <header class="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-100 dark:border-gray-800">
          <div class="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <button id="btn-back"
                class="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
            <button id="dark-toggle" aria-label="ダークモード切替"
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

        <!-- メインコンテンツ -->
        <main class="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            コンピューターは <strong class="text-gray-700 dark:text-gray-200">0 と 1 だけ</strong> で
            すべての情報を表現しています。体で感じながら学んでみよう！
          </p>

          ${buildModeSwitcher(state.mode)}
          ${buildSection1(state.bits1, state.mode)}
          ${buildSection4(state.bits4, state.mode)}
          ${buildSection8(state.bits8, state.mode)}
          ${buildChallenge(
            state.challengeBits,
            state.challengeTarget,
            state.challengeAnswered,
            state.challengeCorrect,
            state.challengeStreak,
            state.mode
          )}
        </main>
      </div>
    `;
    attachEvents();
  }

  function toggleBit(key, index) {
    state[key][index] ^= 1;
    render();
  }

  function attachEvents() {
    appEl.querySelector('#btn-back').addEventListener('click', () => navigate('/'));

    appEl.querySelector('#dark-toggle').addEventListener('click', () => {
      toggleDarkMode();
      render();
    });

    appEl.querySelectorAll('[data-set-mode]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.mode = btn.dataset.setMode;
        render();
      });
    });

    appEl.querySelectorAll('[data-bit-section]').forEach(btn => {
      btn.addEventListener('click', () => {
        const section = btn.dataset.bitSection;
        const index   = parseInt(btn.dataset.bitIndex);
        switch (section) {
          case '1': toggleBit('bits1', index); break;
          case '4': toggleBit('bits4', index); break;
          case '8': toggleBit('bits8', index); break;
          case 'c':
            if (!state.challengeAnswered) toggleBit('challengeBits', index);
            break;
        }
      });
    });

    appEl.querySelector('#submit-challenge')?.addEventListener('click', () => {
      const current = bitsToDecimal(state.challengeBits);
      state.challengeAnswered = true;
      state.challengeCorrect  = current === state.challengeTarget;
      if (state.challengeCorrect) {
        state.challengeStreak++;
      } else {
        state.challengeStreak = 0;
      }
      render();
    });

    appEl.querySelector('#next-challenge')?.addEventListener('click', () => {
      state.challengeBits     = [0, 0, 0, 0];
      state.challengeTarget   = generateChallengeTarget();
      state.challengeAnswered = false;
      state.challengeCorrect  = false;
      render();
    });
  }

  render();
}
