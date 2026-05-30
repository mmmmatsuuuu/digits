import { navigate } from '../router.js';
import { getDarkMode, toggleDarkMode } from '../lib/state.js';

// ============================================================
// 動的問題生成（ステージ・経過時間でビット数レンジを変化させる）
// ============================================================

function makeConversionQuestion(stage, elapsed) {
  let minBits, maxBits;
  if (stage === 1) {
    // Easy: 2〜4bit
    minBits = 2;
    maxBits = Math.min(4, 2 + Math.floor(elapsed / 20000));
  } else if (stage === 2) {
    // Normal: 4〜6bit
    minBits = 4;
    maxBits = Math.min(6, 4 + Math.floor(elapsed / 20000));
  } else {
    // Hard: 4〜8bit
    minBits = 4;
    maxBits = Math.min(8, 4 + Math.floor(elapsed / 20000));
  }

  const bits = Math.floor(Math.random() * (maxBits - minBits + 1)) + minBits;
  const canDoHex = bits % 4 === 0;
  const types = ['dec-to-bin', 'bin-to-dec'];
  if (canDoHex) types.push('bin-to-hex', 'hex-to-bin');
  const type = types[Math.floor(Math.random() * types.length)];

  const val = Math.floor(Math.random() * (2 ** bits));
  const binStr = val.toString(2).padStart(bits, '0');

  switch (type) {
    case 'dec-to-bin':
      return { type, answerType: 'binary',
        question: `10進数の ${val} を2進数に変換せよ`,
        unit: '先頭の 0 は省略可', answer: binStr, bits };
    case 'bin-to-dec':
      return { type, answerType: 'number',
        question: `2進数の ${binStr} を10進数に変換せよ`,
        unit: '', answer: val, bits };
    case 'bin-to-hex': {
      const hexStr = val.toString(16).toUpperCase().padStart(bits / 4, '0');
      return { type, answerType: 'hex',
        question: `2進数の ${binStr} を16進数に変換せよ`,
        unit: '大文字・小文字どちらも可', answer: hexStr, bits };
    }
    case 'hex-to-bin': {
      const hexStr = val.toString(16).toUpperCase().padStart(bits / 4, '0');
      return { type, answerType: 'binary',
        question: `16進数の ${hexStr} を2進数に変換せよ`,
        unit: '先頭の 0 は省略可', answer: binStr, bits };
    }
  }
}

function makeQuestionForStage(categoryId, stage, elapsed) {
  if (categoryId === 'conversion') return makeConversionQuestion(stage, elapsed);

  // 情報量計算
  let minBits, maxBits;
  if (stage === 3) {
    // ★3: 6〜8bit スタート（20秒ごとに+1bit、上限16bit）
    minBits = 6;
    maxBits = Math.min(16, 8 + Math.floor(elapsed / 20000));
  } else {
    // ★1/★2: 2〜4bit スタート（20秒ごとに+1bit、上限8bit）
    minBits = 2;
    maxBits = Math.min(8, 4 + Math.floor(elapsed / 20000));
  }

  const bits = Math.floor(Math.random() * (maxBits - minBits + 1)) + minBits;

  if (Math.random() < 0.5) {
    const patterns = 2 ** bits;
    return {
      type: 'inf-bit',
      answerType: 'number',
      question: `${patterns.toLocaleString()} 通りで表せる情報のデータ量は？`,
      unit: 'bit',
      answer: bits,
      bits,
    };
  } else {
    return {
      type: 'bit-inf',
      answerType: 'number',
      question: `${bits} bit で表せる情報は？`,
      unit: '通り',
      answer: 2 ** bits,
      bits,
    };
  }
}

// ============================================================
// ハイスコア管理（ローカルストレージ）
// ============================================================

function getHighScore(categoryId, stage) {
  return Number(localStorage.getItem(`digits_hiscore_${categoryId}_${stage}`) || 0);
}

function saveHighScore(categoryId, stage, score) {
  const current = getHighScore(categoryId, stage);
  if (score > current) {
    localStorage.setItem(`digits_hiscore_${categoryId}_${stage}`, String(score));
    return true;
  }
  return false;
}

// ファイアウォールの初期位置を生成（右端から左端へ）
function initWalls(hp) {
  const posMap = {
    5: [45, 36, 27, 18, 10],
    3: [45, 27, 10],
  };
  const positions = posMap[hp]
    ?? Array.from({ length: hp }, (_, i) =>
        Math.round(45 - i * (35 / Math.max(hp - 1, 1))));
  return positions.map((x, i) => ({ id: i, x, alive: true }));
}

// ============================================================
// 設定
// ============================================================

const STAGE_CONFIG = {
  1: {
    label: '★1  EASY',
    hp: 5,
    penaltyBoost: 0,
    baseSpeed: 7,
    spawnStart: 4000,
    spawnMin: 1500,
    colorClass: 'text-green-400',
    bgClass: 'bg-green-500',
    bonus: 1.0,
    description: 'ペナルティなし・易しい問題',
  },
  2: {
    label: '★2  NORMAL',
    hp: 3,
    penaltyBoost: 1.6,
    baseSpeed: 8,
    spawnStart: 3500,
    spawnMin: 1200,
    colorClass: 'text-yellow-400',
    bgClass: 'bg-yellow-500',
    bonus: 2.0,
    description: '不正解でハッカーが加速・ウォール3枚',
  },
  3: {
    label: '★3  HARD',
    hp: 3,
    penaltyBoost: 2.2,
    baseSpeed: 9,
    spawnStart: 3000,
    spawnMin: 1000,
    colorClass: 'text-red-400',
    bgClass: 'bg-red-500',
    bonus: 3.0,
    description: '不正解で激加速・8bit以上の問題',
  },
};

const GAME_CATEGORIES = [
  {
    id: 'amount',
    name: '情報量計算',
    description: 'ビット数 ↔ パターン数',
    available: true,
  },
  {
    id: 'conversion',
    name: '進数変換',
    description: '2進数・10進数・16進数',
    available: true,
  },
];

// ============================================================
// CSS（一度だけ注入）
// ============================================================

let cssInjected = false;
function injectCSS() {
  if (cssInjected) return;
  cssInjected = true;
  const style = document.createElement('style');
  style.textContent = `
    @keyframes textFlicker {
      0%, 88%, 91%, 94%, 97%, 100% { opacity: 1; }
      89%, 92%, 95% { opacity: 0.55; }
    }
    @keyframes glowPulse {
      0%, 100% { opacity: 0.7; }
      50%       { opacity: 1; }
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0; }
    }
    @keyframes slideInUp {
      from { transform: translateY(24px); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
    @keyframes shieldBob {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-10px); }
    }
    @keyframes floatUp {
      0%   { transform: translateY(0)     translateX(-50%); opacity: 1; }
      100% { transform: translateY(-56px) translateX(-50%); opacity: 0; }
    }
    @keyframes screenShake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-7px); }
      40%      { transform: translateX(7px); }
      60%      { transform: translateX(-4px); }
      80%      { transform: translateX(4px); }
    }
    @keyframes countdownPop {
      0%   { transform: scale(0.4); opacity: 0; }
      60%  { transform: scale(1.15); opacity: 1; }
      100% { transform: scale(1);   opacity: 1; }
    }
    @keyframes hackerBoost {
      0%,100% { filter: drop-shadow(0 0 0px transparent); }
      50%     { filter: drop-shadow(0 0 10px #f87171) brightness(1.3); }
    }
    @keyframes wallBreak {
      0%   { transform: translateX(-50%) scale(1);   opacity: 1; }
      40%  { transform: translateX(-50%) scale(1.2); opacity: 0.7; }
      100% { transform: translateX(-50%) scale(0);   opacity: 0; }
    }
    .hk-score-popup {
      position: absolute;
      pointer-events: none;
      font-weight: 800;
      font-size: 1rem;
      color: #FCD34D;
      text-shadow: 0 1px 6px rgba(0,0,0,0.95);
      animation: floatUp 1s ease-out forwards;
      white-space: nowrap;
      z-index: 30;
    }
    .hk-hacker-boosted .hk-hacker-icon {
      animation: hackerBoost 0.22s ease-in-out infinite;
    }
    .hk-game-shake {
      animation: screenShake 0.4s ease-in-out;
    }
    .hk-wall-breaking {
      animation: wallBreak 0.45s ease-out forwards;
      pointer-events: none;
    }
  `;
  document.head.appendChild(style);
}

// ============================================================
// メイン
// ============================================================

export function renderGameHacker(appEl) {
  injectCSS();

  let selectedCategory = null;
  let selectedStage = null;

  const timers = { tick: null, spawn: null };
  let spaceHandler = null;

  function cleanup() {
    if (timers.tick)  { clearInterval(timers.tick);  timers.tick = null; }
    if (timers.spawn) { clearTimeout(timers.spawn);  timers.spawn = null; }
    if (spaceHandler) {
      document.removeEventListener('keydown', spaceHandler);
      spaceHandler = null;
    }
  }

  // ──────────────────────────────────────────
  // フェーズ①: カテゴリ選択（タイトル画面）
  // ──────────────────────────────────────────
  function showCategorySelect() {
    cleanup();

    appEl.innerHTML = `
      <div class="fixed inset-0 bg-slate-950 flex flex-col overflow-hidden">

        <!-- 背景グリッド -->
        <div class="absolute inset-0 pointer-events-none opacity-[0.035]"
             style="background-image:linear-gradient(rgba(34,197,94,1) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,1) 1px,transparent 1px);background-size:48px 48px;"></div>

        <!-- CRTスキャンライン -->
        <div class="absolute inset-0 pointer-events-none"
             style="background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.07) 3px,rgba(0,0,0,0.07) 4px);"></div>

        <!-- 戻るボタン -->
        <button id="btn-back"
          class="absolute top-5 left-5 z-20 flex items-center gap-1.5
                 text-slate-600 hover:text-slate-300 font-mono text-xs tracking-widest transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
               stroke="currentColor" class="w-3 h-3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/>
          </svg>
          BACK
        </button>

        <!-- メインコンテンツ -->
        <div class="flex-1 flex flex-col items-center justify-center px-6 py-8">

          <!-- システム起動メッセージ -->
          <p class="text-green-500 font-mono text-xs tracking-[0.35em] mb-8 uppercase"
             style="animation:glowPulse 2.5s ease-in-out infinite;">
            &gt;&nbsp;DEFENSE SYSTEM ONLINE
          </p>

          <!-- シールドアイコン -->
          <div class="text-7xl mb-5 leading-none"
               style="animation:shieldBob 3.5s ease-in-out infinite;">🛡️</div>

          <!-- タイトルロゴ -->
          <div class="text-center mb-2">
            <h1 class="font-black font-mono tracking-[0.2em] leading-[1.1]"
                style="font-size:clamp(2.2rem,9vw,3.8rem);
                       animation:textFlicker 6s infinite;
                       color:#fff;
                       text-shadow:0 0 25px rgba(239,68,68,0.85),0 0 55px rgba(239,68,68,0.45);">
              CYBER
            </h1>
            <h1 class="font-black font-mono tracking-[0.2em] leading-[1.1] text-red-500"
                style="font-size:clamp(2.2rem,9vw,3.8rem);
                       animation:textFlicker 6s infinite 0.2s;
                       text-shadow:0 0 25px rgba(239,68,68,0.85),0 0 55px rgba(239,68,68,0.45);">
              DEFENSE
            </h1>
          </div>

          <p class="text-slate-500 font-mono text-xs tracking-[0.25em] mb-12">
            ハッカーの侵入を阻止せよ
          </p>

          <!-- ミッション選択 -->
          <div class="w-full max-w-xs">
            <div class="flex items-center gap-2 mb-4">
              <p class="text-green-400 font-mono text-[11px] tracking-[0.3em] uppercase">
                &gt;&nbsp;Select Mission
              </p>
              <span class="w-2 h-[14px] bg-green-400 inline-block"
                    style="animation:blink 1s step-end infinite;"></span>
            </div>

            <div class="flex flex-col gap-3">
              ${GAME_CATEGORIES.map((cat, i) => {
                const best = cat.available
                  ? Math.max(getHighScore(cat.id, 1), getHighScore(cat.id, 2), getHighScore(cat.id, 3))
                  : 0;
                const bestLabel = best > 0
                  ? `<span class="text-yellow-400/80">${best.toLocaleString()}&nbsp;pt</span>`
                  : `<span class="text-slate-700">---</span>`;
                return cat.available ? `
                  <button
                    data-category="${cat.id}"
                    class="w-full text-left p-4 rounded-lg border border-green-900/50
                           bg-slate-900/80 hover:border-green-500 hover:bg-slate-800/90
                           transition-all duration-200 group"
                    style="animation:slideInUp 0.45s ease-out ${i * 0.12}s both;">
                    <div class="flex items-center gap-3">
                      <div class="flex-shrink-0 w-9 h-9 rounded border border-green-800/60
                                  bg-green-950/50 flex items-center justify-center
                                  group-hover:border-green-500 transition-colors">
                        <span class="text-green-500 font-mono text-xs font-bold">0${i + 1}</span>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-white font-mono font-bold text-sm
                                  group-hover:text-green-400 transition-colors">${cat.name}</p>
                        <p class="text-slate-500 font-mono text-[11px]">${cat.description}</p>
                        <p class="font-mono text-[10px] text-slate-600 mt-1">
                          BEST&nbsp;${bestLabel}
                        </p>
                      </div>
                      <span class="flex-shrink-0 text-green-600 group-hover:text-green-400
                                   font-mono text-[10px] tracking-wider transition-colors">
                        READY&nbsp;›
                      </span>
                    </div>
                  </button>
                ` : `
                  <div
                    class="w-full p-4 rounded-lg border border-slate-800/50
                           bg-slate-900/30 opacity-40 cursor-not-allowed"
                    style="animation:slideInUp 0.45s ease-out ${i * 0.12}s both;">
                    <div class="flex items-center gap-3">
                      <div class="flex-shrink-0 w-9 h-9 rounded border border-slate-800
                                  bg-slate-900/50 flex items-center justify-center">
                        <span class="text-slate-600 font-mono text-xs font-bold">0${i + 1}</span>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-slate-500 font-mono font-bold text-sm">${cat.name}</p>
                        <p class="text-slate-600 font-mono text-[11px]">${cat.description}</p>
                      </div>
                      <span class="flex-shrink-0 text-slate-600 font-mono text-[10px] tracking-wider">
                        🔒&nbsp;LOCKED
                      </span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

        </div>
      </div>
    `;

    appEl.querySelector('#btn-back').addEventListener('click', () => { cleanup(); navigate('/'); });
    appEl.querySelectorAll('[data-category]').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedCategory = GAME_CATEGORIES.find(c => c.id === btn.dataset.category);
        showStageSelect();
      });
    });
  }

  // ──────────────────────────────────────────
  // フェーズ②: ステージ選択
  // ──────────────────────────────────────────
  function showStageSelect() {
    cleanup();

    const stageTheme = {
      1: { borderIdle: 'border-green-900/50',  borderActive: 'border-green-500',  glowColor: 'rgba(34,197,94,0.45)',  bgIdle: 'bg-green-950/15',  bgActive: 'bg-green-950/40',  threat: 'LOW',    threatCls: 'text-green-400'  },
      2: { borderIdle: 'border-yellow-900/50', borderActive: 'border-yellow-500', glowColor: 'rgba(234,179,8,0.45)', bgIdle: 'bg-yellow-950/15', bgActive: 'bg-yellow-950/40', threat: 'MEDIUM', threatCls: 'text-yellow-400' },
      3: { borderIdle: 'border-red-900/50',    borderActive: 'border-red-500',    glowColor: 'rgba(239,68,68,0.45)', bgIdle: 'bg-red-950/15',    bgActive: 'bg-red-950/40',    threat: 'HIGH',   threatCls: 'text-red-400'   },
    };

    function renderStageUI() {
      appEl.innerHTML = `
        <div class="fixed inset-0 bg-slate-950 flex flex-col overflow-hidden">

          <!-- 背景グリッド -->
          <div class="absolute inset-0 pointer-events-none opacity-[0.035]"
               style="background-image:linear-gradient(rgba(34,197,94,1) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,1) 1px,transparent 1px);background-size:48px 48px;"></div>

          <!-- CRTスキャンライン -->
          <div class="absolute inset-0 pointer-events-none"
               style="background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.07) 3px,rgba(0,0,0,0.07) 4px);"></div>

          <!-- 戻るボタン -->
          <button id="btn-back"
            class="absolute top-5 left-5 z-20 flex items-center gap-1.5
                   text-slate-600 hover:text-slate-300 font-mono text-xs tracking-widest transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                 stroke="currentColor" class="w-3 h-3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/>
            </svg>
            BACK
          </button>

          <!-- メインコンテンツ -->
          <div class="flex-1 flex flex-col items-center justify-center px-6 py-8">

            <!-- パンくず -->
            <p class="text-red-500/60 font-mono text-xs tracking-[0.3em] mb-1 uppercase">
              CYBER DEFENSE
            </p>
            <p class="text-slate-500 font-mono text-[11px] tracking-[0.2em] mb-8">
              MISSION:&nbsp;<span class="text-slate-300">${selectedCategory.name}</span>
            </p>

            <!-- セクションヘッダー -->
            <div class="flex items-center gap-2 mb-6">
              <p class="text-green-400 font-mono text-[11px] tracking-[0.3em] uppercase">
                &gt;&nbsp;Select Difficulty
              </p>
              <span class="w-2 h-[14px] bg-green-400 inline-block"
                    style="animation:blink 1s step-end infinite;"></span>
            </div>

            <!-- ステージカード（3列） -->
            <div class="w-full max-w-lg flex gap-3 mb-8">
              ${[1, 2, 3].map(s => {
                const cfg = STAGE_CONFIG[s];
                const th = stageTheme[s];
                const isSelected = selectedStage === s;
                const best = getHighScore(selectedCategory.id, s);
                return `
                  <button data-stage="${s}"
                    class="flex-1 p-4 rounded-lg border text-left cursor-pointer
                           transition-all duration-200 flex flex-col gap-2.5
                           ${isSelected
                             ? `${th.borderActive} ${th.bgActive} -translate-y-1.5`
                             : `${th.borderIdle} ${th.bgIdle} hover:-translate-y-0.5`
                           }"
                    ${isSelected ? `style="box-shadow:0 0 22px ${th.glowColor};"` : ''}>

                    <!-- 番号 + ラベル -->
                    <div class="flex items-center gap-2">
                      <span class="font-mono text-[10px] text-slate-600">0${s}</span>
                      <span class="font-bold font-mono text-xs ${cfg.colorClass} tracking-wider leading-none">
                        ${cfg.label.replace(/★\d\s+/, '').trim()}
                      </span>
                    </div>

                    <!-- シールド数 -->
                    <div class="flex gap-0.5">
                      ${Array.from({ length: cfg.hp }, () =>
                        `<span class="text-base leading-none">🛡️</span>`
                      ).join('')}
                    </div>

                    <!-- 説明 -->
                    <p class="text-[10px] text-slate-500 leading-snug">${cfg.description}</p>

                    <!-- 最高点 -->
                    <div class="flex items-center justify-between font-mono text-[10px]">
                      <span class="text-slate-600">BEST</span>
                      <span class="${best > 0 ? 'text-yellow-400/80' : 'text-slate-700'}">
                        ${best > 0 ? best.toLocaleString() + '&nbsp;pt' : '---'}
                      </span>
                    </div>

                    <!-- ボーナス + THREAT（下部） -->
                    <div class="mt-auto pt-2 border-t ${isSelected ? 'border-slate-600' : 'border-slate-800/80'} flex items-center justify-between">
                      <span class="font-mono text-[10px] ${cfg.colorClass}">BONUS&nbsp;×${cfg.bonus}</span>
                      <span class="font-mono text-[10px] font-bold ${th.threatCls}">${th.threat}</span>
                    </div>

                  </button>
                `;
              }).join('')}
            </div>

            <!-- スタートボタン or 選択促し -->
            ${selectedStage ? `
              <div class="flex flex-col items-center gap-3"
                   style="animation:slideInUp 0.3s ease-out both;">
                <button id="start-btn"
                  class="px-14 py-4 font-black font-mono text-base tracking-[0.2em] uppercase
                         rounded-lg border-2 border-green-500 text-green-400
                         bg-green-950/40 hover:bg-green-950/70 active:scale-95
                         transition-all duration-150"
                  style="box-shadow:0 0 20px rgba(34,197,94,0.35);">
                  [ START MISSION ]
                </button>
                <p class="text-slate-600 font-mono text-[10px] tracking-wider">
                  <kbd class="px-1.5 py-0.5 border border-slate-700 rounded text-slate-500 font-mono text-[10px]">SPACE</kbd>
                  &nbsp;でも開始できます
                </p>
              </div>
            ` : `
              <p class="text-slate-600 font-mono text-xs tracking-[0.2em] uppercase"
                 style="animation:glowPulse 2s ease-in-out infinite;">
                &gt;&nbsp;Choose a difficulty level
              </p>
            `}

          </div>
        </div>
      `;

      appEl.querySelector('#btn-back').addEventListener('click', () => { cleanup(); showCategorySelect(); });

      appEl.querySelectorAll('[data-stage]').forEach(btn => {
        btn.addEventListener('click', () => {
          selectedStage = Number(btn.dataset.stage);
          renderStageUI();
        });
      });

      if (selectedStage) {
        appEl.querySelector('#start-btn')?.addEventListener('click', showCountdown);
        if (!spaceHandler) {
          spaceHandler = (e) => {
            if (e.code === 'Space') { e.preventDefault(); showCountdown(); }
          };
          document.addEventListener('keydown', spaceHandler);
        }
      }
    }

    renderStageUI();
  }

  // ──────────────────────────────────────────
  // フェーズ③: カウントダウン
  // ──────────────────────────────────────────
  function showCountdown() {
    cleanup();
    const cfg = STAGE_CONFIG[selectedStage];

    function showNum(val) {
      const isGo = val === 'GO!';
      appEl.innerHTML = `
        <div class="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center gap-6 select-none">
          <p class="text-sm text-slate-400 font-mono tracking-widest uppercase">
            ${selectedCategory.name} — ${cfg.label}
          </p>
          <div class="${isGo ? 'text-green-400 text-7xl' : 'text-white text-[9rem]'} font-bold font-mono"
               style="animation: countdownPop 0.5s ease-out forwards;">
            ${val}
          </div>
          ${isGo ? `<p class="text-slate-400 text-sm">侵入を阻止せよ！</p>` : ''}
        </div>
      `;
    }

    showNum(3);
    setTimeout(() => showNum(2), 900);
    setTimeout(() => showNum(1), 1800);
    setTimeout(() => showNum('GO!'), 2700);
    setTimeout(() => showGame(), 3300);
  }

  // ──────────────────────────────────────────
  // フェーズ④: ゲーム本編
  // ──────────────────────────────────────────
  function showGame() {
    cleanup();
    const cfg = STAGE_CONFIG[selectedStage];

    const gs = {
      hp: cfg.hp,
      walls: initWalls(cfg.hp),
      score: 0,
      hackers: [],
      nextId: 0,
      problem: makeQuestionForStage(selectedCategory.id, selectedStage, 0),
      problemStartTime: Date.now(),
      elapsed: 0,
      gameOver: false,
    };

    // ────── HTML 構築（一度だけ） ──────────────────────────────────────

    appEl.innerHTML = `
      <div class="flex flex-col bg-slate-950" style="height:100svh;height:100vh;">

        <!-- ゲームヘッダー -->
        <header class="flex-shrink-0 h-11 flex items-center justify-between px-4
                       bg-slate-900 border-b border-slate-700/80">
          <button id="btn-back" aria-label="戻る"
            class="text-slate-500 hover:text-white transition-colors p-1 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                 stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/>
            </svg>
          </button>

          <div class="flex items-center gap-3">
            <span class="font-bold ${cfg.colorClass} text-xs font-mono">${cfg.label}</span>
            <span id="wave-display" class="text-slate-500 text-xs font-mono">WAVE 1</span>
            <span class="text-slate-400 text-xs">
              SCORE:&nbsp;<strong id="score-display" class="text-yellow-400 font-mono">0</strong>
            </span>
          </div>

          <!-- ファイアウォール残数 -->
          <div id="fw-header" class="text-xs font-mono text-slate-400"></div>
        </header>

        <!-- ゲームエリア（フルワイド・全高） -->
        <div id="game-area" class="flex-1 relative overflow-hidden bg-slate-950">
          <div id="flash-overlay" class="absolute inset-0 pointer-events-none"
               style="opacity:0;transition:opacity 0.15s;z-index:20;"></div>
          <!-- サーバー・ファイアウォール・ハッカーをすべてここに描画 -->
          <div id="game-canvas" class="absolute inset-0"></div>
        </div>

        <!-- 問題エリア（下半分） -->
        <div class="flex-1 bg-slate-900 border-t border-slate-700/80 px-6 flex flex-col justify-center">
          <div class="max-w-xl mx-auto w-full">
            <div class="flex items-start gap-3 mb-3">
              <span class="flex-shrink-0 text-sm font-bold bg-red-950 text-red-400
                           px-3 py-1 rounded-full border border-red-800/50 mt-0.5">問題</span>
              <p id="problem-text" class="text-xl text-slate-100 leading-relaxed font-medium"></p>
            </div>
            <p id="problem-unit" class="text-base text-slate-500 mb-5"></p>
            <div class="flex gap-3">
              <input id="answer-input" type="text" inputmode="numeric"
                placeholder="答えを入力…" autocomplete="off"
                class="flex-1 px-4 py-4 rounded-2xl bg-slate-800 text-white border border-slate-600
                       text-xl focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-slate-600" />
              <button id="submit-btn"
                class="px-8 py-4 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xl font-bold
                       rounded-2xl transition-all focus:outline-none focus:ring-2 focus:ring-red-400">
                撃退
              </button>
            </div>
            <div class="flex items-center justify-between mt-3">
              <div id="feedback-text" class="text-base font-bold min-h-[1.5rem]"></div>
              <p class="text-xs text-slate-600 flex-shrink-0 ml-4">
                <kbd class="px-1.5 py-0.5 bg-slate-700 rounded text-slate-400 font-mono text-xs">Enter</kbd>
                でも送信できます
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- ゲームオーバーオーバーレイ -->
      <div id="gameover-overlay"
           class="hidden fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm">
        <div class="bg-slate-800 border border-slate-600 rounded-2xl shadow-2xl p-8 mx-4 w-full max-w-sm text-center">
          <p class="text-5xl mb-4">💀</p>
          <h2 class="text-2xl font-bold text-white mb-1">サーバー陥落</h2>
          <p class="text-sm text-slate-400 mb-4">${selectedCategory.name} — ${cfg.label}</p>
          <div class="bg-slate-700/50 rounded-xl py-4 mb-6 relative">
            <div id="new-record-badge"
                 class="hidden absolute -top-3 left-1/2 -translate-x-1/2
                        bg-yellow-400 text-slate-900 font-black font-mono text-xs
                        px-3 py-0.5 rounded-full tracking-wider whitespace-nowrap">
              ★ NEW RECORD !
            </div>
            <p class="text-xs text-slate-400 mb-1">最終スコア</p>
            <p id="final-score" class="text-4xl font-bold font-mono text-yellow-400">0</p>
            <p id="bonus-label" class="text-xs text-slate-500 mt-0.5">pt</p>
          </div>
          <div class="flex flex-col gap-2">
            <button id="retry-btn"
              class="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors">
              もう一度
            </button>
            <button id="back-stage-btn"
              class="w-full py-3 border border-slate-600 text-slate-300 text-sm rounded-xl
                     hover:bg-slate-700 transition-colors">
              ステージ選択へ
            </button>
          </div>
        </div>
      </div>
    `;

    // ────── ゲームロジック ──────────────────────────────────────────────

    function currentSpeed() {
      return Math.min(20, cfg.baseSpeed + Math.floor(gs.elapsed / 20000) * 2);
    }

    function currentSpawnDelay() {
      return Math.max(cfg.spawnMin, cfg.spawnStart - Math.floor(gs.elapsed / 10000) * 400);
    }

    function spawnHacker() {
      if (gs.gameOver) return;
      gs.hackers.push({
        id: gs.nextId++,
        x: 97,
        boosted: false,
        boostRemaining: 0,
        boostStrength: 1,
      });
      timers.spawn = setTimeout(spawnHacker, currentSpawnDelay());
    }

    function tick() {
      if (!appEl.querySelector('#game-canvas')) {
        clearInterval(timers.tick);
        clearTimeout(timers.spawn);
        return;
      }
      if (gs.gameOver) return;

      gs.elapsed += 100;
      const spd = currentSpeed();

      // ハッカー移動
      for (const h of gs.hackers) {
        const move = h.boosted ? spd * h.boostStrength : spd;
        h.x -= move * 0.1;
        if (h.boosted) {
          h.boostRemaining -= 100;
          if (h.boostRemaining <= 0) h.boosted = false;
        }
      }

      // ファイアウォール衝突判定
      const aliveWalls = gs.walls.filter(w => w.alive).sort((a, b) => b.x - a.x);

      if (aliveWalls.length > 0) {
        const rightmost = aliveWalls[0];
        const colliders = gs.hackers.filter(h => h.x <= rightmost.x);

        if (colliders.length > 0) {
          // 衝突したハッカーはすべて消去し、ウォールを1枚破壊
          rightmost.alive = false;
          gs.hp--;
          gs.hackers = gs.hackers.filter(h => h.x > rightmost.x);
          triggerFlash('red');
          triggerShake();
          showWallBreakEffect(rightmost.x);
          updateFirewall();

          if (gs.hp === 0) {
            showFloatingText('⚠️  FIREWALL DOWN!', '#f87171');
          }
        }

      } else {
        // ウォールなし → サーバー直撃判定
        const serverHit = gs.hackers.some(h => h.x <= 5);
        if (serverHit) {
          gs.hackers = gs.hackers.filter(h => h.x > 5);
          gs.gameOver = true;
          clearInterval(timers.tick);
          clearTimeout(timers.spawn);
          updateCanvas();
          showGameOver();
          return;
        }
      }

      updateCanvas();
      updateWave();
    }

    function handleAnswer(raw) {
      if (gs.gameOver || !raw.trim()) return;
      const trimmed = raw.trim();
      let correct;
      switch (gs.problem.answerType) {
        case 'number':
          correct = Number(trimmed.replace(/,/g, '')) === gs.problem.answer;
          break;
        case 'binary':
          correct = trimmed.replace(/^0+/, '') === String(gs.problem.answer).replace(/^0+/, '')
                 || trimmed === String(gs.problem.answer);
          break;
        case 'hex':
          correct = trimmed.toUpperCase() === String(gs.problem.answer).toUpperCase();
          break;
        default:
          correct = trimmed === String(gs.problem.answer);
      }

      if (correct) {
        const front = gs.hackers.length > 0
          ? gs.hackers.reduce((a, b) => (a.x < b.x ? a : b))
          : null;

        const secondsTaken = (Date.now() - gs.problemStartTime) / 1000;
        const pts = Math.max(0, Math.round(gs.problem.bits * (1 + (10 - secondsTaken) / 10) * 100));

        if (front) {
          showScorePopup(front.x, pts);
          gs.hackers = gs.hackers.filter(h => h.id !== front.id);
        }
        gs.score += pts;
        gs.problem = makeQuestionForStage(selectedCategory.id, selectedStage, gs.elapsed);
        gs.problemStartTime = Date.now();

        triggerFlash('green');
        updateScore();
        updateProblem();
        showFeedback(`✅  BLOCKED!  +${pts}pt`, true);

      } else {
        if (selectedStage >= 2 && gs.hackers.length > 0) {
          const front = gs.hackers.reduce((a, b) => (a.x < b.x ? a : b));
          front.boosted = true;
          front.boostRemaining = 3000;
          front.boostStrength = cfg.penaltyBoost;
        }
        triggerFlash('red');
        const penMsg = selectedStage >= 2 ? '  →  SPEED UP!' : '';
        showFeedback(`❌  不正解${penMsg}`, false);
      }

      const input = appEl.querySelector('#answer-input');
      if (input) { input.value = ''; input.focus(); }
    }

    // ────── DOM 更新 ────────────────────────────────────────────────────

    function updateCanvas() {
      const canvas = appEl.querySelector('#game-canvas');
      if (!canvas) return;

      const frontId = gs.hackers.length > 0
        ? gs.hackers.reduce((a, b) => (a.x < b.x ? a : b)).id
        : -1;

      const aliveWalls = gs.walls.filter(w => w.alive);
      const isLastWall = aliveWalls.length === 1;

      const serverHTML = `
        <div class="absolute top-1/2 flex flex-col items-center gap-1 select-none"
             style="left:2%;transform:translateY(-50%);">
          <span class="text-4xl">🖥️</span>
          <span class="text-[9px] text-slate-500 font-mono">SERVER</span>
        </div>
      `;

      // 右端に固定配置されたハッカー（ウイルスの送信元）
      const hackerBaseHTML = `
        <div class="absolute top-1/2 flex flex-col items-center gap-1 select-none"
             style="right:1%;transform:translateY(-50%);">
          <span class="text-[9px] text-red-500 font-mono animate-pulse">HACKER</span>
          <span class="text-4xl">🧑‍💻</span>
        </div>
      `;

      // シールド壁
      const wallsHTML = aliveWalls.map(w => {
        const isLast = isLastWall && aliveWalls[0].id === w.id;
        return `
          <div class="absolute top-1/2 flex flex-col items-center select-none"
               style="left:${w.x}%;transform:translate(-50%,-50%);">
            <span class="text-6xl leading-none ${isLast ? 'animate-pulse' : ''}"
                  style="${isLast
                    ? 'filter:drop-shadow(0 0 12px rgba(239,68,68,0.9))'
                    : 'filter:drop-shadow(0 0 6px rgba(96,165,250,0.5))'}">🛡️</span>
          </div>
        `;
      }).join('');

      // 左向きに流れるウイルス
      const virusHTML = gs.hackers.map(h => {
        const isTarget = h.id === frontId;
        return `
          <div class="absolute flex flex-col items-center gap-0.5 select-none
                      ${h.boosted ? 'hk-hacker-boosted' : ''}"
               style="left:${h.x}%;top:50%;transform:translate(-50%,-50%);">
            ${isTarget
              ? `<span class="text-[11px] text-orange-400 font-bold animate-pulse leading-none tracking-tight">🎯 TARGET</span>`
              : `<span style="height:14px;display:block;"></span>`
            }
            <span class="hk-hacker-icon text-3xl leading-none">${h.boosted ? '💨🦠' : '🦠'}</span>
            ${h.boosted ? `<span class="text-[10px] text-red-400 font-bold leading-none">FAST!</span>` : ''}
          </div>
        `;
      }).join('');

      canvas.innerHTML = serverHTML + wallsHTML + virusHTML + hackerBaseHTML;
    }

    function updateFirewall() {
      const el = appEl.querySelector('#fw-header');
      if (!el) return;
      const remaining = gs.walls.filter(w => w.alive).length;
      if (remaining > 0) {
        el.innerHTML = `🛡️&nbsp;×&nbsp;<span class="font-bold text-slate-300">${remaining}</span>`;
      } else {
        el.innerHTML = `<span class="text-red-400 font-bold animate-pulse">⚠️ 露出中</span>`;
      }
    }

    function updateScore() {
      const el = appEl.querySelector('#score-display');
      if (el) el.textContent = gs.score;
    }

    function updateWave() {
      const el = appEl.querySelector('#wave-display');
      if (el) el.textContent = `WAVE ${Math.floor(gs.elapsed / 10000) + 1}`;
    }

    function updateProblem() {
      const textEl = appEl.querySelector('#problem-text');
      const unitEl = appEl.querySelector('#problem-unit');
      const inputEl = appEl.querySelector('#answer-input');
      if (textEl) textEl.textContent = gs.problem.question;
      if (unitEl) {
        const u = gs.problem.unit;
        unitEl.textContent = !u ? '' : gs.problem.answerType === 'number' ? `単位: ${u}` : u;
      }
      if (inputEl) {
        inputEl.inputMode = gs.problem.answerType === 'number' ? 'numeric' : 'text';
        inputEl.placeholder = {
          number: '数値を入力…',
          binary: '2進数で入力（例: 1010）',
          hex:    '16進数で入力（例: 2F）',
        }[gs.problem.answerType] ?? '答えを入力…';
      }
    }

    function showFeedback(text, ok) {
      const el = appEl.querySelector('#feedback-text');
      if (!el) return;
      el.textContent = text;
      el.className = `mt-1.5 text-xs font-bold min-h-[1rem] ${ok ? 'text-green-400' : 'text-red-400'}`;
      setTimeout(() => { if (el) el.textContent = ''; }, 1500);
    }

    function triggerFlash(color) {
      const overlay = appEl.querySelector('#flash-overlay');
      if (!overlay) return;
      overlay.style.background = color === 'green'
        ? 'rgba(0,200,80,0.20)'
        : 'rgba(200,0,0,0.28)';
      overlay.style.opacity = '1';
      setTimeout(() => { if (overlay) overlay.style.opacity = '0'; }, 200);
    }

    function triggerShake() {
      const area = appEl.querySelector('#game-area');
      if (!area) return;
      area.classList.remove('hk-game-shake');
      void area.offsetWidth;
      area.classList.add('hk-game-shake');
      setTimeout(() => area.classList.remove('hk-game-shake'), 400);
    }

    // ウォール破壊エフェクト（壁の位置に 💥 が浮かび上がる）
    function showWallBreakEffect(wallX) {
      const canvas = appEl.querySelector('#game-canvas');
      if (!canvas) return;
      const el = document.createElement('div');
      el.textContent = '💥';
      el.style.cssText = [
        `position:absolute`,
        `left:${wallX}%`,
        `top:45%`,
        `font-size:2.5rem`,
        `pointer-events:none`,
        `z-index:25`,
        `animation:floatUp 0.9s ease-out forwards`,
        `transform:translateX(-50%)`,
      ].join(';');
      canvas.appendChild(el);
      setTimeout(() => el.remove(), 900);
    }

    function showFloatingText(text, color) {
      const canvas = appEl.querySelector('#game-canvas');
      if (!canvas) return;
      const el = document.createElement('div');
      el.textContent = text;
      el.style.cssText = [
        `position:absolute`, `left:50%`, `top:30%`,
        `transform:translateX(-50%)`,
        `color:${color}`, `font-weight:800`, `font-size:1.2rem`,
        `pointer-events:none`, `z-index:26`, `white-space:nowrap`,
        `text-shadow:0 2px 8px rgba(0,0,0,0.9)`,
        `animation:floatUp 1.3s ease-out forwards`,
      ].join(';');
      canvas.appendChild(el);
      setTimeout(() => el.remove(), 1300);
    }

    function showScorePopup(x, pts) {
      const canvas = appEl.querySelector('#game-canvas');
      if (!canvas) return;
      const el = document.createElement('div');
      el.className = 'hk-score-popup';
      el.textContent = `+${pts}pt`;
      el.style.left = `${Math.min(88, Math.max(6, x))}%`;
      el.style.top = '28%';
      canvas.appendChild(el);
      setTimeout(() => el.remove(), 1000);
    }

    function showGameOver() {
      const overlay = appEl.querySelector('#gameover-overlay');
      const finalEl = appEl.querySelector('#final-score');
      const bonusEl = appEl.querySelector('#bonus-label');
      if (overlay) overlay.classList.remove('hidden');
      const finalScore = Math.round(gs.score * cfg.bonus);
      if (finalEl) finalEl.textContent = finalScore;
      if (bonusEl) {
        bonusEl.textContent = cfg.bonus > 1
          ? `pt（ベース ${gs.score} pt × ${cfg.bonus} ボーナス）`
          : 'pt';
      }
      const isNew = saveHighScore(selectedCategory.id, selectedStage, finalScore);
      if (isNew) {
        const badge = appEl.querySelector('#new-record-badge');
        if (badge) badge.classList.remove('hidden');
      }
    }

    // ────── イベント登録 ──────────────────────────────────────────────

    appEl.querySelector('#btn-back').addEventListener('click', () => {
      cleanup(); showStageSelect();
    });

    const input = appEl.querySelector('#answer-input');
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') handleAnswer(input.value);
    });
    appEl.querySelector('#submit-btn').addEventListener('click', () => handleAnswer(input.value));

    appEl.querySelector('#retry-btn')?.addEventListener('click', () => {
      cleanup(); showCountdown();
    });
    appEl.querySelector('#back-stage-btn')?.addEventListener('click', () => {
      cleanup(); showStageSelect();
    });

    // ────── 初期描画 + ゲーム開始 ──────────────────────────────────────

    updateProblem();
    updateFirewall();
    updateCanvas();
    timers.spawn = setTimeout(spawnHacker, currentSpawnDelay());
    timers.tick  = setInterval(tick, 100);
    input.focus();
  }

  // ──────────────────────────────────────────
  // ヘルパー: 共通ヘッダー（非ゲーム画面）
  // ──────────────────────────────────────────
  function headerHTML(title, isDark) {
    return `
      <header class="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur
                     border-b border-gray-100 dark:border-gray-800">
        <div class="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <button id="btn-back"
              class="w-9 h-9 flex items-center justify-center rounded-xl
                     text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                   stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/>
              </svg>
            </button>
            <h1 class="font-bold text-gray-800 dark:text-gray-100 text-base">🛡️ ${title}</h1>
          </div>
          <button id="dark-toggle"
            class="w-9 h-9 flex items-center justify-center rounded-xl
                   text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke-width="1.5" stroke="currentColor" class="w-5 h-5 ${isDark ? 'hidden' : ''}">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"/>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke-width="1.5" stroke="currentColor" class="w-5 h-5 ${isDark ? '' : 'hidden'}">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"/>
            </svg>
          </button>
        </div>
      </header>
    `;
  }

  // ──────────────────────────────────────────
  // エントリーポイント
  // ──────────────────────────────────────────
  showCategorySelect();
}
