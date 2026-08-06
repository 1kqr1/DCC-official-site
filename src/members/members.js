// src/content/members/ 内の Markdown をビルド時にすべて読み込む。
// 部員を追加・編集するときは .md ファイルを足すだけでOK（このファイルは触らない）。
import { load as parseYaml } from 'js-yaml';

const files = import.meta.glob('../content/members/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
});

// 記事の先頭にある --- で囲まれた frontmatter を YAML として読み込む
// （作品リストなど入れ子の情報を扱うため、ブログより本格的なパーサーを使う）
function parseFrontmatter(raw) {
    const match = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/.exec(raw);
    if (!match) return { data: {}, content: raw.trim() };

    let data = {};
    try {
        data = parseYaml(match[1]) || {};
    } catch (err) {
        console.error('メンバーのfrontmatter読み込みに失敗しました:', err);
    }
    return { data, content: match[2].trim() };
}

// アバター画像は public/member-images/ に置く。
export function avatarUrl(name) {
    if (!name) return null;
    return `${import.meta.env.BASE_URL}member-images/${name}`;
}

export const members = Object.entries(files)
    .map(([path, raw]) => {
        const slug = path.split('/').pop().replace(/\.md$/, '');
        const { data, content } = parseFrontmatter(raw);
        return { slug, ...data, content };
    })
    // name の無いファイルや、_ 始まりの下書き・public: false は一覧に出さない
    .filter((m) => m.name && !m.slug.startsWith('_') && m.public !== false)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || a.name.localeCompare(b.name, 'ja'));

export function getMember(slug) {
    return members.find((m) => m.slug === slug);
}

// 本人が works の中の visible: false を付けた作品は表に出さない
// （ログイン無しで、自分のファイルを編集するだけで公開/非公開を切り替えられる）
export function visibleWorks(member) {
    if (!member || !Array.isArray(member.works)) return [];
    return member.works.filter((w) => w && w.visible !== false);
}
