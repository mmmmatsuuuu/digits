(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function r(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(s){if(s.ep)return;s.ep=!0;const n=r(s);fetch(s.href,n)}})();const Le=[];function D(e,t){Le.push({path:e,handler:t})}function Qe(e,t){const r=e.split("/").filter(Boolean),a=t.split("/").filter(Boolean);if(r.length!==a.length)return null;const s={};for(let n=0;n<r.length;n++)if(r[n].startsWith(":"))s[r[n].slice(1)]=a[n];else if(r[n]!==a[n])return null;return s}function ye(){const t=(window.location.hash.slice(1)||"/").split("?")[0];for(const r of Le){const a=Qe(r.path,t);if(a!==null){r.handler(a);return}}T("/")}function T(e){window.location.hash=e}function Ze(){window.addEventListener("hashchange",ye),ye()}function c(e,t){return Math.floor(Math.random()*(t+1-e))+e}function k(e){return e.toString(2)}function je(e){return e.toString(16)}function Te(e){if(e===0)return 1;let t=0;for(;e>0;)e=Math.floor(e/2),t++;return t}function ce(e){let t,r;switch(e){case 1:t=2,r=2**8;break;case 2:t=2**8+1,r=2**16;break;case 3:t=2**16+1,r=2**20;break;default:t=2,r=256}const a=c(t,r);return{type:"inf-bit",answerType:"number",question:`${a.toLocaleString()}通りで表せる情報のデータ量は？`,unit:"bit",formatHint:"数値のみ入力（例: 8）",answer:Te(a-1)}}function xe(e){let t,r;switch(e){case 1:t=1,r=8;break;case 2:t=9,r=16;break;case 3:t=17,r=20;break;default:t=1,r=8}const a=c(t,r);return{type:"bit-inf",answerType:"number",question:`${a}bitで表せる情報は？`,unit:"通り",formatHint:"数値のみ入力（例: 256）",answer:2**a}}function ee(e){switch(e){case 1:return[1,15];case 2:return[16,255];case 3:return[256,4095];default:return[1,15]}}function Oe(e){const[t,r]=ee(e),a=c(t,r);return{type:"dec-to-bin",answerType:"binary",question:`10進数の「${a}」を2進数に変換すると？`,formatHint:"例) 1101",answer:k(a)}}function Pe(e){const[t,r]=ee(e),a=c(t,r);return{type:"bin-to-dec",answerType:"number",question:`2進数の「${k(a)}」を10進数に変換すると？`,formatHint:"例) 42",answer:a}}function Ve(e){const[t,r]=ee(e),a=c(t,r);return{type:"bin-to-hex",answerType:"hex",question:`2進数の「${k(a)}」を16進数に変換すると？`,formatHint:"例) 1A（大文字・小文字どちらでも可）",answer:je(a).toUpperCase()}}function _e(e){const[t,r]=ee(e),a=c(t,r);return{type:"hex-to-bin",answerType:"binary",question:`16進数の「${je(a).toUpperCase()}」を2進数に変換すると？`,formatHint:"例) 10110011",answer:k(a)}}function ge(e){switch(e){case 1:return[0,15];case 2:return[0,255];case 3:return[0,1023];default:return[0,15]}}function We(e){const[t,r]=ge(e),a=c(t,r),s=c(t,r),n=a+s,o=k(r).length;return{type:"add",answerType:"binary",question:`2進数の計算をしてください
${k(a).padStart(o,"0")}  +  ${k(s).padStart(o,"0")}`,formatHint:"例) 10011（先頭の0は不要）",answer:k(n),explanation:`${k(a).padStart(o,"0")} + ${k(s).padStart(o,"0")} = ${k(n)}
（10進数: ${a} + ${s} = ${n}）`}}function Ue(e){const[t,r]=ge(e),a=c(t,r),s=c(t,r),n=Math.max(a,s),o=Math.min(a,s),d=n-o,x=k(r).length;return{type:"sub",answerType:"binary",question:`2進数の計算をしてください
${k(n).padStart(x,"0")}  −  ${k(o).padStart(x,"0")}`,formatHint:"例) 1010（先頭の0は不要）",answer:k(d),explanation:`${k(n).padStart(x,"0")} − ${k(o).padStart(x,"0")} = ${k(d)}
（10進数: ${n} − ${o} = ${d}）`}}function Ge(e){const[t,r]=ge(e),a=c(t,r),s=k(r).length,n=c(1,Math.floor(s/2));if(c(0,1)===0){const d=a<<n;return{type:"shift-left",answerType:"binary",question:`2進数「${k(a).padStart(s,"0")}」を左に${n}ビットシフトすると？`,formatHint:"例) 10110（先頭の0は不要）",answer:k(d),explanation:`左に${n}ビットシフトすると、値が 2^${n} = ${2**n} 倍になります。
${a} × ${2**n} = ${d}
2進数: ${k(d)}`}}else{const d=a>>n;return{type:"shift-right",answerType:"binary",question:`2進数「${k(a).padStart(s,"0")}」を右に${n}ビットシフトすると？`,formatHint:"例) 101（先頭の0は不要）",answer:k(d),explanation:`右に${n}ビットシフトすると、値を 2^${n} = ${2**n} で割った商になります。
${a} ÷ ${2**n} = ${d}（余り切り捨て）
2進数: ${k(d)}`}}}function Xe(e){let t,r;switch(e){case 1:t=[10,20,30][c(0,2)],r=[2,4,8,16][c(0,3)];break;case 2:t=[50,60,100][c(0,2)],r=c(3,30);break;case 3:t=[128,256,512][c(0,2)],r=c(32,100);break;default:t=10,r=4}const a=Te(r-1),s=t*t*a,n=s/8,o=`① 1画素あたりのデータ量: ${r}色を表すには ${a} bit 必要
② 総画素数: ${t} × ${t} = ${t*t} px
③ ビット数: ${t*t} × ${a} = ${s} bit
④ バイト換算: ${s} ÷ 8 = ${n} B`;return{type:"img-amount",answerType:"number",question:`解像度 ${t}×${t} px、色数 ${r} 色の画像のデータ量は何 B か？`,formatHint:"数値のみ入力（例: 1024）",answer:n,explanation:o}}function Ye(e){let t,r,a,s;switch(e){case 1:t=c(10,30),r=[8e3,16e3,22050][c(0,2)],a=[8,16][c(0,1)],s=[1,2][c(0,1)];break;case 2:t=c(30,60),r=[32e3,44100,48e3][c(0,2)],a=[16,24][c(0,1)],s=[1,2][c(0,1)];break;case 3:t=c(60,120),r=[44100,48e3,96e3][c(0,2)],a=[24,32][c(0,1)],s=[2,4][c(0,1)];break;default:t=10,r=8e3,a=8,s=1}const n=t*r*a*s,o=n/8,d=`データ量 = 時間 × サンプリング周波数 × 量子化ビット数 × チャンネル数
= ${t} × ${r} × ${a} × ${s} = ${n} bit
バイト換算: ${n} ÷ 8 = ${o} B`;return{type:"audio-amount",answerType:"number",question:`録音時間 ${t} 秒、サンプリング周波数 ${r.toLocaleString()} Hz、量子化ビット数 ${a} bit、チャンネル数 ${s} の音声データ量は何 B か？`,formatHint:"数値のみ入力（例: 88200）",answer:o,explanation:d}}function Ke(e){let t,r,a,s,n;switch(e){case 1:t=c(5,15),r=[15,24,30][c(0,2)],a=[160,320][c(0,1)],s=[120,240][c(0,1)],n=[8,16][c(0,1)];break;case 2:t=c(15,30),r=[30,60][c(0,1)],a=[640,800][c(0,1)],s=[480,600][c(0,1)],n=[16,24][c(0,1)];break;case 3:t=c(30,60),r=[60,120][c(0,1)],a=[1280,1920][c(0,1)],s=[720,1080][c(0,1)],n=[24,32][c(0,1)];break;default:t=5,r=15,a=160,s=120,n=8}const o=t*r*a*s*n,d=o/8,x=`データ量 = 時間 × FPS × 横 × 縦 × 1画素あたりのビット数
= ${t} × ${r} × ${a} × ${s} × ${n} = ${o} bit
バイト換算: ${o} ÷ 8 = ${d} B`;return{type:"video-amount",answerType:"number",question:`再生時間 ${t} 秒、フレームレート ${r} fps、解像度 ${a}×${s} px、1画素あたり ${n} bit の動画データ量は何 B か？`,formatHint:"数値のみ入力（例: 115200）",answer:d,explanation:x}}function Je(e){let t,r,a;switch(e){case 1:t=c(100,500),r=c(10,t-1),a=c(0,1);break;case 2:t=c(500,2e3),r=c(50,t-1),a=c(0,2);break;case 3:t=c(2e3,1e4),r=c(100,t-1),a=c(0,2);break;default:t=100,r=50,a=0}const s=parseFloat((r/t*100).toFixed(1));if(a===0)return{type:"compression-ratio",answerType:"number",question:`元データ量 ${t} MB、圧縮後 ${r} MB のとき、圧縮率は何 % か？`,formatHint:"小数第1位まで入力（例: 62.5）",answer:s,explanation:`圧縮率 = 圧縮後 ÷ 元データ量 × 100
= ${r} ÷ ${t} × 100 = ${s} %`};if(a===1){const n=c(10,90),o=parseFloat((t*n/100).toFixed(1));return{type:"compression-compressed",answerType:"number",question:`圧縮率 ${n} %、元データ量 ${t} MB のとき、圧縮後のデータ量は何 MB か？`,formatHint:"小数第1位まで入力（例: 48.0）",answer:o,explanation:`圧縮後 = 元データ量 × 圧縮率 ÷ 100
= ${t} × ${n} ÷ 100 = ${o} MB`}}else{const n=c(10,90),o=parseFloat((r/(n/100)).toFixed(1));return{type:"compression-original",answerType:"number",question:`圧縮率 ${n} %、圧縮後のデータ量 ${r} MB のとき、元のデータ量は何 MB か？`,formatHint:"小数第1位まで入力（例: 200.0）",answer:o,explanation:`元データ量 = 圧縮後 ÷ (圧縮率 ÷ 100)
= ${r} ÷ (${n} ÷ 100) = ${o} MB`}}}function et(e){let t;switch(e){case 1:t=c(5,10);break;case 2:t=c(10,20);break;case 3:t=c(20,30);break;default:t=5}const r=Array.from({length:t},()=>c(0,1)).join(""),a=[];let s=1;for(let o=0;o<r.length;o++)r[o]===r[o+1]?s++:(a.push(`${s},${r[o]}`),s=1);const n=a.join(" ");return{type:"run-length",answerType:"run-length",question:`「${r}」をランレングス法で圧縮すると？`,formatHint:"例) 3,0 2,1 1,0（数,値 をスペース区切り）",answer:n,explanation:`連続する同じ値の数と値を「数,値」で記録します。
「${r}」→ ${n}`}}function tt(e){const t=[{text:"ABBCDA",codes:{A:"0",B:"10",C:"110",D:"111"}},{text:"HELLO",codes:{H:"0",E:"10",L:"110",O:"111"}},{text:"BOOKKEEPER",codes:{B:"0",O:"10",K:"110",E:"1110",P:"1111"}}];let r;switch(e){case 1:r=0;break;case 2:r=c(0,1);break;case 3:r=c(0,2);break;default:r=0}const{text:a,codes:s}=t[r];let n=0,o="";for(const x of a)n+=s[x].length,o+=s[x];return{type:"huffman",answerType:"number",question:`【ハフマン符号表】${Object.entries(s).map(([x,p])=>`${x}→${p}`).join("、")}

文字列「${a}」を上の符号で圧縮すると何ビットになるか？`,formatHint:"数値のみ入力（例: 14）",answer:n,explanation:`各文字のビット数を合計します。
${a.split("").map(x=>`${x}(${s[x].length}bit)`).join(" + ")}
= ${n} bit
符号列: ${o}`}}const z={amount:`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7">
    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
  </svg>`,conversion:`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7">
    <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
  </svg>`,calc:`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm2.247-4.509h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.248-6.751h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.76 4.5 4.98V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.98c0-1.22-.807-2.28-1.907-2.408A48.716 48.716 0 0 0 12 2.25Z" />
  </svg>`,data_amount:`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7">
    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
  </svg>`,compression:`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7">
    <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
  </svg>`},K=[{id:"amount",name:"情報量計算",description:"ビット数と情報のパターン数の相互変換",icon:z.amount,color:"indigo",generators:[ce,xe],hints:{"inf-bit":`① パターン数から 1 を引く
② その値を2進数で表したとき何桁になるかを数える
③ 桁数がビット数になる`,"bit-inf":`① n ビットのとき 2^n 通り表現できる
② 2 を n 回かけ算する
③ 例: 3 bit → 2³ = 8 通り`}},{id:"conversion",name:"進数変換",description:"2進数・10進数・16進数の相互変換",icon:z.conversion,color:"violet",generators:[Oe,Pe,Ve,_e],hints:{"dec-to-bin":`① 10進数を2で割り続ける
② 余りを下から順に並べると2進数になる
③ 例: 13 → 13÷2=6余1, 6÷2=3余0, 3÷2=1余1, 1÷2=0余1 → 1101`,"bin-to-dec":`① 右端から 0, 1, 2, 3… と桁の位置を数える
② 1 が立っている桁の 2^n を合計する
③ 例: 1011 → 2⁰+2¹+2³ = 1+2+8 = 11`,"bin-to-hex":`① 2進数を右から4桁ずつ区切る
② 各4桁を16進数1文字に変換する
③ 0000=0, 1010=A, 1111=F など`,"hex-to-bin":`① 16進数の各1文字を4桁の2進数に変換する
② そのまま並べると2進数になる
③ 例: B = 1011, A = 1010`}},{id:"calc",name:"2進数の計算",description:"2進数の四則演算とシフト演算",icon:z.calc,color:"blue",generators:[We,Ue,Ge],hints:{add:`① 右の桁から順に足し算する
② 1+1=10（繰り上がり）を忘れずに
③ 例: 011+101 → 桁ごとに 1,1,0 → 1000`,sub:`① 右の桁から順に引き算する
② 0から1を引くときは上の桁から借りてくる（借位）
③ 借位すると現在の桁は 10（=2）になる`,"shift-left":`① 全ビットを左にずらす
② 右端には 0 が入る
③ 左シフト n 回 = 2^n 倍になる`,"shift-right":`① 全ビットを右にずらす
② 左端には 0 が入る
③ 右シフト n 回 = 2^n で割った商になる`}},{id:"data_amount",name:"データ量の計算",description:"画像・音声・動画データ量の計算",icon:z.data_amount,color:"cyan",generators:[Xe,Ye,Ke],hints:{"img-amount":`① 何色あるかから1画素あたりのビット数を求める（2^n ≥ 色数となる最小の n）
② 総画素数 = 横 × 縦
③ データ量(bit) = 総画素数 × 1画素ビット数
④ ÷8 でバイト換算`,"audio-amount":`① データ量(bit) = 時間(秒) × サンプリング周波数(Hz) × 量子化ビット数(bit) × チャンネル数
② ÷8 でバイト換算`,"video-amount":`① データ量(bit) = 時間(秒) × FPS × 横px × 縦px × 1画素ビット数
② ÷8 でバイト換算`}},{id:"compression",name:"圧縮の計算",description:"圧縮率・ランレングス・ハフマン符号",icon:z.compression,color:"emerald",generators:[Je,et,tt],hints:{"compression-ratio":"圧縮率(%) = 圧縮後のデータ量 ÷ 元のデータ量 × 100","compression-compressed":"圧縮後 = 元のデータ量 × 圧縮率 ÷ 100","compression-original":"元のデータ量 = 圧縮後のデータ量 ÷ (圧縮率 ÷ 100)","run-length":`① 先頭から連続する同じ値をひとまとめにする
② 「個数,値」の形式で記録する
③ 各グループをスペース区切りで並べる
④ 例: 00011 → 3,0 2,1`,huffman:`① 各文字に対応するビット列の長さを確認する
② 文字列の各文字のビット長を足し算する
③ 例: A(1bit)×2 + B(2bit)×3 = 2+6 = 8bit`}}];function Be(e){return K.find(t=>t.id===e)||null}function rt(e,t){const r=String(e).trim();if(r==="")return!1;switch(t.answerType){case"binary":return r.replace(/^0+/,"")===String(t.answer).replace(/^0+/,"")||r===String(t.answer);case"hex":return r.toUpperCase()===String(t.answer).toUpperCase();case"number":{const a=Number(r.replace(/,/g,"")),s=Number(t.answer);return isNaN(a)?!1:Number.isInteger(s)?a===s:Math.abs(a-s)<.05}case"run-length":return r.replace(/\s+/g," ")===t.answer;default:return r===String(t.answer)}}const qe="digital_calc_score";function be(){try{const e=localStorage.getItem(qe);return e?JSON.parse(e):{}}catch{return{}}}function Ae(e){localStorage.setItem(qe,JSON.stringify(e))}function at(e,t,r,a){var n,o;const s=be();s[e]??(s[e]={}),(n=s[e])[t]??(n[t]={}),(o=s[e][t])[r]??(o[r]={correct:0,incorrect:0}),a?s[e][t][r].correct++:s[e][t][r].incorrect++,Ae(s)}function he(e=null,t=null){var a;let r=be();e&&t?(a=r[e])==null||delete a[t]:e?delete r[e]:r={},Ae(r)}function He(e){const r=be()[e]||{},a={};let s=0,n=0;for(let o=1;o<=3;o++){let d=0,x=0;const p=r[o]||{};for(const u in p)d+=p[u].correct,x+=p[u].incorrect;a[o]={correct:d,incorrect:x},s+=d,n+=x}return{totalCorrect:s,totalIncorrect:n,byDifficulty:a}}let C={total:0,correct:0,streak:0,maxStreak:0,startTime:null,byDifficulty:{1:{correct:0,total:0},2:{correct:0,total:0},3:{correct:0,total:0}}};function nt(){C={total:0,correct:0,streak:0,maxStreak:0,startTime:Date.now(),byDifficulty:{1:{correct:0,total:0},2:{correct:0,total:0},3:{correct:0,total:0}}}}function st(e,t){var r;C.total++,(r=C.byDifficulty)[t]??(r[t]={correct:0,total:0}),C.byDifficulty[t].total++,e?(C.correct++,C.streak++,C.byDifficulty[t].correct++,C.streak>C.maxStreak&&(C.maxStreak=C.streak)):C.streak=0}function ue(){return{...C}}function I(){return localStorage.getItem("darkMode")==="true"}function ot(e){localStorage.setItem("darkMode",String(e)),e?document.documentElement.classList.add("dark"):document.documentElement.classList.remove("dark")}function Z(){ot(!I())}const lt={indigo:{bg:"bg-indigo-100 dark:bg-indigo-900/30",icon:"text-indigo-600 dark:text-indigo-400",bar:"bg-indigo-500",badge:"bg-indigo-600"},violet:{bg:"bg-violet-100 dark:bg-violet-900/30",icon:"text-violet-600 dark:text-violet-400",bar:"bg-violet-500",badge:"bg-violet-600"},blue:{bg:"bg-blue-100 dark:bg-blue-900/30",icon:"text-blue-600 dark:text-blue-400",bar:"bg-blue-500",badge:"bg-blue-600"},cyan:{bg:"bg-cyan-100 dark:bg-cyan-900/30",icon:"text-cyan-600 dark:text-cyan-400",bar:"bg-cyan-500",badge:"bg-cyan-600"},emerald:{bg:"bg-emerald-100 dark:bg-emerald-900/30",icon:"text-emerald-600 dark:text-emerald-400",bar:"bg-emerald-500",badge:"bg-emerald-600"}};function it(e){const t=He(e.id),r=t.totalCorrect+t.totalIncorrect,a=r>0?Math.round(t.totalCorrect/r*100):0,s=lt[e.color],n=r===0,o=[1,2,3].map(d=>{const x=t.byDifficulty[d];return x.correct+x.incorrect===0?`<span class="text-xs text-gray-400 dark:text-gray-500">★${d}: 未挑戦</span>`:`<span class="text-xs text-gray-500 dark:text-gray-400">
      ★${d}: <span class="text-green-600 dark:text-green-400 font-medium">正${x.correct}</span>
            <span class="text-red-500 dark:text-red-400 font-medium">誤${x.incorrect}</span>
    </span>`}).join("");return`
    <button
      data-navigate="/quiz/${e.id}"
      class="group w-full text-left bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md
             border border-gray-100 dark:border-gray-700 transition-all duration-200
             hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2
             dark:focus:ring-offset-gray-900 p-5"
      aria-label="${e.name}の練習を開始"
    >
      <div class="flex items-start gap-4">
        <!-- アイコン -->
        <div class="flex-shrink-0 w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center ${s.icon}">
          ${e.icon}
        </div>

        <!-- テキスト -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-0.5">
            <h2 class="font-bold text-gray-800 dark:text-gray-100 text-base">${e.name}</h2>
            ${n?'<span class="text-xs text-gray-400 dark:text-gray-500">未挑戦</span>':`<span class="text-sm font-bold ${a>=70?"text-green-600 dark:text-green-400":"text-gray-600 dark:text-gray-300"}">${a}%</span>`}
          </div>
          <p class="text-xs text-gray-400 dark:text-gray-500 mb-3">${e.description}</p>

          <!-- プログレスバー -->
          <div class="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
            <div
              class="${s.bar} h-full rounded-full transition-all duration-500"
              style="width: ${a}%"
            ></div>
          </div>

          <!-- 難易度別スコア -->
          <div class="flex gap-3 flex-wrap">
            ${o}
          </div>
        </div>

        <!-- 矢印 -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
             stroke="currentColor" class="flex-shrink-0 w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-brand-500 transition-colors mt-1">
          <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </div>
    </button>
  `}function dt(){return`
    <div id="reset-modal" class="fixed inset-0 z-50 hidden items-center justify-center">
      <!-- バックドロップ -->
      <div id="reset-backdrop" class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <!-- モーダル本体 -->
      <div class="relative z-10 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mx-4 w-full max-w-sm">
        <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">スコアをリセット</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-5">リセットする範囲を選んでください。</p>
        <div class="flex flex-col gap-2 mb-5" id="reset-options">
          ${K.map(e=>`
            <button data-reset="${e.id}"
              class="text-left px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                     hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20
                     text-sm text-gray-700 dark:text-gray-300 transition-colors">
              ${e.name} のスコアをリセット
            </button>
          `).join("")}
          <button data-reset="all"
            class="text-left px-4 py-2.5 rounded-xl border border-red-300 dark:border-red-700
                   bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40
                   text-sm font-medium text-red-600 dark:text-red-400 transition-colors">
            すべてのスコアをリセット
          </button>
        </div>
        <button id="reset-cancel"
          class="w-full py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
          キャンセル
        </button>
      </div>
    </div>
  `}function le(e){const t=I();e.innerHTML=`
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <!-- ヘッダー -->
      <header class="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-100 dark:border-gray-800">
        <div class="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 class="font-bold text-gray-800 dark:text-gray-100 text-base tracking-tight">
            💻 デジタル計算トレーニング
          </h1>
          <div class="flex items-center gap-2">
            <!-- スコアリセット -->
            <button id="open-reset"
              class="text-xs text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400
                     px-2 py-1 rounded-lg transition-colors">
              スコアリセット
            </button>
            <!-- ダークモードトグル -->
            <button id="dark-toggle" aria-label="ダークモード切替"
              class="w-9 h-9 flex items-center justify-center rounded-xl
                     text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <svg id="icon-sun" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   stroke-width="1.5" stroke="currentColor" class="w-5 h-5 ${t?"hidden":""}">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
              <svg id="icon-moon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   stroke-width="1.5" stroke="currentColor" class="w-5 h-5 ${t?"":"hidden"}">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <!-- メインコンテンツ -->
      <main class="max-w-2xl mx-auto px-4 py-6">

        <!-- 1. デジタルの仕組み体験バナー -->
        <button
          data-navigate="/binary"
          class="w-full text-left mb-8 rounded-2xl overflow-hidden shadow-sm hover:shadow-md
                 border border-amber-200 dark:border-amber-800
                 bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/20
                 transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          aria-label="デジタルの仕組み体験ページへ"
        >
          <div class="p-5 flex items-center gap-4">
            <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-400/30 dark:bg-amber-500/20 flex items-center justify-center text-2xl">
              🔢
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-0.5">
                <h2 class="font-bold text-amber-800 dark:text-amber-200 text-base">デジタルの仕組み体験</h2>
                <span class="text-xs bg-amber-400 dark:bg-amber-600 text-white font-bold px-2 py-0.5 rounded-full">NEW</span>
              </div>
              <p class="text-xs text-amber-700/70 dark:text-amber-300/70">
                コインや電球で「0と1」を体感しよう！コンピューターの情報表現の基本をインタラクティブに学べます
              </p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                 stroke="currentColor" class="flex-shrink-0 w-4 h-4 text-amber-400 dark:text-amber-500">
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </button>

        <!-- 2. 計算トレーニング セクション -->
        <div class="flex items-center gap-3 mb-4">
          <h2 class="font-bold text-gray-700 dark:text-gray-200 text-sm tracking-wide">計算トレーニング</h2>
          <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">学習したいカテゴリを選んでください</p>
        <div class="flex flex-col gap-3 mb-10">
          ${K.map(it).join("")}
        </div>

        <!-- 3. ゲームモード セクション -->
        <div class="flex items-center gap-3 mb-4">
          <h2 class="font-bold text-gray-700 dark:text-gray-200 text-sm tracking-wide">ゲームモード</h2>
          <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <button
          data-navigate="/game/hacker"
          class="w-full text-left rounded-2xl overflow-hidden border border-red-200 dark:border-red-800
                 bg-gradient-to-br from-slate-900 to-red-950
                 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200
                 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          aria-label="サイバー防衛ゲームへ"
        >
          <div class="p-5 flex items-center gap-4">
            <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-2xl">
              🛡️
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-0.5">
                <h3 class="font-bold text-white text-base">サイバー防衛</h3>
                <span class="text-xs bg-red-500 text-white font-bold px-2 py-0.5 rounded-full">NEW</span>
              </div>
              <p class="text-xs text-red-300/80">ハッカーの侵入からサーバーを守れ！★1〜★3 の難易度</p>
            </div>
            <div class="flex items-center gap-2 text-base mr-1">
              <span>🦠</span><span>🎯🦠</span><span class="text-red-400">🧑‍💻</span>
            </div>
          </div>
        </button>

      </main>

      ${dt()}
    </div>
  `,e.querySelectorAll("[data-navigate]").forEach(n=>{n.addEventListener("click",()=>T(n.dataset.navigate))}),e.querySelector("#dark-toggle").addEventListener("click",()=>{Z(),le(e)});const r=e.querySelector("#reset-modal"),a=()=>{r.classList.remove("hidden"),r.classList.add("flex")},s=()=>{r.classList.add("hidden"),r.classList.remove("flex")};e.querySelector("#open-reset").addEventListener("click",a),e.querySelector("#reset-cancel").addEventListener("click",s),e.querySelector("#reset-backdrop").addEventListener("click",s),e.querySelectorAll("[data-reset]").forEach(n=>{n.addEventListener("click",()=>{var x;const o=n.dataset.reset,d=o==="all"?"全スコア":`${(x=K.find(p=>p.id===o))==null?void 0:x.name}のスコア`;confirm(`${d}をリセットしますか？この操作は元に戻せません。`)&&(o==="all"?he():he(o),s(),le(e))})})}let G=null,h={categoryId:null,category:null,difficulty:1,currentQuestion:null,answered:!1,wasCorrect:!1,showHint:!1,appEl:null};function Ie(e){const t=Be(e);h={categoryId:e,category:t,difficulty:1,currentQuestion:null,answered:!1,wasCorrect:!1,showHint:!1,appEl:h.appEl},nt()}function ct(){const{category:e,difficulty:t}=h,r=e.generators[Math.floor(Math.random()*e.generators.length)];h.currentQuestion=r(t),h.answered=!1,h.wasCorrect=!1,h.showHint=!1}function xt(e){const t=Math.floor(e/1e3),r=Math.floor(t/60);return r>0?`${r}分${t%60}秒`:`${t}秒`}function gt(){const{difficulty:e}=h;return`
    <div class="flex items-center gap-1.5" role="group" aria-label="難易度選択">
      ${[1,2,3].map(t=>`
        <button
          data-action="set-difficulty" data-difficulty="${t}"
          class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150
                 ${t===e?"bg-brand-600 text-white shadow-sm":"bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"}"
          aria-pressed="${t===e}"
        >${"★".repeat(t)}</button>
      `).join("")}
    </div>
  `}function bt(){const{streak:e}=ue();return e<2?"":`
    <div class="flex items-center gap-1 text-orange-500 dark:text-orange-400 font-bold text-sm">
      <span>🔥</span>
      <span>${e} 連続正解</span>
    </div>
  `}function ut(){const e=He(h.categoryId),{total:t,correct:r}=ue(),a=t>0?Math.round(r/t*100):0;return`
    <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-medium text-gray-500 dark:text-gray-400">今回のセッション</span>
        <span class="text-xs font-bold text-gray-700 dark:text-gray-200">${r}/${t}問正解 ${t>0?`(${a}%)`:""}</span>
      </div>
      <div class="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div class="bg-green-500 h-full rounded-full transition-all duration-500" style="width:${a}%"></div>
      </div>
      <div class="flex gap-4 mt-3 pt-3 border-t border-gray-50 dark:border-gray-700">
        ${[1,2,3].map(s=>{const n=e.byDifficulty[s],o=n.correct+n.incorrect;return`<span class="text-xs text-gray-400 dark:text-gray-500">
            ★${s}: ${o===0?"未挑戦":`<span class="text-green-600 dark:text-green-400">正${n.correct}</span> <span class="text-red-500 dark:text-red-400">誤${n.incorrect}</span>`}
          </span>`}).join("")}
      </div>
    </div>
  `}function ft(){var x;const{currentQuestion:e,answered:t,wasCorrect:r,showHint:a,category:s,difficulty:n}=h;if(!e)return`
      <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 text-center">
        <div class="text-5xl mb-4">📝</div>
        <p class="text-gray-500 dark:text-gray-400 mb-6">「新しい問題」を押して練習を始めましょう</p>
        <button data-action="next-question"
          class="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition-colors shadow-sm">
          新しい問題
        </button>
      </div>
    `;const o=((x=s.hints)==null?void 0:x[e.type])??null,d=e.question.split(`
`).map(p=>`<span>${E(p)}</span>`).join("<br>");return`
    <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">

      <!-- フィードバックバナー -->
      ${t?`
        <div class="px-5 py-3 flex items-center gap-2
                    ${r?"bg-green-50 dark:bg-green-900/30 border-b border-green-100 dark:border-green-800":"bg-red-50 dark:bg-red-900/30 border-b border-red-100 dark:border-red-800"}">
          <span class="text-lg">${r?"✅":"❌"}</span>
          <span class="font-bold text-sm ${r?"text-green-700 dark:text-green-300":"text-red-700 dark:text-red-300"}">
            ${r?"正解！":`不正解　正しい答え: ${e.answer}${e.unit?" "+e.unit:""}`}
          </span>
        </div>
      `:""}

      <div class="p-5">
        <!-- 問題文 -->
        <div class="mb-5">
          <p class="text-gray-800 dark:text-gray-100 font-medium leading-relaxed font-mono text-sm md:text-base">
            ${d}
          </p>
        </div>

        <!-- 回答エリア（未回答時） -->
        ${t?`
          <!-- 回答後エリア -->
          <div class="space-y-3">
            <!-- 解説 -->
            ${e.explanation?`
              <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800
                          rounded-xl p-4 text-sm text-blue-800 dark:text-blue-300 whitespace-pre-line leading-relaxed">
                <p class="font-semibold mb-1.5 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                       stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                  </svg>
                  解説
                </p>
                ${E(e.explanation)}
              </div>
            `:""}

            <!-- アクションボタン -->
            <div class="flex flex-col sm:flex-row gap-2 pt-1">
              <button data-action="retry"
                class="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600
                       text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                もう一度この問題
              </button>
              <button data-action="next-question"
                class="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700
                       text-sm text-white font-medium transition-colors shadow-sm">
                次の問題へ →
              </button>
            </div>
            <button data-action="end-session"
              class="w-full py-2.5 rounded-xl border border-gray-200 dark:border-gray-600
                     text-sm text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400
                     hover:border-red-300 dark:hover:border-red-600 transition-colors">
              練習を終わる
            </button>
          </div>
        `:`
          <div class="space-y-2">
            <div class="flex gap-2 items-stretch">
              <div class="flex-1">
                <input
                  type="text" id="answer-input"
                  placeholder="回答を入力..."
                  class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
                         placeholder:text-gray-300 dark:placeholder:text-gray-500
                         focus:outline-none focus:border-brand-500 dark:focus:border-brand-400
                         font-mono text-sm transition-colors"
                  autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
                >
              </div>
              ${e.unit?`
                <span class="flex items-center px-3 bg-gray-100 dark:bg-gray-700
                             rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400
                             border border-gray-200 dark:border-gray-600 whitespace-nowrap">
                  ${E(e.unit)}
                </span>
              `:""}
              <button id="submit-btn" data-action="submit"
                class="px-5 py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 dark:disabled:bg-gray-600
                       text-white font-medium rounded-xl transition-colors shadow-sm whitespace-nowrap text-sm">
                解答
              </button>
            </div>

            <!-- 単位がある場合の補足 -->
            ${e.unit?`<p class="text-xs text-gray-400 dark:text-gray-500 pl-1">💡 数値のみ入力してください（単位「${E(e.unit)}」は自動で付きます）</p>`:""}

            <!-- フォーマットヒント -->
            ${!e.unit&&e.formatHint?`<p class="text-xs text-gray-400 dark:text-gray-500 pl-1">📌 ${E(e.formatHint)}</p>`:""}

            <!-- バリデーションエラー -->
            <p id="validation-error" class="text-xs text-red-500 dark:text-red-400 pl-1 hidden"></p>

            <!-- ヒントボタン -->
            ${o?`
              <button data-action="toggle-hint"
                class="text-xs text-brand-500 dark:text-brand-400 hover:underline flex items-center gap-1 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
                ${a?"ヒントを閉じる":"ヒントを見る"}
              </button>
              ${a?`
                <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700
                            rounded-xl p-3 text-xs text-amber-800 dark:text-amber-300 whitespace-pre-line">
                  ${E(o)}
                </div>
              `:""}
            `:""}
          </div>
        `}
      </div>
    </div>
  `}function mt(){const e=ue(),t=e.total,r=t>0?Math.round(e.correct/t*100):0,a=e.startTime?Date.now()-e.startTime:0,s=r>=90?"🏆":r>=70?"🎉":r>=50?"👍":"💪",n=r>=90?"素晴らしい！":r>=70?"よくできました！":r>=50?"もう少し練習しましょう":"引き続き頑張りましょう！",o=[1,2,3].map(d=>{var u;const x=((u=e.byDifficulty)==null?void 0:u[d])??{correct:0,total:0};if(x.total===0)return"";const p=Math.round(x.correct/x.total*100);return`
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-500 dark:text-gray-400">★${d}</span>
        <span class="font-medium text-gray-700 dark:text-gray-200">
          ${x.correct}/${x.total}問 (${p}%)
        </span>
      </div>
    `}).filter(Boolean).join("");return`
    <div id="summary-modal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div class="relative z-10 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 mx-4 w-full max-w-sm text-center">
        <div class="text-5xl mb-3">${s}</div>
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">練習お疲れ様でした！</h2>
        <p class="text-sm text-gray-400 dark:text-gray-500 mb-5">${n}</p>

        <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-4 text-left space-y-2">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">正解率</span>
            <span class="font-bold text-2xl ${r>=70?"text-green-600 dark:text-green-400":"text-gray-700 dark:text-gray-200"}">${r}%</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">正解数</span>
            <span class="font-medium text-gray-700 dark:text-gray-200">${e.correct} / ${t} 問</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">最大連続正解</span>
            <span class="font-medium text-gray-700 dark:text-gray-200">${e.maxStreak} 問</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">練習時間</span>
            <span class="font-medium text-gray-700 dark:text-gray-200">${xt(a)}</span>
          </div>
          ${o?`
            <div class="pt-2 mt-2 border-t border-gray-200 dark:border-gray-600 space-y-1.5">
              <p class="text-xs text-gray-400 dark:text-gray-500 mb-1">難易度別</p>
              ${o}
            </div>
          `:""}
        </div>

        <div class="flex flex-col gap-2">
          <button data-action="restart-session"
            class="py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors">
            続けて練習する
          </button>
          <button data-action="go-top"
            class="py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                   text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            トップに戻る
          </button>
        </div>
      </div>
    </div>
  `}function q(e=!1){const{category:t,categoryId:r,difficulty:a,appEl:s}=h,n=I();s.innerHTML=`
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">

      <!-- ヘッダー -->
      <header class="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-100 dark:border-gray-800">
        <div class="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <!-- トップへ戻る -->
          <button data-action="go-top"
            class="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400
                   hover:text-brand-600 dark:hover:text-brand-400 transition-colors shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke-width="2" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            トップ
          </button>

          <span class="text-gray-200 dark:text-gray-700">|</span>

          <!-- カテゴリ名 -->
          <h1 class="font-bold text-gray-800 dark:text-gray-100 text-sm flex-1 truncate">
            ${t.name}
          </h1>

          <!-- ストリーク -->
          <div id="streak-display">${bt()}</div>

          <!-- ダークモードトグル -->
          <button data-action="toggle-dark" aria-label="ダークモード切替"
            class="w-8 h-8 flex items-center justify-center rounded-lg
                   text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke-width="1.5" stroke="currentColor" class="w-4 h-4 ${n?"hidden":""}">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke-width="1.5" stroke="currentColor" class="w-4 h-4 ${n?"":"hidden"}">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
            </svg>
          </button>
        </div>
      </header>

      <!-- メインコンテンツ -->
      <main class="max-w-2xl mx-auto px-4 py-5 space-y-4">

        <!-- 難易度 + 新しい問題 -->
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-400 dark:text-gray-500 shrink-0">難易度</span>
            ${gt()}
          </div>
          ${h.answered?"":`
            <button data-action="next-question"
              class="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700
                     text-white text-sm font-medium transition-colors shadow-sm shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              新しい問題
            </button>
          `}
        </div>

        <!-- 問題カード -->
        <div id="question-area">
          ${ft()}
        </div>

        <!-- スコアパネル -->
        ${ut()}

      </main>
    </div>

    ${e?mt():""}
  `,yt()}function pt(e){const t=e.target.closest("[data-action]");if(t)switch(t.dataset.action){case"set-difficulty":{const r=parseInt(t.dataset.difficulty,10);r!==h.difficulty&&(h.difficulty=r,q());break}case"next-question":ct(),q();break;case"retry":h.answered=!1,h.wasCorrect=!1,h.showHint=!1,q();break;case"toggle-hint":h.showHint=!h.showHint,q();break;case"toggle-dark":Z(),q();break;case"go-top":T("/");break;case"end-session":q(!0);break;case"restart-session":Ie(h.categoryId),q();break}}function yt(){const{appEl:e}=h,t=e.querySelector("#answer-input");t&&(t.focus(),t.addEventListener("keydown",a=>{a.key==="Enter"&&ve()}));const r=e.querySelector("#submit-btn");r&&r.addEventListener("click",ve)}function ve(){const e=h.appEl.querySelector("#answer-input"),t=h.appEl.querySelector("#validation-error");if(!e||e.value.trim()===""){t&&(t.textContent="回答を入力してください",t.classList.remove("hidden")),e==null||e.focus();return}const r=rt(e.value,h.currentQuestion);at(h.categoryId,h.difficulty,h.currentQuestion.type,r),st(r,h.difficulty),h.answered=!0,h.wasCorrect=r,q()}function E(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ht(e,t){if(!Be(t)){T("/");return}h.categoryId!==t||h.appEl!==e?(h.appEl=e,Ie(t)):h.appEl=e,G&&G.abort(),G=new AbortController,e.addEventListener("click",pt,{signal:G.signal}),q()}function fe(e){return e.reduce((t,r,a)=>t+r*Math.pow(2,e.length-1-a),0)}function vt(e){return e>=32&&e<=126?String.fromCharCode(e):null}function ke(){return Math.floor(Math.random()*15)+1}const O={lightbulb:{name:"電球",emoji:"💡",onLabel:"点灯",offLabel:"消灯",intro:"電球が「ついている（1）」か「消えている（0）」かで情報を表します。"},coin:{name:"コイン",emoji:"🪙",onLabel:"表（おもて）",offLabel:"裏（うら）",intro:"コインの「表（1）」か「裏（0）」かで情報を表します。"},card:{name:"カード",emoji:"🃏",onLabel:"表向き",offLabel:"裏向き",intro:"カードの「表向き（1）」か「裏向き（0）」かで情報を表します。"}};function Ee(e,t=22){const r=Math.round(t*1.18),a=e?"#92400E":"#9CA3AF",s=e?"#FEF9C3":"none",n=t>=15;return`<svg width="${t}" height="${r}" viewBox="0 0 22 26" xmlns="http://www.w3.org/2000/svg" style="overflow:visible">
    <path d="M11 1.5C6.3 1.5 2.5 5.3 2.5 10C2.5 13.2 4.3 15.9 6.8 17.4L6.8 20.5L15.2 20.5L15.2 17.4C17.7 15.9 19.5 13.2 19.5 10C19.5 5.3 15.7 1.5 11 1.5Z"
          fill="${s}" stroke="${a}" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M8.5 15 Q11 12.5 13.5 15" stroke="${a}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    ${n?`
    <rect x="6.8" y="20.5" width="8.4" height="2"   rx="0.8" fill="${a}" opacity="0.8"/>
    <rect x="7.8" y="22.5" width="6.4" height="1.8" rx="0.8" fill="${a}" opacity="0.6"/>
    <rect x="8.8" y="24.3" width="4.4" height="1.5" rx="0.7" fill="${a}" opacity="0.4"/>
    `:""}
  </svg>`}function J(e,t,r,a,s=!1,n="sm"){const o=s?"opacity-60 pointer-events-none":"",d=`data-bit-section="${r}" data-bit-index="${t}" ${s?"disabled":""}`,x=n==="xs"?"text-xs":"text-sm",p=`flex flex-col items-center gap-1 group select-none ${o}`;switch(a){case"coin":return`
        <button ${d} class="${p}" aria-label="${e?"表（1）":"裏（0）"}のコイン">
          <div class="${n==="xs"?"w-8 h-8":"w-11 h-11"} rounded-full flex items-center justify-center border-2 transition-all duration-150
            ${e?"bg-gradient-to-br from-yellow-300 to-amber-500 border-amber-600 shadow-md shadow-amber-300/50 scale-110":"bg-gradient-to-br from-gray-300 to-slate-400 dark:from-gray-600 dark:to-slate-700 border-gray-400 dark:border-gray-600 group-hover:scale-105"}
          ">
            <span class="${n==="xs"?"text-[10px]":"text-xs"} font-bold leading-none ${e?"text-amber-900":"text-gray-600 dark:text-gray-300"}">
              ${e?"表":"裏"}
            </span>
          </div>
          <span class="${x} font-bold font-mono leading-none
            ${e?"text-amber-600 dark:text-amber-400":"text-slate-500 dark:text-slate-400"}
          ">${e?"1":"0"}</span>
        </button>
      `;case"card":return`
        <button ${d} class="${p}" aria-label="${e?"表向き（1）":"裏向き（0）"}のカード">
          <div class="${n==="xs"?"w-6":"w-9"} ${n==="xs"?"h-9":"h-12"} rounded flex items-center justify-center transition-all duration-150
            ${e?"bg-white dark:bg-gray-100 shadow-md border border-gray-200 scale-105":"card-back-pattern shadow border border-blue-700 group-hover:scale-105"}
          ">
            ${e?`<span class="text-red-600 dark:text-red-500 ${n==="xs"?"text-sm":"text-lg"} leading-none">♠</span>`:'<span class="text-white/70 text-[10px] font-bold">裏</span>'}
          </div>
          <span class="${x} font-bold font-mono leading-none
            ${e?"text-rose-600 dark:text-rose-400":"text-blue-500 dark:text-blue-400"}
          ">${e?"1":"0"}</span>
        </button>
      `;default:return`
        <button ${d} class="${p}" aria-label="${e?"点灯中（1）":"消灯中（0）"}の電球">
          <div class="${n==="xs"?"w-8 h-8":"w-11 h-11"} rounded-full flex items-center justify-center transition-all duration-150
            ${e?"bg-yellow-300 dark:bg-yellow-400 shadow-md shadow-yellow-300/70 dark:shadow-yellow-400/50 scale-110":"bg-gray-100 dark:bg-gray-800 opacity-60 group-hover:opacity-80 group-hover:scale-105"}
          ">
            ${Ee(e,n==="xs"?17:22)}
          </div>
          <span class="${x} font-bold font-mono leading-none
            ${e?"text-yellow-600 dark:text-yellow-400":"text-gray-400 dark:text-gray-500"}
          ">${e?"1":"0"}</span>
        </button>
      `}}function kt(e,t,r,a){switch(a){case"coin":return`
        <button data-bit-section="${r}" data-bit-index="${t}"
          class="flex flex-col items-center gap-2 group select-none"
          aria-label="${e?"表（1）":"裏（0）"}、クリックで切り替え">
          <div class="w-20 h-20 rounded-full flex items-center justify-center border-4 transition-all duration-200
            ${e?"bg-gradient-to-br from-yellow-300 to-amber-500 border-amber-600 shadow-lg shadow-amber-300/60 scale-105":"bg-gradient-to-br from-gray-300 to-slate-400 dark:from-gray-600 dark:to-slate-700 border-gray-400 dark:border-gray-600 group-hover:scale-105"}
          ">
            <span class="text-2xl font-bold ${e?"text-amber-900":"text-gray-600 dark:text-gray-300"}">
              ${e?"表":"裏"}
            </span>
          </div>
          <span class="text-xl font-bold font-mono ${e?"text-amber-600 dark:text-amber-400":"text-slate-500 dark:text-slate-400"}">
            ${e?"1":"0"}
          </span>
        </button>
      `;case"card":return`
        <button data-bit-section="${r}" data-bit-index="${t}"
          class="flex flex-col items-center gap-2 group select-none"
          aria-label="${e?"表向き（1）":"裏向き（0）"}、クリックで切り替え">
          <div class="w-16 h-24 rounded-lg flex items-center justify-center transition-all duration-200
            ${e?"bg-white dark:bg-gray-100 shadow-lg border-2 border-gray-200 scale-105":"card-back-pattern shadow-md border-2 border-blue-700 group-hover:scale-105"}
          ">
            ${e?'<span class="text-red-600 dark:text-red-500 text-4xl">♠</span>':'<span class="text-white font-bold text-sm">裏</span>'}
          </div>
          <span class="text-xl font-bold font-mono ${e?"text-rose-600 dark:text-rose-400":"text-blue-500 dark:text-blue-400"}">
            ${e?"1":"0"}
          </span>
        </button>
      `;default:return`
        <button data-bit-section="${r}" data-bit-index="${t}"
          class="flex flex-col items-center gap-2 group select-none"
          aria-label="${e?"点灯中（1）":"消灯中（0）"}、クリックで切り替え">
          <div class="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200
            ${e?"bg-yellow-300 dark:bg-yellow-400 shadow-lg shadow-yellow-300/70 dark:shadow-yellow-400/50 scale-105":"bg-gray-100 dark:bg-gray-800 opacity-60 group-hover:scale-105"}
          ">
            ${Ee(e,36)}
          </div>
          <span class="text-xl font-bold font-mono ${e?"text-yellow-600 dark:text-yellow-400":"text-gray-400 dark:text-gray-500"}">
            ${e?"1":"0"}
          </span>
        </button>
      `}}function wt(e){return`
    <div class="flex gap-1.5 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
      ${Object.entries(O).map(([t,r])=>`
          <button data-set-mode="${t}"
            class="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-sm font-medium transition-all duration-150
              ${t===e?"bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm":"text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50"}
            ">
            <span>${r.emoji}</span><span>${r.name}</span>
          </button>
        `).join("")}
    </div>
  `}function $t(e,t){const r=O[t],a=e[0]===1;return`
    <section class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div class="flex items-center gap-2 mb-1">
        <span class="text-lg">${r.emoji}</span>
        <h2 class="font-bold text-gray-800 dark:text-gray-100 text-base">${r.name}1つ ＝ 1ビット</h2>
      </div>
      <p class="text-xs text-gray-400 dark:text-gray-500 mb-6">${r.intro}</p>

      <div class="flex justify-center mb-6">
        ${kt(a,0,"1",t)}
      </div>

      <div class="flex justify-center gap-8 mb-4">
        <div class="flex flex-col items-center gap-1">
          <span class="text-xs text-gray-400 dark:text-gray-500">状態</span>
          <span class="font-bold text-base ${a?"text-green-600 dark:text-green-400":"text-gray-500 dark:text-gray-400"}">
            ${a?r.onLabel:r.offLabel}
          </span>
        </div>
        <div class="h-10 w-px bg-gray-200 dark:bg-gray-700 self-center"></div>
        <div class="flex flex-col items-center gap-1">
          <span class="text-xs text-gray-400 dark:text-gray-500">デジタル値</span>
          <span class="font-bold font-mono text-3xl ${a?"text-green-600 dark:text-green-400":"text-red-500 dark:text-red-400"}">
            ${a?"1":"0"}
          </span>
        </div>
      </div>

      <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 text-xs text-amber-700 dark:text-amber-300">
        💡 <strong>ポイント：</strong>2つの状態（${r.onLabel} / ${r.offLabel}）＝ 2つの数字（1 / 0）。これが「<strong>ビット（bit）</strong>」の基本です。
      </div>
    </section>
  `}function St(e,t){const r=O[t],a=fe(e),s=e.join("");return`
    <section class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div class="flex items-center gap-2 mb-1">
        <span class="text-lg">${r.emoji}</span>
        <h2 class="font-bold text-gray-800 dark:text-gray-100 text-base">${r.name}4つ ＝ 4ビット</h2>
      </div>
      <p class="text-xs text-gray-400 dark:text-gray-500 mb-5">
        タップして ${r.onLabel} / ${r.offLabel} を切り替えてみよう。
        4つで <strong class="text-gray-700 dark:text-gray-300">0〜15 の 16通り</strong> を表せます！
      </p>

      <div class="flex justify-center gap-4 mb-5">
        ${e.map((n,o)=>J(n===1,o,"4",t)).join("")}
      </div>

      <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="text-xs text-gray-500 dark:text-gray-400">2進数</span>
          <span class="font-mono font-bold text-lg tracking-widest text-indigo-600 dark:text-indigo-400">${s}</span>
        </div>
        <div class="h-px bg-gray-200 dark:bg-gray-600"></div>
        <div class="flex items-center justify-between">
          <span class="text-xs text-gray-500 dark:text-gray-400">10進数</span>
          <span class="font-mono font-bold text-2xl text-gray-800 dark:text-gray-100">${a}</span>
        </div>
      </div>

      <div class="mt-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-3 text-xs text-indigo-700 dark:text-indigo-300">
        💡 <strong>ポイント：</strong>ビットが増えると表現できる数が増えます。4ビットなら 2<sup>4</sup> ＝ <strong>16通り</strong>！
      </div>
    </section>
  `}function Mt(e,t){const r=O[t],a=fe(e),s=vt(a),n=e.join("");return`
    <section class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div class="flex items-center gap-2 mb-1">
        <span class="text-lg">🔤</span>
        <h2 class="font-bold text-gray-800 dark:text-gray-100 text-base">${r.name}8つ ＝ 1バイト（文字に変換！）</h2>
      </div>
      <p class="text-xs text-gray-400 dark:text-gray-500 mb-5">
        8つ（1バイト）で 0〜255 の256通りを表現でき、
        <strong class="text-gray-700 dark:text-gray-300">アルファベットや記号</strong>を表せます！
      </p>

      <!-- 8ビット 1列（前半4・後半4 をセパレーターで区切り）-->
      <div class="flex items-start justify-center gap-1 mb-5 overflow-x-auto pb-1">
        <div class="flex gap-1.5">
          ${e.slice(0,4).map((o,d)=>J(o===1,d,"8",t,!1,"xs")).join("")}
        </div>
        <div class="flex-shrink-0 w-3 flex justify-center" style="padding-top:14px">
          <div class="w-px h-5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>
        <div class="flex gap-1.5">
          ${e.slice(4).map((o,d)=>J(o===1,d+4,"8",t,!1,"xs")).join("")}
        </div>
      </div>

      <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="text-xs text-gray-500 dark:text-gray-400">2進数</span>
          <span class="font-mono font-bold text-base tracking-widest text-indigo-600 dark:text-indigo-400">${n}</span>
        </div>
        <div class="h-px bg-gray-200 dark:bg-gray-600"></div>
        <div class="flex items-center justify-between">
          <span class="text-xs text-gray-500 dark:text-gray-400">10進数</span>
          <span class="font-mono font-bold text-2xl text-gray-800 dark:text-gray-100">${a}</span>
        </div>
        <div class="h-px bg-gray-200 dark:bg-gray-600"></div>
        <div class="flex items-center justify-between">
          <span class="text-xs text-gray-500 dark:text-gray-400">文字（ASCII）</span>
          <span class="font-mono font-bold text-2xl
            ${s?"text-emerald-600 dark:text-emerald-400":"text-gray-300 dark:text-gray-600"}
          ">
            ${s??"―"}
          </span>
        </div>
      </div>

      <p class="mt-3 text-xs text-gray-400 dark:text-gray-500 text-center">
        ヒント：<span class="font-mono text-emerald-600 dark:text-emerald-400">01000001</span> にすると… 「A」になるよ！
      </p>

      <div class="mt-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 text-xs text-emerald-700 dark:text-emerald-300">
        💡 <strong>ポイント：</strong>8ビット ＝ 1バイト。コンピューターが文字を記録するときは、このように数字に変換しています。
      </div>
    </section>
  `}function Ct(e,t,r,a,s,n){const o=O[n],d=t.toString(2).padStart(4,"0");return`
    <section class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div class="flex items-center justify-between mb-1">
        <div class="flex items-center gap-2">
          <span class="text-lg">🎯</span>
          <h2 class="font-bold text-gray-800 dark:text-gray-100 text-base">チャレンジ！</h2>
        </div>
        ${s>0?`<span class="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-bold px-2 py-0.5 rounded-full">🔥 ${s}問連続正解</span>`:""}
      </div>
      <p class="text-xs text-gray-400 dark:text-gray-500 mb-5">
        ${o.name}を並べて下の数字を作ろう。「これだ！」と思ったら <strong class="text-gray-700 dark:text-gray-200">回答ボタン</strong> を押して確定！
      </p>

      <!-- 目標値 -->
      <div class="flex justify-center mb-5">
        <div class="bg-violet-50 dark:bg-violet-900/20 border-2 border-violet-300 dark:border-violet-700 rounded-2xl px-8 py-4 text-center">
          <p class="text-xs text-violet-500 dark:text-violet-400 mb-1">作りたい数字</p>
          <p class="text-5xl font-bold font-mono text-violet-700 dark:text-violet-300">${t}</p>
        </div>
      </div>

      <!-- ビット操作エリア -->
      <div class="flex justify-center gap-4 mb-6">
        ${e.map((x,p)=>J(x===1,p,"c",n,r)).join("")}
      </div>

      <!-- 回答前：回答ボタン -->
      ${r?"":`
        <button id="submit-challenge"
          class="w-full py-3 bg-violet-600 hover:bg-violet-700 active:scale-95 text-white text-sm font-bold
                 rounded-xl shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2">
          回答する ✓
        </button>
      `}

      <!-- 回答後：フィードバック -->
      ${r?`
        <div class="${a?"bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700":"bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700"} rounded-xl p-4 text-center mb-4">
          <p class="text-2xl mb-1">${a?"🎉":"😢"}</p>
          <p class="font-bold ${a?"text-green-700 dark:text-green-300":"text-red-700 dark:text-red-300"}">
            ${a?"せいかい！":"ざんねん…"}
          </p>
          <p class="text-xs mt-1 ${a?"text-green-600 dark:text-green-400":"text-red-600 dark:text-red-400"}">
            ${a?`${t} ＝ ${d}（2進数）`:`正解は <span class="font-mono font-bold">${d}</span>（2進数）＝ ${t} でした！`}
          </p>
          ${a?"":`
            <p class="text-xs mt-1.5 text-orange-500 dark:text-orange-400 font-medium">
              💥 連続正解がリセットされました
            </p>
          `}
        </div>
        <button id="next-challenge"
          class="w-full py-3 active:scale-95 text-white text-sm font-bold rounded-xl shadow transition-all duration-150
                 focus:outline-none focus:ring-2 focus:ring-offset-2
                 ${a?"bg-violet-600 hover:bg-violet-700 focus:ring-violet-400":"bg-gray-500 hover:bg-gray-600 focus:ring-gray-400"}
          ">
          次の問題へ →
        </button>
      `:""}
    </section>
  `}function Lt(e){const t={mode:"lightbulb",bits1:[0],bits4:[0,0,0,0],bits8:[0,0,0,0,0,0,0,0],challengeBits:[0,0,0,0],challengeTarget:ke(),challengeAnswered:!1,challengeCorrect:!1,challengeStreak:0};function r(){const n=I();e.innerHTML=`
      <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">

        <!-- ヘッダー -->
        <header class="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-100 dark:border-gray-800">
          <div class="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <button id="btn-back"
                class="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="トップへ戻る">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                     stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </button>
              <h1 class="font-bold text-gray-800 dark:text-gray-100 text-base tracking-tight">
                🔢 デジタルの仕組み体験
              </h1>
            </div>
            <button id="dark-toggle" aria-label="ダークモード切替"
              class="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   stroke-width="1.5" stroke="currentColor" class="w-5 h-5 ${n?"hidden":""}">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   stroke-width="1.5" stroke="currentColor" class="w-5 h-5 ${n?"":"hidden"}">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
              </svg>
            </button>
          </div>
        </header>

        <!-- メインコンテンツ -->
        <main class="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            コンピューターは <strong class="text-gray-700 dark:text-gray-200">0 と 1 だけ</strong> で
            すべての情報を表現しています。体で感じながら学んでみよう！
          </p>

          ${wt(t.mode)}
          ${$t(t.bits1,t.mode)}
          ${St(t.bits4,t.mode)}
          ${Mt(t.bits8,t.mode)}
          ${Ct(t.challengeBits,t.challengeTarget,t.challengeAnswered,t.challengeCorrect,t.challengeStreak,t.mode)}
        </main>
      </div>
    `,s()}function a(n,o){t[n][o]^=1,r()}function s(){var n,o;e.querySelector("#btn-back").addEventListener("click",()=>T("/")),e.querySelector("#dark-toggle").addEventListener("click",()=>{Z(),r()}),e.querySelectorAll("[data-set-mode]").forEach(d=>{d.addEventListener("click",()=>{t.mode=d.dataset.setMode,r()})}),e.querySelectorAll("[data-bit-section]").forEach(d=>{d.addEventListener("click",()=>{const x=d.dataset.bitSection,p=parseInt(d.dataset.bitIndex);switch(x){case"1":a("bits1",p);break;case"4":a("bits4",p);break;case"8":a("bits8",p);break;case"c":t.challengeAnswered||a("challengeBits",p);break}})}),(n=e.querySelector("#submit-challenge"))==null||n.addEventListener("click",()=>{const d=fe(t.challengeBits);t.challengeAnswered=!0,t.challengeCorrect=d===t.challengeTarget,t.challengeCorrect?t.challengeStreak++:t.challengeStreak=0,r()}),(o=e.querySelector("#next-challenge"))==null||o.addEventListener("click",()=>{t.challengeBits=[0,0,0,0],t.challengeTarget=ke(),t.challengeAnswered=!1,t.challengeCorrect=!1,r()})}r()}function jt(e,t){let r,a;e===1?(r=2,a=Math.min(4,2+Math.floor(t/2e4))):e===2?(r=4,a=Math.min(6,4+Math.floor(t/2e4))):(r=4,a=Math.min(8,4+Math.floor(t/2e4)));const s=Math.floor(Math.random()*(a-r+1))+r,n=s%4===0,o=["dec-to-bin","bin-to-dec"];n&&o.push("bin-to-hex","hex-to-bin");const d=o[Math.floor(Math.random()*o.length)],x=Math.floor(Math.random()*2**s),p=x.toString(2).padStart(s,"0");switch(d){case"dec-to-bin":return{type:d,answerType:"binary",question:`10進数の ${x} を2進数に変換せよ`,unit:"先頭の 0 は省略可",answer:p,bits:s};case"bin-to-dec":return{type:d,answerType:"number",question:`2進数の ${p} を10進数に変換せよ`,unit:"",answer:x,bits:s};case"bin-to-hex":{const u=x.toString(16).toUpperCase().padStart(s/4,"0");return{type:d,answerType:"hex",question:`2進数の ${p} を16進数に変換せよ`,unit:"大文字・小文字どちらも可",answer:u,bits:s}}case"hex-to-bin":{const u=x.toString(16).toUpperCase().padStart(s/4,"0");return{type:d,answerType:"binary",question:`16進数の ${u} を2進数に変換せよ`,unit:"先頭の 0 は省略可",answer:p,bits:s}}}}function we(e,t,r){if(e==="conversion")return jt(t,r);let a,s;t===3?(a=6,s=Math.min(16,8+Math.floor(r/2e4))):(a=2,s=Math.min(8,4+Math.floor(r/2e4)));const n=Math.floor(Math.random()*(s-a+1))+a;return Math.random()<.5?{type:"inf-bit",answerType:"number",question:`${(2**n).toLocaleString()} 通りで表せる情報のデータ量は？`,unit:"bit",answer:n,bits:n}:{type:"bit-inf",answerType:"number",question:`${n} bit で表せる情報は？`,unit:"通り",answer:2**n,bits:n}}function Q(e,t){return Number(localStorage.getItem(`digits_hiscore_${e}_${t}`)||0)}function Tt(e,t,r){const a=Q(e,t);return r>a?(localStorage.setItem(`digits_hiscore_${e}_${t}`,String(r)),!0):!1}function Bt(e){return({5:[45,36,27,18,10],3:[45,27,10]}[e]??Array.from({length:e},(a,s)=>Math.round(45-s*(35/Math.max(e-1,1))))).map((a,s)=>({id:s,x:a,alive:!0}))}const ae={1:{label:"★1  EASY",hp:5,penaltyBoost:0,baseSpeed:7,spawnStart:4e3,spawnMin:1500,colorClass:"text-green-400",bgClass:"bg-green-500",bonus:1,description:"ペナルティなし・易しい問題"},2:{label:"★2  NORMAL",hp:3,penaltyBoost:1.6,baseSpeed:8,spawnStart:3500,spawnMin:1200,colorClass:"text-yellow-400",bgClass:"bg-yellow-500",bonus:2,description:"不正解でハッカーが加速・ウォール3枚"},3:{label:"★3  HARD",hp:3,penaltyBoost:2.2,baseSpeed:9,spawnStart:3e3,spawnMin:1e3,colorClass:"text-red-400",bgClass:"bg-red-500",bonus:3,description:"不正解で激加速・8bit以上の問題"}},$e=[{id:"amount",name:"情報量計算",description:"ビット数 ↔ パターン数",available:!0},{id:"conversion",name:"進数変換",description:"2進数・10進数・16進数",available:!0}];let Se=!1;function qt(){if(Se)return;Se=!0;const e=document.createElement("style");e.textContent=`
    @keyframes textFlicker {
      0%, 88%, 91%, 94%, 97%, 100% { opacity: 1; }
      89%, 92%, 95% { opacity: 0.55; }
    }
    @keyframes glowPulse {
      0%, 100% { opacity: 0.7; }
      50%       { opacity: 1; }
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0; }
    }
    @keyframes slideInUp {
      from { transform: translateY(24px); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
    @keyframes shieldBob {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-10px); }
    }
    @keyframes floatUp {
      0%   { transform: translateY(0)     translateX(-50%); opacity: 1; }
      100% { transform: translateY(-56px) translateX(-50%); opacity: 0; }
    }
    @keyframes screenShake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-7px); }
      40%      { transform: translateX(7px); }
      60%      { transform: translateX(-4px); }
      80%      { transform: translateX(4px); }
    }
    @keyframes countdownPop {
      0%   { transform: scale(0.4); opacity: 0; }
      60%  { transform: scale(1.15); opacity: 1; }
      100% { transform: scale(1);   opacity: 1; }
    }
    @keyframes hackerBoost {
      0%,100% { filter: drop-shadow(0 0 0px transparent); }
      50%     { filter: drop-shadow(0 0 10px #f87171) brightness(1.3); }
    }
    @keyframes wallBreak {
      0%   { transform: translateX(-50%) scale(1);   opacity: 1; }
      40%  { transform: translateX(-50%) scale(1.2); opacity: 0.7; }
      100% { transform: translateX(-50%) scale(0);   opacity: 0; }
    }
    .hk-score-popup {
      position: absolute;
      pointer-events: none;
      font-weight: 800;
      font-size: 1rem;
      color: #FCD34D;
      text-shadow: 0 1px 6px rgba(0,0,0,0.95);
      animation: floatUp 1s ease-out forwards;
      white-space: nowrap;
      z-index: 30;
    }
    .hk-hacker-boosted .hk-hacker-icon {
      animation: hackerBoost 0.22s ease-in-out infinite;
    }
    .hk-game-shake {
      animation: screenShake 0.4s ease-in-out;
    }
    .hk-wall-breaking {
      animation: wallBreak 0.45s ease-out forwards;
      pointer-events: none;
    }
  `,document.head.appendChild(e)}function At(e){qt();let t=null,r=null;const a={tick:null,spawn:null};let s=null;function n(){a.tick&&(clearInterval(a.tick),a.tick=null),a.spawn&&(clearTimeout(a.spawn),a.spawn=null),s&&(document.removeEventListener("keydown",s),s=null)}function o(){n(),e.innerHTML=`
      <div class="fixed inset-0 bg-slate-950 flex flex-col overflow-hidden">

        <!-- 背景グリッド -->
        <div class="absolute inset-0 pointer-events-none opacity-[0.035]"
             style="background-image:linear-gradient(rgba(34,197,94,1) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,1) 1px,transparent 1px);background-size:48px 48px;"></div>

        <!-- CRTスキャンライン -->
        <div class="absolute inset-0 pointer-events-none"
             style="background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.07) 3px,rgba(0,0,0,0.07) 4px);"></div>

        <!-- 戻るボタン -->
        <button id="btn-back"
          class="absolute top-5 left-5 z-20 flex items-center gap-1.5
                 text-slate-600 hover:text-slate-300 font-mono text-xs tracking-widest transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
               stroke="currentColor" class="w-3 h-3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/>
          </svg>
          BACK
        </button>

        <!-- メインコンテンツ -->
        <div class="flex-1 flex flex-col items-center justify-center px-6 py-8">

          <!-- システム起動メッセージ -->
          <p class="text-green-500 font-mono text-xs tracking-[0.35em] mb-8 uppercase"
             style="animation:glowPulse 2.5s ease-in-out infinite;">
            &gt;&nbsp;DEFENSE SYSTEM ONLINE
          </p>

          <!-- シールドアイコン -->
          <div class="text-7xl mb-5 leading-none"
               style="animation:shieldBob 3.5s ease-in-out infinite;">🛡️</div>

          <!-- タイトルロゴ -->
          <div class="text-center mb-2">
            <h1 class="font-black font-mono tracking-[0.2em] leading-[1.1]"
                style="font-size:clamp(2.2rem,9vw,3.8rem);
                       animation:textFlicker 6s infinite;
                       color:#fff;
                       text-shadow:0 0 25px rgba(239,68,68,0.85),0 0 55px rgba(239,68,68,0.45);">
              CYBER
            </h1>
            <h1 class="font-black font-mono tracking-[0.2em] leading-[1.1] text-red-500"
                style="font-size:clamp(2.2rem,9vw,3.8rem);
                       animation:textFlicker 6s infinite 0.2s;
                       text-shadow:0 0 25px rgba(239,68,68,0.85),0 0 55px rgba(239,68,68,0.45);">
              DEFENSE
            </h1>
          </div>

          <p class="text-slate-500 font-mono text-xs tracking-[0.25em] mb-12">
            ハッカーの侵入を阻止せよ
          </p>

          <!-- ミッション選択 -->
          <div class="w-full max-w-xs">
            <div class="flex items-center gap-2 mb-4">
              <p class="text-green-400 font-mono text-[11px] tracking-[0.3em] uppercase">
                &gt;&nbsp;Select Mission
              </p>
              <span class="w-2 h-[14px] bg-green-400 inline-block"
                    style="animation:blink 1s step-end infinite;"></span>
            </div>

            <div class="flex flex-col gap-3">
              ${$e.map((u,l)=>{const $=u.available?Math.max(Q(u.id,1),Q(u.id,2),Q(u.id,3)):0,b=$>0?`<span class="text-yellow-400/80">${$.toLocaleString()}&nbsp;pt</span>`:'<span class="text-slate-700">---</span>';return u.available?`
                  <button
                    data-category="${u.id}"
                    class="w-full text-left p-4 rounded-lg border border-green-900/50
                           bg-slate-900/80 hover:border-green-500 hover:bg-slate-800/90
                           transition-all duration-200 group"
                    style="animation:slideInUp 0.45s ease-out ${l*.12}s both;">
                    <div class="flex items-center gap-3">
                      <div class="flex-shrink-0 w-9 h-9 rounded border border-green-800/60
                                  bg-green-950/50 flex items-center justify-center
                                  group-hover:border-green-500 transition-colors">
                        <span class="text-green-500 font-mono text-xs font-bold">0${l+1}</span>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-white font-mono font-bold text-sm
                                  group-hover:text-green-400 transition-colors">${u.name}</p>
                        <p class="text-slate-500 font-mono text-[11px]">${u.description}</p>
                        <p class="font-mono text-[10px] text-slate-600 mt-1">
                          BEST&nbsp;${b}
                        </p>
                      </div>
                      <span class="flex-shrink-0 text-green-600 group-hover:text-green-400
                                   font-mono text-[10px] tracking-wider transition-colors">
                        READY&nbsp;›
                      </span>
                    </div>
                  </button>
                `:`
                  <div
                    class="w-full p-4 rounded-lg border border-slate-800/50
                           bg-slate-900/30 opacity-40 cursor-not-allowed"
                    style="animation:slideInUp 0.45s ease-out ${l*.12}s both;">
                    <div class="flex items-center gap-3">
                      <div class="flex-shrink-0 w-9 h-9 rounded border border-slate-800
                                  bg-slate-900/50 flex items-center justify-center">
                        <span class="text-slate-600 font-mono text-xs font-bold">0${l+1}</span>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-slate-500 font-mono font-bold text-sm">${u.name}</p>
                        <p class="text-slate-600 font-mono text-[11px]">${u.description}</p>
                      </div>
                      <span class="flex-shrink-0 text-slate-600 font-mono text-[10px] tracking-wider">
                        🔒&nbsp;LOCKED
                      </span>
                    </div>
                  </div>
                `}).join("")}
            </div>
          </div>

        </div>
      </div>
    `,e.querySelector("#btn-back").addEventListener("click",()=>{n(),T("/")}),e.querySelectorAll("[data-category]").forEach(u=>{u.addEventListener("click",()=>{t=$e.find(l=>l.id===u.dataset.category),d()})})}function d(){n();const u={1:{borderIdle:"border-green-900/50",borderActive:"border-green-500",glowColor:"rgba(34,197,94,0.45)",bgIdle:"bg-green-950/15",bgActive:"bg-green-950/40",threat:"LOW",threatCls:"text-green-400"},2:{borderIdle:"border-yellow-900/50",borderActive:"border-yellow-500",glowColor:"rgba(234,179,8,0.45)",bgIdle:"bg-yellow-950/15",bgActive:"bg-yellow-950/40",threat:"MEDIUM",threatCls:"text-yellow-400"},3:{borderIdle:"border-red-900/50",borderActive:"border-red-500",glowColor:"rgba(239,68,68,0.45)",bgIdle:"bg-red-950/15",bgActive:"bg-red-950/40",threat:"HIGH",threatCls:"text-red-400"}};function l(){var $;e.innerHTML=`
        <div class="fixed inset-0 bg-slate-950 flex flex-col overflow-hidden">

          <!-- 背景グリッド -->
          <div class="absolute inset-0 pointer-events-none opacity-[0.035]"
               style="background-image:linear-gradient(rgba(34,197,94,1) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,1) 1px,transparent 1px);background-size:48px 48px;"></div>

          <!-- CRTスキャンライン -->
          <div class="absolute inset-0 pointer-events-none"
               style="background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.07) 3px,rgba(0,0,0,0.07) 4px);"></div>

          <!-- 戻るボタン -->
          <button id="btn-back"
            class="absolute top-5 left-5 z-20 flex items-center gap-1.5
                   text-slate-600 hover:text-slate-300 font-mono text-xs tracking-widest transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                 stroke="currentColor" class="w-3 h-3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/>
            </svg>
            BACK
          </button>

          <!-- メインコンテンツ -->
          <div class="flex-1 flex flex-col items-center justify-center px-6 py-8">

            <!-- パンくず -->
            <p class="text-red-500/60 font-mono text-xs tracking-[0.3em] mb-1 uppercase">
              CYBER DEFENSE
            </p>
            <p class="text-slate-500 font-mono text-[11px] tracking-[0.2em] mb-8">
              MISSION:&nbsp;<span class="text-slate-300">${t.name}</span>
            </p>

            <!-- セクションヘッダー -->
            <div class="flex items-center gap-2 mb-6">
              <p class="text-green-400 font-mono text-[11px] tracking-[0.3em] uppercase">
                &gt;&nbsp;Select Difficulty
              </p>
              <span class="w-2 h-[14px] bg-green-400 inline-block"
                    style="animation:blink 1s step-end infinite;"></span>
            </div>

            <!-- ステージカード（3列） -->
            <div class="w-full max-w-lg flex gap-3 mb-8">
              ${[1,2,3].map(b=>{const i=ae[b],f=u[b],w=r===b,M=Q(t.id,b);return`
                  <button data-stage="${b}"
                    class="flex-1 p-4 rounded-lg border text-left cursor-pointer
                           transition-all duration-200 flex flex-col gap-2.5
                           ${w?`${f.borderActive} ${f.bgActive} -translate-y-1.5`:`${f.borderIdle} ${f.bgIdle} hover:-translate-y-0.5`}"
                    ${w?`style="box-shadow:0 0 22px ${f.glowColor};"`:""}>

                    <!-- 番号 + ラベル -->
                    <div class="flex items-center gap-2">
                      <span class="font-mono text-[10px] text-slate-600">0${b}</span>
                      <span class="font-bold font-mono text-xs ${i.colorClass} tracking-wider leading-none">
                        ${i.label.replace(/★\d\s+/,"").trim()}
                      </span>
                    </div>

                    <!-- シールド数 -->
                    <div class="flex gap-0.5">
                      ${Array.from({length:i.hp},()=>'<span class="text-base leading-none">🛡️</span>').join("")}
                    </div>

                    <!-- 説明 -->
                    <p class="text-[10px] text-slate-500 leading-snug">${i.description}</p>

                    <!-- 最高点 -->
                    <div class="flex items-center justify-between font-mono text-[10px]">
                      <span class="text-slate-600">BEST</span>
                      <span class="${M>0?"text-yellow-400/80":"text-slate-700"}">
                        ${M>0?M.toLocaleString()+"&nbsp;pt":"---"}
                      </span>
                    </div>

                    <!-- ボーナス + THREAT（下部） -->
                    <div class="mt-auto pt-2 border-t ${w?"border-slate-600":"border-slate-800/80"} flex items-center justify-between">
                      <span class="font-mono text-[10px] ${i.colorClass}">BONUS&nbsp;×${i.bonus}</span>
                      <span class="font-mono text-[10px] font-bold ${f.threatCls}">${f.threat}</span>
                    </div>

                  </button>
                `}).join("")}
            </div>

            <!-- スタートボタン or 選択促し -->
            ${r?`
              <div class="flex flex-col items-center gap-3"
                   style="animation:slideInUp 0.3s ease-out both;">
                <button id="start-btn"
                  class="px-14 py-4 font-black font-mono text-base tracking-[0.2em] uppercase
                         rounded-lg border-2 border-green-500 text-green-400
                         bg-green-950/40 hover:bg-green-950/70 active:scale-95
                         transition-all duration-150"
                  style="box-shadow:0 0 20px rgba(34,197,94,0.35);">
                  [ START MISSION ]
                </button>
                <p class="text-slate-600 font-mono text-[10px] tracking-wider">
                  <kbd class="px-1.5 py-0.5 border border-slate-700 rounded text-slate-500 font-mono text-[10px]">SPACE</kbd>
                  &nbsp;でも開始できます
                </p>
              </div>
            `:`
              <p class="text-slate-600 font-mono text-xs tracking-[0.2em] uppercase"
                 style="animation:glowPulse 2s ease-in-out infinite;">
                &gt;&nbsp;Choose a difficulty level
              </p>
            `}

          </div>
        </div>
      `,e.querySelector("#btn-back").addEventListener("click",()=>{n(),o()}),e.querySelectorAll("[data-stage]").forEach(b=>{b.addEventListener("click",()=>{r=Number(b.dataset.stage),l()})}),r&&(($=e.querySelector("#start-btn"))==null||$.addEventListener("click",x),s||(s=b=>{b.code==="Space"&&(b.preventDefault(),x())},document.addEventListener("keydown",s)))}l()}function x(){n();const u=ae[r];function l($){const b=$==="GO!";e.innerHTML=`
        <div class="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center gap-6 select-none">
          <p class="text-sm text-slate-400 font-mono tracking-widest uppercase">
            ${t.name} — ${u.label}
          </p>
          <div class="${b?"text-green-400 text-7xl":"text-white text-[9rem]"} font-bold font-mono"
               style="animation: countdownPop 0.5s ease-out forwards;">
            ${$}
          </div>
          ${b?'<p class="text-slate-400 text-sm">侵入を阻止せよ！</p>':""}
        </div>
      `}l(3),setTimeout(()=>l(2),900),setTimeout(()=>l(1),1800),setTimeout(()=>l("GO!"),2700),setTimeout(()=>p(),3300)}function p(){var me,pe;n();const u=ae[r],l={hp:u.hp,walls:Bt(u.hp),score:0,hackers:[],nextId:0,problem:we(t.id,r,0),problemStartTime:Date.now(),elapsed:0,gameOver:!1};e.innerHTML=`
      <div class="flex flex-col bg-slate-950" style="height:100svh;height:100vh;">

        <!-- ゲームヘッダー -->
        <header class="flex-shrink-0 h-11 flex items-center justify-between px-4
                       bg-slate-900 border-b border-slate-700/80">
          <button id="btn-back" aria-label="戻る"
            class="text-slate-500 hover:text-white transition-colors p-1 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                 stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/>
            </svg>
          </button>

          <div class="flex items-center gap-3">
            <span class="font-bold ${u.colorClass} text-xs font-mono">${u.label}</span>
            <span id="wave-display" class="text-slate-500 text-xs font-mono">WAVE 1</span>
            <span class="text-slate-400 text-xs">
              SCORE:&nbsp;<strong id="score-display" class="text-yellow-400 font-mono">0</strong>
            </span>
          </div>

          <!-- ファイアウォール残数 -->
          <div id="fw-header" class="text-xs font-mono text-slate-400"></div>
        </header>

        <!-- ゲームエリア（フルワイド・全高） -->
        <div id="game-area" class="flex-1 relative overflow-hidden bg-slate-950">
          <div id="flash-overlay" class="absolute inset-0 pointer-events-none"
               style="opacity:0;transition:opacity 0.15s;z-index:20;"></div>
          <!-- サーバー・ファイアウォール・ハッカーをすべてここに描画 -->
          <div id="game-canvas" class="absolute inset-0"></div>
        </div>

        <!-- 問題エリア（下半分） -->
        <div class="flex-1 bg-slate-900 border-t border-slate-700/80 px-6 flex flex-col justify-center">
          <div class="max-w-xl mx-auto w-full">
            <div class="flex items-start gap-3 mb-3">
              <span class="flex-shrink-0 text-sm font-bold bg-red-950 text-red-400
                           px-3 py-1 rounded-full border border-red-800/50 mt-0.5">問題</span>
              <p id="problem-text" class="text-xl text-slate-100 leading-relaxed font-medium"></p>
            </div>
            <p id="problem-unit" class="text-base text-slate-500 mb-5"></p>
            <div class="flex gap-3">
              <input id="answer-input" type="text" inputmode="numeric"
                placeholder="答えを入力…" autocomplete="off"
                class="flex-1 px-4 py-4 rounded-2xl bg-slate-800 text-white border border-slate-600
                       text-xl focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-slate-600" />
              <button id="submit-btn"
                class="px-8 py-4 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xl font-bold
                       rounded-2xl transition-all focus:outline-none focus:ring-2 focus:ring-red-400">
                撃退
              </button>
            </div>
            <div class="flex items-center justify-between mt-3">
              <div id="feedback-text" class="text-base font-bold min-h-[1.5rem]"></div>
              <p class="text-xs text-slate-600 flex-shrink-0 ml-4">
                <kbd class="px-1.5 py-0.5 bg-slate-700 rounded text-slate-400 font-mono text-xs">Enter</kbd>
                でも送信できます
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- ゲームオーバーオーバーレイ -->
      <div id="gameover-overlay"
           class="hidden fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm">
        <div class="bg-slate-800 border border-slate-600 rounded-2xl shadow-2xl p-8 mx-4 w-full max-w-sm text-center">
          <p class="text-5xl mb-4">💀</p>
          <h2 class="text-2xl font-bold text-white mb-1">サーバー陥落</h2>
          <p class="text-sm text-slate-400 mb-4">${t.name} — ${u.label}</p>
          <div class="bg-slate-700/50 rounded-xl py-4 mb-6 relative">
            <div id="new-record-badge"
                 class="hidden absolute -top-3 left-1/2 -translate-x-1/2
                        bg-yellow-400 text-slate-900 font-black font-mono text-xs
                        px-3 py-0.5 rounded-full tracking-wider whitespace-nowrap">
              ★ NEW RECORD !
            </div>
            <p class="text-xs text-slate-400 mb-1">最終スコア</p>
            <p id="final-score" class="text-4xl font-bold font-mono text-yellow-400">0</p>
            <p id="bonus-label" class="text-xs text-slate-500 mt-0.5">pt</p>
          </div>
          <div class="flex flex-col gap-2">
            <button id="retry-btn"
              class="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors">
              もう一度
            </button>
            <button id="back-stage-btn"
              class="w-full py-3 border border-slate-600 text-slate-300 text-sm rounded-xl
                     hover:bg-slate-700 transition-colors">
              ステージ選択へ
            </button>
          </div>
        </div>
      </div>
    `;function $(){return Math.min(20,u.baseSpeed+Math.floor(l.elapsed/2e4)*2)}function b(){return Math.max(u.spawnMin,u.spawnStart-Math.floor(l.elapsed/1e4)*400)}function i(){l.gameOver||(l.hackers.push({id:l.nextId++,x:97,boosted:!1,boostRemaining:0,boostStrength:1}),a.spawn=setTimeout(i,b()))}function f(){if(!e.querySelector("#game-canvas")){clearInterval(a.tick),clearTimeout(a.spawn);return}if(l.gameOver)return;l.elapsed+=100;const m=$();for(const g of l.hackers){const v=g.boosted?m*g.boostStrength:m;g.x-=v*.1,g.boosted&&(g.boostRemaining-=100,g.boostRemaining<=0&&(g.boosted=!1))}const y=l.walls.filter(g=>g.alive).sort((g,v)=>v.x-g.x);if(y.length>0){const g=y[0];l.hackers.filter(L=>L.x<=g.x).length>0&&(g.alive=!1,l.hp--,l.hackers=l.hackers.filter(L=>L.x>g.x),re("red"),De(),Re(g.x),te(),l.hp===0&&ze("⚠️  FIREWALL DOWN!","#f87171"))}else if(l.hackers.some(v=>v.x<=5)){l.hackers=l.hackers.filter(v=>v.x>5),l.gameOver=!0,clearInterval(a.tick),clearTimeout(a.spawn),M(),Fe();return}M(),V()}function w(m){if(l.gameOver||!m.trim())return;const y=m.trim();let g;switch(l.problem.answerType){case"number":g=Number(y.replace(/,/g,""))===l.problem.answer;break;case"binary":g=y.replace(/^0+/,"")===String(l.problem.answer).replace(/^0+/,"")||y===String(l.problem.answer);break;case"hex":g=y.toUpperCase()===String(l.problem.answer).toUpperCase();break;default:g=y===String(l.problem.answer)}if(g){const L=l.hackers.length>0?l.hackers.reduce((B,S)=>B.x<S.x?B:S):null,j=(Date.now()-l.problemStartTime)/1e3,A=Math.max(0,Math.round(l.problem.bits*(1+(10-j)/10)*100));L&&(Ne(L.x,A),l.hackers=l.hackers.filter(B=>B.id!==L.id)),l.score+=A,l.problem=we(t.id,r,l.elapsed),l.problemStartTime=Date.now(),re("green"),P(),_(),W(`✅  BLOCKED!  +${A}pt`,!0)}else{if(r>=2&&l.hackers.length>0){const j=l.hackers.reduce((A,B)=>A.x<B.x?A:B);j.boosted=!0,j.boostRemaining=3e3,j.boostStrength=u.penaltyBoost}re("red");const L=r>=2?"  →  SPEED UP!":"";W(`❌  不正解${L}`,!1)}const v=e.querySelector("#answer-input");v&&(v.value="",v.focus())}function M(){const m=e.querySelector("#game-canvas");if(!m)return;const y=l.hackers.length>0?l.hackers.reduce((S,H)=>S.x<H.x?S:H).id:-1,g=l.walls.filter(S=>S.alive),v=g.length===1,L=`
        <div class="absolute top-1/2 flex flex-col items-center gap-1 select-none"
             style="left:2%;transform:translateY(-50%);">
          <span class="text-4xl">🖥️</span>
          <span class="text-[9px] text-slate-500 font-mono">SERVER</span>
        </div>
      `,j=`
        <div class="absolute top-1/2 flex flex-col items-center gap-1 select-none"
             style="right:1%;transform:translateY(-50%);">
          <span class="text-[9px] text-red-500 font-mono animate-pulse">HACKER</span>
          <span class="text-4xl">🧑‍💻</span>
        </div>
      `,A=g.map(S=>{const H=v&&g[0].id===S.id;return`
          <div class="absolute top-1/2 flex flex-col items-center select-none"
               style="left:${S.x}%;transform:translate(-50%,-50%);">
            <span class="text-6xl leading-none ${H?"animate-pulse":""}"
                  style="${H?"filter:drop-shadow(0 0 12px rgba(239,68,68,0.9))":"filter:drop-shadow(0 0 6px rgba(96,165,250,0.5))"}">🛡️</span>
          </div>
        `}).join(""),B=l.hackers.map(S=>{const H=S.id===y;return`
          <div class="absolute flex flex-col items-center gap-0.5 select-none
                      ${S.boosted?"hk-hacker-boosted":""}"
               style="left:${S.x}%;top:50%;transform:translate(-50%,-50%);">
            ${H?'<span class="text-[11px] text-orange-400 font-bold animate-pulse leading-none tracking-tight">🎯 TARGET</span>':'<span style="height:14px;display:block;"></span>'}
            <span class="hk-hacker-icon text-3xl leading-none">${S.boosted?"💨🦠":"🦠"}</span>
            ${S.boosted?'<span class="text-[10px] text-red-400 font-bold leading-none">FAST!</span>':""}
          </div>
        `}).join("");m.innerHTML=L+A+B+j}function te(){const m=e.querySelector("#fw-header");if(!m)return;const y=l.walls.filter(g=>g.alive).length;y>0?m.innerHTML=`🛡️&nbsp;×&nbsp;<span class="font-bold text-slate-300">${y}</span>`:m.innerHTML='<span class="text-red-400 font-bold animate-pulse">⚠️ 露出中</span>'}function P(){const m=e.querySelector("#score-display");m&&(m.textContent=l.score)}function V(){const m=e.querySelector("#wave-display");m&&(m.textContent=`WAVE ${Math.floor(l.elapsed/1e4)+1}`)}function _(){const m=e.querySelector("#problem-text"),y=e.querySelector("#problem-unit"),g=e.querySelector("#answer-input");if(m&&(m.textContent=l.problem.question),y){const v=l.problem.unit;y.textContent=v?l.problem.answerType==="number"?`単位: ${v}`:v:""}g&&(g.inputMode=l.problem.answerType==="number"?"numeric":"text",g.placeholder={number:"数値を入力…",binary:"2進数で入力（例: 1010）",hex:"16進数で入力（例: 2F）"}[l.problem.answerType]??"答えを入力…")}function W(m,y){const g=e.querySelector("#feedback-text");g&&(g.textContent=m,g.className=`mt-1.5 text-xs font-bold min-h-[1rem] ${y?"text-green-400":"text-red-400"}`,setTimeout(()=>{g&&(g.textContent="")},1500))}function re(m){const y=e.querySelector("#flash-overlay");y&&(y.style.background=m==="green"?"rgba(0,200,80,0.20)":"rgba(200,0,0,0.28)",y.style.opacity="1",setTimeout(()=>{y&&(y.style.opacity="0")},200))}function De(){const m=e.querySelector("#game-area");m&&(m.classList.remove("hk-game-shake"),m.offsetWidth,m.classList.add("hk-game-shake"),setTimeout(()=>m.classList.remove("hk-game-shake"),400))}function Re(m){const y=e.querySelector("#game-canvas");if(!y)return;const g=document.createElement("div");g.textContent="💥",g.style.cssText=["position:absolute",`left:${m}%`,"top:45%","font-size:2.5rem","pointer-events:none","z-index:25","animation:floatUp 0.9s ease-out forwards","transform:translateX(-50%)"].join(";"),y.appendChild(g),setTimeout(()=>g.remove(),900)}function ze(m,y){const g=e.querySelector("#game-canvas");if(!g)return;const v=document.createElement("div");v.textContent=m,v.style.cssText=["position:absolute","left:50%","top:30%","transform:translateX(-50%)",`color:${y}`,"font-weight:800","font-size:1.2rem","pointer-events:none","z-index:26","white-space:nowrap","text-shadow:0 2px 8px rgba(0,0,0,0.9)","animation:floatUp 1.3s ease-out forwards"].join(";"),g.appendChild(v),setTimeout(()=>v.remove(),1300)}function Ne(m,y){const g=e.querySelector("#game-canvas");if(!g)return;const v=document.createElement("div");v.className="hk-score-popup",v.textContent=`+${y}pt`,v.style.left=`${Math.min(88,Math.max(6,m))}%`,v.style.top="28%",g.appendChild(v),setTimeout(()=>v.remove(),1e3)}function Fe(){const m=e.querySelector("#gameover-overlay"),y=e.querySelector("#final-score"),g=e.querySelector("#bonus-label");m&&m.classList.remove("hidden");const v=Math.round(l.score*u.bonus);if(y&&(y.textContent=v),g&&(g.textContent=u.bonus>1?`pt（ベース ${l.score} pt × ${u.bonus} ボーナス）`:"pt"),Tt(t.id,r,v)){const j=e.querySelector("#new-record-badge");j&&j.classList.remove("hidden")}}e.querySelector("#btn-back").addEventListener("click",()=>{n(),d()});const U=e.querySelector("#answer-input");U.addEventListener("keydown",m=>{m.key==="Enter"&&w(U.value)}),e.querySelector("#submit-btn").addEventListener("click",()=>w(U.value)),(me=e.querySelector("#retry-btn"))==null||me.addEventListener("click",()=>{n(),x()}),(pe=e.querySelector("#back-stage-btn"))==null||pe.addEventListener("click",()=>{n(),d()}),_(),te(),M(),a.spawn=setTimeout(i,b()),a.tick=setInterval(f,100),U.focus()}o()}const ne=6e3,N=3e4;function Me(){return Math.random()<.5?ce(1):xe(1)}function ie(e){const t={timeLeft:N,score:0,problem:Me(),feedback:null,gameOver:!1};let r=null;function a(){if(!e.querySelector("#timer-bar")){clearInterval(r);return}if(!t.gameOver){if(t.timeLeft-=100,t.timeLeft<=0){t.timeLeft=0,t.gameOver=!0,clearInterval(r),o(),l();return}o()}}function s(b){if(t.gameOver||!b.trim())return;Number(b.trim())===t.problem.answer?(t.score++,t.timeLeft=Math.min(N,t.timeLeft+ne),t.problem=Me(),n(`+${ne/1e3}秒！`,!0)):n(`❌ 答え: ${t.problem.answer}`,!1),d(),x(),u()}function n(b,i){t.feedback={text:b,ok:i},p(),setTimeout(()=>{t.feedback=null,p()},1e3)}function o(){const b=e.querySelector("#timer-bar"),i=e.querySelector("#timer-num");if(!b||!i)return;const f=t.timeLeft/N*100;b.style.width=f+"%",b.className=`h-full rounded-full transition-all duration-100 ${f>50?"bg-blue-500":f>25?"bg-yellow-500":"bg-red-500"}`,i.textContent=(t.timeLeft/1e3).toFixed(1)+"秒",i.className=`text-4xl font-bold font-mono tabular-nums ${f>50?"text-blue-600 dark:text-blue-400":f>25?"text-yellow-600 dark:text-yellow-400":"text-red-600 dark:text-red-400"}`}function d(){const b=e.querySelector("#problem-text"),i=e.querySelector("#problem-unit");b&&(b.textContent=t.problem.question),i&&(i.textContent=`単位: ${t.problem.unit}`)}function x(){const b=e.querySelector("#score-display");b&&(b.textContent=t.score)}function p(){var i,f;const b=e.querySelector("#feedback-text");b&&(b.textContent=((i=t.feedback)==null?void 0:i.text)??"",b.className=`text-sm font-bold h-5 ${(f=t.feedback)!=null&&f.ok?"text-green-500 dark:text-green-400":"text-red-500 dark:text-red-400"}`)}function u(){const b=e.querySelector("#answer-input");b&&(b.value="",b.focus())}function l(){const b=e.querySelector("#gameover-overlay"),i=e.querySelector("#final-score"),f=e.querySelector("#final-time");b&&b.classList.remove("hidden"),i&&(i.textContent=t.score),f&&(f.textContent=N/1e3+"秒スタート")}function $(){const b=I();e.innerHTML=`
      <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">

        <header class="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-100 dark:border-gray-800">
          <div class="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <button id="btn-back"
                class="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                     stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </button>
              <h1 class="font-bold text-gray-800 dark:text-gray-100 text-base">⏱️ タイマーサバイバル</h1>
            </div>
            <button id="dark-toggle"
              class="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   stroke-width="1.5" stroke="currentColor" class="w-5 h-5 ${b?"hidden":""}">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   stroke-width="1.5" stroke="currentColor" class="w-5 h-5 ${b?"":"hidden"}">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
              </svg>
            </button>
          </div>
        </header>

        <main class="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-5">

          <!-- タイマー表示 -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 text-center">
            <p class="text-xs text-gray-400 dark:text-gray-500 mb-1">残り時間</p>
            <p id="timer-num" class="text-4xl font-bold font-mono tabular-nums text-blue-600 dark:text-blue-400 mb-3">
              ${(N/1e3).toFixed(1)}秒
            </p>
            <div class="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div id="timer-bar" class="h-full rounded-full bg-blue-500 transition-all duration-100" style="width: 100%"></div>
            </div>
            <p class="text-xs text-gray-400 dark:text-gray-500 mt-2">正解で <strong class="text-blue-500">+${ne/1e3}秒</strong> 回復</p>
          </div>

          <!-- スコア -->
          <div class="flex justify-center">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 px-6 py-3 text-center">
              <p class="text-xs text-gray-400 dark:text-gray-500">正解数</p>
              <p class="text-3xl font-bold font-mono text-gray-800 dark:text-gray-100">
                <span id="score-display">0</span>
              </p>
            </div>
          </div>

          <!-- 問題エリア -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
            <div class="flex items-start gap-2 mb-3">
              <span class="text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full flex-shrink-0">問題</span>
              <p id="problem-text" class="text-sm font-medium text-gray-800 dark:text-gray-100 leading-relaxed"></p>
            </div>
            <p id="problem-unit" class="text-xs text-gray-400 dark:text-gray-500 mb-3"></p>

            <div class="flex gap-2">
              <input
                id="answer-input"
                type="number"
                inputmode="numeric"
                placeholder="答えを入力..."
                autocomplete="off"
                class="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600
                       bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
                       text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button id="submit-btn"
                class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-bold
                       rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-400">
                回答
              </button>
            </div>

            <div id="feedback-text" class="mt-2 text-sm font-bold h-5"></div>
          </div>
        </main>

        <!-- ゲームオーバーオーバーレイ -->
        <div id="gameover-overlay" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mx-4 w-full max-w-sm text-center">
            <p class="text-5xl mb-3">⏰</p>
            <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">タイムアップ！</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-1" id="final-time"></p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
              正解数: <strong class="text-gray-800 dark:text-gray-100 text-2xl" id="final-score">0</strong> 問
            </p>
            <div class="flex flex-col gap-2">
              <button id="retry-btn"
                class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
                もう一度
              </button>
              <button id="back-to-select"
                class="w-full py-3 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
                ゲーム選択へ
              </button>
            </div>
          </div>
        </div>

      </div>
    `,e.querySelector("#btn-back").addEventListener("click",()=>{clearInterval(r),T("/game")}),e.querySelector("#dark-toggle").addEventListener("click",()=>{clearInterval(r),Z(),ie(e)});const i=e.querySelector("#answer-input");i.addEventListener("keydown",f=>{f.key==="Enter"&&s(i.value)}),e.querySelector("#submit-btn").addEventListener("click",()=>s(i.value)),e.querySelector("#retry-btn").addEventListener("click",()=>{clearInterval(r),ie(e)}),e.querySelector("#back-to-select").addEventListener("click",()=>{clearInterval(r),T("/game")}),d(),r=setInterval(a,100),i.focus()}$()}const F=5,se=1,oe=3,X=18,Y=20;function Ce(){return Math.random()<.5?ce(1):xe(1)}function de(e){const t={blocks:F,maxBlocks:F,problem:Ce(),feedback:null,shaking:!1,gameOver:!1,cleared:!1,totalCorrect:0,totalWrong:0};function r(i){if(t.gameOver||t.cleared||!i.trim())return;if(Number(i.trim())===t.problem.answer){if(t.blocks+=se,t.totalCorrect++,t.blocks>t.maxBlocks&&(t.maxBlocks=t.blocks),t.problem=Ce(),a(`+${se}段 積み上がった！`,!0),t.blocks>=Y){t.cleared=!0,o(),$();return}}else if(t.blocks=Math.max(0,t.blocks-oe),t.totalWrong++,s(),a(`-${oe}段 崩れた…（答え: ${t.problem.answer}）`,!1),t.blocks<=0){t.blocks=0,t.gameOver=!0,o(),$();return}o(),l()}function a(i,f){t.feedback={text:i,ok:f},u(),setTimeout(()=>{t.feedback=null,u()},1200)}function s(){t.shaking=!0;const i=e.querySelector("#tower-container");i&&(i.classList.add("animate-shake"),setTimeout(()=>{i.classList.remove("animate-shake"),t.shaking=!1},500))}function n(){const i=Math.min(t.blocks,X),f=t.blocks>X,w=Array.from({length:i},(te,P)=>{const V=i-1-P,_=Math.max(60,100-V*1.5),W=120-V/X*60;return`
        <div class="rounded transition-all duration-200 mx-auto"
             style="width: ${_}%; height: 14px; background: hsl(${W}, 65%, 50%); margin-bottom: 2px; opacity: ${.7+P/i*.3}">
        </div>
      `}).join("");return(f?`<p class="text-xs text-gray-400 dark:text-gray-500 mb-1">…上に ${t.blocks-X} 段</p>`:"")+w}function o(){d(),x(),p(),u()}function d(){const i=e.querySelector("#tower-blocks"),f=e.querySelector("#block-count"),w=e.querySelector("#goal-bar");if(i&&(i.innerHTML=t.blocks===0?'<p class="text-gray-400 dark:text-gray-500 text-sm">タワーが崩壊した…</p>':n(),f&&(f.textContent=t.blocks),w)){const M=Math.min(100,t.blocks/Y*100);w.style.width=M+"%"}}function x(){const i=e.querySelector("#max-blocks");i&&(i.textContent=t.maxBlocks)}function p(){const i=e.querySelector("#problem-text"),f=e.querySelector("#problem-unit");i&&(i.textContent=t.problem.question),f&&(f.textContent=`単位: ${t.problem.unit}`)}function u(){var f,w;const i=e.querySelector("#feedback-text");i&&(i.textContent=((f=t.feedback)==null?void 0:f.text)??"",i.className=`text-sm font-bold h-5 ${(w=t.feedback)!=null&&w.ok?"text-green-500 dark:text-green-400":"text-red-500 dark:text-red-400"}`)}function l(){const i=e.querySelector("#answer-input");i&&(i.value="",i.focus())}function $(){const i=e.querySelector("#result-overlay");if(!i)return;i.classList.remove("hidden");const f=i.querySelector("#result-emoji"),w=i.querySelector("#result-title"),M=i.querySelector("#result-msg");f&&(f.textContent=t.cleared?"🎉":"💥"),w&&(w.textContent=t.cleared?"タワー完成！":"タワー崩壊…"),M&&(M.innerHTML=`
      最高段数: <strong class="text-gray-800 dark:text-gray-100 text-xl">${t.maxBlocks}</strong> 段<br>
      <span class="text-xs">正解 ${t.totalCorrect} / 不正解 ${t.totalWrong}</span>
    `)}function b(){const i=I();e.innerHTML=`
      <style>
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-6px); }
          40%       { transform: translateX(6px); }
          60%       { transform: translateX(-4px); }
          80%       { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.45s ease-in-out; }
      </style>

      <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">

        <header class="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-100 dark:border-gray-800">
          <div class="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <button id="btn-back"
                class="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                     stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </button>
              <h1 class="font-bold text-gray-800 dark:text-gray-100 text-base">🗼 ビットタワー</h1>
            </div>
            <button id="dark-toggle"
              class="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   stroke-width="1.5" stroke="currentColor" class="w-5 h-5 ${i?"hidden":""}">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   stroke-width="1.5" stroke="currentColor" class="w-5 h-5 ${i?"":"hidden"}">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
              </svg>
            </button>
          </div>
        </header>

        <main class="max-w-2xl mx-auto px-4 py-4 flex flex-col gap-4">

          <!-- ステータス -->
          <div class="flex gap-3">
            <div class="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 text-center">
              <p class="text-xs text-gray-400 dark:text-gray-500">現在</p>
              <p class="text-2xl font-bold font-mono text-gray-800 dark:text-gray-100">
                <span id="block-count">${F}</span><span class="text-sm text-gray-400"> 段</span>
              </p>
            </div>
            <div class="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 text-center">
              <p class="text-xs text-gray-400 dark:text-gray-500">最高</p>
              <p class="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                <span id="max-blocks">${F}</span><span class="text-sm text-gray-400"> 段</span>
              </p>
            </div>
          </div>

          <!-- ゴールプログレスバー -->
          <div>
            <div class="flex justify-between text-xs text-gray-400 dark:text-gray-500 mb-1">
              <span>進捗</span>
              <span>ゴール: ${Y}段</span>
            </div>
            <div class="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div id="goal-bar" class="h-full bg-emerald-500 rounded-full transition-all duration-300"
                   style="width: ${F/Y*100}%"></div>
            </div>
          </div>

          <!-- タワー表示エリア -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4"
               style="min-height: 200px;">
            <div id="tower-container" class="flex flex-col-reverse justify-start" style="min-height: 180px;">
              <!-- 地面 -->
              <div class="h-2 bg-gray-300 dark:bg-gray-600 rounded-full mt-2"></div>
              <!-- ブロック群（動的更新） -->
              <div id="tower-blocks" class="flex flex-col-reverse gap-0.5">
                ${n()}
              </div>
            </div>
          </div>

          <!-- 問題エリア -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
            <div class="flex items-start gap-2 mb-1">
              <span class="text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full flex-shrink-0">問題</span>
              <p id="problem-text" class="text-sm font-medium text-gray-800 dark:text-gray-100 leading-relaxed"></p>
            </div>
            <p id="problem-unit" class="text-xs text-gray-400 dark:text-gray-500 mb-3"></p>

            <div class="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-3">
              <span class="text-green-500 font-bold">✓ 正解 +${se}段</span>
              <span class="mx-1">／</span>
              <span class="text-red-400 font-bold">✗ 不正解 -${oe}段</span>
            </div>

            <div class="flex gap-2">
              <input
                id="answer-input"
                type="number"
                inputmode="numeric"
                placeholder="答えを入力..."
                autocomplete="off"
                class="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600
                       bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
                       text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <button id="submit-btn"
                class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-bold
                       rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400">
                積む
              </button>
            </div>

            <div id="feedback-text" class="mt-2 text-sm font-bold h-5"></div>
          </div>
        </main>

        <!-- リザルトオーバーレイ -->
        <div id="result-overlay" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mx-4 w-full max-w-sm text-center">
            <p id="result-emoji" class="text-5xl mb-3">🎉</p>
            <h2 id="result-title" class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2"></h2>
            <p id="result-msg" class="text-sm text-gray-500 dark:text-gray-400 mb-6"></p>
            <div class="flex flex-col gap-2">
              <button id="retry-btn"
                class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors">
                もう一度
              </button>
              <button id="back-to-select"
                class="w-full py-3 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
                ゲーム選択へ
              </button>
            </div>
          </div>
        </div>

      </div>
    `,e.querySelector("#btn-back").addEventListener("click",()=>T("/game")),e.querySelector("#dark-toggle").addEventListener("click",()=>{Z(),de(e)});const f=e.querySelector("#answer-input");f.addEventListener("keydown",w=>{w.key==="Enter"&&r(f.value)}),e.querySelector("#submit-btn").addEventListener("click",()=>r(f.value)),e.querySelector("#retry-btn").addEventListener("click",()=>de(e)),e.querySelector("#back-to-select").addEventListener("click",()=>T("/game")),p(),f.focus()}b()}I()&&document.documentElement.classList.add("dark");const R=document.getElementById("app");D("/",()=>le(R));D("/quiz/:id",({id:e})=>ht(R,e));D("/binary",()=>Lt(R));D("/game/hacker",()=>At(R));D("/game/survivor",()=>ie(R));D("/game/jenga",()=>de(R));Ze();
