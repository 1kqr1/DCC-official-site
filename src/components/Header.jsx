import React, { useState, useEffect } from 'react';
import { HashLink } from 'react-router-hash-link';
import logo from '../assets/logo-white.png';
import './Header.css';

const navItems = [
    { to: '/#hero', label: 'Home' },
    { to: '/#about', label: 'About' },
    { to: '/#activities', label: 'Activities' },
    { to: '/#works', label: 'Works' },
    { to: '/#room', label: 'Room' },
    { to: '/blog', label: 'Blog' },
    { to: '/#faq', label: 'FAQ' },
    { to: '/#contact', label: 'Contact' },
];

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const close = () => setIsOpen(false);

    // メニューを開いている間は背面のスクロールを止める
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    return (
        <>
        <header className="header">
            <div className="header-container">
                <div className="logo">
                    <img src={logo} alt="DCC Logo" className="logo-img" />
                </div>
                <nav className="nav">
                    <ul className="nav-list">
                        {navItems.map((item) => (
                            <li key={item.to}>
                                <HashLink smooth to={item.to} className="nav-link">{item.label}</HashLink>
                            </li>
                        ))}
                    </ul>
                </nav>
                <HashLink smooth to="/#contact" className="join-btn">Join DCC</HashLink>

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
                    {navItems.map((item) => (
                        <HashLink
                            key={item.to}
                            smooth
                            to={item.to}
                            className="mobile-nav-link"
                            onClick={close}
                        >
                            {item.label}
                        </HashLink>
                    ))}
                    <HashLink smooth to="/#contact" className="mobile-join-btn" onClick={close}>
                        Join DCC
                    </HashLink>
                </nav>
            </div>
        </>
    );
};

export default Header;
