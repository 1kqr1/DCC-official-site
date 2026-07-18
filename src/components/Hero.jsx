import React from 'react';
import { HashLink } from 'react-router-hash-link';
import { DISCORD_INVITE } from '../config';
import './Hero.css';

const Hero = () => {
    return (
        <section id="hero" className="hero">
            <div className="hero-grid-overlay" aria-hidden="true"></div>

            <div className="hero-inner">
                <div className="hero-code">
                    <p className="row row-comment">
                        <span className="ln" aria-hidden="true">1</span>
                        <span className="lc">// 周南公立大学発 — Discordベースのクリエイターコミュニティ</span>
                    </p>

                    <div className="row row-blank" aria-hidden="true">
                        <span className="ln">2</span><span className="lc"></span>
                    </div>

                    <h1 className="hero-h1">
                        <span className="row">
                            <span className="ln" aria-hidden="true">3</span>
                            <span className="lc title">誰もが<span className="tok-cyan">クリエイター</span>に</span>
                        </span>
                        <span className="row">
                            <span className="ln" aria-hidden="true">4</span>
                            <span className="lc title">なれる場所。</span>
                        </span>
                    </h1>

                    <div className="row row-blank" aria-hidden="true">
                        <span className="ln">5</span><span className="lc"></span>
                    </div>

                    <p className="hero-sub">
                        <span className="row">
                            <span className="ln" aria-hidden="true">6</span>
                            <span className="lc sub">アプリ開発・3Dプリンタ・デジタルアート。</span>
                        </span>
                        <span className="row">
                            <span className="ln" aria-hidden="true">7</span>
                            <span className="lc sub">コンピュータサイエンスで<span className="tok-str">&quot;遊ぶ&quot;</span>デジタル秘密基地。</span>
                        </span>
                    </p>

                    <div className="row row-blank" aria-hidden="true">
                        <span className="ln">8</span><span className="lc"></span>
                    </div>

                    <div className="row row-actions">
                        <span className="ln" aria-hidden="true">9</span>
                        <span className="lc">
                            <span className="hero-actions">
                                <a href={DISCORD_INVITE} className="btn-cli" target="_blank" rel="noreferrer">
                                    <span className="cli-prompt">$</span> join --dcc
                                </a>
                                <HashLink smooth to="/#works" className="btn-ghost">
                                    作品を見る <span className="arrow">→</span>
                                </HashLink>
                            </span>
                        </span>
                    </div>
                </div>

                <a
                    href={DISCORD_INVITE}
                    className="discord-card"
                    target="_blank"
                    rel="noreferrer"
                >
                    <span className="discord-glyph" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.32 4.57A19.8 19.8 0 0 0 15.4 3.05a13.7 13.7 0 0 0-.63 1.28 18.3 18.3 0 0 0-5.51 0 13.6 13.6 0 0 0-.63-1.28A19.7 19.7 0 0 0 3.68 4.57 20.26 20.26 0 0 0 .2 18.28a19.9 19.9 0 0 0 6.07 3.06c.49-.67.93-1.38 1.3-2.12a12.9 12.9 0 0 1-2.05-.98c.17-.13.34-.26.5-.4a14.2 14.2 0 0 0 12.16 0c.16.14.33.27.5.4-.65.39-1.34.72-2.05.99.37.74.81 1.45 1.3 2.11a19.8 19.8 0 0 0 6.07-3.06 20.23 20.23 0 0 0-3.48-13.71ZM8.02 15.33c-1.18 0-2.15-1.09-2.15-2.42 0-1.34.95-2.43 2.15-2.43 1.2 0 2.17 1.1 2.15 2.43 0 1.33-.95 2.42-2.15 2.42Zm7.96 0c-1.18 0-2.15-1.09-2.15-2.42 0-1.34.95-2.43 2.15-2.43 1.2 0 2.17 1.1 2.15 2.43 0 1.33-.94 2.42-2.15 2.42Z" />
                        </svg>
                    </span>
                    <span className="discord-meta">
                        <span className="discord-label">Discord Community</span>
                        <span className="discord-sublabel">オンラインで集まる、DCCの本拠地</span>
                    </span>
                    <span className="discord-cta">参加する<span className="arrow">→</span></span>
                </a>
            </div>
        </section>
    );
};

export default Hero;
