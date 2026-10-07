import { test, expect } from '@playwright/test';

test.use({ reducedMotion: 'reduce' });

test.beforeEach(async ({ page }) => {
    await page.route('https://dcc-portal.s1kqr1s.workers.dev/api/**', (route) => route.fulfill({ json: [] }));
    // Webフォントが届かない端末でも、代替フォントで崩れないことを確認する。
    await page.route('https://fonts.googleapis.com/**', (route) => route.abort());
    await page.addInitScript(() => sessionStorage.setItem('dcc_opening_seen', '1'));
});

for (const fontSize of [16, 20]) {
    test(`本文の左端とボタンの配置を画面幅に合わせる（文字サイズ ${fontSize}px）`, async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('.editor-hero__code')).toBeVisible();
        await page.evaluate((size) => { document.documentElement.style.fontSize = `${size}px`; }, fontSize);

        for (const width of [320, 360, 390, 412, 560, 561, 600, 768, 860, 861, 1024, 1440]) {
            await page.setViewportSize({ width, height: 1000 });
            const layout = await page.evaluate(() => {
                const rect = (selector) => document.querySelector(selector).getBoundingClientRect();
                const content = rect('.editor-hero__copy > span:last-child');
                const number = rect('.editor-hero__actions > .editor-code__number');
                const buttons = [...document.querySelectorAll('.editor-hero__actions a')].map((el) => {
                    const r = el.getBoundingClientRect();
                    return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, height: r.height };
                });
                const overflow = [...document.querySelectorAll('.editor-hero__code *, .site-header__inner *')]
                    .filter((el) => {
                        const r = el.getBoundingClientRect();
                        return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1 || el.scrollWidth > el.clientWidth + 1);
                    }).map((el) => el.className || el.tagName);
                return {
                    left: content.left,
                    origin: rect('.hero-origin').left,
                    description: rect('.hero-description').left,
                    welcome: rect('.hero-welcome').left,
                    numberTop: number.top,
                    buttons,
                    overflow,
                    documentWidth: document.documentElement.scrollWidth,
                };
            });
            const context = `${width}px / font ${fontSize}px`;
            expect(layout.overflow, context).toEqual([]);
            expect(layout.documentWidth, context).toBeLessThanOrEqual(width);
            expect(Math.abs(layout.description - layout.left), context).toBeLessThan(1);
            expect(Math.abs(layout.welcome - layout.left), context).toBeLessThan(1);
            for (const button of layout.buttons) expect(button.height, context).toBeGreaterThanOrEqual(42);
            if (width <= 560) {
                expect(Math.abs(layout.origin - layout.left), context).toBeLessThan(1);
                expect(layout.buttons[0].bottom, context).toBeLessThan(layout.buttons[1].top);
                expect(layout.numberTop, context).toBeGreaterThanOrEqual(layout.buttons[0].top);
                expect(layout.numberTop, context).toBeLessThan(layout.buttons[0].bottom);
                for (const button of layout.buttons) expect(Math.abs(button.left - layout.left), context).toBeLessThan(1);
            }
        }
    });
}
