import React, { useEffect, useState } from 'react';
import Link from '../components/NavigationLink';
import EditorExplorer from '../components/EditorExplorer';
import Schedule from '../components/Schedule';
import logo from '../assets/logo-white.png';
import { fetchPosts } from '../blog/api';
import { DCC_AI_URL, DCC_GIT_URL, DISCORD_INVITE, CONTACT_FORM_URL, PORTFOLIO_EDIT_URL, SHOW_HOME_MEMBERS } from '../config';
import { siteContent, imageSrc } from '../data/siteContent';
import { RichText, SmartLink } from '../components/RichText';
import { homeSections, siteNumber } from '../data/siteSections';
import { fetchMembers } from '../members/api';
import { useSeo } from '../seo';
import './Home.css';
import './Community.css';

const home = siteContent.home;
const { hero, about, projects, news, room, join } = home;
const roomImage = imageSrc(room.image);

const sectionFileById = Object.fromEntries(homeSections.map((section) => [section.id, section]));

const formatLogDate = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value || '---- -- --');

    return new Intl.DateTimeFormat('sv-SE', {
        timeZone: 'Asia/Tokyo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(date);
};

const getMemberLinks = (member) => {
    const labels = {
        github: 'GitHub',
        portfolio: 'Portfolio',
        x: 'X',
        discord: 'Discord',
    };

    return Object.entries(member.links || {})
        .filter(([key, value]) => labels[key] && value)
        .map(([key, value]) => ({ label: labels[key], href: value }));
};

const EditorFileBar = ({ section }) => {
    const { file, type } = sectionFileById[section];
    return (
        <header className="editor-filebar">
            <span className="editor-filebar__tab">
                <i className={`editor-filebar__icon editor-filebar__icon--${type}`} aria-hidden="true"></i>
                {file}
            </span>
            <span className="editor-filebar__meta">{siteNumber(section)} / DCC</span>
        </header>
    );
};

const Home = () => {
    const [members, setMembers] = useState(null);
    const [membersError, setMembersError] = useState(false);
    const [posts, setPosts] = useState(null);
    const [postsError, setPostsError] = useState(false);

    useSeo({ path: '/' });

    useEffect(() => {
        let cancelled = false;

        if (SHOW_HOME_MEMBERS) fetchMembers()
            .then((data) => {
                if (!cancelled) setMembers(Array.isArray(data) ? data : []);
            })
            .catch(() => {
                if (!cancelled) setMembersError(true);
            });

        fetchPosts()
            .then((data) => {
                if (!cancelled) setPosts(Array.isArray(data) ? data : []);
            })
            .catch(() => {
                if (!cancelled) setPostsError(true);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const firstMember = members?.[0];

    return (
        <div id="top" className="editor-home">
            <div className="editor-home__chrome" aria-hidden="true">
                <span className="editor-home__dot editor-home__dot--red"></span>
                <span className="editor-home__dot editor-home__dot--yellow"></span>
                <span className="editor-home__dot editor-home__dot--green"></span>
                <span className="editor-home__workspace-title">dcc / creative-development-environment</span>
            </div>

            <div className="editor-workspace">
                <EditorExplorer />

                <div className="editor-canvas">
                    <section id="hero" className="editor-section editor-hero" aria-labelledby="hero-title">
                        <EditorFileBar section="hero" />
                        <div className="editor-hero__body">
                            <div className="editor-code editor-hero__code" data-reveal>
                                <p className="hero-origin">{hero.origin}</p>
                                <h1 id="hero-title" className="editor-hero__title">
                                    <span>DCC;<i className="terminal-cursor" aria-label=""></i></span>
                                </h1>
                                <p className="editor-hero__kicker"><span>{hero.kicker}</span></p>
                                <p className="editor-hero__copy"><span><RichText text={hero.copy} /></span></p>
                                <p className="hero-description"><RichText text={hero.description} /></p>
                                <p className="hero-welcome">{hero.welcome}</p>
                                <div className="editor-hero__actions">
                                    <span>
                                        <a href={DISCORD_INVITE} className="editor-button editor-button--accent" target="_blank" rel="noreferrer">{hero.primaryLabel} <b>↗</b></a>
                                        <Link to="/#projects" className="editor-button editor-button--quiet">{hero.secondaryLabel} <b>↓</b></Link>
                                    </span>
                                </div>
                            </div>

                            <div className="editor-hero__visual" data-reveal style={{ '--reveal-delay': '0.12s' }}>
                                <div className="editor-hero__logo-grid" aria-hidden="true">
                                    <div className="editor-hero__logo-line"></div>
                                    <img src={logo} alt="" />
                                </div>
                                <dl className="editor-hero__meta">
                                    {hero.meta.map((item) => (
                                        <div key={item.label}><dt>{item.label}</dt><dd>{item.live && <><i className="editor-live-dot" aria-hidden="true"></i> </>}{item.value}</dd></div>
                                    ))}
                                </dl>
                            </div>
                        </div>
                    </section>

                    <section id="about" className="editor-section editor-about" aria-labelledby="about-title">
                        <EditorFileBar section="about" />
                        <div className="editor-about__body">
                            <div className="markdown-sheet" data-reveal>
                                <p className="markdown-sheet__eyebrow">{siteNumber('about')} / ABOUT DCC</p>
                                <h2 id="about-title"><RichText text={about.heading} /></h2>
                                {about.paragraphs.map((text, i) => <p key={i}><RichText text={text} /></p>)}
                                {about.subheading && <h3>{about.subheading}</h3>}
                                {about.subText && <p><RichText text={about.subText} /></p>}
                                {about.quote && <blockquote>{about.quote}</blockquote>}
                                <p><Link to="/business" className="editor-text-link">{about.businessLinkLabel} →</Link></p>
                                <div className="markdown-sheet__fields">
                                    <p>## Fields</p>
                                    <ul>
                                        {about.fields.map((field) => <li key={field}>- {field}</li>)}
                                    </ul>
                                </div>
                            </div>

                            <div className="editor-about__aside" data-reveal style={{ '--reveal-delay': '0.1s' }}>
                                <div className="editor-about__gallery">
                                    {about.gallery.filter((item) => imageSrc(item.image)).map((item, i) => (
                                        <figure key={`${item.label}-${i}`}>
                                            <img src={imageSrc(item.image)} alt={item.alt} loading="lazy" />
                                            <figcaption>{item.label}</figcaption>
                                        </figure>
                                    ))}
                                </div>
                                <div className="about-runtime">
                                    <p><span>const</span> base = <b>&quot;Discord&quot;</b>;</p>
                                    <p><span>const</span> place = <b>&quot;{siteContent.common.place}&quot;</b>;</p>
                                    <p><span>const</span> access = <b>&quot;member&quot;</b>;</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="schedule" className="editor-section editor-news" aria-labelledby="schedule-title">
                        <EditorFileBar section="schedule" />
                        <div className="editor-section__intro" data-reveal>
                            <div>
                                <p className="editor-section__label">{siteNumber('schedule')} / SCHEDULE</p>
                                <h2 id="schedule-title"><RichText text={home.schedule.heading} /></h2>
                            </div>
                            <p><RichText text={home.schedule.lead} /></p>
                        </div>
                        <Schedule note={home.schedule.note} />
                    </section>

                    <section id="projects" className="editor-section editor-projects" aria-labelledby="projects-title">
                        <EditorFileBar section="projects" />
                        <div className="editor-section__intro" data-reveal>
                            <div>
                                <p className="editor-section__label">{siteNumber('projects')} / FROM THE SHOWCASE</p>
                                <h2 id="projects-title"><RichText text={projects.heading} /></h2>
                            </div>
                            <p><RichText text={projects.lead} /></p>
                        </div>
                        <div className="published-work" data-reveal>
                            <ul>{projects.items.map((item, i) => <li key={i}>{item.title} <span>{item.desc}</span></li>)}</ul>
                            {projects.articleUrl && <SmartLink href={projects.articleUrl} className="editor-text-link">{projects.articleLabel} →</SmartLink>}
                        </div>
                        <Link to="/blog" className="editor-text-link">{projects.blogLinkLabel} <span aria-hidden="true">→</span></Link>
                    </section>

                    {SHOW_HOME_MEMBERS && <section id="members" className="editor-section editor-members" aria-labelledby="members-title">
                        <EditorFileBar section="members" />
                        <div className="editor-section__intro editor-members__intro" data-reveal>
                            <div>
                                <p className="editor-section__label">{siteNumber('members')} / PEOPLE IN DCC</p>
                                <h2 id="members-title"><RichText text={home.members.heading} /></h2>
                            </div>
                            <a href={PORTFOLIO_EDIT_URL} className="editor-text-link" target="_blank" rel="noreferrer">プロフィールを編集する <span aria-hidden="true">↗</span></a>
                        </div>

                        <div className="members-workspace">
                            <pre className="members-json" aria-label="公開メンバーのJSONプレビュー" data-reveal>
                                <code>{members === null && !membersError ? '{\n  "status": "loading"\n}' : membersError ? '{\n  "status": "unavailable"\n}' : `{
  "publicMembers": ${members.length},
  "member": {
    "name": "${firstMember?.name || ''}",
    "role": "${[firstMember?.role, firstMember?.grade, firstMember?.field].filter(Boolean).join(' / ')}",
    "skills": [${(firstMember?.skills || []).map((skill) => `"${skill}"`).join(', ')}]
  }
}`}</code>
                            </pre>

                            <div className="member-preview" aria-live="polite">
                                {members === null && !membersError && <p className="editor-state">// Loading public member data…</p>}
                                {membersError && <p className="editor-state">// 公開メンバー情報を取得できませんでした。</p>}
                                {members?.length === 0 && <p className="editor-state">// 公開中のメンバー情報はまだありません。</p>}
                                {members?.map((member, index) => {
                                    const links = getMemberLinks(member);
                                    return (
                                        <article className="member-card" key={member.id || member.name} data-reveal style={{ '--reveal-delay': `${index * 0.06}s` }}>
                                            <div className="member-card__top">
                                                <div className="member-card__avatar">
                                                    {member.avatarUrl ? <img src={member.avatarUrl} alt={`${member.name}のプロフィール`} loading="lazy" /> : <span aria-hidden="true">DCC</span>}
                                                </div>
                                                <span className="member-card__availability"><i className="editor-live-dot" aria-hidden="true"></i> PUBLIC</span>
                                            </div>
                                            <h3>{member.name}</h3>
                                            <p className="member-card__role">{[member.role, member.grade, member.field].filter(Boolean).join(' / ')}</p>
                                            {Array.isArray(member.skills) && member.skills.length > 0 && <div className="member-card__skills">{member.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>}
                                            <div className="member-card__links">
                                                {links.map((link) => <a key={link.label} href={link.href} target="_blank" rel="noreferrer">{link.label} ↗</a>)}
                                                {member.id && <Link to={`/members/${member.id}`}>Profile →</Link>}
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        </div>
                        <Link to="/members" className="editor-text-link">全メンバーを見る <span aria-hidden="true">→</span></Link>
                    </section>}

                    <section id="news" className="editor-section editor-news" aria-labelledby="news-title">
                        <EditorFileBar section="news" />
                        <div className="editor-section__intro" data-reveal>
                            <div>
                                <p className="editor-section__label">{siteNumber('news')} / ACTIVITY LOG</p>
                                <h2 id="news-title"><RichText text={news.heading} /></h2>
                            </div>
                            <p><RichText text={news.lead} /></p>
                        </div>

                        <div className="news-workspace">
                            <div className="news-terminal" aria-live="polite" data-reveal>
                                <div className="news-terminal__bar"><span>LOG OUTPUT</span><span>LIVE FEED</span></div>
                                {posts === null && !postsError && <p className="news-terminal__state">// Loading published activity logs…</p>}
                                {postsError && <p className="news-terminal__state">// Feed unavailable. Open the activity blog to try again.</p>}
                                {posts?.length === 0 && <p className="news-terminal__state">// No published activity logs yet.</p>}
                                {posts?.slice(0, 4).map((post) => (
                                    <Link to={`/blog/${post.slug}`} state={{ post }} className="news-terminal__line" key={post.slug}>
                                        <time>{formatLogDate(post.publishedAt)}</time>
                                        <span>{post.title}</span>
                                        <b aria-hidden="true">↗</b>
                                    </Link>
                                ))}
                                <p className="news-terminal__prompt"><span>&gt;</span> <i className="terminal-cursor" aria-label=""></i></p>
                            </div>

                            <aside className="dcc-services" data-reveal style={{ '--reveal-delay': '0.1s' }}>
                                <p>FROM DCC HUB</p>
                                <a href={DCC_AI_URL} target="_blank" rel="noreferrer"><span>DCC AI</span><b>↗</b><small>IDEA / ASSIST</small></a>
                                <a href={DCC_GIT_URL} target="_blank" rel="noreferrer"><span>DCC git</span><b>↗</b><small>CODE / SHARE</small></a>
                                <p className="dcc-services__note">{news.servicesNote}</p>
                            </aside>
                        </div>
                        <Link to="/blog" className="editor-text-link">{news.blogLinkLabel} <span aria-hidden="true">→</span></Link>
                    </section>

                    <section id="room" className="editor-section" aria-labelledby="room-title">
                        <EditorFileBar section="room" />
                        <div className="community-space">
                            <div>
                                <p className="editor-section__label">{siteNumber('room')} / ONLINE &amp; ON CAMPUS</p>
                                <h2 id="room-title"><RichText text={room.heading} /></h2>
                                <p><RichText text={room.text} /></p>
                                <p>活動拠点：{siteContent.common.place}</p>
                                <ul>{room.equipment.map((item) => <li key={item}>{item}</li>)}</ul>
                                <a className="editor-text-link" href={CONTACT_FORM_URL} target="_blank" rel="noreferrer">{room.visitLabel} ↗</a>
                            </div>
                            {roomImage && <figure><img src={roomImage} alt={room.imageAlt} loading="lazy" width="800" height="600" /><figcaption>{room.caption}</figcaption></figure>}
                        </div>
                    </section>
                    <section id="faq" className="editor-section" aria-labelledby="faq-title">
                        <EditorFileBar section="faq" />
                        <div className="community-faq"><p className="editor-section__label">{siteNumber('faq')} / BEFORE YOU JOIN</p><h2 id="faq-title">{home.faq.heading}</h2>
                            {home.faq.items.map((item, i) => (
                                <details key={i} open={i === 0}><summary>{item.q}</summary><p><RichText text={item.a} /></p></details>
                            ))}
                        </div>
                    </section>
                    <section id="join" className="editor-section editor-join" aria-labelledby="join-title">
                        <EditorFileBar section="join" />
                        <div className="join-terminal" data-reveal>
                            <p className="join-terminal__command"><span>$</span> ./join.sh</p>
                            <p className="join-terminal__output">&gt; {join.kicker}</p>
                            <h2 id="join-title">{join.heading.split('\n').map((phrase, i) => <span className="nowrap-phrase" key={i}>{phrase}</span>)}</h2>
                            <p className="join-terminal__output">&gt; {join.question}</p>
                            <p className="join-explanation"><RichText text={join.explanation} /></p>
                            <div className="join-terminal__actions">
                                <a href={DISCORD_INVITE} className="join-terminal__cta" target="_blank" rel="noreferrer">{join.ctaLabel} <span aria-hidden="true">↗</span></a>
                                <a href={CONTACT_FORM_URL} className="join-terminal__contact" target="_blank" rel="noreferrer">{join.contactLabel} ↗</a>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Home;
