import React from 'react';
import './Activities.css';

const activities = [
    {
        num: '01',
        varName: 'app',
        fn: 'develop',
        title: 'アプリ開発',
        desc: 'Web・スマホアプリなど、アイデアを形にしていきます。',
        tags: ['React', 'Unity', 'Swift'],
    },
    {
        num: '02',
        varName: 'model',
        fn: 'create3D',
        title: '3D・デザイン制作',
        desc: 'BlenderやUnityを使った3D作品や映像を制作します。',
        tags: ['Blender', 'Unity', 'Fusion360'],
    },
    {
        num: '03',
        varName: 'art',
        fn: 'design',
        title: 'デジタルアート',
        desc: 'イラストや映像、音楽など、表現の幅を広げています。',
        tags: ['Procreate', 'Photoshop', 'TouchDesigner'],
    },
    {
        num: '04',
        varName: 'community',
        fn: 'connect',
        title: '勉強会・交流',
        desc: '定期的に勉強会やLT会を開催し、知識や経験を共有します。',
        tags: ['Discord', 'LT会', 'もくもく会'],
    },
];

const Activities = () => {
    return (
        <section id="activities" className="activities">
            <div className="container">
                <div className="activities-header" data-reveal>
                    <span className="section-label">03 // ACTIVITIES</span>
                    <h2 className="section-heading">活動内容</h2>
                </div>
                <div className="activities-strip">
                    {activities.map((item, index) => (
                        <div
                            className="activity-item"
                            key={item.num}
                            data-reveal
                            style={{ '--reveal-delay': `${index * 0.08}s` }}
                        >
                            <div className="activity-top">
                                <span className="activity-file">{item.varName}.ts</span>
                                <span className="activity-num">{item.num}</span>
                            </div>
                            <code className="activity-code">
                                <span className="tok-keyword">const</span>{' '}
                                <span className="tok-var">{item.varName}</span> ={' '}
                                <span className="tok-func">{item.fn}</span>()
                            </code>
                            <div className="activity-body">
                                <h3 className="activity-title">{item.title}</h3>
                                <p className="activity-desc">{item.desc}</p>
                            </div>
                            <div className="activity-tags">
                                {item.tags.map((t) => (
                                    <span className="activity-tag" key={t}>{t}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Activities;
