import React, { useState } from 'react';
import './Room.css';

import roomPc01 from '../assets/room-pc-01.jpg';
import roomPc02 from '../assets/room-pc-02.jpg';
import roomFridge from '../assets/room-fridge.jpg';
import roomProjector from '../assets/room-05.jpg';

const Room = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = [roomFridge, roomPc01, roomPc02, roomProjector];

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    return (
        <section id="room" className="room">
            <div className="container">
                <h2 className="section-title">Room</h2>
                <div className="room-content">
                    <div className="room-image-wrapper">
                        <div className="room-carousel-container">
                            <img
                                src={images[currentImageIndex]}
                                alt={`部室の様子 ${currentImageIndex + 1}`}
                                className="room-image"
                            />
                            <button className="room-carousel-btn room-prev-btn" onClick={prevImage}>&#10094;</button>
                            <button className="room-carousel-btn room-next-btn" onClick={nextImage}>&#10095;</button>
                            <div className="room-carousel-indicators">
                                {images.map((_, index) => (
                                    <span
                                        key={index}
                                        className={`room-indicator ${index === currentImageIndex ? 'active' : ''}`}
                                        onClick={() => setCurrentImageIndex(index)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="room-text">
                        <h3>快適な活動環境</h3>
                        <p>
                            私たちの部室は、メンバーが快適に過ごせるよう様々な設備が整っています。
                            作業環境はもちろん、リラックスできるスペースも用意されています！

                        </p>
                        <ul className="room-features">
                            <li>冷暖房完備</li>
                            <li>冷蔵庫・電子レンジ・ケトル</li>
                            <li>ゲーミングPC 6台</li>
                            <li>VR機器</li>
                            <li>ホワイトボード</li>
                            <li>プロジェクター</li>
                        </ul>
                        <p className="room-access">
                            <strong>場所:</strong> 11号館 2F 第1実習室
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Room;
