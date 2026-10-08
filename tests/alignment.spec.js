import { test, expect } from '@playwright/test';

const post = { slug: 'alignment-check', title: '配置確認の記事', excerpt: 'ブラウザ検証用です。', publishedAt: '2026-10-08', blocks: [{ type: 'text', text: '検証専用の本文' }] };
const member = { id: 'alignment-check', name: '検証用メンバー', skills: [], works: [] };
const widths = [320, 390, 391, 412, 600, 601, 768, 860, 861, 980, 1024, 1100, 1101, 1280, 1440, 1920];

test.use({ reducedMotion: 'reduce' });
test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem('dcc_opening_seen', '1'));
    await page.route('https://fonts.googleapis.com/**', route => route.abort());
    await page.route('https://dcc-portal.s1kqr1s.workers.dev/api/**', route => {
        const path = new URL(route.request().url()).pathname;
        return route.fulfill({ json: path === '/api/blog' ? [post] : path === '/api/members' ? [member] : path.startsWith('/api/blog/') ? post : member });
    });
});

test('全セクションの本文左端を同じ基準線に揃える', async ({ page }) => {
    await page.goto('/');
    for (const width of widths) {
        await page.setViewportSize({ width, height: 900 });
        const lefts = await page.evaluate(() => ['.editor-hero__copy', '.markdown-sheet', '#projects-title', '#news-title', '#room-title', '#faq-title'].map(selector => document.querySelector(selector).getBoundingClientRect().left));
        for (const left of lefts) expect(Math.abs(left - lefts[0]), `${width}px`).toBeLessThan(1);
    }
});

test('390px境界を越えても本文幅を逆に狭めない', async ({ page }) => {
    await page.goto('/');
    let previous = 0;
    for (const width of [360, 390, 391, 412, 480, 560, 600]) {
        await page.setViewportSize({ width, height: 900 });
        const body = await page.locator('.markdown-sheet').boundingBox();
        expect(body.width, `${width}px`).toBeGreaterThan(previous);
        previous = body.width;
    }
});

test('トップと個別ページの枠・Explorer・本文左端を保持する', async ({ page }) => {
    for (const width of [390, 412, 768, 861, 1024, 1440, 1920]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto('/');
        const before = await page.evaluate(() => ({
            frame: document.querySelector('.editor-home').getBoundingClientRect().left,
            canvas: document.querySelector('.editor-canvas').getBoundingClientRect().left,
            body: document.querySelector('.editor-hero__copy').getBoundingClientRect().left,
        }));
        for (const [path, heading] of [['/blog', '.blog-heading'], ['/business', '.biz-title'], ['/members', '.members-heading']]) {
            await page.goto(path);
            await expect(page.locator(heading)).toBeVisible();
            const after = await page.evaluate(selector => ({
                frame: document.querySelector('.editor-route-frame').getBoundingClientRect().left,
                canvas: document.querySelector('.editor-route-frame__canvas').getBoundingClientRect().left,
                body: document.querySelector(selector).getBoundingClientRect().left,
            }), heading);
            for (const key of Object.keys(before)) expect(Math.abs(after[key] - before[key]), `${path} / ${width}px / ${key}`).toBeLessThan(1);
        }
    }
});

test('アンカーはヘッダー直下の余白を一度だけ確保する', async ({ page }) => {
    for (const width of [390, 861, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        for (const id of ['about', 'projects', 'room', 'faq']) {
            await page.goto(`/#${id}`);
            await expect.poll(() => page.evaluate(id => document.getElementById(id).getBoundingClientRect().top - document.querySelector('.site-header').getBoundingClientRect().bottom, id)).toBeGreaterThanOrEqual(11);
            const gap = await page.evaluate(id => document.getElementById(id).getBoundingClientRect().top - document.querySelector('.site-header').getBoundingClientRect().bottom, id);
            expect(gap).toBeLessThanOrEqual(13);
        }
    }
});

test('狭いPCでもAbout本文と写真を細い二列に押し込まない', async ({ page }) => {
    await page.goto('/');
    for (const width of [861, 900, 980, 1024, 1100]) {
        await page.setViewportSize({ width, height: 900 });
        const text = await page.locator('.markdown-sheet').boundingBox();
        const pictures = await page.locator('.editor-about__aside').boundingBox();
        expect(text.width, `${width}px`).toBeGreaterThan(400);
        expect(pictures.y, `${width}px`).toBeGreaterThanOrEqual(text.y + text.height);
    }
});

test('初期表示と幅変更でDCCAIが本文を覆わず、明示的に開いた状態を保つ', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await expect(page.locator('.dccai-window')).toHaveCount(0);
    await page.setViewportSize({ width: 1024, height: 900 });
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page.locator('.dccai-window')).toHaveCount(0);
    await page.goto('/#news');
    await page.locator('.news-terminal__line').first().click();
    await expect(page.locator('.blog-post-title')).toHaveText(post.title);
    await page.getByRole('button', { name: 'DCCAIを開く', exact: true }).click();
    await page.setViewportSize({ width: 1024, height: 900 });
    await expect(page.locator('.dccai-window')).toBeVisible();
    await page.getByRole('button', { name: 'DCCAIを閉じる', exact: true }).first().click();
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page.locator('.dccai-window')).toHaveCount(0);
});
