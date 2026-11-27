import React from 'react';
import Link from '../components/NavigationLink';
import { BUSINESS_FORM_URL } from '../config';
import { useSeo } from '../seo';
import EditorRouteFrame from '../components/EditorRouteFrame';
import { siteNumber } from '../data/siteSections';
import { siteContent } from '../data/siteContent';
import { RichText, SmartLink } from '../components/RichText';
import './Business.css';

const biz = siteContent.business;

const Business = () => {
    useSeo({ path: '/business' });

    return (
        <EditorRouteFrame file="collaborate.md" type="markdown" number={siteNumber('business')}>
        <div className="business">
            {/* ===== イントロ ===== */}
            <section className="biz-hero">
                <div className="container">
                    <p className="biz-comment">// {biz.comment}</p>
                    <h1 className="biz-title">
                        <RichText text={biz.title} highlight="tok-cyan" />
                    </h1>
                    {biz.leads.map((text, i) => <p className="biz-lead" key={i}><RichText text={text} /></p>)}
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
                    <span className="section-label">01 / WHAT WE OFFER</span>
                    <h2 className="section-heading">{biz.offersHeading}</h2>
                    <div className="offer-grid">
                        {biz.offers.map((o, i) => (
                            <div className="offer-card" key={i}>
                                <span className="offer-num">{String(i + 1).padStart(2, '0')}</span>
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
                    <span className="section-label">02 / WORKS</span>
                    <h2 className="section-heading">{biz.worksHeading}</h2>
                    <div className="biz-work-grid">
                        {biz.works.map((w, i) => (
                            <article className="biz-work" key={i}>
                                <span className="biz-work-file">{w.file}</span>
                                <h3 className="biz-work-title">{w.title}</h3>
                                <p className="biz-work-desc">{w.desc}</p>
                                <div className="biz-work-tags">
                                    {w.tags.map((t) => <span key={t}>{t}</span>)}
                                </div>
                            </article>
                        ))}
                    </div>
                    {biz.worksArticleUrl && (
                        <SmartLink href={biz.worksArticleUrl} className="biz-text-link">
                            {biz.worksArticleLabel} →
                        </SmartLink>
                    )}
                </div>
            </section>

            {/* ===== ご依頼の流れ ===== */}
            <section className="biz-flow">
                <div className="container">
                    <span className="section-label">03 / FLOW</span>
                    <h2 className="section-heading">{biz.flowHeading}</h2>
                    <ol className="flow-list">
                        {biz.flow.map((f, i) => (
                            <li className="flow-step" key={i}>
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
                    <span className="section-label">04 / FAQ</span>
                    <h2 className="section-heading">{biz.faqHeading}</h2>
                    <div className="biz-faq-window">
                        <div className="biz-faq-bar" aria-hidden="true">business-faq.md</div>
                        {biz.faqs.map((f, i) => (
                            <details className="biz-faq-item" key={i}>
                                <summary>
                                    <span className="biz-faq-num">Q{String(i + 1).padStart(2, '0')}</span>
                                    <span className="biz-faq-q">{f.q}</span>
                                    <span className="biz-faq-toggle" aria-hidden="true">+</span>
                                </summary>
                                <p className="biz-faq-a"><RichText text={f.a} /></p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== 問い合わせCTA ===== */}
            <section className="biz-contact" id="contact-form">
                <div className="container">
                    <span className="section-label">05 / CONTACT</span>
                    <h2 className="section-heading">{biz.contactHeading}</h2>
                    <p className="biz-contact-lead"><RichText text={biz.contactLead} /></p>

                    <a
                        href={BUSINESS_FORM_URL}
                        className="btn-cli biz-form-cta"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <span className="cli-prompt">$</span> {biz.contactCta}
                        <span className="arrow">→</span>
                    </a>
                </div>
            </section>
        </div>
        </EditorRouteFrame>
    );
};

export default Business;
