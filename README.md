# 浜名湖うなぎ

静岡県・浜名湖のうなぎを紹介する静的サイトです。GitHub Pages で公開しています。

- **公開 URL**: https://katzkawai.org/kklab-ds-1017/ （GitHub Pages の `katzkawai.github.io/kklab-ds-1017/` はこちらへリダイレクトされます）
- **リポジトリ**: `kklab-ds-1017`（ローカル・リモート共通）

## 内容

- 汽水湖・浜名湖の成り立ちと、うなぎ養殖の歴史
- 浜名湖うなぎの美味しさを支える四つの要素
- 蒲焼き・白焼き・うな重など、いただき方の紹介
- 産卵から食卓までの「うなぎの一生」
- 浜松駅周辺・舘山寺温泉・弁天島・新居／湖西の訪ね方とアクセス
- 資源保全とこれからのうなぎ
- よくある質問（アコーディオン）

## 構成

```
.
├── index.html            # 全ページ（シングルページ構成）
├── assets/
│   ├── css/style.css     # デザイン・レスポンシブ
│   ├── js/main.js        # スクロール演出・カウンター・FAQ・メニュー
│   └── img/
│       ├── favicon.svg
│       └── ogp.png       # SNS シェア用画像（1200×630）
├── .nojekyll             # GitHub Pages の Jekyll 処理を無効化
└── README.md
```

ビルド工程はありません。HTML / CSS / JavaScript のみで動作します。

## ローカルで確認する

```bash
python3 -m http.server 8765
# http://localhost:8765/ を開く
```

## 公開について

`main` ブランチのルートを GitHub Pages の公開元に設定しています。`main` へ push すると自動で反映されます。

## 補足

- 掲載内容は浜名湖うなぎの魅力を紹介するための一般的な情報です。特定の店舗・商品を推薦するものではありません。
- 写真は使用せず、すべてインライン SVG と CSS で描画しています。
- フォントは Google Fonts（Shippori Mincho B1 / Zen Kaku Gothic New）を利用しています。
