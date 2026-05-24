// ============================================================
// Helper Functions
// ============================================================

function Rand(min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
}

function decToBin(dec) {
  return dec.toString(2);
}

function decToHex(dec) {
  return dec.toString(16);
}

function getBit(num) {
  if (num === 0) return 1;
  let itr = 0;
  while (num > 0) {
    num = Math.floor(num / 2);
    itr++;
  }
  return itr;
}

// ============================================================
// 情報量計算
// ============================================================

export function makeInfBitQuestion(difficulty) {
  let min, max;
  switch (difficulty) {
    case 1: min = 2;        max = 2 ** 8;  break;
    case 2: min = 2 ** 8 + 1; max = 2 ** 16; break;
    case 3: min = 2 ** 16 + 1; max = 2 ** 20; break;
    default: min = 2; max = 256;
  }
  const patterns = Rand(min, max);
  return {
    type: 'inf-bit',
    answerType: 'number',
    question: `${patterns.toLocaleString()}通りで表せる情報のデータ量は？`,
    unit: 'bit',
    formatHint: '数値のみ入力（例: 8）',
    answer: getBit(patterns - 1),
  };
}

export function makeBitInfQuestion(difficulty) {
  let min, max;
  switch (difficulty) {
    case 1: min = 1; max = 8;  break;
    case 2: min = 9; max = 16; break;
    case 3: min = 17; max = 20; break;
    default: min = 1; max = 8;
  }
  const bits = Rand(min, max);
  return {
    type: 'bit-inf',
    answerType: 'number',
    question: `${bits}bitで表せる情報は？`,
    unit: '通り',
    formatHint: '数値のみ入力（例: 256）',
    answer: 2 ** bits,
  };
}

// ============================================================
// 進数変換
// ============================================================

function getConversionRange(difficulty) {
  switch (difficulty) {
    case 1: return [1, 15];
    case 2: return [16, 255];
    case 3: return [256, 4095];
    default: return [1, 15];
  }
}

export function makeDecToBinQuestion(difficulty) {
  const [min, max] = getConversionRange(difficulty);
  const dec = Rand(min, max);
  return {
    type: 'dec-to-bin',
    answerType: 'binary',
    question: `10進数の「${dec}」を2進数に変換すると？`,
    formatHint: '例) 1101',
    answer: decToBin(dec),
  };
}

export function makeBinToDecQuestion(difficulty) {
  const [min, max] = getConversionRange(difficulty);
  const dec = Rand(min, max);
  const bin = decToBin(dec);
  return {
    type: 'bin-to-dec',
    answerType: 'number',
    question: `2進数の「${bin}」を10進数に変換すると？`,
    formatHint: '例) 42',
    answer: dec,
  };
}

export function makeBinToHexQuestion(difficulty) {
  const [min, max] = getConversionRange(difficulty);
  const dec = Rand(min, max);
  const bin = decToBin(dec);
  return {
    type: 'bin-to-hex',
    answerType: 'hex',
    question: `2進数の「${bin}」を16進数に変換すると？`,
    formatHint: '例) 1A（大文字・小文字どちらでも可）',
    answer: decToHex(dec).toUpperCase(),
  };
}

export function makeHexToBinQuestion(difficulty) {
  const [min, max] = getConversionRange(difficulty);
  const dec = Rand(min, max);
  const hex = decToHex(dec).toUpperCase();
  return {
    type: 'hex-to-bin',
    answerType: 'binary',
    question: `16進数の「${hex}」を2進数に変換すると？`,
    formatHint: '例) 10110011',
    answer: decToBin(dec),
  };
}

// ============================================================
// 2進数の計算
// ============================================================

function getCalcRange(difficulty) {
  switch (difficulty) {
    case 1: return [0, 15];
    case 2: return [0, 255];
    case 3: return [0, 1023];
    default: return [0, 15];
  }
}

export function makeAddQuestion(difficulty) {
  const [min, max] = getCalcRange(difficulty);
  const num1 = Rand(min, max);
  const num2 = Rand(min, max);
  const answer = num1 + num2;
  const pad = decToBin(max).length;
  return {
    type: 'add',
    answerType: 'binary',
    question: `2進数の計算をしてください\n${decToBin(num1).padStart(pad, '0')}  +  ${decToBin(num2).padStart(pad, '0')}`,
    formatHint: '例) 10011（先頭の0は不要）',
    answer: decToBin(answer),
    explanation: `${decToBin(num1).padStart(pad,'0')} + ${decToBin(num2).padStart(pad,'0')} = ${decToBin(answer)}\n（10進数: ${num1} + ${num2} = ${answer}）`,
  };
}

export function makeSubQuestion(difficulty) {
  const [min, max] = getCalcRange(difficulty);
  const temp1 = Rand(min, max);
  const temp2 = Rand(min, max);
  const num1 = Math.max(temp1, temp2);
  const num2 = Math.min(temp1, temp2);
  const answer = num1 - num2;
  const pad = decToBin(max).length;
  return {
    type: 'sub',
    answerType: 'binary',
    question: `2進数の計算をしてください\n${decToBin(num1).padStart(pad, '0')}  −  ${decToBin(num2).padStart(pad, '0')}`,
    formatHint: '例) 1010（先頭の0は不要）',
    answer: decToBin(answer),
    explanation: `${decToBin(num1).padStart(pad,'0')} − ${decToBin(num2).padStart(pad,'0')} = ${decToBin(answer)}\n（10進数: ${num1} − ${num2} = ${answer}）`,
  };
}

export function makeShiftQuestion(difficulty) {
  const [min, max] = getCalcRange(difficulty);
  const num = Rand(min, max);
  const pad = decToBin(max).length;
  const shiftAmount = Rand(1, Math.floor(pad / 2));
  const direction = Rand(0, 1);

  if (direction === 0) {
    const answer = num << shiftAmount;
    return {
      type: 'shift-left',
      answerType: 'binary',
      question: `2進数「${decToBin(num).padStart(pad, '0')}」を左に${shiftAmount}ビットシフトすると？`,
      formatHint: '例) 10110（先頭の0は不要）',
      answer: decToBin(answer),
      explanation: `左に${shiftAmount}ビットシフトすると、値が 2^${shiftAmount} = ${2**shiftAmount} 倍になります。\n${num} × ${2**shiftAmount} = ${answer}\n2進数: ${decToBin(answer)}`,
    };
  } else {
    const answer = num >> shiftAmount;
    return {
      type: 'shift-right',
      answerType: 'binary',
      question: `2進数「${decToBin(num).padStart(pad, '0')}」を右に${shiftAmount}ビットシフトすると？`,
      formatHint: '例) 101（先頭の0は不要）',
      answer: decToBin(answer),
      explanation: `右に${shiftAmount}ビットシフトすると、値を 2^${shiftAmount} = ${2**shiftAmount} で割った商になります。\n${num} ÷ ${2**shiftAmount} = ${answer}（余り切り捨て）\n2進数: ${decToBin(answer)}`,
    };
  }
}

// ============================================================
// データ量の計算
// ============================================================

export function makeImgAmountQuestion(difficulty) {
  let px, grad;
  switch (difficulty) {
    case 1:
      px   = [10, 20, 30][Rand(0, 2)];
      grad = [2, 4, 8, 16][Rand(0, 3)];
      break;
    case 2:
      px   = [50, 60, 100][Rand(0, 2)];
      grad = Rand(3, 30);
      break;
    case 3:
      px   = [128, 256, 512][Rand(0, 2)];
      grad = Rand(32, 100);
      break;
    default:
      px = 10; grad = 4;
  }

  const gradNum = getBit(grad - 1);
  const bits    = px * px * gradNum;
  const answer  = bits / 8;
  const explanation =
    `① 1画素あたりのデータ量: ${grad}色を表すには ${gradNum} bit 必要\n` +
    `② 総画素数: ${px} × ${px} = ${px * px} px\n` +
    `③ ビット数: ${px * px} × ${gradNum} = ${bits} bit\n` +
    `④ バイト換算: ${bits} ÷ 8 = ${answer} B`;

  return {
    type: 'img-amount',
    answerType: 'number',
    question: `解像度 ${px}×${px} px、色数 ${grad} 色の画像のデータ量は何 B か？`,
    formatHint: '数値のみ入力（例: 1024）',
    answer,
    explanation,
  };
}

export function makeAudioAmountQuestion(difficulty) {
  let sec, hz, bit, channel;
  switch (difficulty) {
    case 1:
      sec     = Rand(10, 30);
      hz      = [8000, 16000, 22050][Rand(0, 2)];
      bit     = [8, 16][Rand(0, 1)];
      channel = [1, 2][Rand(0, 1)];
      break;
    case 2:
      sec     = Rand(30, 60);
      hz      = [32000, 44100, 48000][Rand(0, 2)];
      bit     = [16, 24][Rand(0, 1)];
      channel = [1, 2][Rand(0, 1)];
      break;
    case 3:
      sec     = Rand(60, 120);
      hz      = [44100, 48000, 96000][Rand(0, 2)];
      bit     = [24, 32][Rand(0, 1)];
      channel = [2, 4][Rand(0, 1)];
      break;
    default:
      sec = 10; hz = 8000; bit = 8; channel = 1;
  }

  const bits   = sec * hz * bit * channel;
  const answer = bits / 8;
  const explanation =
    `データ量 = 時間 × サンプリング周波数 × 量子化ビット数 × チャンネル数\n` +
    `= ${sec} × ${hz} × ${bit} × ${channel} = ${bits} bit\n` +
    `バイト換算: ${bits} ÷ 8 = ${answer} B`;

  return {
    type: 'audio-amount',
    answerType: 'number',
    question: `録音時間 ${sec} 秒、サンプリング周波数 ${hz.toLocaleString()} Hz、量子化ビット数 ${bit} bit、チャンネル数 ${channel} の音声データ量は何 B か？`,
    formatHint: '数値のみ入力（例: 88200）',
    answer,
    explanation,
  };
}

export function makeVideoAmountQuestion(difficulty) {
  let sec, fps, width, height, gradNum;
  switch (difficulty) {
    case 1:
      sec    = Rand(5, 15);
      fps    = [15, 24, 30][Rand(0, 2)];
      width  = [160, 320][Rand(0, 1)];
      height = [120, 240][Rand(0, 1)];
      gradNum = [8, 16][Rand(0, 1)];
      break;
    case 2:
      sec    = Rand(15, 30);
      fps    = [30, 60][Rand(0, 1)];
      width  = [640, 800][Rand(0, 1)];
      height = [480, 600][Rand(0, 1)];
      gradNum = [16, 24][Rand(0, 1)];
      break;
    case 3:
      sec    = Rand(30, 60);
      fps    = [60, 120][Rand(0, 1)];
      width  = [1280, 1920][Rand(0, 1)];
      height = [720, 1080][Rand(0, 1)];
      gradNum = [24, 32][Rand(0, 1)];
      break;
    default:
      sec = 5; fps = 15; width = 160; height = 120; gradNum = 8;
  }

  const bits   = sec * fps * width * height * gradNum;
  const answer = bits / 8;
  const explanation =
    `データ量 = 時間 × FPS × 横 × 縦 × 1画素あたりのビット数\n` +
    `= ${sec} × ${fps} × ${width} × ${height} × ${gradNum} = ${bits} bit\n` +
    `バイト換算: ${bits} ÷ 8 = ${answer} B`;

  return {
    type: 'video-amount',
    answerType: 'number',
    question: `再生時間 ${sec} 秒、フレームレート ${fps} fps、解像度 ${width}×${height} px、1画素あたり ${gradNum} bit の動画データ量は何 B か？`,
    formatHint: '数値のみ入力（例: 115200）',
    answer,
    explanation,
  };
}

// ============================================================
// 圧縮の計算
// ============================================================

export function makeCompressionRatioQuestion(difficulty) {
  let originalSize, compressedSize, questionType;

  switch (difficulty) {
    case 1:
      originalSize   = Rand(100, 500);
      compressedSize = Rand(10, originalSize - 1);
      questionType   = Rand(0, 1);
      break;
    case 2:
      originalSize   = Rand(500, 2000);
      compressedSize = Rand(50, originalSize - 1);
      questionType   = Rand(0, 2);
      break;
    case 3:
      originalSize   = Rand(2000, 10000);
      compressedSize = Rand(100, originalSize - 1);
      questionType   = Rand(0, 2);
      break;
    default:
      originalSize = 100; compressedSize = 50; questionType = 0;
  }

  const ratio = parseFloat((compressedSize / originalSize * 100).toFixed(1));

  if (questionType === 0) {
    return {
      type: 'compression-ratio',
      answerType: 'number',
      question: `元データ量 ${originalSize} MB、圧縮後 ${compressedSize} MB のとき、圧縮率は何 % か？`,
      formatHint: '小数第1位まで入力（例: 62.5）',
      answer: ratio,
      explanation:
        `圧縮率 = 圧縮後 ÷ 元データ量 × 100\n` +
        `= ${compressedSize} ÷ ${originalSize} × 100 = ${ratio} %`,
    };
  } else if (questionType === 1) {
    const givenRatio = Rand(10, 90);
    const ans = parseFloat((originalSize * givenRatio / 100).toFixed(1));
    return {
      type: 'compression-compressed',
      answerType: 'number',
      question: `圧縮率 ${givenRatio} %、元データ量 ${originalSize} MB のとき、圧縮後のデータ量は何 MB か？`,
      formatHint: '小数第1位まで入力（例: 48.0）',
      answer: ans,
      explanation:
        `圧縮後 = 元データ量 × 圧縮率 ÷ 100\n` +
        `= ${originalSize} × ${givenRatio} ÷ 100 = ${ans} MB`,
    };
  } else {
    const givenRatio = Rand(10, 90);
    const ans = parseFloat((compressedSize / (givenRatio / 100)).toFixed(1));
    return {
      type: 'compression-original',
      answerType: 'number',
      question: `圧縮率 ${givenRatio} %、圧縮後のデータ量 ${compressedSize} MB のとき、元のデータ量は何 MB か？`,
      formatHint: '小数第1位まで入力（例: 200.0）',
      answer: ans,
      explanation:
        `元データ量 = 圧縮後 ÷ (圧縮率 ÷ 100)\n` +
        `= ${compressedSize} ÷ (${givenRatio} ÷ 100) = ${ans} MB`,
    };
  }
}

export function makeRunLengthQuestion(difficulty) {
  let length;
  switch (difficulty) {
    case 1: length = Rand(5, 10);  break;
    case 2: length = Rand(10, 20); break;
    case 3: length = Rand(20, 30); break;
    default: length = 5;
  }

  const binaryString = Array.from({ length }, () => Rand(0, 1)).join('');

  const encoded = [];
  let count = 1;
  for (let i = 0; i < binaryString.length; i++) {
    if (binaryString[i] === binaryString[i + 1]) {
      count++;
    } else {
      encoded.push(`${count},${binaryString[i]}`);
      count = 1;
    }
  }
  const answer = encoded.join(' ');

  return {
    type: 'run-length',
    answerType: 'run-length',
    question: `「${binaryString}」をランレングス法で圧縮すると？`,
    formatHint: '例) 3,0 2,1 1,0（数,値 をスペース区切り）',
    answer,
    explanation:
      `連続する同じ値の数と値を「数,値」で記録します。\n` +
      `「${binaryString}」→ ${answer}`,
  };
}

export function makeHuffmanQuestion(difficulty) {
  const huffmanTables = [
    { text: 'ABBCDA',   codes: { A: '0', B: '10', C: '110', D: '111' } },
    { text: 'HELLO',    codes: { H: '0', E: '10', L: '110', O: '111' } },
    { text: 'BOOKKEEPER', codes: { B: '0', O: '10', K: '110', E: '1110', P: '1111' } },
  ];

  let tableIndex;
  switch (difficulty) {
    case 1: tableIndex = 0; break;
    case 2: tableIndex = Rand(0, 1); break;
    case 3: tableIndex = Rand(0, 2); break;
    default: tableIndex = 0;
  }

  const { text, codes } = huffmanTables[tableIndex];
  let totalBits = 0;
  let encodedString = '';
  for (const char of text) {
    totalBits    += codes[char].length;
    encodedString += codes[char];
  }

  const codeTable = Object.entries(codes).map(([c, b]) => `${c}→${b}`).join('、');

  return {
    type: 'huffman',
    answerType: 'number',
    question: `【ハフマン符号表】${codeTable}\n\n文字列「${text}」を上の符号で圧縮すると何ビットになるか？`,
    formatHint: '数値のみ入力（例: 14）',
    answer: totalBits,
    explanation:
      `各文字のビット数を合計します。\n` +
      `${text.split('').map(c => `${c}(${codes[c].length}bit)`).join(' + ')}\n` +
      `= ${totalBits} bit\n符号列: ${encodedString}`,
  };
}
