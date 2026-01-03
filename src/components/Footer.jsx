import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer id="contact" className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-logo">
                        <span className="logo-text">DCC</span>
                    </div>
                    <div className="footer-links">
                        <a href="#" className="footer-link">X</a>

                        <a href="#" className="footer-link">Instagram</a>
                    </div>
                    <p className="copyright">
                        &copy; {new Date().getFullYear()} Digital Creators Club. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
