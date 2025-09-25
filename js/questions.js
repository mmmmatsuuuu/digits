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

export function makeInfBitQuestion() {
  const patterns = Rand(1, 256);
  return {
    question: `${patterns}通りで表せる情報のデータ量は？ (bit)`,
    answer: getBit(patterns -1),
  };
}

export function makeBitInfQuestion() {
  const bits = Rand(1, 16);
  return {
    question: `${bits}bitで表せる情報は？ (通り)`,
    answer: 2 ** bits,
  };
}

export function makeDecToBinQuestion() {
  const dec = Rand(0, 255);
  return {
    question: `10進数の「${dec}」を2進数に変換すると？`,
    answer: decToBin(dec).padStart(8, "0"),
  };
}

export function makeBinToDecQuestion() {
  const bin = decToBin(Rand(0, 255)).padStart(8, "0");
  return {
    question: `2進数の「${bin}」を10進数に変換すると？`,
    answer: binToDec(bin),
  };
}

export function makeBinToHexQuestion() {
  const dec = Rand(0, 255);
  const bin = decToBin(dec).padStart(8, "0");
  return {
    question: `2進数の「${bin}」を16進数に変換すると？`,
    answer: decToHex(dec).toUpperCase().padStart(2, "0"),
  };
}

export function makeHexToBinQuestion() {
  const dec = Rand(0, 255);
  const hex = decToHex(dec).toUpperCase().padStart(2, "0");
  return {
    question: `16進数の「${hex}」を2進数に変換すると？`,
    answer: decToBin(dec).padStart(8, "0"),
  };
}

export function makeAddQuestion() {
  const num1 = Rand(0, 15);
  const num2 = Rand(0, 15);
  const answer = num1 + num2;
  return {
    question: `2進数の計算: ${decToBin(num1).padStart(4, "0")} + ${decToBin(num2).padStart(4, "0")} = ?`,
    answer: decToBin(answer).padStart(4, "0"),
  };
}

export function makeSubQuestion() {
  const temp1 = Rand(0, 15);
  const temp2 = Rand(0, 15);
  const num1 = Math.max(temp1, temp2);
  const num2 = Math.min(temp1, temp2);
  const answer = num1 - num2;
  return {
    question: `2進数の計算: ${decToBin(num1).padStart(4, "0")} - ${decToBin(num2).padStart(4, "0")} = ?`,
    answer: decToBin(answer).padStart(4, "0"),
  };
}

export function makeImgAmountQuestion() {
    const px = [10, 16, 20, 32][Rand(0, 3)];
    const grad = [8, 16, 32, 64][Rand(0, 3)];
    const gradNum = getBit(grad - 1);
    const amount = px * px * gradNum;
    const answer = amount / 8;
    return {
        question: `解像度: ${px} x ${px}[px]、色数: ${grad}色の場合、画像のデータ量は何[B]か？`,
        answer: answer,
        explanation: `１画素(ピクセル)あたりのデータ量は、${grad}色表せればいいので${gradNum}[bit]必要です。画素は、全部で${px} x ${px} = ${px * px}[px]あるのでデータ量は、${px} x ${px} x ${gradNum} = ${amount}[bit]、つまり${answer}[B]です。`
    };
}
