import React, { useState, useEffect } from 'react';
import { HashLink } from 'react-router-hash-link';
import { useLocation } from 'react-router-dom';
import { DISCORD_INVITE } from '../config';
import './Header.css';

// エディタのファイルタブに見立てたナビゲーション（LPの各セクションはスクロールで閲覧）
const navTabs = [
    { to: '/#hero', file: 'home', ext: 'tsx', color: 'var(--syn-func)' },
    { to: '/business', file: 'business', ext: 'tsx', color: 'var(--syn-func)' },
    { to: '/blog', file: 'blog', ext: 'md', color: 'var(--syn-var)' },
    { to: '/#contact', file: 'contact', ext: 'sh', color: 'var(--syn-string)' },
];

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    // 企業ページは Discord に入れない前提なので join ボタンを隠す
    const isBusiness = location.pathname.startsWith('/business');

    const close = () => setIsOpen(false);

    // メニューを開いている間は背面のスクロールを止める
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const isActive = (tab) => {
        if (tab.to === '/blog') return location.pathname.startsWith('/blog');
        if (tab.to === '/business') return location.pathname.startsWith('/business');
        return location.pathname === '/' && tab.file === 'home';
    };

    return (
        <>
            <header className="header">
                <div className="header-bar">
                    <div className="win-dots" aria-hidden="true">
                        <span className="dot dot-r"></span>
                        <span className="dot dot-y"></span>
                        <span className="dot dot-g"></span>
                    </div>

                    <nav className="tabs" aria-label="メインナビゲーション">
                        {navTabs.map((tab) => (
                            <HashLink
                                key={tab.to}
                                smooth
                                to={tab.to}
                                className={`tab ${isActive(tab) ? 'active' : ''}`}
                            >
                                <span className="tab-dot" style={{ background: tab.color }}></span>
                                <span className="tab-name">
                                    {tab.file}<span className="tab-ext">.{tab.ext}</span>
                                </span>
                            </HashLink>
                        ))}
                    </nav>

                    {!isBusiness && (
                        <a
                            href={DISCORD_INVITE}
                            className="cli-btn"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <span className="cli-prompt">$</span> join --dcc
                        </a>
                    )}

                    <button
                        type="button"
                        className={`nav-toggle ${isOpen ? 'open' : ''}`}
                        aria-label={isOpen ? 'メニューを閉じる' : 'メニューを開く'}
                        aria-expanded={isOpen}
                        aria-controls="mobile-menu"
                        onClick={() => setIsOpen((v) => !v)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </header>

            <div
                id="mobile-menu"
                className={`mobile-menu ${isOpen ? 'open' : ''}`}
                onClick={close}
            >
                <nav className="mobile-nav">
                    {navTabs.map((tab) => (
                        <HashLink
                            key={tab.to}
                            smooth
                            to={tab.to}
                            className="mobile-nav-link"
                            onClick={close}
                        >
                            <span className="tab-dot" style={{ background: tab.color }}></span>
                            {tab.file}<span className="tab-ext">.{tab.ext}</span>
                        </HashLink>
                    ))}
                    {!isBusiness && (
                        <a
                            href={DISCORD_INVITE}
                            className="mobile-join-btn"
                            target="_blank"
                            rel="noreferrer"
                            onClick={close}
                        >
                            <span className="cli-prompt">$</span> join --dcc
                        </a>
                    )}
                </nav>
            </div>
        </>
    );
};

export default Header;
