import React from 'react';
import './Works.css';
import workImage1 from '../assets/activity-webapp.jpg';
import workImage2 from '../assets/activity-hp-new.jpg';
import workImage3 from '../assets/activity-3d.jpg';

const Works = () => {
    return (
        <section id="works" className="works">
            <div className="container">
                <h2 className="section-title">Works</h2>
                <div className="works-content">
                    <p>活動報告は以下のNotionページで公開しています。</p>
                    <a
                        href="https://www.notion.so/2b7725dc34d68078929ffb2fb9b349dd?source=copy_link"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="works-link-btn"
                    >
                        活動報告を見る (Notion)
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Works;
