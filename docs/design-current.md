# 現状設計ドキュメント

> 作成日: 2026-05-30  
> ブランチ: feature/binary-experience-page  
> このファイルは現状のアーキテクチャの記録です。変更は行わず、参照専用として扱ってください。

---

## プロジェクト概要

**digits** — 情報処理教育向けのデジタル計算トレーニングSPA。  
生徒が進数変換・データ量計算などを繰り返し練習するためのWebアプリケーション。

---

## 技術スタック

| 項目 | 内容 |
|------|------|
| バンドラー | Vite 6.x |
| UI | バニラJS（フレームワーク不使用）|
| スタイリング | Tailwind CSS 3.x |
| ルーティング | ハッシュベース自作SPA |
| データ永続化 | localStorage |
| ホスティング | Apache (htdocs配下) |
| ビルド成果物 | `dist/` |

---

## ディレクトリ構成

```
digits/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── dist/                    # ビルド成果物（デプロイ対象）
└── src/
    ├── main.js              # エントリーポイント・ルート登録
    ├── router.js            # ハッシュベースSPAルーター
    ├── style.css            # グローバルCSS
    ├── pages/
    │   ├── TopPage.js       # トップページ
    │   ├── QuizPage.js      # クイズページ
    │   └── BinaryPage.js    # デジタル体験ページ
    └── lib/
        ├── categories.js    # カテゴリ定義・回答バリデーション
        ├── questions.js     # 問題ランダム生成関数群
        └── state.js         # スコア管理・セッション管理・ダークモード
```

---

## ルーティング

ハッシュベース（`#/path`）で動作する自作ルーター。

| URL | ページ | 説明 |
|-----|--------|------|
| `#/` | TopPage | カテゴリ選択・累積スコア表示 |
| `#/quiz/:id` | QuizPage | カテゴリ別クイズ（`id` = カテゴリID） |
| `#/binary` | BinaryPage | デジタルの仕組み体験（インタラクティブ） |

ルーターの仕組み:
- `addRoute(pattern, handler)` でルート登録
- `navigate(path)` で `window.location.hash` を書き換えて遷移
- `hashchange` イベントで `dispatch()` が走り、マッチしたハンドラーを呼び出す

---

## ページ設計

### TopPage（`#/`）

- カテゴリカード一覧を表示（5カテゴリ）
- 各カードに累積スコアとプログレスバーを表示
- ダークモードトグル
- スコアリセットモーダル（カテゴリ単位 or 全リセット）
- "デジタルの仕組み体験" バナーで BinaryPage へ誘導

### QuizPage（`#/quiz/:id`）

- カテゴリIDに対応した問題をランダム生成
- 難易度★1〜★3 を切り替え可能
- テキスト入力で回答 → 即座に正誤フィードバック
- ヒント表示機能
- セッションスコア（正解数・連続正解・経過時間）をリアルタイム表示
- 回答後に次の問題を自動生成

### BinaryPage（`#/binary`）

インタラクティブな体験型ページ。計算練習ではなく概念理解が目的。

- モード切り替え：電球 / コイン / カードの3種
- セクション①：1ビット（大きなビジュアル）
- セクション②：4ビット（0〜15の表現）
- セクション③：8ビット = 1バイト（ASCII変換付き）
- セクション④：チャレンジ（指定した数をビットで表現する）

---

## データ設計

### スコア管理（localStorage）

キー: `digital_calc_score`

```json
{
  "amount": {
    "1": {
      "inf-bit": { "correct": 5, "incorrect": 2 },
      "bit-inf": { "correct": 3, "incorrect": 1 }
    },
    "2": { ... },
    "3": { ... }
  },
  "conversion": { ... }
}
```

構造: `カテゴリID > 難易度(1-3) > 問題タイプ > { correct, incorrect }`

主な関数:
- `updateQuestionScore(pageName, difficulty, questionType, isCorrect)` — 回答記録
- `resetScore(pageName?, difficulty?)` — リセット
- `getCategoryStats(pageName)` — トップページ表示用集計

### セッション管理（in-memory）

ページ遷移で消える一時データ。QuizPage のセッション統計に使用。

```js
{
  total, correct, streak, maxStreak, startTime,
  byDifficulty: { 1: { correct, total }, 2: ..., 3: ... }
}
```

### ダークモード（localStorage）

キー: `darkMode`（`"true"` / `"false"`）

---

## カテゴリ・問題タイプ一覧

| カテゴリID | カテゴリ名 | 問題タイプ | 回答形式 |
|-----------|-----------|-----------|---------|
| `amount` | 情報量計算 | `inf-bit`, `bit-inf` | `number` |
| `conversion` | 進数変換 | `dec-to-bin`, `bin-to-dec`, `bin-to-hex`, `hex-to-bin` | `binary` / `number` / `hex` |
| `calc` | 2進数の計算 | `add`, `sub`, `shift-left`, `shift-right` | `binary` |
| `data_amount` | データ量の計算 | `img-amount`, `audio-amount`, `video-amount` | `number` |
| `compression` | 圧縮の計算 | `compression-ratio`, `compression-compressed`, `compression-original`, `run-length`, `huffman` | `number` / `run-length` |

### 回答バリデーション方式

| `answerType` | バリデーション |
|-------------|-------------|
| `binary` | 先頭ゼロを除いて文字列比較 |
| `hex` | 大文字小文字を正規化して比較 |
| `number` | 整数は厳密一致、小数は ±0.05 許容 |
| `run-length` | 複数スペースを正規化して文字列比較 |
| その他 | 文字列の完全一致 |

---

## 既知の設計上の制約

- **サーバーレス**: ランキングや学習履歴の共有は不可（すべてローカル）
- **フレームワークなし**: コンポーネントは文字列HTMLテンプレートで構築。状態変化のたびに `innerHTML` を全書き換えして再描画
- **問題生成はすべてランダム**: 出題履歴の管理・同じ問題の出題制御なし
