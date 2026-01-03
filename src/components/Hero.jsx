import React, { useEffect, useRef } from 'react';
import { HashLink } from 'react-router-hash-link';
import logoAccent from '../assets/logo-accent.png';
import heroBg from '../assets/hero-bg.mp4';
import './Hero.css';

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
                {/* <img src={logoAccent} alt="" className="hero-bg-logo" /> */}
            </div>

            <div className="hero-content">
                <h1 className="hero-title">
                    <span className="block">We are</span>
                    <span className="block highlight glitch" data-text="DCC">DCC</span>
                </h1>
                <p className="hero-subtitle">
                    Digital Creators Club. <br />
                    パソコンで遊ぶ、<span className="text-gradient">デジタル秘密基地。</span>
                </p>

                <div className="hero-actions">
                    <a href="#about" className="btn btn-primary">詳しく見る</a>
                    <HashLink smooth to="/#works" className="btn btn-secondary">活動報告</HashLink>
                </div>
            </div>

            <div className="hero-scroll">
                <span>Scroll</span>
                <div className="scroll-line"></div>
            </div>
        </section >
    );
};

export default Hero;
