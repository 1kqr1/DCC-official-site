import React from 'react';
import aboutImage from '../assets/about-image.jpg';
import './About.css';

const About = () => {
    return (
        <section id="about" className="about">
            <div className="container">
                <h2 className="section-title">Who We Are</h2>
                <div className="about-content">
                    <div className="about-image-container">
                        <img src={aboutImage} alt="DCC Members" className="about-image" />
                    </div>
                    <div className="about-text-container">
                        <div className="about-text">
                            <p>
                                DCCは周南公立大学<strong>情報科学部</strong>の学生による学生団体です。
                                私たちは、コンピュータサイエンス（CS）を自由に学び、自由に遊ぶサークルです。
                            </p>
                            <p>
                                アプリケーション開発、3Dプリンター、HP制作、デジタルアート制作など、活動分野は様々です。
                                新たな技術やアイデアを追求し、一緒に成長していくことを楽しみにしています。
                            </p>
                        </div>
                        <div className="about-stats">
                            <div className="stat-item">
                                <span className="stat-number">20+</span>
                                <span className="stat-label">メンバー</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number stat-infinity">♾️</span>
                                <span className="stat-label">可能性</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">Weekly</span>
                                <span className="stat-label">勉強会</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">Monthly</span>
                                <span className="stat-label">定例会</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
};

export default About;
