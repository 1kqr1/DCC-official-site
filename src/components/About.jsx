import React from 'react';
import { HashLink } from 'react-router-hash-link';
import imgProgramming from '../assets/dcc-programming.jpg';
import img3d from '../assets/IMG_0031.jpg';
import imgDigital from '../assets/IMG_20260425_153752268.jpg';
import imgMeeting from '../assets/20260428_144619.jpg';
import './About.css';

const gridItems = [
    { img: imgProgramming, main: 'プログラミング', sub: 'Programming' },
    { img: img3d, main: '3D制作', sub: '3D Printing' },
    { img: imgDigital, main: 'デジタルアート', sub: 'Digital Art' },
    { img: imgMeeting, main: '定例会', sub: 'Meeting' },
];

const About = () => {
    return (
        <section id="about" className="about">
            <div className="container">
                <div className="about-content">
                    <div className="about-left" data-reveal>
                        <span className="section-label">01 // ABOUT</span>
                        <h2 className="section-heading">本拠地は、<br />Discord。</h2>
                        <p className="about-desc">
                            DCCは、周南公立大学の学生を中心とした
                            <span className="tok-cyan">Discordベースのクリエイターコミュニティ</span>です。
                            プログラミング・3D・デジタルアートなど、
                            好きなものづくりを楽しむ仲間がオンラインで集まっています。
                        </p>
                        <p className="about-desc">
                            活動の中心はDiscord。入部届も部費もなく、参加すればその日からメンバーです。
                            さらに、大学の部室や機材も自由に使えます。
                        </p>
                        <HashLink smooth to="/#activities" className="about-btn">
                            もっと知る <span className="btn-arrow">→</span>
                        </HashLink>
                    </div>
                    <div className="about-right">
                        <div className="about-grid">
                            {gridItems.map((item, i) => (
                                <div
                                    className="about-grid-item"
                                    key={item.sub}
                                    data-reveal
                                    style={{ '--reveal-delay': `${i * 0.08}s` }}
                                >
                                    <img src={item.img} alt={item.main} loading="lazy" />
                                    <div className="about-grid-label">
                                        <span className="label-main">{item.main}</span>
                                        <span className="label-sub">{item.sub}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
