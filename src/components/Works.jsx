import React, { useState } from 'react';
import './Works.css';
import img3d from '../assets/IMG_0031.jpg';
import imgUnity from '../assets/IMG_3169.jpg';
import imgMusic from '../assets/IMG_20260425_153752268.jpg';
import imgStudy from '../assets/20260428_144812.jpg';
import imgVr from '../assets/dcc-vr.jpg';

const works = [
    { title: '3D制作', sub: '3Dプリンター', img: img3d },
    { title: 'ゲーム開発', sub: 'Unity', img: imgUnity },
    { title: '音楽・映像制作', sub: 'VoiSona / DTM', img: imgMusic },
    { title: '勉強会', sub: 'ハッカソン・LT会', img: imgStudy },
    { title: 'VR体験', sub: 'KAT VR', img: imgVr },
];

const Works = () => {
    const [current, setCurrent] = useState(0);
    const visible = 3;
    const max = works.length - visible;

    const prev = () => setCurrent(c => Math.max(0, c - 1));
    const next = () => setCurrent(c => Math.min(max, c + 1));

    return (
        <section id="works" className="works">
            <div className="container">
                <div className="works-header">
                    <div>
                        <span className="section-label">WORKS</span>
                        <h2 className="works-heading">活動・制作</h2>
                    </div>
                    <div className="works-nav">
                        <button className="works-nav-btn" onClick={prev} disabled={current === 0}>‹</button>
                        <button className="works-nav-btn" onClick={next} disabled={current === max}>›</button>
                    </div>
                </div>
                <div className="works-carousel-wrap">
                    <div
                        className="works-carousel"
                        style={{ transform: `translateX(calc(-${current} * (100% / ${visible} + 1rem)))` }}
                    >
                        {works.map((work, i) => (
                            <div className="work-card" key={i}>
                                <div className="work-img-wrap">
                                    <img src={work.img} alt={work.title} className="work-img" />
                                    <div className="work-overlay" />
                                </div>
                                <div className="work-info">
                                    <p className="work-title">{work.title}</p>
                                    <p className="work-sub">{work.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="works-footer">
                    <a
                        href="https://www.notion.so/2b7725dc34d68078929ffb2fb9b349dd?source=copy_link"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="works-all-link"
                    >
                        すべての活動を見る <span>→</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Works;
