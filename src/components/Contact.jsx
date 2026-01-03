import React from 'react';
import './Contact.css';

const Contact = () => {
    return (
        <section id="contact" className="contact">
            <div className="container">
                <h2 className="section-title">Contact</h2>
                <div className="contact-content">
                    <p className="contact-message">
                        DCCへの入部希望、見学依頼、その他ご質問などございましたら、<br />
                        お気軽に以下のメールアドレスまたはSNSのDMよりご連絡ください。
                    </p>
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLSew9o6Btnqyyf1_NvSGiaOzRfKoLBAz_BJmGAkZvOiGpo0HOQ/viewform?usp=dialog" className="contact-button" target="_blank" rel="noopener noreferrer">
                        お問い合わせはこちら
                    </a>
                    <div className="contact-sns">
                        <p>SNSでも情報発信中！</p>
                        <div className="sns-links">
                            <a href="#" className="sns-link twitter">X</a>
                            <a href="#" className="sns-link instagram">Instagram</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
