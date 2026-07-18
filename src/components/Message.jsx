import React from 'react';
import './Message.css';

// TODO: 実際の部長メッセージ・お名前・写真に差し替え
const PRESIDENT = {
    name: 'お名前',
    role: 'DCC 部長',
    photo: null, // 画像パスを入れると写真表示に切り替わる
    body: [
        'はじめまして、DCC部長の（お名前）です。',
        'DCCは「パソコンで遊ぶ」をモットーに、プログラミング・3D・デジタルアートなど、興味のあることを自由に楽しむ学生コミュニティです。',
        'ふだんはDiscordを中心にオンラインで集まっていて、学年も経験も関係なく、誰でも気軽に参加できます。少しでも気になったら、ぜひ覗いてみてください。',
    ],
};

const Message = () => {
    return (
        <section id="message" className="message">
            <div className="container">
                <span className="section-label">02 // MESSAGE</span>
                <h2 className="section-heading">部長からのメッセージ</h2>

                <div className="message-card" data-reveal>
                    <div className="message-avatar">
                        {PRESIDENT.photo ? (
                            <img src={PRESIDENT.photo} alt={PRESIDENT.name} />
                        ) : (
                            <span className="message-avatar-placeholder" aria-hidden="true">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                <em>PHOTO</em>
                            </span>
                        )}
                    </div>

                    <div className="message-body">
                        <span className="message-quote" aria-hidden="true">/**</span>
                        {PRESIDENT.body.map((line, i) => (
                            <p className="message-text" key={i}>{line}</p>
                        ))}
                        <div className="message-author">
                            <span className="message-name">{PRESIDENT.name}</span>
                            <span className="message-role">{PRESIDENT.role}</span>
                        </div>
                        <span className="message-quote message-quote-end" aria-hidden="true">*/</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Message;
