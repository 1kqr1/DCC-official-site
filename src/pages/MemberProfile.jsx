import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchMember } from '../members/api';
import './Members.css';

const AvatarPlaceholder = () => (
    <span className="member-avatar-placeholder" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    </span>
);

const MemberProfile = () => {
    const { slug } = useParams();
    const [member, setMember] = useState(undefined); // undefined=読み込み中, null=見つからない
    const [error, setError] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        let ignore = false;
        fetchMember(slug)
            .then((data) => { if (!ignore) setMember(data); })
            .catch((err) => { if (!ignore) setError(err.message); });
        return () => { ignore = true; };
    }, [slug]);

    if (error) {
        return (
            <section className="members-page">
                <div className="container members-notfound">
                    <h1>読み込みに失敗しました</h1>
                    <p className="muted">{error}</p>
                    <Link to="/members" className="members-back">cd ../members</Link>
                </div>
            </section>
        );
    }

    if (member === undefined) {
        return (
            <section className="members-page">
                <div className="container members-notfound">
                    <p className="muted">読み込み中...</p>
                </div>
            </section>
        );
    }

    if (member === null) {
        return (
            <section className="members-page">
                <div className="container members-notfound">
                    <h1>メンバーが見つかりませんでした</h1>
                    <Link to="/members" className="members-back">cd ../members</Link>
                </div>
            </section>
        );
    }

    const works = member.works || [];

    return (
        <article className="member-profile">
            <div className="container container-narrow">
                <Link to="/members" className="members-back">cd ../members</Link>

                <header className="member-profile-header" data-reveal>
                    <div className="member-avatar member-avatar-lg">
                        {member.avatarUrl ? (
                            <img src={member.avatarUrl} alt={member.name} />
                        ) : (
                            <AvatarPlaceholder />
                        )}
                    </div>
                    <div className="member-profile-info">
                        <h1 className="member-profile-name">{member.name}</h1>
                        <p className="member-profile-meta">
                            {[member.grade, member.field].filter(Boolean).join(' / ')}
                        </p>
                        {member.bio && <p className="member-profile-bio">{member.bio}</p>}

                        {(member.links?.github || member.links?.x || member.links?.discord) && (
                            <div className="member-links">
                                {member.links.github && (
                                    <a href={member.links.github} target="_blank" rel="noreferrer" className="member-link">GitHub</a>
                                )}
                                {member.links.x && (
                                    <a href={member.links.x} target="_blank" rel="noreferrer" className="member-link">X</a>
                                )}
                                {member.links.discord && (
                                    <a href={member.links.discord} target="_blank" rel="noreferrer" className="member-link">Discord</a>
                                )}
                            </div>
                        )}

                        {Array.isArray(member.skills) && member.skills.length > 0 && (
                            <div className="member-skills member-skills-lg">
                                {member.skills.map((s) => (
                                    <span className="member-skill" key={s}>{s}</span>
                                ))}
                            </div>
                        )}
                    </div>
                </header>

                <div className="member-works">
                    <span className="section-label">// WORKS</span>
                    <h2 className="member-works-heading">作品</h2>

                    {works.length > 0 ? (
                        <div className="member-works-grid">
                            {works.map((w, i) => (
                                <div className="member-work-card" key={i}>
                                    {w.category && <span className="member-work-category">{w.category}</span>}
                                    <h3 className="member-work-title">{w.title}</h3>
                                    {w.description && <p className="member-work-desc">{w.description}</p>}
                                    {w.url && (
                                        <a href={w.url} target="_blank" rel="noreferrer" className="member-work-link">
                                            見る <span className="arrow">→</span>
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="member-works-empty">公開している作品はまだありません。</p>
                    )}
                </div>

                <Link to="/members" className="members-back members-back-bottom">cd ../members</Link>
            </div>
        </article>
    );
};

export default MemberProfile;
