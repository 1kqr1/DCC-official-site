import React, { useState } from 'react';
import studyImage1 from '../assets/activity-books.jpg';
import studyImage2 from '../assets/activity-study.jpg';
import printerImage1 from '../assets/activity-printer-new.jpg';
import printerImage2 from '../assets/activity-3d-printer-new-02.jpg';
import hpImage1 from '../assets/activity-hp-new.jpg';
import hpImage2 from '../assets/activity-hp-new-02.png';
import webappImage1 from '../assets/activity-webapp.jpg';
import webappImage2 from '../assets/activity-room.jpg';
import './Activities.css';

const ActivityCard = ({ activity }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === activity.images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? activity.images.length - 1 : prevIndex - 1
        );
    };

    return (
        <div className="activity-card">
            <div className="activity-image-container">
                <img
                    src={activity.images[currentImageIndex]}
                    alt={`${activity.title} ${currentImageIndex + 1} `}
                    className="activity-image"
                />
                {activity.images.length > 1 && (
                    <>
                        <button className="carousel-btn prev-btn" onClick={prevImage}>&#10094;</button>
                        <button className="carousel-btn next-btn" onClick={nextImage}>&#10095;</button>
                        <div className="carousel-indicators">
                            {activity.images.map((_, index) => (
                                <span
                                    key={index}
                                    className={`indicator ${index === currentImageIndex ? 'active' : ''} `}
                                    onClick={() => setCurrentImageIndex(index)}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
            <div className="activity-content">
                <h3 className="activity-title">{activity.title}</h3>
                <p className="activity-desc">{activity.desc}</p>
            </div>
        </div>
    );
};

const Activities = () => {
    const activities = [
        {
            title: "勉強会",
            desc: "定例会と共に勉強会を企画しています！",
            images: [studyImage1, studyImage2]
        },
        {
            title: "3Dプリンター",
            desc: "部室に設置された3Dプリンターで、モデリングから出力まで体験できます!",
            images: [printerImage1, printerImage2]
        },
        {
            title: "HP制作",
            desc: "大学祭や新歓イベントの特設サイト、団体の公式Webサイトなどを企画・デザイン・実装まで一貫して行います。",
            images: [hpImage2, hpImage1]
        },
        {
            title: "Webアプリ制作",
            desc: "ReactやNext.jsなどのモダンなフレームワークを使用し、ハッカソンや個人開発で実用的なアプリケーションを開発しています。",
            images: [webappImage1, webappImage2]
        }
    ];

    return (
        <section id="activities" className="activities">
            <div className="container">
                <h2 className="section-title">What We Do</h2>
                <div className="activities-grid">
                    {activities.map((activity, index) => (
                        <ActivityCard key={index} activity={activity} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Activities;
