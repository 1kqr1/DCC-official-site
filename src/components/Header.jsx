import React, { useEffect, useState } from 'react';
import { HashLink } from 'react-router-hash-link';
import logo from '../assets/logo-white.png';
import { DISCORD_INVITE } from '../config';
import './Header.css';

const navigation = [
    { to: '/#about', label: '[01] ABOUT' },
    { to: '/#projects', label: '[02] PROJECTS' },
    { to: '/#members', label: '[03] MEMBERS' },
    { to: '/#news', label: '[04] NEWS' },
    { to: '/#join', label: '[05] JOIN' },
];

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!isOpen) return undefined;

        const previousOverflow = document.body.style.overflow;
        const closeOnEscape = (event) => {
            if (event.key === 'Escape') setIsOpen(false);
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', closeOnEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', closeOnEscape);
        };
    }, [isOpen]);

    const closeMenu = () => setIsOpen(false);

    return (
        <>
            <a className="skip-link" href="#main-content">本文へスキップ</a>
            <header className="site-header">
                <div className="site-header__inner">
                    <HashLink smooth to="/#top" className="site-brand" aria-label="DCC トップへ">
                        <img src={logo} alt="DCC" className="site-brand__logo" />
                        <span className="site-brand__copy">
                            <span>DIGITAL CREATORS COMMUNITY</span>
                            <small>CREATIVE DEVELOPMENT ENVIRONMENT</small>
                        </span>
                    </HashLink>

                    <nav className="site-header__nav" aria-label="メインナビゲーション">
                        {navigation.map((item) => (
                            <HashLink key={item.to} smooth to={item.to} className="site-header__link">
                                {item.label}
                            </HashLink>
                        ))}
                    </nav>

                    <div className="site-header__tools">
                        <a href={DISCORD_INVITE} className="header-join" target="_blank" rel="noreferrer">
                            Discordで参加 <span aria-hidden="true">↗</span>
                        </a>
                    </div>

                    <button
                        type="button"
                        className={`site-menu-toggle${isOpen ? ' is-open' : ''}`}
                        aria-label={isOpen ? 'メニューを閉じる' : 'メニューを開く'}
                        aria-expanded={isOpen}
                        aria-controls="dcc-mobile-menu"
                        onClick={() => setIsOpen((current) => !current)}
                    >
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </header>

            <div id="dcc-mobile-menu" className={`site-mobile-menu${isOpen ? ' is-open' : ''}`}>
                <nav aria-label="モバイルナビゲーション">
                    {navigation.map((item) => (
                        <HashLink key={item.to} smooth to={item.to} className="site-mobile-menu__link" onClick={closeMenu}>
                            {item.label}
                            <span aria-hidden="true">↘</span>
                        </HashLink>
                    ))}
                    <a href={DISCORD_INVITE} className="site-mobile-menu__join" target="_blank" rel="noreferrer" onClick={closeMenu}>
                        $ ./join.sh <span aria-hidden="true">↗</span>
                    </a>
                </nav>
            </div>
        </>
    );
};

export default Header;
