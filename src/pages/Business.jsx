import React from 'react';
import { HashLink } from 'react-router-hash-link';
import { BUSINESS_FORM_URL } from '../config';
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
        desc: 'アプリ・Web・3D・映像・デザイン。学生ならではの発想とスピードで形にします。',
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

const skills = ['React', 'TypeScript', 'Unity', 'Blender', 'Fusion360', 'Figma', 'Procreate', 'TouchDesigner', 'Python', 'AI'];

const Business = () => {
    return (
        <div className="business">
            {/* ===== イントロ ===== */}
            <section className="biz-hero">
                <div className="container">
                    <p className="biz-comment">// 企業・団体の皆さまへ</p>
                    <h1 className="biz-title">
                        学生クリエイターと、<br />
                        <span className="tok-cyan">一緒に</span>つくる。
                    </h1>
                    <p className="biz-lead">
                        DCC（Digital Creators Community）は、周南公立大学の学生を中心とした
                        Discordベースのクリエイターコミュニティです。協賛・制作依頼・採用・共同開発など、
                        企業・団体の皆さまとの関わりを歓迎しています。
                    </p>
                    <div className="biz-hero-actions">
                        <HashLink smooth to="/business#contact-form" className="btn-cli">
                            <span className="cli-prompt">$</span> お問い合わせ
                        </HashLink>
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

            {/* ===== スキル ===== */}
            <section className="biz-skills">
                <div className="container">
                    <span className="section-label">02 // STACK</span>
                    <h2 className="section-heading">得意な分野</h2>
                    <div className="skill-tags">
                        {skills.map((s) => (
                            <span className="skill-tag" key={s}>{s}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== 問い合わせCTA ===== */}
            <section className="biz-contact" id="contact-form">
                <div className="container">
                    <span className="section-label">03 // CONTACT</span>
                    <h2 className="section-heading">お問い合わせ</h2>
                    <p className="biz-contact-lead">
                        協賛・制作依頼・採用・共同開発など、どんなご相談でも歓迎です。
                        下のボタンからお問い合わせフォームへお進みください。
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
    );
};

export default Business;
