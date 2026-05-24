# デジタル計算トレーニング

情報Iを受ける生徒向けの、デジタル計算練習サイトです。  
Vite + TailwindCSS で構築した SPA で、GitHub Actions により GitHub Pages へ自動デプロイされます。

## 機能

| カテゴリ | 内容 |
|---|---|
| 情報量計算 | ビット数 ↔ パターン数の変換 |
| 進数変換 | 2進数・10進数・16進数の相互変換 |
| 2進数の計算 | 足し算・引き算・シフト演算 |
| データ量の計算 | 画像・音声・動画データ量 |
| 圧縮の計算 | 圧縮率・ランレングス・ハフマン符号 |

各カテゴリに難易度 ★1〜★3 があります。

## 開発

```bash
npm install          # 依存関係インストール
npm run dev          # 開発サーバー起動（http://localhost:5173/digits/）
npm run build        # プロダクションビルド（dist/ へ出力）
npm run preview      # ビルド結果のプレビュー
```

## デプロイ

`main` ブランチへ push すると GitHub Actions が自動で `npm run build` を実行し、  
`gh-pages` ブランチへデプロイします。

## 技術スタック

- **Vite** — ビルドツール・開発サーバー
- **TailwindCSS v3** — スタイリング
- **Vanilla JS (ES Modules)** — フレームワークなし
- **GitHub Pages** — ホスティング
- **GitHub Actions** — CI/CD