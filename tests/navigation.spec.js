import { test, expect } from '@playwright/test';

const posts = Array.from({ length: 20 }, (_, i) => ({
    slug: `fixture-${i}`, title: `遷移検証用の記事 ${i}`, publishedAt: '2026-09-01T00:00:00Z',
    excerpt: '公開データではない、ブラウザテスト専用の文章です。', tags: ['test'],
}));
const article = (slug) => ({
    ...posts.find((post) => post.slug === slug),
    blocks: Array.from({ length: 35 }, () => ({ type: 'text', text: '記事本文のスクロールとページ遷移を確認するためのテスト専用の文章です。' })),
});
const member = (id) => ({ id, name: `検証用メンバー ${id}`, bio: 'テスト専用のプロフィール', works: [] });
const api = 'https://dcc-portal.s1kqr1s.workers.dev/api/';

test.beforeEach(async ({ page }) => {
    // 外部サービスや公開データの変更から、遷移の検証を独立させる。
    await page.route(`${api}**`, (route) => {
        const path = new URL(route.request().url()).pathname;
        const data = path === '/api/blog' ? posts
            : path.startsWith('/api/blog/') ? article(decodeURIComponent(path.split('/').at(-1)))
            : path === '/api/members' ? [member('one'), member('two')]
            : member(path.split('/').at(-1));
        return route.fulfill({ json: data, headers: { 'access-control-allow-origin': '*' } });
    });
    await page.route('https://fonts.googleapis.com/**', (route) => route.abort());
    await page.addInitScript(() => {
        sessionStorage.setItem('dcc_opening_seen', '1');
        window.__viewTransitionCalls = 0;
        if (document.startViewTransition) {
            const original = document.startViewTransition.bind(document);
            document.startViewTransition = (...args) => {
                window.__viewTransitionCalls++;
                return original(...args);
            };
        }
    });
});

async function clickLink(page, selector) {
    await page.locator(selector).first().evaluate((link) => link.click());
}

async function scrollTo(page, top) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), top);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(top);
}

async function expectHeader(page) {
    await expect(page.locator('.site-header')).toBeVisible();
    const rect = await page.locator('.site-header').boundingBox();
    expect(Math.abs(rect.y)).toBeLessThan(1);
    expect(rect.height).toBeGreaterThanOrEqual(60);
    expect(await page.evaluate(() => window.__viewTransitionCalls)).toBe(0);
}

async function expectAnchor(page, selector) {
    await expect.poll(() => page.locator(selector).evaluate((el) => {
        const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)
            + parseFloat(getComputedStyle(el).scrollMarginTop);
        return Math.abs(el.getBoundingClientRect().top - offset);
    })).toBeLessThanOrEqual(2);
}

test('URL・DOM・スクロールを最初の描画から一致させ、ヘッダーを保持する', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.editor-home')).toBeVisible();
    await scrollTo(page, 1400);
    const result = await page.evaluate(() => new Promise((resolve) => {
        const header = document.querySelector('.site-header');
        const snapshot = () => ({
            path: location.pathname,
            oldPage: Boolean(document.querySelector('.editor-home')),
            sameHeader: document.querySelector('.site-header') === header,
            top: document.querySelector('.site-header').getBoundingClientRect().top,
            scroll: window.scrollY,
            headingOpacity: getComputedStyle(document.querySelector('.blog-header')).opacity,
        });
        document.querySelector('a[href="/blog"]').click();
        const immediate = snapshot();
        requestAnimationFrame(() => resolve({ immediate, frame: snapshot() }));
    }));
    for (const state of Object.values(result)) {
        expect(state).toEqual({ path: '/blog', oldPage: false, sameHeader: true, top: 0, scroll: 0, headingOpacity: '1' });
    }
    await expectHeader(page);
});

test('APIが遅くても新ページと読み込み表示へ即時に切り替わる', async ({ page }) => {
    let release;
    const pending = new Promise((resolve) => { release = resolve; });
    await page.route(`${api}blog`, async (route) => {
        await pending;
        await route.fulfill({ json: posts });
    });
    try {
        await page.goto('/');
        await scrollTo(page, 1200);
        await clickLink(page, 'a[href="/blog"]');
        await expect(page).toHaveURL('/blog');
        await expect(page.locator('.blog-heading')).toBeVisible();
        await expect(page.locator('.blog-empty')).toHaveText('読み込み中...');
        await expect(page.locator('.editor-home')).toHaveCount(0);
        await expectHeader(page);
    } finally { release(); }
    await expect(page.locator('.blog-card')).toHaveCount(20);
});

test('記事プレビューを即時表示し、遅い本文取得を待っても旧ページを残さない', async ({ page }) => {
    let release;
    const pending = new Promise((resolve) => { release = resolve; });
    await page.route(`${api}blog/fixture-0`, async (route) => {
        await pending;
        await route.fulfill({ json: article('fixture-0') });
    });
    try {
        await page.goto('/blog');
        await expect(page.locator('.blog-card')).toHaveCount(20);
        await clickLink(page, '.blog-card[href="/blog/fixture-0"]');
        await expect(page.locator('.blog-post-title')).toHaveText(posts[0].title);
        await expect(page.locator('.blog-post-body')).toHaveText('本文を読み込み中...');
        await expect(page.locator('.blog-grid')).toHaveCount(0);
        expect(await page.evaluate(() => scrollY)).toBe(0);
        await expectHeader(page);
    } finally { release(); }
    await expect(page.locator('.blog-post-body p')).toHaveCount(35);
});

test('高速の連続クリックでは最後に選んだページが同期的に表示される', async ({ page }) => {
    await page.goto('/');
    const state = await page.evaluate(() => {
        const header = document.querySelector('.site-header');
        for (let i = 0; i < 20; i++) {
            document.querySelector('.site-brand').click();
            document.querySelector('.site-footer a[href="/business"]').click();
        }
        return { path: location.pathname, business: Boolean(document.querySelector('.biz-hero')), sameHeader: header === document.querySelector('.site-header') };
    });
    expect(state).toEqual({ path: '/business', business: true, sameHeader: true });
    await expectHeader(page);
    expect(await page.evaluate(() => scrollY)).toBe(0);
});

test('戻る・進むでは各履歴のスクロール位置を復元する', async ({ page }) => {
    await page.goto('/');
    await scrollTo(page, 1300);
    await clickLink(page, 'a[href="/blog"]');
    await expect(page.locator('.blog-card')).toHaveCount(20);
    await scrollTo(page, 500);
    await clickLink(page, '.site-footer a[href="/business"]');
    await page.goBack();
    await expect(page.locator('.blog-heading')).toBeVisible();
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(500);
    await expectHeader(page);
    await page.goBack();
    await expect(page.locator('.editor-home')).toBeVisible();
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(1300);
    await page.goForward();
    await expect(page.locator('.blog-heading')).toBeVisible();
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(500);
    expect(await page.evaluate(() => history.scrollRestoration)).toBe('manual');
    await expectHeader(page);
});

for (const hash of ['#top', '#about']) {
    test(`ハッシュ付きの履歴 ${hash} でも戻る・進むで読んでいた位置を復元する`, async ({ page }) => {
        await page.goto('/business');
        await clickLink(page, '.site-brand');
        if (hash !== '#top') await clickLink(page, `.site-header__link[href="/${hash}"]`);
        await scrollTo(page, 1300);
        await clickLink(page, '.site-footer a[href="/business"]');
        await scrollTo(page, 500);
        await clickLink(page, '.site-brand');
        await page.goBack();
        await expect(page.locator('.business')).toBeAttached();
        await expect.poll(() => page.evaluate(() => scrollY)).toBe(500);
        await page.goBack();
        await expect(page).toHaveURL(`/${hash}`);
        await expect.poll(() => page.evaluate(() => scrollY)).toBe(1300);
        await page.goForward();
        await expect(page.locator('.business')).toBeAttached();
        await expect.poll(() => page.evaluate(() => scrollY)).toBe(500);
        await expectHeader(page);
    });
}

test('ハッシュ付きページを再読み込みしても読んでいた位置を失わない', async ({ page }) => {
    await page.goto('/business');
    await clickLink(page, '.site-brand');
    await scrollTo(page, 1300);
    await page.reload();
    await expect(page).toHaveURL('/#top');
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(1300);
    await expectHeader(page);
});

test('初回のアンカーURLと別ページからのアンカー移動を描画前に合わせる', async ({ page }) => {
    await page.goto('/#about');
    await expectAnchor(page, '#about');
    await clickLink(page, '.site-footer a[href="/business"]');
    await clickLink(page, '.site-header__link[href="/#projects"]');
    await expect(page).toHaveURL('/#projects');
    await expectAnchor(page, '#projects');
    await expectHeader(page);
});

test('記事に戻る際、APIの再取得が遅くても本文の高さとスクロール位置を復元する', async ({ page }) => {
    let release;
    let requests = 0;
    const pending = new Promise((resolve) => { release = resolve; });
    await page.route(`${api}blog/fixture-0`, async (route) => {
        if (++requests > 1) await pending;
        await route.fulfill({ json: article('fixture-0') });
    });
    try {
        await page.goto('/blog/fixture-0');
        await expect(page.locator('.blog-post-body p')).toHaveCount(35);
        await scrollTo(page, 1400);
        await clickLink(page, '.site-footer a[href="/business"]');
        await page.goBack();
        await expect(page.locator('.blog-post-body p')).toHaveCount(35);
        await expect.poll(() => page.evaluate(() => scrollY)).toBe(1400);
        await expectHeader(page);
    } finally { release(); }
});

test('本文取得が遅い再読み込みでも、描画の準備ができたときに履歴の位置を復元する', async ({ page }) => {
    let release;
    let requests = 0;
    const pending = new Promise((resolve) => { release = resolve; });
    await page.route(`${api}blog/fixture-0`, async (route) => {
        if (++requests > 1) await pending;
        await route.fulfill({ json: article('fixture-0') });
    });
    try {
        await page.goto('/blog/fixture-0');
        await expect(page.locator('.blog-post-body p')).toHaveCount(35);
        await scrollTo(page, 1400);
        await page.reload();
        await expect(page.locator('.blog-notfound')).toHaveText('読み込み中...');
    } finally { release(); }
    await expect(page.locator('.blog-post-body p')).toHaveCount(35);
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(1400);
    await expectHeader(page);
});

test('本文を待つ間に利用者が操作したら、遅い復元で位置を上書きしない', async ({ page, isMobile }) => {
    let release;
    let requests = 0;
    const pending = new Promise((resolve) => { release = resolve; });
    await page.route(`${api}blog/fixture-0`, async (route) => {
        if (++requests > 1) await pending;
        await route.fulfill({ json: article('fixture-0') });
    });
    try {
        await page.goto('/blog/fixture-0');
        await expect(page.locator('.blog-post-body p')).toHaveCount(35);
        await scrollTo(page, 1400);
        await page.reload();
        await expect(page.locator('.blog-notfound')).toHaveText('読み込み中...');
        if (isMobile) {
            // モバイルWebKitはwheel未対応。タッチ操作後に利用者の位置を選ぶ。
            await page.locator('.blog-notfound').tap();
            await scrollTo(page, 0);
        } else {
            await page.mouse.wheel(0, -10000);
        }
        await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
    } finally { release(); }
    await expect(page.locator('.blog-post-body p')).toHaveCount(35);
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
    await expectHeader(page);
});

test('スマホメニューを閉じてから遷移し、スクロールロックを残さない', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/blog');
    await page.locator('.site-menu-toggle').click();
    await expect(page.locator('.site-menu-toggle')).toHaveAttribute('aria-expanded', 'true');
    await clickLink(page, '.site-mobile-menu__link[href="/#about"]');
    await expect(page).toHaveURL('/#about');
    await expect(page.locator('.site-menu-toggle')).toHaveAttribute('aria-expanded', 'false');
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
    await expectHeader(page);
    await page.locator('.site-menu-toggle').click();
    await page.setViewportSize({ width: 1280, height: 844 });
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('');
});

test('指定幅・境界幅・80〜150%ズーム相当の幅でヘッダーの高さとナビを保持する', async ({ page }) => {
    await page.goto('/');
    const widths = [320, 375, 390, 430, 768, 860, 861, 869, 870, 871, 1024, 1180, 1181, 1280, 1440, 1920,
        ...[0.8, 0.9, 1, 1.1, 1.25, 1.5].map((zoom) => Math.round(1280 / zoom))];
    for (const width of widths) {
        await page.setViewportSize({ width, height: 900 });
        // Safari系では常時表示のスクロールバー幅がメディアクエリの幅に影響する。
        const desktop = await page.evaluate(() => matchMedia('(min-width: 861px)').matches);
        await expect(page.locator('.site-header')).toHaveCSS('height', desktop ? '69px' : '61px');
        const geometry = await page.locator('.site-header').evaluate((el) => ({
            width: el.clientWidth, contentWidth: el.scrollWidth, height: el.getBoundingClientRect().height,
            top: el.getBoundingClientRect().top,
            navHeight: el.querySelector('.site-header__nav').getBoundingClientRect().height,
        }));
        expect(geometry.contentWidth, `${width}px`).toBeLessThanOrEqual(geometry.width);
        expect(geometry.height, `${width}px`).toBe(desktop ? 69 : 61);
        expect(geometry.top, `${width}px`).toBe(0);
        expect(geometry.navHeight > 0, `${width}px`).toBe(desktop);
    }
});

test('フォントの読み込み待ちでも遷移やヘッダーの高さを止めない', async ({ page }) => {
    let release;
    const pending = new Promise((resolve) => { release = resolve; });
    await page.route('**/delayed-header.woff2', async (route) => { await pending; await route.abort(); });
    try {
        await page.goto('/');
        await page.evaluate(() => {
            const font = new FontFace('DCCDelayedTestFont', 'url(/delayed-header.woff2)');
            document.fonts.add(font);
            document.documentElement.style.setProperty('--font-mono', 'DCCDelayedTestFont, monospace');
            font.load().catch(() => {});
        });
        expect(await page.evaluate(() => document.fonts.status)).toBe('loading');
        const before = await page.locator('.site-header').boundingBox();
        await clickLink(page, 'a[href="/blog"]');
        await expect(page.locator('.blog-heading')).toBeVisible();
        const after = await page.locator('.site-header').boundingBox();
        expect(after.height).toBe(before.height);
        await expectHeader(page);
    } finally { release(); }
});

test('CPUを6倍遅くしても最初のフレームに旧ページを残さない', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'CPUの制限はChromiumのDevTools Protocolで検証する');
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 6 });
    await page.goto('/');
    await scrollTo(page, 1200);
    const state = await page.evaluate(() => new Promise((resolve) => {
        document.querySelector('a[href="/blog"]').click();
        requestAnimationFrame(() => resolve({ path: location.pathname, oldPage: Boolean(document.querySelector('.editor-home')), scroll: scrollY }));
    }));
    expect(state).toEqual({ path: '/blog', oldPage: false, scroll: 0 });
    await expectHeader(page);
});

test('初回オープニングとキャッシュ済み再訪問の後でもヘッダーを保持する', async ({ page }) => {
    await page.goto('/?opening');
    await expect(page.locator('.opening')).toBeVisible();
    await page.locator('.opening').click();
    await expect(page.locator('.opening')).toHaveCount(0);
    await expectHeader(page);
    await clickLink(page, 'a[href="/blog"]');
    await expect(page.locator('.blog-card')).toHaveCount(20);
    await clickLink(page, '.site-brand');
    await expect(page.locator('.opening')).toHaveCount(0);
    await clickLink(page, 'a[href="/blog"]');
    await expect(page.locator('.blog-card')).toHaveCount(20);
    await expectHeader(page);
});

test('動きを減らす設定とスクロール進捗のJSフォールバックでも操作できる', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript(() => {
        const supports = CSS.supports.bind(CSS);
        CSS.supports = (...args) => String(args[0]).includes('animation-timeline') ? false : supports(...args);
    });
    await page.goto('/');
    await scrollTo(page, 1200);
    await expect.poll(() => page.evaluate(() => Number(getComputedStyle(document.documentElement).getPropertyValue('--scroll-progress')))).toBeGreaterThan(0);
    await clickLink(page, 'a[href="/blog"]');
    await expectHeader(page);
    expect(await page.evaluate(() => scrollY)).toBe(0);
    await expect(page.locator('.blog-header')).toHaveCSS('opacity', '1');
});
