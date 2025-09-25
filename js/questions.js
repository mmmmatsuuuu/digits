// Helper Functions
function Rand(min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
}

function decToBin(dec) {
  return dec.toString(2);
}

function decToHex(dec) {
  return dec.toString(16);
}

function binToDec(bin) {
  return parseInt(bin, 2);
}

function hexToDec(hex) {
  return parseInt(hex, 16);
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

// Question Generation

export function makeInfBitQuestion(difficulty) {
  let min, max;
  switch (difficulty) {
    case 1: min = 2; max = 2**8; break; // 1-8 bits
    case 2: min = 2**8 + 1; max = 2**16; break; // 9-16 bits
    case 3: min = 2**16 + 1; max = 2**20; break; // 17-20 bits
    default: min = 2; max = 256;
  }
  const patterns = Rand(min, max);
  return {
    question: `${patterns}通りで表せる情報のデータ量は？ (bit)`,
    answer: getBit(patterns - 1),
  };
}

export function makeBitInfQuestion(difficulty) {
  let min, max;
  switch (difficulty) {
    case 1: min = 1; max = 8; break;
    case 2: min = 9; max = 16; break;
    case 3: min = 17; max = 20; break;
    default: min = 1; max = 8;
  }
  const bits = Rand(min, max);
  return {
    question: `${bits}bitで表せる情報は？ (通り)`,
    answer: 2 ** bits,
  };
}

function getConversionRange(difficulty) {
    switch (difficulty) {
        case 1: return [0, 15]; // 4 bits
        case 2: return [16, 255]; // 5-8 bits
        case 3: return [256, 4095]; // 9-12 bits
        default: return [0, 15];
    }
}

export function makeDecToBinQuestion(difficulty) {
  const [min, max] = getConversionRange(difficulty);
  const dec = Rand(min, max);
  const bin_len = dec.toString(2).length;
  return {
    question: `10進数の「${dec}」を2進数に変換すると？`,
    answer: decToBin(dec),
  };
}

export function makeBinToDecQuestion(difficulty) {
  const [min, max] = getConversionRange(difficulty);
  const dec = Rand(min, max);
  const bin = decToBin(dec);
  return {
    question: `2進数の「${bin}」を10進数に変換すると？`,
    answer: dec,
  };
}

export function makeBinToHexQuestion(difficulty) {
  const [min, max] = getConversionRange(difficulty);
  const dec = Rand(min, max);
  const bin = decToBin(dec);
  return {
    question: `2進数の「${bin}」を16進数に変換すると？`,
    answer: decToHex(dec).toUpperCase(),
  };
}

export function makeHexToBinQuestion(difficulty) {
  const [min, max] = getConversionRange(difficulty);
  const dec = Rand(min, max);
  const hex = decToHex(dec).toUpperCase();
  return {
    question: `16進数の「${hex}」を2進数に変換すると？`,
    answer: decToBin(dec),
  };
}

function getCalcRange(difficulty) {
    switch (difficulty) {
        case 1: return [0, 15]; // 4 bits
        case 2: return [0, 255]; // 8 bits
        case 3: return [0, 1023]; // 10 bits
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
    question: `2進数の計算: ${decToBin(num1).padStart(pad, '0')} + ${decToBin(num2).padStart(pad, '0')} = ?`,
    answer: decToBin(answer),
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
    question: `2進数の計算: ${decToBin(num1).padStart(pad, '0')} - ${decToBin(num2).padStart(pad, '0')} = ?`,
    answer: decToBin(answer),
  };
}

export function makeShiftQuestion(difficulty) {
    const [min, max] = getCalcRange(difficulty);
    const num = Rand(min, max);
    const pad = decToBin(max).length;
    const shiftAmount = Rand(1, Math.floor(pad / 2));
    const direction = Rand(0, 1); // 0 for left, 1 for right

    if (direction === 0) { // Left shift
        const answer = num << shiftAmount;
        return {
            question: `2進数の「${decToBin(num).padStart(pad, '0')}」を左に${shiftAmount}ビットシフトすると？`,
            answer: decToBin(answer),
            explanation: `左に${shiftAmount}ビットシフトすると、数値が2^${shiftAmount}倍になります。`
        };
    } else { // Right shift
        const answer = num >> shiftAmount;
        return {
            question: `2進数の「${decToBin(num).padStart(pad, '0')}」を右に${shiftAmount}ビットシフトすると？`,
            answer: decToBin(answer),
            explanation: `右に${shiftAmount}ビットシフトすると、数値が2^${shiftAmount}で割った商になります。`
        };
    }
}

export function makeImgAmountQuestion(difficulty) {
    let px, grad, type, gradNum, amount, answer, explanation;
    switch (difficulty) {
        case 1:
            px = [10, 20, 30][Rand(0, 2)];
            grad = [2, 4, 8, 16][Rand(0, 3)]; // Powers of 2
            break;
        case 2:
            px = [50, 60, 100][Rand(0, 2)];
            grad = Rand(3, 30);
            break;
        case 3:
            px = [128, 256, 512][Rand(0, 2)];
            grad = Rand(32, 100);
            break;
    }

    gradNum = getBit(grad - 1);
    amount = px * px * gradNum;
    answer = amount / 8;
    explanation = `１画素(ピクセル)あたりのデータ量は、${grad}色表せればいいので${gradNum}[bit]必要です。画素は、全部で${px} x ${px} = ${px * px}[px]あるのでデータ量は、${px} x ${px} x ${gradNum} = ${amount}[bit]、つまり${answer}[B]です。`;

    return {
        question: `解像度: ${px} x ${px}[px]、色数: ${grad}色の場合、画像のデータ量は何[B]か？`,
        answer: answer,
        explanation: explanation
    };
}

export function makeAudioAmountQuestion(difficulty) {
    let sec, hz, bit, channel, amount, answer, explanation;
    switch (difficulty) {
        case 1:
            sec = Rand(10, 30);
            hz = [8000, 16000, 22050][Rand(0, 2)];
            bit = [8, 16][Rand(0, 1)];
            channel = [1, 2][Rand(0, 1)];
            break;
        case 2:
            sec = Rand(30, 60);
            hz = [32000, 44100, 48000][Rand(0, 2)];
            bit = [16, 24][Rand(0, 1)];
            channel = [1, 2][Rand(0, 1)];
            break;
        case 3:
            sec = Rand(60, 120);
            hz = [44100, 48000, 96000][Rand(0, 2)];
            bit = [24, 32][Rand(0, 1)];
            channel = [2, 4][Rand(0, 1)];
            break;
    }

    amount = sec * hz * bit * channel;
    answer = amount / 8; // Convert bits to bytes
    explanation = `データ量 = 時間[秒] x サンプリング周波数[Hz] x 量子化ビット数[bit] x チャンネル数\n${sec}[秒] x ${hz}[Hz] x ${bit}[bit] x ${channel}[チャンネル] = ${amount}[bit]\nバイトに変換すると ${amount} / 8 = ${answer}[B]`;

    return {
        question: `時間: ${sec}[秒]、サンプリング周波数: ${hz}[Hz]、量子化ビット数: ${bit}[bit]、チャンネル数: ${channel}の場合、音声のデータ量は何[B]か？`,
        answer: answer,
        explanation: explanation
    };
}

export function makeVideoAmountQuestion(difficulty) {
    let sec, fps, width, height, gradNum, amount, answer, explanation;
    switch (difficulty) {
        case 1:
            sec = Rand(5, 15);
            fps = [15, 24, 30][Rand(0, 2)];
            width = [160, 320][Rand(0, 1)];
            height = [120, 240][Rand(0, 1)];
            gradNum = [8, 16][Rand(0, 1)]; // bits per pixel
            break;
        case 2:
            sec = Rand(15, 30);
            fps = [30, 60][Rand(0, 1)];
            width = [640, 800][Rand(0, 1)];
            height = [480, 600][Rand(0, 1)];
            gradNum = [16, 24][Rand(0, 1)];
            break;
        case 3:
            sec = Rand(30, 60);
            fps = [60, 120][Rand(0, 1)];
            width = [1280, 1920][Rand(0, 1)];
            height = [720, 1080][Rand(0, 1)];
            gradNum = [24, 32][Rand(0, 1)];
            break;
    }

    amount = sec * fps * width * height * gradNum;
    answer = amount / 8; // Convert bits to bytes
    explanation = `データ量 = 時間[秒] x フレームレート[fps] x 解像度[横px] x 解像度[縦px] x 1画素あたりのデータ量[bit]\n${sec}[秒] x ${fps}[fps] x ${width}[px] x ${height}[px] x ${gradNum}[bit] = ${amount}[bit]\nバイトに変換すると ${amount} / 8 = ${answer}[B]`;

    return {
        question: `時間: ${sec}[秒]、フレームレート: ${fps}[fps]、解像度: ${width}x${height}[px]、1画素あたりのデータ量: ${gradNum}[bit]の場合、動画のデータ量は何[B]か？`,
        answer: answer,
        explanation: explanation
    };
}

export function makeCompressionRatioQuestion(difficulty) {
    let originalSize, compressedSize, questionType, answer, explanation;

    switch (difficulty) {
        case 1:
            originalSize = Rand(100, 500);
            compressedSize = Rand(10, originalSize - 1);
            questionType = Rand(0, 1); // 0: calculate ratio, 1: calculate compressed size
            break;
        case 2:
            originalSize = Rand(500, 2000);
            compressedSize = Rand(50, originalSize - 1);
            questionType = Rand(0, 2); // 0: ratio, 1: compressed, 2: original
            break;
        case 3:
            originalSize = Rand(2000, 10000);
            compressedSize = Rand(100, originalSize - 1);
            questionType = Rand(0, 2);
            break;
    }

    const ratio = (compressedSize / originalSize * 100).toFixed(1);

    if (questionType === 0) {
        // Calculate compression ratio
        answer = ratio;
        explanation = `圧縮率 = (圧縮後のデータ量 / 元のデータ量) * 100\n(${compressedSize} / ${originalSize}) * 100 = ${ratio}%`;
        return {
            question: `元のデータ量が ${originalSize}[MB]、圧縮後のデータ量が ${compressedSize}[MB]の場合、圧縮率は何%か？`,
            answer: answer,
            explanation: explanation
        };
    } else if (questionType === 1) {
        // Calculate compressed size
        const givenRatio = Rand(10, 90);
        answer = (originalSize * givenRatio / 100).toFixed(1);
        explanation = `圧縮後のデータ量 = 元のデータ量 * (圧縮率 / 100)\n${originalSize} * (${givenRatio} / 100) = ${answer}[MB]`;
        return {
            question: `圧縮率が ${givenRatio}% で、元のデータ量が ${originalSize}[MB]の場合、圧縮後のデータ量は何[MB]か？`,
            answer: answer,
            explanation: explanation
        };
    } else { // questionType === 2
        // Calculate original size
        const givenRatio = Rand(10, 90);
        answer = (compressedSize / (givenRatio / 100)).toFixed(1);
        explanation = `元のデータ量 = 圧縮後のデータ量 / (圧縮率 / 100)\n${compressedSize} / (${givenRatio} / 100) = ${answer}[MB]`;
        return {
            question: `圧縮率が ${givenRatio}% で、圧縮後のデータ量が ${compressedSize}[MB]の場合、元のデータ量は何[MB]か？`,
            answer: answer,
            explanation: explanation
        };
    }
}

export function makeRunLengthQuestion(difficulty) {
    let binaryString, explanation;
    let length;
    switch (difficulty) {
        case 1: length = Rand(5, 10); break;
        case 2: length = Rand(10, 20); break;
        case 3: length = Rand(20, 30); break;
        default: length = 5;
    }

    binaryString = Array.from({length: length}, () => Rand(0, 1)).join('');

    let encoded = [];
    let count = 1;
    for (let i = 0; i < binaryString.length; i++) {
        if (binaryString[i] === binaryString[i+1]) {
            count++;
        } else {
            encoded.push(`${count},${binaryString[i]}`);
            count = 1;
        }
    }
    const answer = encoded.join(' ');
    explanation = `ランレングス法は、連続する同じ文字の数とその文字を記録します。\n例: 000110 -> 3,0 2,1 1,0`;

    return {
        question: `「${binaryString}」をランレングス法で圧縮すると？ (例: 3,0 2,1)`,
        answer: answer,
        explanation: explanation
    };
}

export function makeHuffmanQuestion(difficulty) {
    let text, codes, answer, explanation;

    const huffmanTables = [
        { text: "ABBCDA", codes: { A: "0", B: "10", C: "110", D: "111" } },
        { text: "HELLO", codes: { H: "0", E: "10", L: "110", O: "111" } },
        { text: "BOOKKEEPER", codes: { B: "0", O: "10", K: "110", E: "1110", P: "1111" } }
    ];

    let tableIndex;
    switch (difficulty) {
        case 1: tableIndex = 0; break;
        case 2: tableIndex = Rand(0, 1); break;
        case 3: tableIndex = Rand(0, 2); break;
        default: tableIndex = 0;
    }

    const selectedTable = huffmanTables[tableIndex];
    text = selectedTable.text;
    codes = selectedTable.codes;

    let totalBits = 0;
    let encodedString = "";
    for (const char of text) {
        if (codes[char]) {
            totalBits += codes[char].length;
            encodedString += codes[char];
        } else {
            // Handle characters not in the table, though for these examples they should all be there
            totalBits = -1; // Indicate error or unencodable
            break;
        }
    }

    answer = totalBits;
    explanation = `各文字のハフマン符号の長さを合計します。\n${text} -> ${encodedString} (${totalBits}ビット)`;

    return {
        question: `文字列「${text}」を以下のハフマン符号で圧縮すると何ビットになるか？\n${Object.entries(codes).map(([char, code]) => `${char}:${code}`).join(', ')}`,
        answer: answer,
        explanation: explanation
    };
}