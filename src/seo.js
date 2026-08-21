import { useEffect } from 'react';

// ページごとに <title> / description / OGP / canonical を切り替える。
//
// index.html に書いてある静的なタグを「置き換える」方式にしている。
// 静的タグはJSを実行しないクローラー向けのフォールバックとして残しておきたい一方、
// 同じ内容のタグが2つ並ぶと検索エンジンにとって曖昧になるため、追加ではなく上書きする。
//
// React 19 は <title> や <meta> をコンポーネント内に直接書けるが、その場合
// index.html の静的タグと二重になる。ここでは重複を確実に避けたいので、
// head を「外部システム」として useEffect から同期している。

const SITE_NAME = 'DCC - Digital Creators Community';
const SITE_URL = 'https://shu-dcc.net';
const DEFAULT_DESCRIPTION =
    'DCC（Digital Creators Community）は周南公立大学発、Discordベースのクリエイターコミュニティ。アプリ開発・3Dプリンタ・デジタルアート。参加すればその日からメンバー、部室や機材も自由に使えます。';
const DEFAULT_IMAGE = `${SITE_URL}/ogp.jpg`;

// 説明文が長すぎると検索結果で途中から切られるので、ほどよい長さに丸める
const MAX_DESCRIPTION = 120;

function truncate(text) {
    const oneLine = String(text).replace(/\s+/g, ' ').trim();
    if (oneLine.length <= MAX_DESCRIPTION) return oneLine;
    return `${oneLine.slice(0, MAX_DESCRIPTION - 1)}…`;
}

function upsertMeta(keyAttr, keyValue, content) {
    let el = document.head.querySelector(`meta[${keyAttr}="${keyValue}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(keyAttr, keyValue);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
}

function upsertLink(rel, href) {
    let el = document.head.querySelector(`link[rel="${rel}"]`);
    if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
    }
    el.setAttribute('href', href);
}

/**
 * @param {object} options
 * @param {string} [options.title]       ページ名。省略するとサイト名だけになる（トップ用）
 * @param {string} [options.description] 未取得・失敗時は既定の説明文にフォールバックする
 * @param {string} [options.path]        '/blog' のような絶対パス
 * @param {string} [options.image]       OGP画像の絶対URL
 */
export function useSeo({ title, description, path = '/', image } = {}) {
    const fullTitle = title ? `${title} | DCC` : SITE_NAME;
    const desc = description ? truncate(description) : DEFAULT_DESCRIPTION;
    const url = `${SITE_URL}${path}`;
    const img = image || DEFAULT_IMAGE;

    useEffect(() => {
        document.title = fullTitle;
        upsertMeta('name', 'description', desc);
        upsertMeta('property', 'og:title', fullTitle);
        upsertMeta('property', 'og:description', desc);
        upsertMeta('property', 'og:url', url);
        upsertMeta('property', 'og:image', img);
        upsertLink('canonical', url);
    }, [fullTitle, desc, url, img]);
}
