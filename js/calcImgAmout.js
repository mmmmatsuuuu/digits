const pixelList = [10, 16, 20, 32];
const gradList = [8, 16, 32, 64];

function makeImgAmountQuestion() {
  const come = document.getElementById("ia-q");
  const to   = document.getElementById("ia-a");

  const type = Rand(0, 1);
  const px = pixelList[Rand(0, pixelList.length - 1)];
  const grad = gradList[Rand(0, gradList.length - 1)];
  let gradNum;
  let amount;
  if (type == 0) {
    // 色数で作成
    come.innerHTML = `<p>ある画像が次のような場合、画像のデータ量は何[B]か？</p>
<ul>
    <li>解像度: ${px} x ${px}[px]</li>
    <li>色数　: ${ grad }色</li>
</ul>`;
    gradNum = getBit(grad-1);
    amount = px * px * gradNum;
    to.innerHTML = `<p>１画素(ピクセル)あたりのデータ量は、${grad}色表せればいいので${ gradNum }[bit]必要。</p>
  <p>画素は、全部で${px} x ${px} = ${ px * px}[px]あるのでデータ量は、</p>
  <p>${px} x ${px} x ${gradNum} = ${amount}[bit]つまり${amount / 8}[B]である。</p>`;
  } else {
    // 階調で作成
    come.innerHTML = `<p>ある画像が次のような場合、画像のデータ量は何[B]か？</p>
    <ul>
    <li>解像度: ${px} x ${px}[px]</li>
    <li>階調　: 各色${ grad }階調</li>
    </ul>`;
    gradNum = getBit(grad-1) * 3;
    amount = px * px * gradNum;
    to.innerHTML = `<p>１画素(ピクセル)あたりのデータ量は、一色は${grad}階調で${getBit(grad-1)}[bit]、それがRGBの３色あるので${ gradNum }[bit]必要。</p>
  <p>画素は、全部で${px} x ${px} = ${ px * px}[px]あるのでデータ量は、</p>
  <p>${px} x ${px} x ${gradNum} = ${amount}[bit]つまり${amount / 8}[B]である。</p>`;
  }
}