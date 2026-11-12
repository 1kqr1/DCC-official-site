import { test, expect } from '@playwright/test';
import { pageSeo, resolveSeo } from '../src/data/seoContent.js';

test('JavaScriptなしでも本文・ページ固有のメタデータ・画像を取得できる', async ({ browser, request }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    try {
        for (const path of Object.keys(pageSeo)) {
            await page.goto(path);
            const seo = resolveSeo({ path });
            await expect(page).toHaveTitle(seo.title);
            await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', seo.description);
            await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', seo.url);
            await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
            await expect(page.locator('h1')).toHaveCount(1);
            await expect(page.locator('h1')).toBeVisible();
        }
        await page.goto('/');
        await expect(page.getByRole('heading', { name: '周南公立大学で部活・サークルを探している方へ' })).toBeVisible();
        await expect(page.locator('#about')).toContainText('情報科学科');
        const structured = JSON.parse(await page.locator('#dcc-structured-data').textContent());
        expect(structured['@graph'][0].url).toBe('https://shu-dcc.net/');
        for (const src of await page.locator('img').evaluateAll((images) => images.map((image) => image.getAttribute('src')))) {
            expect(src).toMatch(/^\/assets\//);
            expect((await request.get(src)).status()).toBe(200);
        }
        await page.goto('/business');
        await expect(page.locator('.biz-lead').last()).toContainText('産学連携');
        await expect(page.getByRole('link', { name: /お問い合わせフォームを開く/ })).toBeVisible();
        const robots = await request.get('/robots.txt');
        expect(await robots.text()).toContain('Sitemap: https://shu-dcc.net/sitemap.xml');
        const sitemap = await request.get('/sitemap.xml');
        expect(sitemap.headers()['content-type']).toContain('xml');
        const xml = await sitemap.text();
        for (const path of Object.keys(pageSeo)) expect(xml).toContain(`<loc>https://shu-dcc.net${path}</loc>`);
    } finally {
        await context.close();
    }
});

test('ページ移動でcanonical・構造化データ・noindexを正しく切り替える', async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem('dcc_opening_seen', '1'));
    await page.route('https://dcc-portal.s1kqr1s.workers.dev/api/**', (route) => route.fulfill({ json: [] }));
    await page.goto('/');
    await expect(page.locator('#root')).not.toHaveAttribute('data-prerendered');
    await expect(page.locator('#dcc-structured-data')).toHaveCount(1);
    await page.locator('#about a[href="/business"]').click();
    await expect(page).toHaveTitle(resolveSeo({ path: '/business' }).title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://shu-dcc.net/business');
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('#dcc-structured-data')).toHaveCount(0);
    await page.goBack();
    await expect(page.locator('#dcc-structured-data')).toHaveCount(1);
    await page.goto('/missing-seo-page');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
    await page.locator('.site-brand').click();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
});
