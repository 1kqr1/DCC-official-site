import React, { useEffect, useRef } from 'react';
import { HashLink } from 'react-router-hash-link';
import heroBg from '../assets/hero-bg.mp4';
import './Hero.css';

const keywords = [
    'PROGRAMMING', 'UNITY', 'BLENDER', '3D PRINTING', 'VR',
    'DTM', 'WEB DEV', 'GAME JAM', 'DIGITAL ART', 'AI',
];

const Hero = () => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.5;
        }
    }, []);

    return (
        <section id="hero" className="hero">
            <div className="hero-bg">
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="hero-video"
                >
                    <source src={heroBg} type="video/mp4" />
                </video>
                <div className="hero-overlay"></div>
                <div className="hero-grid-overlay"></div>
            </div>

            <div className="hero-content">
                <p className="hero-kicker">Shunan Public University — Student Creators</p>
                <h1 className="hero-title">
                    <span className="block">We are</span>
                    <span className="block highlight glitch" data-text="DCC">DCC</span>
                </h1>
                <p className="hero-subtitle">
                    Digital Creators Community. <br />
                    パソコンで遊ぶ、<span className="text-gradient">デジタル秘密基地。</span>
                </p>

                <div className="hero-actions">
                    <HashLink smooth to="/#about" className="btn btn-primary">詳しく見る</HashLink>
                    <HashLink smooth to="/#works" className="btn btn-secondary">活動報告</HashLink>
                </div>
            </div>

            <div className="hero-scroll">
                <span>Scroll</span>
                <div className="scroll-line"></div>
            </div>

            <div className="hero-marquee" aria-hidden="true">
                <div className="marquee-track">
                    {[...keywords, ...keywords].map((word, i) => (
                        <span className="marquee-item" key={i}>
                            {word} <span className="marquee-dot">•</span>
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;
