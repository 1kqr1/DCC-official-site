import React from 'react';
import './Message.css';

// TODO: 顔写真をもらったら photo に差し替える
const PRESIDENT = {
    name: '郡谷孝裕',
    role: 'DCC 部長',
    photo: null, // 画像パスを入れると写真表示に切り替わる
    isDraft: false, // 本文が仮の間だけ「（仮）」を表示
    body: [
        '情報科学は、決してコンピューターの中だけで完結するものではありません。医療、芸術、経済など、「情報」と「それ以外の分野」が交差したときにこそ、その真価を発揮する領域だと私は確信しています。',
        'そして、その交差点に立ち、新たな価値を生み出していくのは私たち「人間」です。歴史に名を刻むノーベル賞受賞者たちも、もとをたどれば私たちと同じ一人の人間です。人間の可能性は無限大であり、私たちが向き合う情報の可能性もまた果てしなく広がっています。',
        'DCCでは、「人間の可能性は無限大」を活動の根底に据えています。特定の枠にとらわれることなく、メンバー個人個人が自分の「好き」に全力投球し、それぞれの専門性を高め合っています。情報科学を通じた新しい価値の創造に、私たちと共に挑みましょう。',
    ],
};

const Message = () => {
    return (
        <section id="message" className="message">
            <div className="container">
                <span className="section-label">02 // MESSAGE</span>
                <h2 className="section-heading">
                    部長からのメッセージ
                    {PRESIDENT.isDraft && <span className="message-draft">（仮）</span>}
                </h2>

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
