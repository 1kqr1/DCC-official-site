import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchMembers } from '../members/api';
import { PORTFOLIO_EDIT_URL } from '../config';
import { useSeo } from '../seo';
import EditorRouteFrame from '../components/EditorRouteFrame';
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
    const [members, setMembers] = useState(null);
    const [error, setError] = useState(null);

    useSeo({
        title: '部員紹介',
        description: 'DCCで活動しているメンバーと、その作品を紹介します。',
        path: '/members',
    });

    useEffect(() => {
        fetchMembers()
            .then(setMembers)
            .catch((err) => setError(err.message));
    }, []);

    return (
        <EditorRouteFrame file="members.json" type="json" number="08">
        <section className="members-page">
            <div className="container">
                <div className="members-header" data-reveal>
                    <span className="section-label">// MEMBERS</span>
                    <h1 className="members-heading">部員紹介</h1>
                    <p className="members-sub">// DCCで活動しているメンバーと、その作品を紹介します。</p>
                    <a href={PORTFOLIO_EDIT_URL} className="members-edit-link" target="_blank" rel="noreferrer">
                        $ 自分のプロフィールを編集する →
                    </a>
                </div>

                {error && <p className="members-empty">読み込みに失敗しました（{error}）。時間を置いて再度お試しください。</p>}

                {!error && members === null && <p className="members-empty">読み込み中...</p>}

                {members && members.length > 0 && (
                    <div className="members-grid">
                        {members.map((m, i) => (
                            <Link
                                to={`/members/${m.id}`}
                                className="member-card"
                                key={m.id}
                                data-reveal
                                style={{ '--reveal-delay': `${i * 0.06}s` }}
                            >
                                <div className="member-avatar">
                                    <AvatarPlaceholder />
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
                )}

                {members && members.length === 0 && (
                    <p className="members-empty">まだ公開しているメンバーがいません。</p>
                )}
            </div>
        </section>
        </EditorRouteFrame>
    );
};

export default Members;
