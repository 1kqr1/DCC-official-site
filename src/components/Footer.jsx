import React from 'react';
import { HashLink } from 'react-router-hash-link';
import { Link } from 'react-router-dom';
import logo from '../assets/logo-white.png';
import { DISCORD_INVITE, SHOW_HOME_MEMBERS } from '../config';
import './Footer.css';

const footerLinks = [
    { to: '/#about', label: 'About' },
    { to: '/#projects', label: 'Projects' },
    ...(SHOW_HOME_MEMBERS ? [{ to: '/#members', label: 'Members' }] : []),
    { to: '/#news', label: 'News' },
    { to: '/#faq', label: 'よくある質問' },
    { to: '/#join', label: 'Join DCC' },
];

const Footer = () => (
    <footer className="site-footer">
        <div className="site-footer__status" aria-label="サイトステータス">
            <div className="site-footer__status-group">
                <span className="site-footer__branch"><i aria-hidden="true">⑂</i> dcc</span>
                <span><i className="status-ok" aria-hidden="true">✓</i> 0</span>
                <span>△ 0</span>
            </div>
            <div className="site-footer__status-group">
                <span>UTF-8</span>
                <span>LF</span>
                <span>HTML</span>
            </div>
        </div>

        <div className="site-footer__body">
            <div className="site-footer__brand">
                <img src={logo} alt="DCC" />
                <p>つくるで、世界をひらく。<br />周南公立大学発のクリエイターコミュニティ。</p>
            </div>

            <nav className="site-footer__nav" aria-label="フッターナビゲーション">
                {footerLinks.map((link) => (
                    <HashLink key={link.to} smooth to={link.to}>{link.label}</HashLink>
                ))}
            </nav>

            <div className="site-footer__links">
                <a href={DISCORD_INVITE} target="_blank" rel="noreferrer">Discord ↗</a>
                <Link to="/business">企業・団体の方へ →</Link>
            </div>
        </div>

        <div className="site-footer__legal">
            <span>© DCC</span>
            <span>Shunan Public University</span>
            <span>Digital Creators Community</span>
        </div>
    </footer>
);

export default Footer;
