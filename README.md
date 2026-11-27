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
manifest.webmanifest   ホーム画面に追加（PWA）用の設定
sw.js                  オフライン用 service worker
icon-512.png           アプリアイコン（512px）
icon-192.png           アプリアイコン（192px）
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

## セーブデータ

進行状況はブラウザの localStorage に保存されます（`rg_` で始まるキー）。
同じURLで遊ぶ限り引き継がれますが、公開URLを変えるとセーブは別扱いになります。
