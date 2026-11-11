export const SITE_URL = 'https://shu-dcc.net';
export const SITE_NAME = 'DCC - Digital Creators Community';
export const DEFAULT_IMAGE = `${SITE_URL}/ogp-logo.jpg`;

// ビルド時のHTMLと、画面遷移後のheadで同じ内容を使う。
export const pageSeo = {
    '/': {
        title: '周南公立大学のプログラミング・創作コミュニティ',
        description: '周南公立大学の学生を中心とするDCC。部活・サークルを探している方、情報科学・プログラミングに興味がある方へ。Web・ゲーム・AI・3Dなどの制作、参加方法、企業との制作・共同開発の相談をご案内します。',
    },
    '/business': {
        title: '周南公立大学の学生とのWeb制作・共同開発・産学連携のご相談',
        description: '山口県周南市・周南公立大学発のDCC。学生とのWeb・アプリ・3D・映像制作、共同開発、協賛、インターン・採用に関心のある企業・団体の方へ。活動分野とお問い合わせ窓口をご案内します。',
    },
    '/blog': {
        title: '周南公立大学DCCの活動ブログ・制作記録',
        description: '周南公立大学の学生を中心とするDCCの活動ブログ。プログラミングやデジタル制作、作品発表、イベントの様子を公開記事で紹介します。',
    },
    '/members': {
        title: '周南公立大学DCCの部員紹介・作品',
        description: '周南公立大学の学生を中心とするDCCで活動するメンバーと作品を紹介します。本人が公開設定にしたプロフィールをご覧いただけます。',
    },
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
            description: '周南公立大学の学生を中心とした、Discordベースのクリエイターコミュニティ。',
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
