import React from 'react';
import { HashLink } from 'react-router-hash-link';
import imgProgramming from '../assets/dcc-programming.jpg';
import img3d from '../assets/dcc-3d-objects.jpg';
import imgDigital from '../assets/dcc-digital-art.jpg';
import imgMeeting from '../assets/20260428_144619.jpg';
import './About.css';

const About = () => {
    return (
        <section id="about" className="about">
            <div className="container">
                <div className="about-content">
                    <div className="about-left">
                        <span className="section-label">ABOUT</span>
                        <h2 className="about-heading">誰もがクリエイターに<br />なれる場所。</h2>
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
                            <div className="about-grid-item">
                                <img src={imgProgramming} alt="プログラミング" />
                                <div className="about-grid-label">
                                    <span className="label-main">プログラミング</span>
                                    <span className="label-sub">Programming</span>
                                </div>
                            </div>
                            <div className="about-grid-item">
                                <img src={img3d} alt="3D制作" />
                                <div className="about-grid-label">
                                    <span className="label-main">3D制作</span>
                                    <span className="label-sub">3D Modeling</span>
                                </div>
                            </div>
                            <div className="about-grid-item">
                                <img src={imgDigital} alt="デジタルアート" />
                                <div className="about-grid-label">
                                    <span className="label-main">デジタルアート</span>
                                    <span className="label-sub">Digital Art</span>
                                </div>
                            </div>
                            <div className="about-grid-item">
                                <img src={imgMeeting} alt="ミーティング" />
                                <div className="about-grid-label">
                                    <span className="label-main">ミーティング</span>
                                    <span className="label-sub">Meeting</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
