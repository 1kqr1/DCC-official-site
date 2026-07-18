import React, { useState } from 'react';
import { DISCORD_INVITE } from '../config';
import './Room.css';

import roomFridge from '../assets/room-fridge.jpg';
import roomPc01 from '../assets/room-pc-01.jpg';
import roomPc02 from '../assets/room-pc-02.jpg';
import roomProjector from '../assets/room-05.jpg';

const images = [roomPc01, roomPc02, roomProjector, roomFridge];

const amenities = [
    { icon: '🖥️', label: 'ゲーミングPC', sub: '6台' },
    { icon: '🥽', label: 'VR機器', sub: 'KAT VR' },
    { icon: '📽️', label: 'プロジェクター', sub: '大型スクリーン' },
    { icon: '📋', label: 'ホワイトボード', sub: '壁面大型' },
    { icon: '❄️', label: '冷暖房完備', sub: '年中快適' },
    { icon: '🧃', label: '冷蔵庫・電子レンジ', sub: 'ケトルあり' },
];

const Room = () => {
    const [current, setCurrent] = useState(0);

    const prev = () => setCurrent(c => (c === 0 ? images.length - 1 : c - 1));
    const next = () => setCurrent(c => (c === images.length - 1 ? 0 : c + 1));

    return (
        <section id="room" className="room">
            <div className="container">
                <div className="room-header" data-reveal>
                    <span className="section-label">05 // PERK</span>
                    <h2 className="section-heading">Discordに入ると、<br />使える。</h2>
                    <p className="room-sub">
                        メンバーになれば、この部室と機材も自由に使えます。<br />
                        11号館 2F 第1実習室 — オンラインもリアルも、DCCの活動拠点です。
                    </p>
                </div>

                <div className="room-body">
                    <div className="room-carousel-wrap" data-reveal>
                        <div className="room-carousel-inner">
                            <img src={images[current]} alt={`部室 ${current + 1}`} className="room-img" />
                            <button className="room-btn room-btn-prev" onClick={prev}>‹</button>
                            <button className="room-btn room-btn-next" onClick={next}>›</button>
                            <div className="room-dots">
                                {images.map((_, i) => (
                                    <span
                                        key={i}
                                        className={`room-dot ${i === current ? 'active' : ''}`}
                                        onClick={() => setCurrent(i)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="room-amenities">
                        {amenities.map((item, i) => (
                            <div
                                className="amenity-card"
                                key={i}
                                data-reveal
                                style={{ '--reveal-delay': `${i * 0.06}s` }}
                            >
                                <span className="amenity-icon">{item.icon}</span>
                                <p className="amenity-label">{item.label}</p>
                                <p className="amenity-sub">{item.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="room-cta" data-reveal>
                    <p className="room-cta-text">この環境を使えるのは、Discordメンバーだけ。</p>
                    <a href={DISCORD_INVITE} className="btn-cli" target="_blank" rel="noreferrer">
                        <span className="cli-prompt">$</span> Discordに参加して使う <span className="arrow">→</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Room;
