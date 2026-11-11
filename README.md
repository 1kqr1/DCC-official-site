DCCの公式サイトだえ

## デプロイ

`main` にpush（PRをマージ）すると、GitHub Actions（`.github/workflows/deploy-cloudflare.yml`）がビルドして Cloudflare Pages の `dcc-official-site` プロジェクトへ公開します。本番URLは https://shu-dcc.net/ です。手動でのデプロイ作業は不要です。

## DCCAI

右下の `DCCAI _` はDCC専用の案内チャットです。DCCに関する確認済みの内容は [src/data/dcc-knowledge.json](src/data/dcc-knowledge.json) にまとめ、ローカル開発ではその内容だけを使う安全なモックで動きます。

`POST /api/dccai` の開発用エンドポイントは `server/dccai/handler.js` にあります。本番用のCloudflare Workerは `worker/` にあり、`DCCAI_API_KEY` をWorker Secretとして設定します。`.env.example` を `.env.local` にコピーして設定しますが、APIキーに `VITE_` 接頭辞を付けないでください。

サイト本体はCloudflare Pagesへの静的配信なので、秘密鍵を使う `/api/dccai` はサイト側では実行しません。本番では `dccai-shu-dcc` Workerを別オリジンの安全なAPIとして呼び出します。Workerは自動デプロイの対象外なので、変更したときは `worker/` で `npx wrangler deploy` を実行してください。
