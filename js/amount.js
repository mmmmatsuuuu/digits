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