import {
  makeInfBitQuestion, makeBitInfQuestion,
  makeDecToBinQuestion, makeBinToDecQuestion, makeBinToHexQuestion, makeHexToBinQuestion,
  makeAddQuestion, makeSubQuestion, makeShiftQuestion,
  makeImgAmountQuestion, makeAudioAmountQuestion, makeVideoAmountQuestion,
  makeCompressionRatioQuestion, makeRunLengthQuestion, makeHuffmanQuestion,
} from './questions.js';

// ============================================================
// SVG アイコン（Heroicons Outline）
// ============================================================

const ICONS = {
  amount: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7">
    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
  </svg>`,

  conversion: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7">
    <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
  </svg>`,

  calc: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm2.247-4.509h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.248-6.751h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.76 4.5 4.98V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.98c0-1.22-.807-2.28-1.907-2.408A48.716 48.716 0 0 0 12 2.25Z" />
  </svg>`,

  data_amount: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7">
    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
  </svg>`,

  compression: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7">
    <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
  </svg>`,
};

// ============================================================
// カテゴリ定義
// ============================================================

export const CATEGORIES = [
  {
    id: 'amount',
    name: '情報量計算',
    description: 'ビット数と情報のパターン数の相互変換',
    icon: ICONS.amount,
    color: 'indigo',
    generators: [makeInfBitQuestion, makeBitInfQuestion],
    hints: {
      'inf-bit':
        '① パターン数から 1 を引く\n② その値を2進数で表したとき何桁になるかを数える\n③ 桁数がビット数になる',
      'bit-inf':
        '① n ビットのとき 2^n 通り表現できる\n② 2 を n 回かけ算する\n③ 例: 3 bit → 2³ = 8 通り',
    },
  },
  {
    id: 'conversion',
    name: '進数変換',
    description: '2進数・10進数・16進数の相互変換',
    icon: ICONS.conversion,
    color: 'violet',
    generators: [makeDecToBinQuestion, makeBinToDecQuestion, makeBinToHexQuestion, makeHexToBinQuestion],
    hints: {
      'dec-to-bin':
        '① 10進数を2で割り続ける\n② 余りを下から順に並べると2進数になる\n③ 例: 13 → 13÷2=6余1, 6÷2=3余0, 3÷2=1余1, 1÷2=0余1 → 1101',
      'bin-to-dec':
        '① 右端から 0, 1, 2, 3… と桁の位置を数える\n② 1 が立っている桁の 2^n を合計する\n③ 例: 1011 → 2⁰+2¹+2³ = 1+2+8 = 11',
      'bin-to-hex':
        '① 2進数を右から4桁ずつ区切る\n② 各4桁を16進数1文字に変換する\n③ 0000=0, 1010=A, 1111=F など',
      'hex-to-bin':
        '① 16進数の各1文字を4桁の2進数に変換する\n② そのまま並べると2進数になる\n③ 例: B = 1011, A = 1010',
    },
  },
  {
    id: 'calc',
    name: '2進数の計算',
    description: '2進数の四則演算とシフト演算',
    icon: ICONS.calc,
    color: 'blue',
    generators: [makeAddQuestion, makeSubQuestion, makeShiftQuestion],
    hints: {
      'add':
        '① 右の桁から順に足し算する\n② 1+1=10（繰り上がり）を忘れずに\n③ 例: 011+101 → 桁ごとに 1,1,0 → 1000',
      'sub':
        '① 右の桁から順に引き算する\n② 0から1を引くときは上の桁から借りてくる（借位）\n③ 借位すると現在の桁は 10（=2）になる',
      'shift-left':
        '① 全ビットを左にずらす\n② 右端には 0 が入る\n③ 左シフト n 回 = 2^n 倍になる',
      'shift-right':
        '① 全ビットを右にずらす\n② 左端には 0 が入る\n③ 右シフト n 回 = 2^n で割った商になる',
    },
  },
  {
    id: 'data_amount',
    name: 'データ量の計算',
    description: '画像・音声・動画データ量の計算',
    icon: ICONS.data_amount,
    color: 'cyan',
    generators: [makeImgAmountQuestion, makeAudioAmountQuestion, makeVideoAmountQuestion],
    hints: {
      'img-amount':
        '① 何色あるかから1画素あたりのビット数を求める（2^n ≥ 色数となる最小の n）\n② 総画素数 = 横 × 縦\n③ データ量(bit) = 総画素数 × 1画素ビット数\n④ ÷8 でバイト換算',
      'audio-amount':
        '① データ量(bit) = 時間(秒) × サンプリング周波数(Hz) × 量子化ビット数(bit) × チャンネル数\n② ÷8 でバイト換算',
      'video-amount':
        '① データ量(bit) = 時間(秒) × FPS × 横px × 縦px × 1画素ビット数\n② ÷8 でバイト換算',
    },
  },
  {
    id: 'compression',
    name: '圧縮の計算',
    description: '圧縮率・ランレングス・ハフマン符号',
    icon: ICONS.compression,
    color: 'emerald',
    generators: [makeCompressionRatioQuestion, makeRunLengthQuestion, makeHuffmanQuestion],
    hints: {
      'compression-ratio':
        '圧縮率(%) = 圧縮後のデータ量 ÷ 元のデータ量 × 100',
      'compression-compressed':
        '圧縮後 = 元のデータ量 × 圧縮率 ÷ 100',
      'compression-original':
        '元のデータ量 = 圧縮後のデータ量 ÷ (圧縮率 ÷ 100)',
      'run-length':
        '① 先頭から連続する同じ値をひとまとめにする\n② 「個数,値」の形式で記録する\n③ 各グループをスペース区切りで並べる\n④ 例: 00011 → 3,0 2,1',
      'huffman':
        '① 各文字に対応するビット列の長さを確認する\n② 文字列の各文字のビット長を足し算する\n③ 例: A(1bit)×2 + B(2bit)×3 = 2+6 = 8bit',
    },
  },
];

// ============================================================
// カテゴリ検索ユーティリティ
// ============================================================

export function getCategoryById(id) {
  return CATEGORIES.find(c => c.id === id) || null;
}

// ============================================================
// 回答バリデーション（type別）
// ============================================================

export function checkAnswer(userInput, question) {
  const raw = String(userInput).trim();
  if (raw === '') return false;

  switch (question.answerType) {
    case 'binary':
      // 先頭ゼロなし比較・大文字小文字なし
      return raw.replace(/^0+/, '') === String(question.answer).replace(/^0+/, '')
          || raw === String(question.answer);

    case 'hex':
      return raw.toUpperCase() === String(question.answer).toUpperCase();

    case 'number': {
      const userNum = Number(raw.replace(/,/g, '')); // カンマ区切りも許可
      const correctNum = Number(question.answer);
      if (isNaN(userNum)) return false;
      // 整数問題は厳密比較、小数問題は小数第1位まで比較
      if (Number.isInteger(correctNum)) {
        return userNum === correctNum;
      } else {
        return Math.abs(userNum - correctNum) < 0.05; // ±0.05 の誤差許容
      }
    }

    case 'run-length':
      // 複数スペースを1スペースに正規化して比較
      return raw.replace(/\s+/g, ' ') === question.answer;

    default:
      return raw === String(question.answer);
  }
}
