// 部員ポータル（DCCadmin）の「HP編集」で公開された内容を取り込み、src/data/site-content.json に重ねる。
//
// SITE_CONTENT_FETCH=1 のときだけ動く（GitHub Actions の本番ビルドで設定）。
// 手元の npm run build ではリポジトリの初期値のまま、ファイルも書き換えない。
// 取得に失敗したらビルドを止める（壊れた内容で公開せず、今公開中のサイトをそのまま残すため）。
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { mergeSiteContent } from '../src/lib/siteContent.js';

const API_URL = process.env.SITE_CONTENT_API_URL || 'https://dcc-portal.s1kqr1s.workers.dev/api/site-content';
const target = resolve('src/data/site-content.json');

if (process.env.SITE_CONTENT_FETCH !== '1') {
    console.log('site-content: SITE_CONTENT_FETCH が未設定なので、リポジトリの初期値でビルドします。');
    process.exit(0);
}

const defaults = JSON.parse(await readFile(target, 'utf8'));
const res = await fetch(API_URL, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(20_000) });
if (!res.ok) throw new Error(`site-content: ${API_URL} が ${res.status} を返しました`);
const body = await res.json();

if (!body || body.content === null) {
    console.log('site-content: まだ公開された編集内容がないので、初期値でビルドします。');
    process.exit(0);
}
if (typeof body.content !== 'object') throw new Error('site-content: 応答の形が想定と違います');

const merged = mergeSiteContent(defaults, body.content);
await writeFile(target, `${JSON.stringify(merged, null, 2)}\n`);
console.log(`site-content: 公開版 v${body.version ?? '?'}（${body.publishedBy ?? '不明'}）を取り込みました。`);
