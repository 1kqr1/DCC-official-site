import React from 'react';
import { HashLink } from 'react-router-hash-link';
import logo from '../assets/logo-white.png';
import './Footer.css';

const Footer = () => {
    return (
        <footer id="contact" className="footer">
            <div className="container">
                <div className="footer-top">
                    <div className="footer-logo">
                        <img src={logo} alt="DCC" className="footer-logo-img" />
                    </div>
                    <nav className="footer-nav">
                        <HashLink smooth to="/#hero" className="footer-nav-link">Home</HashLink>
                        <HashLink smooth to="/#about" className="footer-nav-link">About</HashLink>
                        <HashLink smooth to="/#activities" className="footer-nav-link">Activities</HashLink>
                        <HashLink smooth to="/#works" className="footer-nav-link">Works</HashLink>
                        <HashLink smooth to="/#room" className="footer-nav-link">Room</HashLink>
                        <HashLink smooth to="/#faq" className="footer-nav-link">FAQ</HashLink>
                        <HashLink smooth to="/#contact" className="footer-nav-link">Contact</HashLink>
                    </nav>
                </div>
                <div className="footer-bottom">
                    <div className="footer-socials">
                        <a href="https://x.com/shu_dcc" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="X">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>
                        <a href="https://www.instagram.com/shu_dcc?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                            </svg>
                        </a>
                        <a href="https://www.youtube.com/@shu_dcc" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="YouTube">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                        </a>
                    </div>
                    <p className="copyright">&copy; Digital Creators Club.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
