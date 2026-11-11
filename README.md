DCCの公式サイトだえ

## 開発

```sh
npm ci            # 依存関係をインストール
npm run dev       # 開発サーバー（http://localhost:5173）
npm run build     # dist/ に本番ビルド
npm run lint      # ESLint
npm test          # ユニットテスト
npm run test:browser  # ビルドしてPlaywrightでブラウザテスト
```

作業はブランチを切ってPRを出し、`main` にマージする流れで進めます。

## デプロイ

`main` にpush（PRをマージ）すると、GitHub Actions（`.github/workflows/deploy-cloudflare.yml`）がビルドして Cloudflare Pages の `dcc-official-site` プロジェクトへ公開します。本番URLは https://shu-dcc.net/ です。手動でのデプロイ作業は不要です。

## SEO

`npm run build` はViteビルド後、トップ・企業向け・ブログ一覧・部員一覧を同じReactコンポーネントからHTML化します。外部APIはビルド時に呼ばず、記事・プロフィールは従来どおりブラウザで取得します。ページごとのSEO設定は `src/data/seoContent.js`、生成処理は `scripts/prerender.mjs` にあります。サイトマップには固定4ページを掲載し、記事はサイト内リンクから辿れる構成です。

Cloudflare Pagesでは固定ページを静的HTMLで配信し、記事・プロフィールの詳細URLは `public/_redirects` により本文・canonicalを持たない `spa.html` へフォールバックします。未知のURLには `404.html` を返します。公開後はGoogle Search Consoleで `https://shu-dcc.net/sitemap.xml` を送信し、トップと `/business` のURL検査・インデックス登録リクエストを行ってください。Search Consoleの所有権確認用トークンは、このリポジトリに未設定です。

## AI向け公開資料（llms.txt）

`npm run build` は `dist/llms.txt` と、固定4ページに対応する `index.md`・`business.md`・`blog.md`・`members.md` を生成します。`llms.txt` はAI向けの概要と資料へのリンクをまとめる案内書です。公開後は `https://shu-dcc.net/llms.txt` から取得できます。

生成テンプレートは `scripts/llms.mjs` にあります。DCCの基本情報・参加方法・FAQは `src/data/dcc-knowledge.json`、公開リンクは `src/config.js`、ページ概要は `src/data/seoContent.js` から読み込みます。企業向けの相談内容を変更した際は `src/pages/Business.jsx` とテンプレートを合わせて更新してください。変更の反映には再ビルド・再公開が必要です。

全ページのHTMLに `rel="describedby"` で `llms.txt` を案内し、固定ページには `rel="alternate" type="text/markdown"` で対応する資料を案内します。画面遷移でもリンクを切り替え、動的な記事・プロフィールや404には固定ページの代替リンクを残しません。

外部APIの取得、記事・個人プロフィールの複製、未確定の活動日時の掲載は行いません。ブログと部員紹介の資料は公開ページへの案内です。AIがこの形式を利用するかはサービス側の対応に依存し、学習への利用許可や巡回ルールを指定するファイルではありません。形式は [llms.txtの提案](https://llmstxt.org/) に準拠しています。

ローカル確認は `npm run build` の後に `npm run preview` を実行し、`/llms.txt` と各MarkdownのURLを開きます（開発サーバーでは生成しません）。配信とページ遷移の検証は `npx playwright test tests/llms.spec.js --project=chromium` で実行できます。

## DCCAI

右下の `DCCAI _` はDCC専用の案内チャットです。DCCに関する確認済みの内容は [src/data/dcc-knowledge.json](src/data/dcc-knowledge.json) にまとめ、ローカル開発ではその内容だけを使う安全なモックで動きます。

`POST /api/dccai` の開発用エンドポイントは `server/dccai/handler.js` にあります。本番用のCloudflare Workerは `worker/` にあり、`DCCAI_API_KEY` をWorker Secretとして設定します。`.env.example` を `.env.local` にコピーして設定しますが、APIキーに `VITE_` 接頭辞を付けないでください。

サイト本体はCloudflare Pagesへの静的配信なので、秘密鍵を使う `/api/dccai` はサイト側では実行しません。本番では `dccai-shu-dcc` Workerを別オリジンの安全なAPIとして呼び出します。Workerは自動デプロイの対象外なので、変更したときは `worker/` で `npx wrangler deploy` を実行してください。
