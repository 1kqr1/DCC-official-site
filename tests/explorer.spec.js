import { test, expect } from '@playwright/test';

const order = ['index.html', 'about.md', 'projects/', 'news/', 'workspace/', 'faq.md', 'join.sh'];
const post = { slug: 'explorer-check', title: 'エクスプローラー検証用', excerpt: 'テスト専用', publishedAt: '2026-10-08', blocks: [{ type: 'text', text: 'テスト専用の本文' }] };
const api = 'https://dcc-portal.s1kqr1s.workers.dev/api/';
const explorer = (page) => page.getByRole('navigation', { name: 'エクスプローラー' });

test.use({ reducedMotion: 'reduce' });
test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.addInitScript(() => sessionStorage.setItem('dcc_opening_seen', '1'));
    await page.route('https://fonts.googleapis.com/**', (route) => route.abort());
    await page.route(`${api}**`, (route) => route.fulfill({ json: route.request().url().endsWith('/blog') ? [post] : route.request().url().includes('/blog/') ? post : [] }));
});

async function expectExplorer(page, news = false) {
    await expect(explorer(page)).toBeVisible();
    await expect(explorer(page).locator('.editor-explorer__entry > span:last-child')).toHaveText(order);
    await expect(page.locator('.editor-explorer')).toHaveCount(1);
    if (news) await expect(explorer(page).getByRole('link', { name: 'news/', exact: true })).toHaveAttribute('aria-current', 'page');
}

test('本文順の一覧を保ち、newsへの切り替え直後と次の描画でも消えない', async ({ page }) => {
    await page.goto('/');
    await expectExplorer(page);
    const snapshots = await page.evaluate(() => new Promise((resolve) => {
        const snapshot = () => {
            const el = document.querySelector('.editor-explorer');
            return { path: location.pathname, count: document.querySelectorAll('.editor-explorer').length, visible: Boolean(el?.getClientRects().length), news: el?.querySelector('[aria-current="page"]')?.getAttribute('href') };
        };
        document.querySelector('.editor-explorer a[href="/blog"]').click();
        const immediate = snapshot();
        requestAnimationFrame(() => resolve([immediate, snapshot()]));
    }));
    for (const state of snapshots) expect(state).toEqual({ path: '/blog', count: 1, visible: true, news: '/blog' });
    await expectExplorer(page, true);
    await expect(page.locator('.blog-card')).toHaveCount(1);
});

test('一覧・記事・再読み込み・戻る／進むからトップの各項目へ移動できる', async ({ page }) => {
    await page.goto('/blog');
    await expectExplorer(page, true);
    await page.locator('.blog-card').click();
    await expect(page.locator('.blog-post-title')).toHaveText(post.title);
    await expectExplorer(page, true);
    await page.reload();
    await expectExplorer(page, true);
    await page.goBack();
    await expect(page).toHaveURL('/blog');
    await expectExplorer(page, true);
    await page.goForward();
    await expect(page).toHaveURL('/blog/explorer-check');
    await expectExplorer(page, true);
    await explorer(page).getByRole('link', { name: 'about.md', exact: true }).click();
    await expect(page).toHaveURL('/#about');
    await expectExplorer(page);
    await expect(explorer(page).getByRole('link', { name: 'about.md', exact: true })).toHaveAttribute('aria-current', 'location');
});

test('newsの読み込み中・APIエラー・記事404でも一覧を保つ', async ({ page }) => {
    let release;
    const pending = new Promise((resolve) => { release = resolve; });
    await page.route(`${api}blog`, async (route) => { await pending; await route.fulfill({ json: [post] }); });
    try {
        await page.goto('/blog');
        await expect(page.locator('.blog-empty')).toHaveText('読み込み中...');
        await expectExplorer(page, true);
    } finally { release(); }
    await expect(page.locator('.blog-card')).toHaveCount(1);
    await page.route(`${api}blog`, (route) => route.fulfill({ status: 503, json: {} }));
    await page.reload();
    await expect(page.locator('.blog-empty')).toContainText('読み込みに失敗');
    await expectExplorer(page, true);
    await page.route(`${api}blog/missing`, (route) => route.fulfill({ status: 404, json: {} }));
    await page.goto('/blog/missing');
    await expect(page.locator('.blog-notfound h1')).toBeVisible();
    await expectExplorer(page, true);
});

test('狭いPCと文字拡大でも末尾まで操作でき、スマホでは既存のメニューを使える', async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 375 });
    await page.goto('/blog');
    await page.evaluate(() => { document.documentElement.style.fontSize = '32px'; });
    const join = explorer(page).getByRole('link', { name: 'join.sh', exact: true });
    await join.scrollIntoViewIfNeeded();
    await expect.poll(() => join.evaluate((el) => { const r = el.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight + 1 && el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)); })).toBe(true);
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.locator('.editor-explorer')).not.toBeVisible();
    await page.getByRole('button', { name: 'メニューを開く', exact: true }).click();
    await expect(page.locator('.site-mobile-menu')).toHaveClass(/is-open/);
});
