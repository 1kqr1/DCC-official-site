import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { createServer } from 'vite';
import { getMarkdownPath, pageSeo, resolveSeo, SITE_URL } from '../src/data/seoContent.js';
import { createLlmFiles } from './llms.mjs';

const output = resolve('dist');
const template = await readFile(resolve(output, 'index.html'), 'utf8');
const manifest = JSON.parse(await readFile(resolve(output, '.vite/manifest.json'), 'utf8'));
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));

function withMetadata(html, path) {
    const seo = resolveSeo({ path });
    const tags = [
        `<title>${escapeHtml(seo.title)}</title>`,
        `<meta name="description" content="${escapeHtml(seo.description)}" />`,
        `<meta name="robots" content="${seo.robots}" />`,
        `<link rel="canonical" href="${seo.url}" />`,
        `<link rel="alternate" type="text/markdown" href="${SITE_URL}${getMarkdownPath(path)}" />`,
        ...Object.entries({
            'og:title': seo.title, 'og:description': seo.description,
            'og:url': seo.url, 'og:image': seo.image,
        }).map(([name, content]) => `<meta property="${name}" content="${escapeHtml(content)}" />`),
        ...Object.entries({
            'twitter:title': seo.title, 'twitter:description': seo.description, 'twitter:image': seo.image,
        }).map(([name, content]) => `<meta name="${name}" content="${escapeHtml(content)}" />`),
    ];
    if (seo.structuredData) {
        tags.push(`<script id="dcc-structured-data" type="application/ld+json">${JSON.stringify(seo.structuredData).replace(/</g, '\\u003c')}</script>`);
    }
    return html.replace(/<title>[^<]*<\/title>\s*/g, '')
        .replace(/<meta\s+(?:name="(?:description|robots|twitter:(?:title|description|image))"|property="og:(?:title|description|url|image)")[^>]*>\s*/g, '')
        .replace('</head>', `${tags.join('\n    ')}\n  </head>`);
}

// 未知のURLやAPI由来の詳細ページにはトップの本文・canonicalを返さない。
await writeFile(resolve(output, 'spa.html'), template);
await writeFile(resolve(output, '404.html'), template);
const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
try {
    const knowledge = JSON.parse(await readFile(resolve('src/data/dcc-knowledge.json'), 'utf8'));
    const links = await server.ssrLoadModule('/src/config.js');
    const llmFiles = createLlmFiles({ knowledge, links });
    for (const [path, content] of Object.entries(llmFiles)) {
        await writeFile(resolve(output, path.slice(1)), content);
    }
    const { renderPage } = await server.ssrLoadModule('/src/prerender.jsx');
    for (const path of Object.keys(pageSeo)) {
        const rendered = renderPage(path).replace(/(?:src|href)="(\/src\/assets\/[^"?]+)(?:\?[^" ]*)?"/g, (attribute, asset) => {
            const built = manifest[asset.slice(1)]?.file;
            if (!built) throw new Error(`Built asset missing: ${asset}`);
            return attribute.replace(/"[^"]+"/, `"/${built}"`);
        });
        if (rendered.includes('/src/assets/')) throw new Error(`Unresolved asset on ${path}`);
        const html = withMetadata(template, path).replace('<div id="root"></div>', `<div id="root" data-prerendered>${rendered}</div>`);
        const destination = resolve(output, path === '/' ? 'index.html' : `${path.slice(1)}.html`);
        await mkdir(dirname(destination), { recursive: true });
        await writeFile(destination, html);
    }
    const urls = Object.keys(pageSeo).map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`).join('\n');
    await writeFile(resolve(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
    console.log(`Prerendered ${Object.keys(pageSeo).length} pages, sitemap.xml and ${Object.keys(llmFiles).length} AI-readable files`);
} finally {
    await server.close();
}
