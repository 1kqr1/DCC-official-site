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
                        <span className="section-label">01 — About</span>
                        <h2 className="section-heading">誰もがクリエイターに<br />なれる場所。</h2>
                        <p className="about-desc">
                            DCCは周南公立大学情報科学部の学生による学生団体です。
                            コンピュータサイエンスを自由に学び、自由に遊ぶサークルです。
                        </p>
                        <p className="about-desc">
                            アプリ開発、3Dプリンター、デジタルアート制作など、
                            活動分野は様々です。新たな技術やアイデアを追求し、
                            一緒に成長していくことを楽しみにしています。
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
