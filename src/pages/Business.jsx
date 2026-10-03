import React from 'react';
import Link from '../components/NavigationLink';
import { BUSINESS_FORM_URL } from '../config';
import { useSeo } from '../seo';
import EditorRouteFrame from '../components/EditorRouteFrame';
import './Business.css';

const offers = [
    {
        n: '01',
        fn: 'sponsor',
        title: '協賛・スポンサー',
        desc: 'イベントや活動へのご支援。ロゴ掲出やコラボ企画など、形は柔軟にご相談いただけます。',
    },
    {
        n: '02',
        fn: 'commission',
        title: '制作依頼',
        desc: 'アプリ・Web・3D・映像・デザイン。学生ならではの発想で、一緒に形にします。',
    },
    {
        n: '03',
        fn: 'recruit',
        title: '採用・インターン',
        desc: '技術好きな学生と出会える場所。インターンや新卒採用のご相談を歓迎します。',
    },
    {
        n: '04',
        fn: 'collab',
        title: '共同開発・コラボ',
        desc: '共同プロジェクトや技術検証など、一緒に手を動かす取り組みを募集しています。',
    },
];

// 企業向けに見せる制作実績。追加するときはこの配列に足すだけでよい。
const works = [
    {
        file: 'dcc-website/',
        title: 'DCC公式サイト',
        desc: 'このサイト自体もメンバーが企画・デザイン・実装・運用まで行っています。',
        tags: ['React', 'Vite', 'Cloudflare'],
    },
    {
        file: 'kodoba/',
        title: 'コドバ。',
        desc: '競技プログラミングのオンライン対戦プラットフォーム。',
        tags: ['Web', 'Realtime'],
    },
    {
        file: 'remote-library/',
        title: 'リモート図書館',
        desc: '漫画の購入先を管理するWebアプリ。',
        tags: ['Web App'],
    },
    {
        file: 'live2d-model/',
        title: '自作Live2Dモデル',
        desc: '下絵からモーションまで、一人で制作したLive2Dモデル。',
        tags: ['Illustration', 'Live2D'],
    },
];

const flow = [
    { cmd: 'contact', title: 'お問い合わせ', desc: 'フォームからご相談内容をお送りください。内容が固まっていなくても大丈夫です。' },
    { cmd: 'meeting', title: 'お打ち合わせ', desc: 'オンラインまたは対面で、目的やご要望、スケジュールを伺います。' },
    { cmd: 'proposal', title: 'ご提案・条件のすり合わせ', desc: '担当できるメンバーと進め方、費用や期間などの条件をご相談します。' },
    { cmd: 'build', title: '制作・実施', desc: '途中経過を共有しながら進めます。' },
    { cmd: 'deliver', title: '納品・振り返り', desc: '成果物をお渡しし、必要に応じて修正や今後のご相談を行います。' },
];

const faqs = [
    {
        q: '費用はかかりますか？',
        a: 'ご依頼の内容や規模によって異なります。お問い合わせの内容を伺ったうえで、個別にご相談させてください。',
    },
    {
        q: '依頼内容がまだ具体的に決まっていません。',
        a: '問題ありません。「こんなことはできる？」という段階からお気軽にご相談ください。一緒に形を考えます。',
    },
    {
        q: '学生だけで対応できますか？',
        a: '内容に合うスキルを持ったメンバーが担当します。対応が難しい内容の場合は、その旨を正直にお伝えします。',
    },
    {
        q: 'どのくらいの期間がかかりますか？',
        a: '内容によって変わります。メンバーは学業と両立して活動しているため、試験期間などは進みがゆっくりになることがあります。余裕のあるスケジュールでご相談いただけると助かります。',
    },
];

const Business = () => {
    useSeo({
        title: '企業・団体の方へ',
        description: 'DCCへの協賛・制作依頼・インターン・共同開発のご相談を受け付けています。',
        path: '/business',
    });

    return (
        <EditorRouteFrame file="collaborate.md" type="markdown" number="09">
        <div className="business">
            {/* ===== イントロ ===== */}
            <section className="biz-hero">
                <div className="container">
                    <p className="biz-comment">// 企業・団体の皆さまへ</p>
                    <h1 className="biz-title">
                        学生と<span className="tok-cyan">一緒に</span>、<br />
                        何かつくりませんか？
                    </h1>
                    <p className="biz-lead">
                        DCC（Digital Creators Community）は、周南公立大学の学生を中心とした
                        Discordベースのクリエイターコミュニティです。協賛・制作依頼・採用・共同開発など、
                        企業・団体の皆さまとの関わりを歓迎しています。
                    </p>
                    <div className="biz-hero-actions">
                        <a href={BUSINESS_FORM_URL} className="btn-cli" target="_blank" rel="noreferrer">
                            <span className="cli-prompt">$</span> お問い合わせ <span aria-hidden="true">↗</span>
                        </a>
                        <Link to="/business#works" className="btn-ghost">実績を見る ↓</Link>
                    </div>
                </div>
            </section>

            {/* ===== 関わり方 ===== */}
            <section className="biz-offers">
                <div className="container">
                    <span className="section-label">01 // WHAT WE OFFER</span>
                    <h2 className="section-heading">できる関わり方</h2>
                    <div className="offer-grid">
                        {offers.map((o) => (
                            <div className="offer-card" key={o.n}>
                                <span className="offer-num">{o.n}</span>
                                <code className="offer-code">
                                    <span className="tok-var">dcc</span>.
                                    <span className="tok-func">{o.fn}</span>()
                                </code>
                                <h3 className="offer-title">{o.title}</h3>
                                <p className="offer-desc">{o.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== 実績 ===== */}
            <section className="biz-works" id="works">
                <div className="container">
                    <span className="section-label">02 // WORKS</span>
                    <h2 className="section-heading">メンバーの制作実績</h2>
                    <div className="biz-work-grid">
                        {works.map((w) => (
                            <article className="biz-work" key={w.file}>
                                <span className="biz-work-file">{w.file}</span>
                                <h3 className="biz-work-title">{w.title}</h3>
                                <p className="biz-work-desc">{w.desc}</p>
                                <div className="biz-work-tags">
                                    {w.tags.map((t) => <span key={t}>{t}</span>)}
                                </div>
                            </article>
                        ))}
                    </div>
                    <Link to="/blog/2026-07-31-summer-showcase" className="biz-text-link">
                        作品を紹介した成果物発表会の記事を読む →
                    </Link>
                </div>
            </section>

            {/* ===== ご依頼の流れ ===== */}
            <section className="biz-flow">
                <div className="container">
                    <span className="section-label">03 // FLOW</span>
                    <h2 className="section-heading">ご依頼の流れ</h2>
                    <ol className="flow-list">
                        {flow.map((f, i) => (
                            <li className="flow-step" key={f.cmd}>
                                <span className="flow-num">{String(i + 1).padStart(2, '0')}</span>
                                <div>
                                    <code className="flow-cmd"><span className="cli-prompt">$</span> {f.cmd}</code>
                                    <h3 className="flow-title">{f.title}</h3>
                                    <p className="flow-desc">{f.desc}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* ===== よくある質問 ===== */}
            <section className="biz-faq">
                <div className="container">
                    <span className="section-label">04 // FAQ</span>
                    <h2 className="section-heading">よくあるご質問</h2>
                    <div className="biz-faq-window">
                        <div className="biz-faq-bar" aria-hidden="true">business-faq.md</div>
                        {faqs.map((f, i) => (
                            <details className="biz-faq-item" key={f.q}>
                                <summary>
                                    <span className="biz-faq-num">Q{String(i + 1).padStart(2, '0')}</span>
                                    <span className="biz-faq-q">{f.q}</span>
                                    <span className="biz-faq-toggle" aria-hidden="true">+</span>
                                </summary>
                                <p className="biz-faq-a">{f.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== 問い合わせCTA ===== */}
            <section className="biz-contact" id="contact-form">
                <div className="container">
                    <span className="section-label">05 // CONTACT</span>
                    <h2 className="section-heading">お問い合わせ</h2>
                    <p className="biz-contact-lead">
                        協賛・制作依頼・採用・共同開発など、どんなご相談でも歓迎です。
                        フォームの内容を確認のうえ、担当者からメールでご連絡します。
                    </p>

                    <a
                        href={BUSINESS_FORM_URL}
                        className="btn-cli biz-form-cta"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <span className="cli-prompt">$</span> お問い合わせフォームを開く
                        <span className="arrow">→</span>
                    </a>
                </div>
            </section>
        </div>
        </EditorRouteFrame>
    );
};

export default Business;
