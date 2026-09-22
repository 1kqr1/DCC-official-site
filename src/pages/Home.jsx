import React, { useEffect, useState } from 'react';
import { HashLink } from 'react-router-hash-link';
import { Link } from 'react-router-dom';
import logo from '../assets/logo-white.png';
import roomPhoto from '../assets/room-pc-01.jpg';
import { fetchPosts } from '../blog/api';
import { DCC_AI_URL, DCC_GIT_URL, DISCORD_INVITE, CONTACT_FORM_URL, PORTFOLIO_EDIT_URL, SHOW_HOME_MEMBERS } from '../config';
import { projectCards, aboutGallery, activityFields } from '../data/editorContent';
import { fetchMembers } from '../members/api';
import { useSeo } from '../seo';
import './Home.css';
import './Community.css';

const sectionFiles = [
    { id: 'hero', label: 'index.html', icon: '◉', kind: 'file' },
    { id: 'about', label: 'about/', icon: '⌄', kind: 'folder' },
    { id: 'projects', label: 'projects/', icon: '⌄', kind: 'folder' },
    ...(SHOW_HOME_MEMBERS ? [{ id: 'members', label: 'members/', icon: '⌄', kind: 'folder' }] : []),
    { id: 'news', label: 'news/', icon: '⌄', kind: 'folder' },
    { id: 'room', label: 'workspace/', icon: '⌄', kind: 'folder' },
    { id: 'faq', label: 'faq.md', icon: '#', kind: 'file' },
    { id: 'join', label: 'join/', icon: '⌄', kind: 'folder' },
];

const extraFiles = [
    { id: 'hero', label: 'index.html', icon: '◉', kind: 'file', track: true },
];

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

const useActiveEditorSection = () => {
    const [activeSection, setActiveSection] = useState('hero');

    useEffect(() => {
        const sections = sectionFiles
            .map(({ id }) => document.getElementById(id))
            .filter(Boolean);

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

                if (visible) setActiveSection(visible.target.id);
            },
            { rootMargin: '-18% 0px -62% 0px', threshold: 0 },
        );

        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, []);

    return activeSection;
};

const EditorFileBar = ({ file, type, number }) => (
    <header className="editor-filebar">
        <span className="editor-filebar__tab">
            <i className={`editor-filebar__icon editor-filebar__icon--${type}`} aria-hidden="true"></i>
            {file}
        </span>
        <span className="editor-filebar__meta">{String(number).padStart(2, '0')} / DCC</span>
    </header>
);

const ExplorerLink = ({ entry, activeSection }) => {
    const isActive = entry.track !== false && entry.id === activeSection;

    return (
        <a
            className={`editor-explorer__entry editor-explorer__entry--${entry.kind}${isActive ? ' is-active' : ''}`}
            href={`#${entry.id}`}
            aria-current={isActive ? 'location' : undefined}
        >
            <span className="editor-explorer__icon" aria-hidden="true">{entry.icon}</span>
            <span>{entry.label}</span>
        </a>
    );
};

const EditorExplorer = ({ activeSection }) => (
    <aside className="editor-explorer" aria-label="DCC Explorer">
        <div className="editor-explorer__heading">
            <span>EXPLORER</span>
            <span aria-hidden="true">···</span>
        </div>
        <div className="editor-explorer__tree">
            <p className="editor-explorer__root"><span aria-hidden="true">⌄</span> DCC</p>
            <div className="editor-explorer__folder-list">
                {sectionFiles.slice(1).map((entry) => (
                    <ExplorerLink key={entry.id} entry={entry} activeSection={activeSection} />
                ))}
            </div>
            <div className="editor-explorer__file-list">
                {extraFiles.map((entry) => (
                    <ExplorerLink key={`${entry.id}-${entry.label}`} entry={entry} activeSection={activeSection} />
                ))}
            </div>
        </div>
        <div className="editor-explorer__foot">
            <span className="editor-live-dot" aria-hidden="true"></span>
            DCC workspace
        </div>
    </aside>
);

const Home = () => {
    const activeSection = useActiveEditorSection();
    const [members, setMembers] = useState(null);
    const [membersError, setMembersError] = useState(false);
    const [posts, setPosts] = useState(null);
    const [postsError, setPostsError] = useState(false);

    useSeo({ path: '/' });

    // SPAの初回描画後でも /#projects のような直リンク先へ確実に移動する。
    useEffect(() => {
        const targetId = decodeURIComponent(window.location.hash.replace(/^#/, ''));
        if (!targetId) return undefined;

        const frame = window.requestAnimationFrame(() => {
            document.getElementById(targetId)?.scrollIntoView();
        });

        return () => window.cancelAnimationFrame(frame);
    }, []);

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
                <EditorExplorer activeSection={activeSection} />

                <div className="editor-canvas">
                    <section id="hero" className="editor-section editor-hero" aria-labelledby="hero-title">
                        <EditorFileBar file="index.html" type="html" number={1} />
                        <div className="editor-hero__body">
                            <div className="editor-code editor-hero__code" data-reveal>
                                <p className="hero-origin">周南公立大学発のクリエイターコミュニティ</p>
                                <h1 id="hero-title" className="editor-hero__title">
                                    <span className="editor-code__number" aria-hidden="true">01</span>
                                    <span>DCC;<i className="terminal-cursor" aria-label=""></i></span>
                                </h1>
                                <p className="editor-hero__kicker"><span className="editor-code__number" aria-hidden="true">02</span><span>DIGITAL CREATORS COMMUNITY</span></p>
                                <p className="editor-hero__copy"><span className="editor-code__number" aria-hidden="true">03</span><span>つくってみたい。<br />その気持ちから、はじめよう。</span></p>
                                <p className="hero-description">アプリ、ゲーム、3D、イラスト、映像、音楽。<br />好きなものをつくり、見せ合い、一緒に学ぶ場所です。</p>
                                <p className="hero-welcome">未経験歓迎 / 部費なし / 自分のペースで参加</p>
                                <div className="editor-hero__actions">
                                    <span className="editor-code__number" aria-hidden="true">04</span>
                                    <span>
                                        <a href={DISCORD_INVITE} className="editor-button editor-button--accent" target="_blank" rel="noreferrer">Discordで参加する <b>↗</b></a>
                                        <HashLink smooth to="/#projects" className="editor-button editor-button--quiet">作品・活動を見る <b>↓</b></HashLink>
                                    </span>
                                </div>
                            </div>

                            <div className="editor-hero__visual" data-reveal style={{ '--reveal-delay': '0.12s' }}>
                                <div className="editor-hero__logo-grid" aria-hidden="true">
                                    <div className="editor-hero__logo-line"></div>
                                    <img src={logo} alt="" />
                                </div>
                                <dl className="editor-hero__meta">
                                    <div><dt>ORIGIN</dt><dd>SHUNAN PUBLIC UNIVERSITY</dd></div>
                                    <div><dt>NETWORK</dt><dd><i className="editor-live-dot" aria-hidden="true"></i> DISCORD BASED</dd></div>
                                    <div><dt>MODE</dt><dd>MAKE / LEARN / PLAY</dd></div>
                                </dl>
                            </div>
                        </div>
                    </section>

                    <section id="about" className="editor-section editor-about" aria-labelledby="about-title">
                        <EditorFileBar file="about.md" type="markdown" number={2} />
                        <div className="editor-about__body">
                            <div className="markdown-sheet" data-reveal>
                                <p className="markdown-sheet__eyebrow"># ABOUT DCC</p>
                                <h2 id="about-title">つくることを、<br /><em>もっと自由に。</em></h2>
                                <p>DCCは、周南公立大学の学生を中心とした、Discordベースのクリエイターコミュニティです。</p>
                                <p>プログラミング・3D・デジタルアートなど。興味のあるものを自由につくり、知識と作品を持ち寄ります。</p>
                                <blockquote>入部届も、部費もなし。Discordに参加すれば、その日からメンバーです。</blockquote>
                                <div className="markdown-sheet__fields">
                                    <p>## Fields</p>
                                    <ul>
                                        {activityFields.map((field) => <li key={field}>- {field}</li>)}
                                    </ul>
                                </div>
                            </div>

                            <div className="editor-about__aside" data-reveal style={{ '--reveal-delay': '0.1s' }}>
                                <div className="editor-about__gallery">
                                    {aboutGallery.map((item) => (
                                        <figure key={item.label}>
                                            <img src={item.image} alt={item.alt} loading="lazy" />
                                            <figcaption>{item.label}</figcaption>
                                        </figure>
                                    ))}
                                </div>
                                <div className="about-runtime">
                                    <p><span>const</span> base = <b>&quot;Discord&quot;</b>;</p>
                                    <p><span>const</span> place = <b>&quot;11号館 2F 第1実習室&quot;</b>;</p>
                                    <p><span>const</span> access = <b>&quot;member&quot;</b>;</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="projects" className="editor-section editor-projects" aria-labelledby="projects-title">
                        <EditorFileBar file="projects/" type="folder" number={3} />
                        <div className="editor-section__intro" data-reveal>
                            <div>
                                <p className="editor-section__label">01 / SELECTED ACTIVITY &amp; WORK</p>
                                <h2 id="projects-title">手を動かした記録が、<br />次の作品になる。</h2>
                            </div>
                            <p>つくる対象は、ひとつに決めない。DCCで動いている制作・活動の入口です。</p>
                        </div>
                        <div className="project-grid">
                            {projectCards.map((project, index) => (
                                <article className="project-card" key={project.number} data-reveal style={{ '--reveal-delay': `${index * 0.07}s` }}>
                                    <div className="project-card__image">
                                        <img src={project.image} alt={project.alt} loading="lazy" />
                                        <span className="project-card__number">{project.number} /</span>
                                    </div>
                                    <div className="project-card__body">
                                        <span className="project-card__file">{project.file}</span>
                                        <h3>{project.title}</h3>
                                        <p>{project.description}</p>
                                        <div className="project-card__footer"><span>{project.category}</span><span>活動分野</span></div>
                                    </div>
                                </article>
                            ))}
                        </div>
                        <div className="published-work">
                            <p className="editor-section__label">FROM THE SHOWCASE / 公開記事で紹介した作品</p>
                            <h3>「好き」から生まれた、こんな作品。</h3>
                            <ul><li>リモート図書館 <span>漫画の購入先を管理するWebアプリ</span></li><li>コドバ。 <span>競技プログラミングのオンライン対戦プラットフォーム</span></li><li>自作Live2Dモデル <span>下絵からモーションまで制作</span></li></ul>
                            <Link to="/blog/2026-07-31-summer-showcase" className="editor-text-link">作品を紹介した成果物発表会の記事を読む →</Link>
                        </div>
                        <Link to="/blog" className="editor-text-link">活動ログをすべて見る <span aria-hidden="true">→</span></Link>
                    </section>

                    {SHOW_HOME_MEMBERS && <section id="members" className="editor-section editor-members" aria-labelledby="members-title">
                        <EditorFileBar file="members.json" type="json" number={4} />
                        <div className="editor-section__intro editor-members__intro" data-reveal>
                            <div>
                                <p className="editor-section__label">02 / PEOPLE IN DCC</p>
                                <h2 id="members-title">人の好奇心が、<br />DCCのエンジン。</h2>
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
                        <EditorFileBar file="news.log" type="log" number={5} />
                        <div className="editor-section__intro" data-reveal>
                            <div>
                                <p className="editor-section__label">03 / ACTIVITY LOG</p>
                                <h2 id="news-title">DCCの今を、<br />ログに残す。</h2>
                            </div>
                            <p>発表会やミーティングなど、DCCの日々の活動を紹介します。</p>
                        </div>

                        <div className="news-workspace">
                            <div className="news-terminal" aria-live="polite" data-reveal>
                                <div className="news-terminal__bar"><span>LOG OUTPUT</span><span>LIVE FEED</span></div>
                                {posts === null && !postsError && <p className="news-terminal__state">// Loading published activity logs…</p>}
                                {postsError && <p className="news-terminal__state">// Feed unavailable. Open the activity blog to try again.</p>}
                                {posts?.length === 0 && <p className="news-terminal__state">// No published activity logs yet.</p>}
                                {posts?.slice(0, 4).map((post) => (
                                    <Link to={`/blog/${post.slug}`} className="news-terminal__line" key={post.slug}>
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
                                <p className="dcc-services__note">制作を支える、メンバー向けのAI・コード共有環境。</p>
                            </aside>
                        </div>
                        <Link to="/blog" className="editor-text-link">活動ブログを開く <span aria-hidden="true">→</span></Link>
                    </section>

                    <section id="room" className="editor-section" aria-labelledby="room-title">
                        <EditorFileBar file="workspace/" type="folder" number={6} />
                        <div className="community-space">
                            <div><p className="editor-section__label">ONLINE / ON CAMPUS</p><h2 id="room-title">オンラインでも、<br />部室でも。</h2><p>普段の相談や作品の共有はDiscordで。大学では、部室のPCやVR機器、3Dプリンタを使って制作を楽しめます。</p><p>活動拠点：11号館 2F 第1実習室</p><ul><li>ゲーミングPC</li><li>VR機器</li><li>3Dプリンタ</li><li>プロジェクター</li></ul><a className="editor-text-link" href={CONTACT_FORM_URL} target="_blank" rel="noreferrer">部室を見学したい方はこちら ↗</a></div>
                            <figure><img src={roomPhoto} alt="PCが並ぶDCCの部室" loading="lazy" width="800" height="600" /><figcaption>つくる道具も、相談できる仲間も。</figcaption></figure>
                        </div>
                    </section>
                    <section id="faq" className="editor-section" aria-labelledby="faq-title">
                        <EditorFileBar file="faq.md" type="markdown" number={7} />
                        <div className="community-faq"><p className="editor-section__label">BEFORE YOU JOIN</p><h2 id="faq-title">参加する前に。</h2>
                            <details open><summary>プログラミング未経験でも大丈夫？</summary><p>はい。未経験でも参加できます。プログラミングだけでなく、イラスト・映像・音楽など、興味のある制作から始められます。</p></details>
                            <details><summary>活動頻度はどのくらい？</summary><p>決まった参加頻度はありません。Discordで交流したり、来られるときに部室に来たり、自分のペースで活動できます。</p></details>
                            <details><summary>他のサークルと掛け持ちできる？</summary><p>はい、掛け持ちできます。</p></details>
                            <details><summary>お金や入部手続きは必要？</summary><p>部費も入部届も必要ありません。Discordに参加すれば、その日からメンバーです。参加後はサーバー内の案内をご確認ください。</p></details>
                        </div>
                    </section>
                    <section id="join" className="editor-section editor-join" aria-labelledby="join-title">
                        <EditorFileBar file="join.sh" type="shell" number={8} />
                        <div className="join-terminal" data-reveal>
                            <p className="join-terminal__command"><span>$</span> ./join.sh</p>
                            <p className="join-terminal__output">&gt; DCCに参加する</p>
                            <h2 id="join-title">つくることが好きな、<br />すべての人へ。</h2>
                            <p className="join-terminal__output">&gt; さあ、一緒につくろう。</p>
                            <p className="join-explanation">下のボタンからDiscordの招待ページが開きます。<br />気になることがあれば、見学・お問い合わせからご相談ください。</p>
                            <div className="join-terminal__actions">
                                <a href={DISCORD_INVITE} className="join-terminal__cta" target="_blank" rel="noreferrer">Discordで参加する <span aria-hidden="true">↗</span></a>
                                <a href={CONTACT_FORM_URL} className="join-terminal__contact" target="_blank" rel="noreferrer">見学・お問い合わせ ↗</a>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Home;
