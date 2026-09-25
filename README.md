DCCの公式サイトだえ

## DCCAI

右下の `DCCAI _` はDCC専用の案内チャットです。DCCに関する確認済みの内容は [src/data/dcc-knowledge.json](src/data/dcc-knowledge.json) にまとめ、ローカル開発ではその内容だけを使う安全なモックで動きます。

`POST /api/dccai` の開発用エンドポイントは `server/dccai/handler.js` にあります。本番用のCloudflare Workerは `worker/` にあり、`DCCAI_API_KEY` をWorker Secretとして設定します。`.env.example` を `.env.local` にコピーして設定しますが、APIキーに `VITE_` 接頭辞を付けないでください。

現在の `npm run deploy` はGitHub Pagesへの静的配信です。GitHub Pagesだけでは秘密鍵を使う `/api/dccai` を実行できないため、本番では `dccai-shu-dcc` Workerを別オリジンの安全なAPIとして呼び出します。
