import { useEffect } from 'react';
import { getMarkdownPath, resolveSeo, SITE_URL } from './data/seoContent';

// ページごとに <title> / description / OGP / canonical を切り替える。
//
// index.html に書いてある静的なタグを「置き換える」方式にしている。
// 静的タグはJSを実行しないクローラー向けのフォールバックとして残しておきたい一方、
// 同じ内容のタグが2つ並ぶと検索エンジンにとって曖昧になるため、追加ではなく上書きする。
//
// React 19 は <title> や <meta> をコンポーネント内に直接書けるが、その場合
// index.html の静的タグと二重になる。ここでは重複を確実に避けたいので、
// head を「外部システム」として useEffect から同期している。

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
 * @param {string} [options.title]       ページ名。省略するとパスごとの既定タイトルになる
 * @param {string} [options.description] 未取得・失敗時は既定の説明文にフォールバックする
 * @param {string} [options.path]        '/blog' のような絶対パス
 * @param {string} [options.image]       OGP画像の絶対URL
 */
export function useSeo(options = {}) {
    const { title: fullTitle, description: desc, url, image: img, robots, structuredData } = resolveSeo(options);
    const markdownPath = getMarkdownPath(options.path || '/');

    useEffect(() => {
        document.title = fullTitle;
        upsertMeta('name', 'description', desc);
        upsertMeta('property', 'og:title', fullTitle);
        upsertMeta('property', 'og:description', desc);
        upsertMeta('property', 'og:url', url);
        upsertMeta('property', 'og:image', img);
        upsertMeta('name', 'twitter:title', fullTitle);
        upsertMeta('name', 'twitter:description', desc);
        upsertMeta('name', 'twitter:image', img);
        upsertMeta('name', 'robots', robots);
        upsertLink('canonical', url);
        const alternate = document.head.querySelector('link[rel="alternate"][type="text/markdown"]');
        if (markdownPath) {
            const link = alternate || document.createElement('link');
            link.setAttribute('rel', 'alternate');
            link.setAttribute('type', 'text/markdown');
            link.setAttribute('href', `${SITE_URL}${markdownPath}`);
            if (!alternate) document.head.appendChild(link);
        } else {
            alternate?.remove();
        }
        const existing = document.getElementById('dcc-structured-data');
        if (structuredData) {
            const script = existing || document.createElement('script');
            script.id = 'dcc-structured-data';
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(structuredData);
            if (!existing) document.head.appendChild(script);
        } else {
            existing?.remove();
        }
    }, [fullTitle, desc, url, img, robots, structuredData, markdownPath]);
}
