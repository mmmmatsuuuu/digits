function Rand(min, max) {
  return Math.floor( Math.random() * (max + 1 - min) ) + min ;
}

function getBit(num) {
  let itr = 0;
  while (num > 0) {
    num = Math.floor(num / 2);
    itr++;
  }
  return itr;
}

function getAmount(bit) {
  return 2 ** bit;
}

function makeInfBitQuestion() {
  const come = document.getElementById("infbit-inf");
  const to = document.getElementById("infbit-bit");
  const rn = Rand(0, 256);
  come.innerText = rn;
  to.innerText = getBit(rn);
}

function makeBitInfQuestion() {
  const come = document.getElementById("bitinf-bit");
  const to = document.getElementById("bitinf-inf");
  const rn = Rand(1, 16);
  come.innerText = rn;
  to.innerText = getAmount(rn);
}