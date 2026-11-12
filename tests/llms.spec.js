import { test, expect } from '@playwright/test';
import { getMarkdownPath, pageSeo, SITE_URL } from '../src/data/seoContent.js';

test('AI向け資料をHTMLではなくテキストとして取得でき、案内先が実在する', async ({ request }) => {
    const response = await request.get('/llms.txt');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/plain');
    const index = await response.text();
    expect(index).toMatch(/^# DCC/);
    expect(index).not.toMatch(/<!doctype|<div|TODO/i);

    const urls = [...index.matchAll(/\]\((https:\/\/[^)]+)\)/g)].map((match) => new URL(match[1]));
    expect(urls.map((url) => url.pathname).sort()).toEqual(Object.keys(pageSeo).map(getMarkdownPath).sort());
    for (const url of urls) {
        expect(url.origin).toBe(SITE_URL);
        const markdown = await request.get(url.pathname);
        expect(markdown.status()).toBe(200);
        expect(markdown.headers()['content-type']).not.toContain('text/html');
        const content = await markdown.text();
        expect(content).toMatch(/^# /);
        expect(content).not.toMatch(/<!doctype|TODO|workers\.dev|\/api\//i);
        expect(content).toContain('元ページ:');
    }
    const home = await (await request.get('/index.md')).text();
    expect(home).toContain('部費はかかりません');
    expect(home).toContain('Discordに参加する');
    const business = await (await request.get('/business.md')).text();
    expect(business).toContain('企業・団体向けお問い合わせフォーム');

    for (const path of Object.keys(pageSeo)) {
        const html = await (await request.get(path)).text();
        expect(html).toContain('<link rel="describedby" href="/llms.txt"');
        expect(html).toContain(`<link rel="alternate" type="text/markdown" href="${SITE_URL}${getMarkdownPath(path)}"`);
    }
});

test('画面遷移でMarkdown資料の案内を切り替え、詳細ページと404には残さない', async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem('dcc_opening_seen', '1'));
    await page.route('https://dcc-portal.s1kqr1s.workers.dev/api/**', (route) => route.fulfill({ json: [] }));
    const alternate = page.locator('link[rel="alternate"][type="text/markdown"]');
    await page.goto('/');
    await expect(alternate).toHaveAttribute('href', `${SITE_URL}/index.md`);
    await page.locator('#about a[href="/business"]').click();
    await expect(alternate).toHaveAttribute('href', `${SITE_URL}/business.md`);
    await expect(alternate).toHaveCount(1);
    await page.goBack();
    await expect(alternate).toHaveAttribute('href', `${SITE_URL}/index.md`);

    for (const path of ['/blog/nonexistent-llms-post', '/members/nonexistent-llms-member', '/nonexistent-llms-page']) {
        await page.goto(path);
        await expect(page.locator('#root')).not.toHaveAttribute('data-prerendered');
        await expect(alternate).toHaveCount(0);
        await expect(page.locator('link[rel="describedby"]')).toHaveAttribute('href', '/llms.txt');
    }
    await page.locator('.site-brand').click();
    await expect(alternate).toHaveAttribute('href', `${SITE_URL}/index.md`);
});
