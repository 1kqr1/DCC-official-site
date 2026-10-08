import { test, expect } from '@playwright/test';

const token = 'ResponsiveVerification'.repeat(6);
const post = { slug: token, title: `検証専用の記事 ${token}`, excerpt: token, publishedAt: '2026-10-07T00:00:00Z', tags: [token], blocks: [{ type: 'heading', text: '検証専用の見出し' }, { type: 'text', text: `https://example.test/${token}` }] };
const member = { id: token, name: `検証専用 ${token}`, grade: '検証専用', field: token, bio: token, skills: [token], works: [{ title: token, category: token, description: token }] };
const widths = [320, 360, 390, 412, 480, 560, 600, 601, 720, 768, 860, 861, 980, 981, 1024, 1180, 1181, 1280, 1440, 1920];
const routes = [
    ['/', '.editor-home'], ['/business', '.biz-title'], ['/blog', '.blog-card'],
    [`/blog/${token}`, '.blog-post-body'], ['/members', '.member-card'],
    [`/members/${token}`, '.member-profile-header'], ['/missing-page', '.not-found'],
    ['/blog/missing', '.blog-notfound h1'], ['/members/missing', '.members-notfound h1'],
];

test.use({ reducedMotion: 'reduce' });
test.beforeEach(async ({ page }) => {
    await page.route('https://fonts.googleapis.com/**', (route) => route.abort());
    await page.addInitScript(() => sessionStorage.setItem('dcc_opening_seen', '1'));
    await page.route('https://dcc-portal.s1kqr1s.workers.dev/api/**', (route) => {
        const path = new URL(route.request().url()).pathname;
        if (path.endsWith('/missing')) return route.fulfill({ status: 404, json: {} });
        return route.fulfill({ json: path === '/api/blog' ? [post] : path === '/api/members' ? [member] : path.startsWith('/api/blog/') ? post : member });
    });
});

// Check rendered text too: overflow:hidden on a card or the root must not conceal a layout failure.
async function textOverflow(page) {
    return page.evaluate(() => {
        const failures = [];
        const hidden = (el) => {
            for (let n = el; n; n = n.parentElement) {
                const s = getComputedStyle(n);
                if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0' || n.getAttribute('aria-hidden') === 'true' || n.classList.contains('sr-only')) return true;
            }
            return false;
        };
        for (const el of document.querySelectorAll('main *, .site-header__inner *, .site-footer *')) {
            if (hidden(el) || !el.getClientRects().length) continue;
            const style = getComputedStyle(el);
            if (style.textOverflow === 'ellipsis') continue;
            const box = el.getBoundingClientRect();
            for (const node of el.childNodes) {
                if (node.nodeType !== 3 || !node.textContent.trim()) continue;
                const range = document.createRange(); range.selectNode(node);
                const r = range.getBoundingClientRect();
                if (r.width && (r.left < -1 || r.right > innerWidth + 1 || r.left < box.left - 2 || r.right > box.right + 2)) failures.push(el.className || el.tagName);
            }
        }
        return { failures, width: document.documentElement.scrollWidth };
    });
}

for (const [path, ready] of routes) {
    test(`全ページの本文とカードが画面に収まる: ${path.split('/').slice(0, 2).join('/')} ${ready}`, async ({ page }) => {
        await page.goto(path);
        await expect(page.locator(ready).first()).toBeVisible();
        await page.locator('details').evaluateAll((items) => items.forEach((item) => { item.open = true; }));
        for (const size of [16, 20, 24, 32]) {
            await page.evaluate((value) => { document.documentElement.style.fontSize = `${value}px`; }, size);
            for (const width of widths) {
                await page.setViewportSize({ width, height: 900 });
                const layout = await textOverflow(page);
                expect(layout.failures, `${width}px / text ${size}px`).toEqual([]);
                expect(layout.width, `${width}px / text ${size}px`).toBeLessThanOrEqual(width);
            }
        }
    });
}

test('短い横向き画面でもメニュー全項目へスクロールでき、DCCAIより手前で操作できる', async ({ page }) => {
    await page.setViewportSize({ width: 667, height: 375 });
    await page.goto('/');
    await page.getByRole('button', { name: 'DCCAIを開く', exact: true }).click();
    await page.getByRole('button', { name: 'メニューを開く', exact: true }).click();
    const join = page.locator('.site-mobile-menu__join');
    await join.scrollIntoViewIfNeeded();
    const reachable = await join.evaluate((el) => {
        const r = el.getBoundingClientRect();
        return r.top >= 0 && r.bottom <= innerHeight && el.contains(document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2));
    });
    expect(reachable).toBe(true);
    await page.getByRole('button', { name: 'メニューを閉じる', exact: true }).click();
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('');
});

test('DCCAIは短い画面・文字拡大・長い回答でも操作領域を保つ', async ({ page }) => {
    await page.addInitScript((text) => sessionStorage.setItem('dccai-conversation-v1', JSON.stringify([{ role: 'assistant', text }])), `https://example.test/${token}`);
    for (const [width, height] of [[320, 568], [390, 844], [667, 375], [844, 390], [861, 375], [1024, 600], [1440, 375], [390, 260]]) {
        await page.setViewportSize({ width, height });
        await page.goto('/');
        await page.evaluate(() => { document.documentElement.style.fontSize = '20px'; });
        const open = page.getByRole('button', { name: 'DCCAIを開く', exact: true });
        if (await open.isVisible()) await open.click();
        const bounds = await page.locator('.dccai-window').boundingBox();
        expect(bounds.x).toBeGreaterThanOrEqual(0);
        expect(bounds.y).toBeGreaterThanOrEqual(0);
        expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
        expect(bounds.y + bounds.height).toBeLessThanOrEqual(height);
        for (const selector of ['.dccai-input textarea', '.dccai-input button', '.dccai-window__close']) await expect(page.locator(selector)).toBeVisible();
        const input = await page.locator('.dccai-input').boundingBox();
        expect(input.y + input.height).toBeLessThanOrEqual(height);
        const transcript = await page.locator('.dccai-window__transcript').evaluate((el) => ({ width: el.clientWidth, content: el.scrollWidth }));
        expect(transcript.content).toBeLessThanOrEqual(transcript.width);
    }
});

test('中間幅のPCでは本文を覆わず、必要なときにDCCAIを開ける', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/');
    await expect(page.locator('.dccai-window')).toHaveCount(0);
    await page.getByRole('button', { name: 'DCCAIを開く', exact: true }).click();
    await expect(page.locator('.dccai-window')).toBeVisible();
    await page.getByRole('button', { name: 'DCCAIを閉じる', exact: true }).first().click();
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page.locator('.dccai-window')).toHaveCount(0);
    await page.getByRole('button', { name: 'DCCAIを開く', exact: true }).click();
    await expect(page.locator('.dccai-window')).toBeVisible();
});

test('200%の文字サイズでもDCCAIの閉じる・送信ボタンがウィンドウ内に収まる', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/');
    await page.evaluate(() => { document.documentElement.style.fontSize = '32px'; });
    await page.getByRole('button', { name: 'DCCAIを開く', exact: true }).click();
    const dialog = await page.locator('.dccai-window').boundingBox();
    for (const selector of ['.dccai-window__close', '.dccai-input button']) {
        const button = page.locator(selector);
        await button.scrollIntoViewIfNeeded();
        const box = await button.boundingBox();
        expect(box.x).toBeGreaterThanOrEqual(dialog.x);
        expect(box.x + box.width).toBeLessThanOrEqual(dialog.x + dialog.width);
        expect(box.y + box.height).toBeLessThanOrEqual(dialog.y + dialog.height);
    }
});

test('初回アニメーションは横向き・文字拡大でもスキップ案内と重ならない', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.setViewportSize({ width: 667, height: 375 });
    await page.goto('/?opening');
    await page.evaluate(() => { document.documentElement.style.fontSize = '32px'; });
    await expect(page.locator('.opening')).toBeVisible();
    const frame = await page.locator('.opening-window').boundingBox();
    const skip = await page.locator('.opening-skip').boundingBox();
    expect(frame.y).toBeGreaterThanOrEqual(0);
    expect(frame.y + frame.height).toBeLessThanOrEqual(skip.y);
    expect(skip.y + skip.height).toBeLessThanOrEqual(375);
    await page.mouse.click(5, 5);
    await expect(page.locator('.opening')).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('');
});

for (const path of ['/blog', '/members', '/blog/error', '/members/error']) {
    test(`APIエラー表示も狭い画面に収まる: ${path}`, async ({ page }) => {
        await page.route('https://dcc-portal.s1kqr1s.workers.dev/api/**', (route) => route.fulfill({ status: 503, json: {} }));
        await page.setViewportSize({ width: 320, height: 568 });
        await page.goto(path);
        await expect(page.getByText(/読み込みに失敗しました/).first()).toBeVisible();
        const result = await textOverflow(page);
        expect(result.failures).toEqual([]);
        expect(result.width).toBeLessThanOrEqual(320);
    });
}
