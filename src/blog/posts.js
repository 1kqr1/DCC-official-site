// src/content/blog/ 内の Markdown をビルド時にすべて読み込む。
// 記事を追加・編集するときは .md ファイルを足すだけでOK（このファイルは触らない）。
const files = import.meta.glob('../content/blog/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
});

// 記事の先頭にある --- で囲まれたメタ情報（frontmatter）を取り出す
function parseFrontmatter(raw) {
    const match = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/.exec(raw);
    if (!match) return { data: {}, content: raw.trim() };

    const data = {};
    for (const line of match[1].split('\n')) {
        const idx = line.indexOf(':');
        if (idx === -1) continue;
        const key = line.slice(0, idx).trim();
        let val = line.slice(idx + 1).trim();
        if (val.startsWith('[') && val.endsWith(']')) {
            // tags: [イベント, 開発] のような配列
            val = val.slice(1, -1).split(',').map((s) => s.trim()).filter(Boolean);
        } else {
            val = val.replace(/^["']|["']$/g, ''); // 前後のクォートを除去
        }
        data[key] = val;
    }
    return { data, content: match[2].trim() };
}

// サムネイル画像は public/blog-images/ に置く。
// GitHub Pages のサブディレクトリ配信に合わせて BASE_URL を前置きする。
export function thumbnailUrl(name) {
    if (!name) return null;
    return `${import.meta.env.BASE_URL}blog-images/${name}`;
}

export const posts = Object.entries(files)
    .map(([path, raw]) => {
        const slug = path.split('/').pop().replace(/\.md$/, '');
        const { data, content } = parseFrontmatter(raw);
        return { slug, ...data, content };
    })
    // title の無いファイル（README など）や、_ 始まりの下書きは一覧に出さない
    .filter((post) => post.title && !post.slug.startsWith('_'))
    // 日付の新しい順に並べる
    .sort((a, b) => new Date(b.date) - new Date(a.date));

export function getPost(slug) {
    return posts.find((p) => p.slug === slug);
}
