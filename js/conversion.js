function makeDecToBinQuestion() {
  const come = document.getElementById("decbin-dec");
  const to = document.getElementById("decbin-bin");
  const rn = Rand(0, 255);
  come.innerHTML = rn;
  to.innerHTML = decToBin(rn).padStart(8, "0");
}
function makeBinToDecQuestion() {
  const come = document.getElementById("bindec-bin");
  const to = document.getElementById("bindec-dec");
  const rn = Rand(0, 255);
  come.innerHTML = decToBin(rn).padStart(8, "0");
  to.innerHTML = rn; 
}
function makeBinToHexQuestion() {
  const come = document.getElementById("binhex-bin");
  const to = document.getElementById("binhex-hex");
  const rn = Rand(0, 255);
  come.innerHTML = decToBin(rn).padStart(8, "0");
  to.innerHTML =  decToHex(rn).toUpperCase().padStart(2, "0");
}
function makeHexToBinQuestion() {
  const come = document.getElementById("hexbin-hex");
  const to = document.getElementById("hexbin-bin");
  const rn = Rand(0, 255);
  come.innerHTML = decToHex(rn).toUpperCase().padStart(2, "0");
  to.innerHTML = decToBin(rn).padStart(8, "0"); 
}