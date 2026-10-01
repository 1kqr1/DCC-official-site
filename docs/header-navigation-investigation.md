2026-10-01 — DCC HP ヘッダー・ページ遷移の調査と修正

ローカルのソース修正と検証は完了。修正前のChromeで、URLが `/blog` に変わった後も旧トップページのDOMが残る描画フレームと、遷移先にスクロール位置が残る状態を確認した。修正後はChrome、Chromium、デスクトップWebKit、iPhone 13を模したWebKitで、リンクをクリックした直後と次の描画フレームの両方に、新ページのDOM・正しいスクロール位置・同じヘッダーDOMが存在することを検証した。

添付動画は今回の実行環境から参照できていない。動画でのヘッダー消失そのものと同一の原因だとは断定していない。確認できた不具合を修正し、環境差につながる描画待ち・スクロールの競合・stickyの祖先設定を整理した。このレポートは本番反映前のソース調査とローカル検証の記録であり、公開結果はリリース報告で扱う。

調査で確認したこと

| 対象 | 修正前の実装と問題 | 確認の程度 |
| --- | --- | --- |
| ページ遷移 | `src/App.jsx` の `<ViewTransition key={location.pathname}>` と React Router 7.9.6 の `BrowserRouter` 内の `startTransition`。HistoryのURL更新後に描画更新が延期される | Chromeの描画フレームでURLと旧DOMの不一致を確認 |
| View Transition | ネストした記事タイトル・ファイルタブにもReactのViewTransitionが存在。Reactは遷移の際にフォントなどを待ち、通常のuseEffectもアニメーション終了後に実行する場合がある | ソースと[React公式のViewTransition仕様](https://react.dev/reference/react/ViewTransition)で確認。端末負荷やフォントの状態で差が出る構造 |
| ヘッダー再生成 | `Header` はRoutesの外にあり、pathnameのkeyも付いていない。削除・再マウント・opacity:0によるヘッダー自体の非表示処理はない | ソースで確認。修正後はDOM参照の同一性をテスト |
| 初期表示アニメーション | `src/index.css` の `[data-reveal] { opacity: 0; transform: ... }` と `RevealManager` のuseEffectにより、遷移直後の見出しがまだ透明 | 最初のフレームのcomputed opacityが0になることを確認 |
| スクロール | 記事とプロフィールにだけuseEffectの `window.scrollTo(0, 0)` がある。その他のページは旧位置を引き継ぐ。htmlのsmoothは位置リセットと履歴復元にも影響する | Chromeでトップの1400pxからブログに移ると、0ではなく682pxに残ることを確認 |
| アンカー移動 | 現役のHashLinkは、DOM更新とは別のタイマーとMutationObserverでスクロールする。Homeにも初回ハッシュ移動のrequestAnimationFrameがあり、責務が分散 | ライブラリとHomeのソースで確認 |
| stickyの祖先 | `body { overflow-x: hidden }` は算出値が `hidden auto` になり、縦方向にもスクロール機構を作る。stickyヘッダーの祖先になる | 算出値を実測。[stickyはoverflowを持つ祖先を基準にする](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position)ため環境差の候補。ヘッダー消失との因果は未断定 |
| transform等 | html/body/#root/app-containerにtransform、translate、filter、contain、will-changeや全体を隠す遷移アニメーションはない。backdrop-filterはヘッダー自身にある | 現役のCSSを調査 |
| Router・API | 独自Router、fetchしたHTMLの差し替えはない。React RouterのRoutesで切り替え、記事・メンバーのJSONだけをfetchしている | 現役のJSを調査 |
| Webフォント | Google Fontsはdisplay=swap。ヘッダーは68px/60pxの最小高さを持つ。フォント自体よりも、View Transitionの待機との組み合わせを優先して修正 | index.htmlとCSSを確認。読み込みを保留したテストでもヘッダー高さが維持されることを確認 |

変更ファイルと理由

| ファイル | 変更内容と改善する理由 |
| --- | --- |
| `src/App.jsx` | 現役のViewTransitionを除去。`BrowserRouter useTransitions={false}` を指定。Header/Footer/DCCAIWidgetを保持し、Routesがmainの内容を更新する構造を維持 |
| `src/components/NavigationLink.jsx`（追加） | 標準のuseLinkClickHandlerをflushSync内で実行。URL更新の後に別の描画フレームまでDOM更新を延期しない。修飾キー、別タブ、外部URL、downloadの通常動作は保持 |
| `src/components/RouteScrollManager.jsx`（追加） | useLayoutEffectで新DOMの描画前に通常遷移を上部へ戻す。別ページのハッシュ移動は即時、同じページのアンカーはsmooth。POPはブラウザのscrollRestoration=autoに任せる |
| `src/components/Header.jsx` | 同期リンクへ統一。遷移時とPC幅への変更時にモバイルメニューを閉じ、bodyのスクロールロックを描画前に解除。ロゴのintrinsic width/heightを明示 |
| `src/components/Header.css` | ナビ文字列をnowrapにし、フォント幅による折返しを防止。Safari向けの-webkit-backdrop-filterを追加。色・配置・フォント・ブレークポイントは維持 |
| `src/components/RevealManager.jsx`、`src/index.css` | 新ページの最初の画面内の要素をuseLayoutEffectで表示し、その初期表示には透明化や移動の演出を適用しない。画面外からスクロールで入る演出は維持。横方向のクリップをbodyからhtmlへ移し、bodyのスクロール機構をなくす。htmlのscroll-behaviorをautoにし、履歴復元をsmoothにしない |
| `src/components/EditorRouteFrame.jsx` | ファイルタブのViewTransitionを除去し、ブラウザ全体の遷移制御を起動しない |
| `src/components/Footer.jsx`、`src/pages/Home.jsx`、`src/pages/Business.jsx`、`src/pages/Members.jsx`、`src/pages/NotFound.jsx` | 現役のリンクを同期リンクに統一。Homeの遷移用ViewTransitionと初回ハッシュ移動の重複処理を除去。ナビ構成と表示文言は維持 |
| `src/pages/Blog.jsx`、`src/pages/BlogPost.jsx` | 同期リンクに統一。タイトルのViewTransitionを除去し、記事個別のuseEffectによるスクロール処理を共通処理へ集約 |
| `src/pages/MemberProfile.jsx` | 同期リンクと共通スクロールを使用。slugが変わればプロフィール内容の状態を作り直し、前の人物のデータを新URLに残さない |
| `src/blog/api.js`、`src/members/api.js` | 取得済みの記事本文とプロフィールをslug/id別にメモリへ保存して再訪時に使用。APIを再取得する間にページの高さが縮み、履歴の位置が復元できなくなることを防ぐ。再取得と古いリクエスト結果の無視は継続 |
| `package.json`、`package-lock.json` | useTransitionsの公式設定が使えるReact Router 7.18.4へ更新。ブラウザ検証用Playwrightとtest:browserを追加。[Router公式の設定](https://reactrouter.com/api/declarative-routers/BrowserRouter)で非同期更新を制御 |
| `playwright.config.js`、`tests/navigation.spec.js`（追加）、`.gitignore` | production buildを使うブラウザ回帰テストを追加。テストの出力をGit対象から除外 |

修正のためのsetTimeout、遅延時間の追加、!importantの追加はない。初回オープニングの既存タイムラインは維持した。既存の `.claude/launch.json` の編集には手を加えていない。

検証結果

| 環境・確認 | 結果 |
| --- | --- |
| Chrome 154（このMacにインストール済み） | ブラウザテスト13件成功 |
| Chromium 151 | ブラウザテスト13件成功 |
| デスクトップWebKit | ブラウザテスト12件成功。CPU制限テスト1件はChromium専用のため除外 |
| iPhone 13を模したWebKit | ブラウザテスト12件成功。CPU制限テスト1件はChromium専用のため除外。実機のiOS Safariではない |
| Firefox | コード上の確認を実施。テスト用Firefoxの起動がこのMacで失敗したため実行検証は未完了。テスト設定は追加済み |
| Edge | Chromium共通の描画経路とコードを確認。このMacにEdgeがないためEdge自身での実行検証は未実施 |
| lint / build / 既存のテスト / diff check | すべて成功。既存のテストは8件成功 |

ブラウザ検証は合計50件成功。確認内容は、クリック直後と次のフレームのURL・DOM・scrollY・ヘッダーDOM参照・見出しopacity、40回の連続クリック、APIを保留した一覧/記事、記事再訪時の遅い再取得、戻る・進む、直接ハッシュURL、モバイルメニュー、PC幅へのリサイズ、初回オープニングとキャッシュ済み再訪、フォント読み込み保留、reduced-motion、進捗バーのJSフォールバック、Chromium/ChromeでのCPU速度6倍制限。

幅320/375/390/430/768/1024/1280/1440/1920pxを確認し、860/861/869/870/871/1180/1181pxの境界も追加した。80/90/100/110/125/150%のブラウザズームで想定されるCSS viewport幅も確認した。これは実際のブラウザのズームUIを操作した検証ではない。WebKitでは常時表示のスクロールバーの幅がメディアクエリに影響するため、JSとCSSが同じメディアクエリを使って整合することも確認した。

APIにはテスト専用のデータを使用し、フォントは外部読込を止めたケースと読込を保留したケースを検証している。利用者の実端末、添付動画、実際のすべてのフォント読込・GPU構成・拡張機能・ズーム設定までは確認していない。

再実行コマンド

```sh
npm ci
npx playwright install chromium firefox webkit
npm run lint
npm test
npm run test:browser
```

このMacのテスト用ブラウザは一時ディレクトリへ配置したため、今回の検証は次の指定で実施した。

```sh
PLAYWRIGHT_BROWSERS_PATH=/tmp/dcc-header-browsers npm run test:browser -- --project=chromium --project=webkit --project=mobile-webkit
DCC_CHROMIUM_CHANNEL=chrome PLAYWRIGHT_BROWSERS_PATH=/tmp/dcc-header-browsers npx playwright test --project=chromium
```

Edgeがある環境では `DCC_CHROMIUM_CHANNEL=msedge` を指定して同じテストを実行できる。
