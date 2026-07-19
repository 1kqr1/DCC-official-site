import React, { useState } from 'react';
import './FAQ.css';

const FAQItem = ({ question, answer, index }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className={`faq-item ${isOpen ? 'open' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            data-reveal
            style={{ '--reveal-delay': `${index * 0.06}s` }}
        >
            <div className="faq-question">
                <span className="faq-q-num">Q{String(index + 1).padStart(2, '0')}</span>
                <span className="faq-q-text">{question}</span>
                <span className="faq-toggle" aria-hidden="true">+</span>
            </div>
            <div className="faq-answer">
                <p>{answer}</p>
            </div>
        </div>
    );
};

const FAQ = () => {
    const faqs = [
        {
            question: "プログラミング未経験でも大丈夫ですか？",
            answer: "はい、全く問題ありません！メンバーのほとんどが未経験からスタートしています。勉強会やイベントで一緒に学んでいきましょう！"
        },
        {
            question: "活動頻度はどのくらいですか？",
            answer: "特に決まりはありません！ふだんはDiscordでゆるくつながっていて、来られるときに部室に来たり、オンラインで参加したり。自分のペースで自由に活動できます。"
        },
        {
            question: "他のサークルとの掛け持ちはできますか？",
            answer: "もちろん可能です！起業部やスポーツ系サークルと掛け持ちしているメンバーも多数います。"
        },
        {
            question: "参加にお金はかかりますか？",
            answer: "かかりません！Discordに参加すれば、その日からメンバーです。"
        }
    ];

    return (
        <section id="faq" className="faq">
            <div className="container">
                <div className="faq-header" data-reveal>
                    <span className="section-label">06 // FAQ</span>
                    <h2 className="section-heading">よくある質問</h2>
                </div>

                <div className="faq-window">
                    <div className="faq-window-bar" aria-hidden="true">
                        <span className="fw-dot fw-r"></span>
                        <span className="fw-dot fw-y"></span>
                        <span className="fw-dot fw-g"></span>
                        <span className="fw-title">faq.md</span>
                    </div>
                    <div className="faq-list">
                        {faqs.map((faq, index) => (
                            <FAQItem key={index} index={index} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
