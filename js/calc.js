function makeAddQuestion() {
  const come = document.getElementById("add-q");
  const to = document.getElementById("add-a");

  const num1 = Rand(0, 15);
  const num2 = Rand(0, 15);
  const addNum = num1 + num2;

  come.innerText = `${decToBin(num1).padStart(4, "0")} + ${decToBin(num2).padStart(4, "0")} =`;
  to.innerText   = `${decToBin(addNum).padStart(4, "0")}`;
}

function makeDivQuestion() {
  const come = document.getElementById("div-q");
  const to = document.getElementById("div-a");

  const temp1 = Rand(0, 15);
  const temp2 = Rand(0, 15);

  const num1 = temp1 > temp2 ? temp1 : temp2;
  const num2 = temp1 > temp2 ? temp2 : temp1;

  const divNum = num1 - num2;

  come.innerText = `${decToBin(num1).padStart(4, "0")} - ${decToBin(num2).padStart(4, "0")} =`;
  to.innerText   = `${decToBin(divNum).padStart(4, "0")}`;
}