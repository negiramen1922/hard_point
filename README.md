# HARD POINT

ブラウザで遊べるメカTPS。スマホ（横持ち）とPCの両方で動きます。
three.js（r128）を使った1ファイル構成のゲームで、ビルド作業は不要です。

## 遊び方

| 操作 | PC | スマホ |
|---|---|---|
| 移動 | WASD | 左スティック |
| 視点 | マウス（クリックでロック／右ドラッグでも可）・Q / E | 画面右側をドラッグ |
| 射撃 | 左クリック / F | FIREボタン |
| 武器 | 1 / 2 | 武器ボタン |
| スラスター | Shift | スラスターボタン |
| ミサイル | G | ミサイルボタン |
| リロード | R | リロードボタン |
| 一時停止 | Esc | ⏸ |

初回起動時にチュートリアル（訓練場）が始まります。設定画面からいつでもやり直せます。

## ファイル構成

```
index.html             ゲーム本体（HTML / CSS / JS すべて入り）
vendor/three.min.js    three.js r128（CDNに頼らず同梱）
vendor/three.LICENSE   three.js のライセンス（MIT）
news.json              お知らせ（ホーム右上のメールマーク）
manifest.webmanifest   ホーム画面に追加（PWA）用の設定
sw.js                  オフライン用 service worker
icon-512.png           アプリアイコン（512px）
icon-192.png           アプリアイコン（192px）
og-image.png           URLを貼ったときに出る紹介画像（1200×630、OGP / Xカード）
.nojekyll              GitHub Pages で Jekyll 処理を無効化
```

## ローカルで動かす

`index.html` をブラウザで直接開いても遊べます。
PWA（service worker）まで確認したいときは簡易サーバーを立ててください。

```bash
python3 -m http.server 8000
# → http://localhost:8000 を開く
```

## 公開する

### GitHub Pages
1. このフォルダの中身をリポジトリのルートに push
2. リポジトリの **Settings → Pages**
3. **Source: Deploy from a branch**、**Branch: `main` / `(root)`** を選んで Save
4. 1〜2分後に `https://<ユーザー名>.github.io/<リポジトリ名>/` で公開されます

### Cloudflare Pages（任意）
1. Cloudflare ダッシュボード → **Workers & Pages → Create → Pages → Connect to Git**
2. リポジトリを選択
3. Framework preset: **None**、Build command: 空欄、Build output directory: `/`
4. push するたびに自動で再公開されます

## URLを貼ったときの紹介カード（OGP）

`index.html` の `<head>` に OGP / Xカード（`summary_large_image`）のタグを入れてあります。
画像は `og-image.png`、URLは `https://negiramen1922.github.io/hard_point/` を前提にしています。
**公開URLが違う場合**（Cloudflare Pages・独自ドメインなど）は、`index.html` の `og:url`・`og:image`・`twitter:image`・`canonical` と、
ゲーム内の `SITE_URL`（共有画像に入るURLの予備）を書き換えてください。
X や Discord はカードをキャッシュするので、差し替え直後は古いカードが出ることがあります。

## 結果の共有と戦歴

- ミッション終了（制圧／大破）の結果画面に、使った機体の3Dモデル（ドラッグで回転）と構成が出ます
- 「共有」でリザルト画像（1200×630）を作成。スマホなど対応環境では画像つきでSNSに共有、PCでは「画像を保存」＋「Xでポスト」
- ホームの「戦歴」から過去のミッション（最新60件）を一覧でき、詳細で結果・機体（3D）・構成の確認と共有、「この機体を格納庫で使う」ができます
- 訓練場・試運転は記録しません

## 更新するとき

1. `index.html` を新しい版に差し替え
2. **`sw.js` の `VERSION` を上げる**（例：`hp-v1` → `hp-v2`）
   これを忘れても HTML はネット優先なので反映されますが、three.js やアイコンを差し替えたときはキャッシュが残るため必ず上げてください
3. commit & push

## クレジット

- 制作：[@Negi_RLabo](https://x.com/Negi_RLabo)
- 3Dモデル：敵キャラクターの3Dモデルの一部は [Meshy](https://www.meshy.ai/) で生成したものです（[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.ja)）。ゲーム用に軽量化し、アニメーション用の加工を加えています。
- 3Dエンジン：[three.js](https://threejs.org/)（MIT License、`vendor/three.LICENSE`）
- フォント：Chakra Petch／Zen Kaku Gothic New（Google Fonts、SIL Open Font License）

## お知らせを追加する

`news.json` の先頭に1件追加して commit & push するだけです（`sw.js` の `VERSION` を上げる必要はありません）。
`id` は他と重ならない文字列にしてください。プレイヤーがまだ見ていない `id` の数が、ホーム右上のメールマークに赤丸で表示されます。

```json
{
  "id": "2026-12-01-update",
  "date": "2026-12-01",
  "tag": "アップデート",
  "title": "新しい武器を追加しました",
  "body": "本文。改行は \n で入れられます。"
}
```

## セーブデータ

進行状況はブラウザの localStorage に保存されます（`rg_` で始まるキー。戦歴は `rg_hist`）。
同じURLで遊ぶ限り引き継がれますが、公開URLを変えるとセーブは別扱いになります。
