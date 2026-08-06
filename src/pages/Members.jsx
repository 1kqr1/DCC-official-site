import React from 'react';
import { Link } from 'react-router-dom';
import { members, avatarUrl } from '../members/members';
import './Members.css';

const AvatarPlaceholder = () => (
    <span className="member-avatar-placeholder" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    </span>
);

const Members = () => {
    return (
        <section className="members-page">
            <div className="container">
                <div className="members-header" data-reveal>
                    <span className="section-label">// MEMBERS</span>
                    <h1 className="members-heading">部員紹介</h1>
                    <p className="members-sub">// DCCで活動しているメンバーと、その作品を紹介します。</p>
                </div>

                <div className="members-grid">
                    {members.map((m, i) => (
                        <Link
                            to={`/members/${m.slug}`}
                            className="member-card"
                            key={m.slug}
                            data-reveal
                            style={{ '--reveal-delay': `${i * 0.06}s` }}
                        >
                            <div className="member-avatar">
                                {m.avatar ? (
                                    <img src={avatarUrl(m.avatar)} alt={m.name} loading="lazy" />
                                ) : (
                                    <AvatarPlaceholder />
                                )}
                            </div>
                            <div className="member-body">
                                <p className="member-name">{m.name}</p>
                                <p className="member-meta">
                                    {[m.grade, m.field].filter(Boolean).join(' / ')}
                                </p>
                                {Array.isArray(m.skills) && m.skills.length > 0 && (
                                    <div className="member-skills">
                                        {m.skills.slice(0, 3).map((s) => (
                                            <span className="member-skill" key={s}>{s}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>

                {members.length === 0 && (
                    <p className="members-empty">まだ登録されているメンバーがいません。</p>
                )}
            </div>
        </section>
    );
};

export default Members;
