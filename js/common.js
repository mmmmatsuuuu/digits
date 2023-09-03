function Rand(min, max) {
  return Math.floor( Math.random() * (max + 1 - min) ) + min ;
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

function hecToDec(hex) {
  return parseInt(hex, 16);
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

const answers = document.querySelectorAll('[name="ans"]');

for (let i = 0; i < answers.length; i++) {
  answers[i].addEventListener("mouseover", (event) => {
    answers[i].classList.remove("bg-dark");
  });
  answers[i].addEventListener("mouseleave", (event) => {
    answers[i].classList.add("bg-dark");
  });
}