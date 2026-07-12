import React from 'react';
import './Contact.css';

const Contact = () => {
    return (
        <section id="contact" className="contact">
            <div className="contact-glow" aria-hidden="true"></div>
            <div className="container">
                <div className="contact-inner" data-reveal>
                    <span className="section-label">06 — Contact</span>
                    <h2 className="contact-heading">
                        Let's create<br /><span className="text-gradient">together.</span>
                    </h2>
                    <p className="contact-message">
                        入部希望・見学・その他の質問、なんでも歓迎です。<br />
                        お気軽にお問い合わせください。
                    </p>
                    <a
                        href="https://docs.google.com/forms/d/e/1FAIpQLSew9o6Btnqyyf1_NvSGiaOzRfKoLBAz_BJmGAkZvOiGpo0HOQ/viewform?usp=dialog"
                        className="contact-button"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        お問い合わせはこちら <span className="contact-arrow">→</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Contact;
