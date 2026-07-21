import React from 'react';
import { HashLink } from 'react-router-hash-link';
import logo from '../assets/logo-white.png';
import { DISCORD_INVITE } from '../config';
import './Footer.css';

// ヘッダーのタブと同じ構成に揃える（LPの各セクションはスクロールで閲覧）
const footerLinks = [
    { to: '/#hero', label: 'home' },
    { to: '/business', label: 'business' },
    { to: '/blog', label: 'blog' },
    { to: '/#contact', label: 'contact' },
];

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-top">
                    <div className="footer-brand">
                        <img src={logo} alt="DCC" className="footer-logo-img" />
                        <p className="footer-tagline">// パソコンで遊ぶ、デジタル秘密基地。</p>
                        <a href={DISCORD_INVITE} className="footer-join" target="_blank" rel="noreferrer">
                            <span className="footer-prompt">$</span> join --dcc
                        </a>
                    </div>
                    <nav className="footer-nav" aria-label="フッターナビゲーション">
                        {footerLinks.map((link) => (
                            <HashLink key={link.label} smooth to={link.to} className="footer-nav-link">
                                {link.label}
                            </HashLink>
                        ))}
                    </nav>
                </div>

                {/* エディタのステータスバー風 */}
                <div className="footer-statusbar">
                    <div className="fs-group">
                        <span className="fs-item fs-branch">git:(<em>main</em>)</span>
                        <span className="fs-item">UTF-8</span>
                        <span className="fs-item">LF</span>
                        <a href={DISCORD_INVITE} className="fs-item fs-online" target="_blank" rel="noreferrer">
                            <i className="fs-dot"></i> online — Discord
                        </a>
                    </div>
                    <div className="fs-group">
                        <span className="fs-item">© Digital Creators Community</span>
                        <span className="fs-item">Shunan Public University</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
