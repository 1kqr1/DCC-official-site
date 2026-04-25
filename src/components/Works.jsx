import React, { useState } from 'react';
import './Works.css';
import img3d from '../assets/activity-3d.jpg';
import imgWebapp from '../assets/activity-webapp.jpg';
import imgDigital from '../assets/activity-hp-new-02.png';
import imgMobile from '../assets/activity-hp-new.jpg';
import imgMotion from '../assets/activity-books.jpg';

const works = [
    { title: '3D Game', sub: 'Unity', img: img3d },
    { title: 'Web Application', sub: 'HTML / CSS / JS', img: imgWebapp },
    { title: 'Digital Art', sub: 'Illustration', img: imgDigital },
    { title: 'Mobile App', sub: 'Flutter', img: imgMobile },
    { title: 'Motion Graphic', sub: 'After Effects', img: imgMotion },
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
                        <h2 className="works-heading">制作作品</h2>
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
                        すべての作品を見る <span>→</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Works;
