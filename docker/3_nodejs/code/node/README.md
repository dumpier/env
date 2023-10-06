# Chart
## フォルダ構成
- `config`
  - `directory.js` root, public, views等のディレクトリを動的に取得
- `libs`
  - `chart`
    - `event.js` Chat機能を実装（入室、退室、メッセージ送信）
    - `storage.js` DBとDAO的な役割
  - `routing.js` ルーティング処理
- `public`
- `routes`
  - `chat.js` views/chat.htmlを表示するだけ（libs/routing.jsに書いても大丈夫）
- `views`
  - `chat.html` チャット画面
- `server.js`
