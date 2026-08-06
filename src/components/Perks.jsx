import React from 'react';
import { HashLink } from 'react-router-hash-link';
import { DISCORD_INVITE } from '../config';
import './Perks.css';

// DCC AI / DCC git は詳細確認中のため仮表示（本文・リンクは確定次第差し替え）
const perks = [
    {
        n: '01',
        fn: 'discord()',
        title: 'Discord Community',
        desc: '質問も雑談もイベント告知も、まずはここから。DCCの本拠地です。',
        cta: { label: '参加する', href: DISCORD_INVITE, external: true },
        draft: false,
    },
    {
        n: '02',
        fn: 'room()',
        title: '部室・機材',
        desc: 'ゲーミングPC・VR機器・3Dプリンタなど、大学の部室を自由に使えます。',
        cta: { label: '詳しく見る', href: '/#room', external: false },
        draft: false,
    },
    {
        n: '03',
        fn: 'ai()',
        title: 'DCC AI',
        desc: '詳細確認中です。決まり次第こちらに追記します。',
        cta: null,
        draft: true,
    },
    {
        n: '04',
        fn: 'git()',
        title: 'DCC git',
        desc: '詳細確認中です。決まり次第こちらに追記します。',
        cta: null,
        draft: true,
    },
];

const Perks = () => {
    return (
        <section id="perks" className="perks">
            <div className="container">
                <div className="perks-header" data-reveal>
                    <span className="section-label">05 // BENEFITS</span>
                    <h2 className="section-heading">入部特典</h2>
                    <p className="perks-sub">// Discordに参加すると、これが使えます。</p>
                </div>

                <div className="perks-grid">
                    {perks.map((p, i) => (
                        <div
                            className={`perk-card ${p.draft ? 'is-draft' : ''}`}
                            key={p.n}
                            data-reveal
                            style={{ '--reveal-delay': `${i * 0.08}s` }}
                        >
                            <div className="perk-top">
                                <span className="perk-num">{p.n}</span>
                                {p.draft && <span className="perk-draft-badge">確認中</span>}
                            </div>
                            <code className="perk-code">
                                <span className="tok-var">dcc</span>.
                                <span className="tok-func">{p.fn}</span>
                            </code>
                            <h3 className="perk-title">{p.title}</h3>
                            <p className="perk-desc">{p.desc}</p>
                            {p.cta && (
                                p.cta.external ? (
                                    <a href={p.cta.href} className="perk-cta" target="_blank" rel="noreferrer">
                                        {p.cta.label} <span className="arrow">→</span>
                                    </a>
                                ) : (
                                    <HashLink smooth to={p.cta.href} className="perk-cta">
                                        {p.cta.label} <span className="arrow">→</span>
                                    </HashLink>
                                )
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Perks;
