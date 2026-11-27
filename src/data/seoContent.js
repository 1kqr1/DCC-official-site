import content from './site-content.json' with { type: 'json' };

export const SITE_URL = 'https://shu-dcc.net';
export const SITE_NAME = 'DCC - Digital Creators Community';
export const DEFAULT_IMAGE = `${SITE_URL}/ogp-logo.jpg`;

// ビルド時のHTMLと、画面遷移後のheadで同じ内容を使う。
// タイトル・説明文は部員ポータル（DCCadmin）の「HP編集」で変えられる（site-content.json の seo）。
export const pageSeo = {
    '/': content.seo.home,
    '/business': content.seo.business,
    '/blog': content.seo.blog,
    '/members': content.seo.members,
};

export const homeStructuredData = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'WebSite',
            '@id': `${SITE_URL}/#website`,
            url: `${SITE_URL}/`,
            name: 'DCC',
            alternateName: 'Digital Creators Community',
            inLanguage: 'ja',
            publisher: { '@id': `${SITE_URL}/#organization` },
        },
        {
            '@type': 'Organization',
            '@id': `${SITE_URL}/#organization`,
            name: 'Digital Creators Community',
            alternateName: 'DCC',
            url: `${SITE_URL}/`,
            description: content.seo.organizationDescription,
        },
    ],
};

// 固定ページのAI向け資料。動的な記事・プロフィールには代替資料を案内しない。
export function getMarkdownPath(path) {
    return Object.hasOwn(pageSeo, path) ? (path === '/' ? '/index.md' : `${path}.md`) : null;
}

export function resolveSeo({ title, description, path = '/', image, noindex = false } = {}) {
    const defaults = pageSeo[path] || pageSeo['/'];
    return {
        title: `${title || defaults.title} | DCC`,
        description: String(description || defaults.description).replace(/\s+/g, ' ').trim(),
        url: `${SITE_URL}${path}`,
        image: image || DEFAULT_IMAGE,
        robots: noindex ? 'noindex, follow' : 'index, follow',
        structuredData: path === '/' ? homeStructuredData : null,
    };
}
