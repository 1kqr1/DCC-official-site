import assert from 'node:assert/strict';
import test from 'node:test';
import defaults from '../src/data/site-content.json' with { type: 'json' };
import { mergeSiteContent } from '../src/lib/siteContent.js';

test('編集内容がなければ初期値のまま', () => {
    assert.deepEqual(mergeSiteContent(defaults, {}), defaults);
});

test('文章・リスト・真偽値を置き換え、知らない項目は捨てる', () => {
    const merged = mergeSiteContent(defaults, {
        settings: { showHomeMembers: true, unknown: 1 },
        home: {
            hero: { welcome: '新入生歓迎' },
            faq: { items: [{ q: '質問', a: '答え', extra: 'x' }] },
            about: { fields: ['Web', 3, 'AI'] },
        },
        injected: { evil: true },
    });
    assert.equal(merged.settings.showHomeMembers, true);
    assert.equal(merged.settings.unknown, undefined);
    assert.equal(merged.home.hero.welcome, '新入生歓迎');
    assert.equal(merged.home.hero.origin, defaults.home.hero.origin);
    assert.deepEqual(merged.home.faq.items, [{ q: '質問', a: '答え' }]);
    assert.deepEqual(merged.home.about.fields, ['Web', 'AI']);
    assert.equal(merged.injected, undefined);
});

test('型が違う値は初期値に戻す', () => {
    const merged = mergeSiteContent(defaults, { settings: { showHomeMembers: 'yes' }, home: { faq: { items: 'x' } } });
    assert.equal(merged.settings.showHomeMembers, false);
    assert.deepEqual(merged.home.faq.items, defaults.home.faq.items);
});

test('危ないリンク・画像は受け付けない', () => {
    const merged = mergeSiteContent(defaults, {
        links: { discordInvite: 'javascript:alert(1)', contactForm: 'https://forms.example/new' },
        home: {
            projects: { articleUrl: '//evil.example' },
            room: { image: 'http://insecure.example/a.jpg' },
            about: { gallery: [{ image: 'data:image/png;base64,AAAA', alt: 'a', label: 'A' }, { image: 'https://portal.example/media/site/1', alt: 'b', label: 'B' }] },
        },
    });
    assert.equal(merged.links.discordInvite, defaults.links.discordInvite);
    assert.equal(merged.links.contactForm, 'https://forms.example/new');
    assert.equal(merged.home.projects.articleUrl, defaults.home.projects.articleUrl);
    assert.equal(merged.home.room.image, defaults.home.room.image);
    assert.deepEqual(merged.home.about.gallery.map((g) => g.image), ['', 'https://portal.example/media/site/1']);
});

test('サイト内リンクと同梱画像は使える。空のリンクは「出さない」', () => {
    const merged = mergeSiteContent(defaults, { home: { projects: { articleUrl: '/blog/new' }, room: { image: 'asset:room-05.jpg' } }, business: { worksArticleUrl: '' } });
    assert.equal(merged.home.projects.articleUrl, '/blog/new');
    assert.equal(merged.business.worksArticleUrl, '');
    assert.equal(merged.home.room.image, 'asset:room-05.jpg');
});
