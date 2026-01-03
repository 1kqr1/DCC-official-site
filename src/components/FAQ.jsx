import React, { useState } from 'react';
import './FAQ.css';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`faq-item ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
            <div className="faq-question">
                {question}
                <span className="faq-toggle">{isOpen ? '−' : '+'}</span>
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
            answer: "はい、全く問題ありません！部員のほとんどが未経験からスタートしています。入部後の勉強会やイベントで共に学んでいきましょう！"
        },
        {
            question: "活動頻度はどのくらいですか？",
            answer: "全体での定例会は週に1回（現在は月曜日の2限）行っています。それ以外は自由活動で、自分のペースで部室に来て作業できます!"
        },
        {
            question: "兼部は可能ですか？",
            answer: "可能です！実際に、起業部やスポーツ系サークルと兼部しているメンバーも多数います。"
        },
        {
            question: "部費はかかりますか？",
            answer: "かかりません！"
        }
    ];

    return (
        <section id="faq" className="faq">
            <div className="container">
                <h2 className="section-title">FAQ</h2>
                <div className="faq-list">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
