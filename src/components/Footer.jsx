import React from 'react';
import { HashLink } from 'react-router-hash-link';
import logo from '../assets/logo-white.png';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-top">
                    <div className="footer-brand">
                        <img src={logo} alt="DCC" className="footer-logo-img" />
                        <p className="footer-tagline">パソコンで遊ぶ、デジタル秘密基地。</p>
                    </div>
                    <nav className="footer-nav">
                        <HashLink smooth to="/#hero" className="footer-nav-link">Home</HashLink>
                        <HashLink smooth to="/#about" className="footer-nav-link">About</HashLink>
                        <HashLink smooth to="/#activities" className="footer-nav-link">Activities</HashLink>
                        <HashLink smooth to="/#works" className="footer-nav-link">Works</HashLink>
                        <HashLink smooth to="/#room" className="footer-nav-link">Room</HashLink>
                        <HashLink smooth to="/blog" className="footer-nav-link">Blog</HashLink>
                        <HashLink smooth to="/#faq" className="footer-nav-link">FAQ</HashLink>
                        <HashLink smooth to="/#contact" className="footer-nav-link">Contact</HashLink>
                    </nav>
                </div>
                <div className="footer-bottom">
                    <p className="copyright">&copy; Digital Creators Community</p>
                    <p className="footer-credit">Shunan Public University</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
