# nplus-llc.net（ｎプラス合同会社 コーポレートサイト）

HTML / CSS / JavaScript だけで作った静的サイトです。ビルド作業は不要で、このフォルダの中身をそのまま GitHub に上げれば公開できます。

## ファイル構成

```
.
├── index.html        # トップページ
├── privacy.html      # プライバシーポリシー
├── css/
│   ├── style.css     # 基本のデザイン（色は冒頭の :root でまとめて管理）
│   └── style2.css    # キャラクター（女の子・ねこ）とアイテムの動き
├── js/main.js        # 動き（ローディング、スクロール演出、パララックス、FAQ開閉、メニューなど）
├── assets/           # ロゴ・ファビコン
├── .nojekyll         # GitHub Pages の Jekyll 処理を止めるファイル（消さないでください）
└── .gitignore
```

## GitHub Pages で公開する

1. GitHub で新しいリポジトリを作成
2. このフォルダの**中身**をリポジトリ直下にアップロード
   （ブラウザの場合：リポジトリ画面の「Add file → Upload files」に、フォルダの中身をすべてドラッグ）
   ※ `.nojekyll` などのドットで始まるファイルは、Finderでは隠しファイルになっています。`Command + Shift + .` で表示できます
3. **Settings → Pages** を開き、Source を `Deploy from a branch`、Branch を `main` / `/ (root)` にして Save
4. 数分後、`https://<ユーザー名>.github.io/<リポジトリ名>/` で公開されます

### 独自ドメイン（nplus-llc.net）で公開する場合

1. **Settings → Pages → Custom domain** に `nplus-llc.net` を入力して保存（`CNAME` ファイルは GitHub が自動で作ります）
2. ドメイン管理会社の DNS 設定で、GitHub Pages 用のレコード（A レコード／CNAME）を設定
3. 反映後に「Enforce HTTPS」にチェック

※ 今のサイトを公開しているサーバーから切り替える形になります。DNS を切り替えるタイミングにご注意ください。

## 編集のヒント

- **文章**：`index.html` の各 `<section>` を直接書き換え
- **色**：`css/style.css` 冒頭の `:root`（`--coral` `--mint` `--yellow` `--blue` など）
- **キャラクター**：`index.html` 上部の `<symbol>` にまとめてあります
  - `#girlA`（ロングヘアの子）／`#girlB`（お団子ボブの子）
  - `#cat`（白ねこ）／`#catCalico`（三毛猫）
  - 使う場所の `<use href="#cat">` を `#catCalico` に変えるだけで柄が変わります
- **メインビジュアルの2人**は、`index.html` のヒーロー内 `<!-- Two girls at a desk -->` の部分です
- OS の「視差効果を減らす」がオンの環境では、アニメーションは自動で止まります
