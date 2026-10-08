import React, { useEffect, useState } from 'react';
import Link from '../components/NavigationLink';
import logo from '../assets/logo-white.png';
import roomPhoto from '../assets/room-pc-01.jpg';
import { fetchPosts } from '../blog/api';
import { DCC_AI_URL, DCC_GIT_URL, DISCORD_INVITE, CONTACT_FORM_URL, PORTFOLIO_EDIT_URL, SHOW_HOME_MEMBERS } from '../config';
import { aboutGallery, activityFields } from '../data/editorContent';
import { homeSections, siteNumber } from '../data/siteSections';
import { fetchMembers } from '../members/api';
import { useSeo } from '../seo';
import './Home.css';
import './Community.css';

const explorerIcons = { html: '◉', markdown: '#', folder: '⌄', json: '{}', log: '>', shell: '$' };
const sectionFiles = homeSections.map(({ id, file, type }) => ({
    id,
    label: file,
    icon: explorerIcons[type],
    kind: type === 'folder' ? 'folder' : 'file',
}));
const sectionFileById = Object.fromEntries(homeSections.map((section) => [section.id, section]));

const extraFiles = [
    { id: 'hero', label: 'index.html', icon: explorerIcons.html, kind: 'file', track: true },
    { to: '/blog', label: 'news/', icon: explorerIcons.folder, kind: 'folder', track: false },
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

const ExplorerLink = ({ entry, activeSection }) => {
    const isActive = entry.track !== false && entry.id === activeSection;
    const content = <>
        <span className="editor-explorer__icon" aria-hidden="true">{entry.icon}</span>
        <span>{entry.label}</span>
    </>;

    if (entry.to) {
        return (
                <Link className={`editor-explorer__entry editor-explorer__entry--${entry.kind}`} to={entry.to}>
                    {content}
                </Link>
        );
    }

    return (
        <Link
            className={`editor-explorer__entry editor-explorer__entry--${entry.kind}${isActive ? ' is-active' : ''}`}
            to={`/#${entry.id}`}
            aria-current={isActive ? 'location' : undefined}
        >
            {content}
        </Link>
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
                        <EditorFileBar section="hero" />
                        <div className="editor-hero__body">
                            <div className="editor-code editor-hero__code" data-reveal>
                                <p className="hero-origin">周南公立大学発のクリエイターコミュニティ</p>
                                <h1 id="hero-title" className="editor-hero__title">
                                    <span>DCC;<i className="terminal-cursor" aria-label=""></i></span>
                                </h1>
                                <p className="editor-hero__kicker"><span>DIGITAL CREATORS COMMUNITY</span></p>
                                <p className="editor-hero__copy"><span>つくってみたい。<br />その気持ちから、はじめよう。</span></p>
                                <p className="hero-description">アプリ、ゲーム、3D、イラスト、映像、音楽。<br />好きなものをつくり、見せ合い、一緒に学ぶ場所です。</p>
                                <p className="hero-welcome">未経験歓迎 / 部費なし / 自分のペースで参加</p>
                                <div className="editor-hero__actions">
                                    <span>
                                        <a href={DISCORD_INVITE} className="editor-button editor-button--accent" target="_blank" rel="noreferrer">Discordで参加する <b>↗</b></a>
                                        <Link to="/#projects" className="editor-button editor-button--quiet">作品・活動を見る <b>↓</b></Link>
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
                        <EditorFileBar section="about" />
                        <div className="editor-about__body">
                            <div className="markdown-sheet" data-reveal>
                                <p className="markdown-sheet__eyebrow">{siteNumber('about')} / ABOUT DCC</p>
                                <h2 id="about-title">DCCって<br /><em>どんなところ？</em></h2>
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
                        <EditorFileBar section="projects" />
                        <div className="editor-section__intro" data-reveal>
                            <div>
                                <p className="editor-section__label">{siteNumber('projects')} / FROM THE SHOWCASE</p>
                                <h2 id="projects-title">発表会で<br />紹介された作品</h2>
                            </div>
                            <p>成果物発表会で、メンバーが発表した作品の一部です。</p>
                        </div>
                        <div className="published-work" data-reveal>
                            <ul><li>リモート図書館 <span>漫画の購入先を管理するWebアプリ</span></li><li>コドバ。 <span>競技プログラミングのオンライン対戦プラットフォーム</span></li><li>自作Live2Dモデル <span>下絵からモーションまで制作</span></li></ul>
                            <Link to="/blog/2026-07-31-summer-showcase" className="editor-text-link">成果物発表会の記事を読む →</Link>
                        </div>
                        <Link to="/blog" className="editor-text-link">活動ブログをすべて見る <span aria-hidden="true">→</span></Link>
                    </section>

                    {SHOW_HOME_MEMBERS && <section id="members" className="editor-section editor-members" aria-labelledby="members-title">
                        <EditorFileBar section="members" />
                        <div className="editor-section__intro editor-members__intro" data-reveal>
                            <div>
                                <p className="editor-section__label">{siteNumber('members')} / PEOPLE IN DCC</p>
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
                        <EditorFileBar section="news" />
                        <div className="editor-section__intro" data-reveal>
                            <div>
                                <p className="editor-section__label">{siteNumber('news')} / ACTIVITY LOG</p>
                                <h2 id="news-title">DCCの<br />最近の活動</h2>
                            </div>
                            <p>イベントや日々の活動の様子を、ブログで紹介しています。</p>
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
                                <p className="dcc-services__note">制作を支える、メンバー向けのAI・コード共有環境。</p>
                            </aside>
                        </div>
                        <Link to="/blog" className="editor-text-link">活動ブログを開く <span aria-hidden="true">→</span></Link>
                    </section>

                    <section id="room" className="editor-section" aria-labelledby="room-title">
                        <EditorFileBar section="room" />
                        <div className="community-space">
                            <div><p className="editor-section__label">{siteNumber('room')} / ONLINE &amp; ON CAMPUS</p><h2 id="room-title">オンラインと<br />部室での活動</h2><p>普段の相談や作品の共有はDiscordで。大学では、部室のPCやVR機器、3Dプリンタを使って制作を楽しめます。</p><p>活動拠点：11号館 2F 第1実習室</p><ul><li>ゲーミングPC</li><li>VR機器</li><li>3Dプリンタ</li><li>プロジェクター</li></ul><a className="editor-text-link" href={CONTACT_FORM_URL} target="_blank" rel="noreferrer">部室を見学したい方はこちら ↗</a></div>
                            <figure><img src={roomPhoto} alt="PCが並ぶDCCの部室" loading="lazy" width="800" height="600" /><figcaption>つくる道具も、相談できる仲間も。</figcaption></figure>
                        </div>
                    </section>
                    <section id="faq" className="editor-section" aria-labelledby="faq-title">
                        <EditorFileBar section="faq" />
                        <div className="community-faq"><p className="editor-section__label">{siteNumber('faq')} / BEFORE YOU JOIN</p><h2 id="faq-title">よくある質問</h2>
                            <details open><summary>プログラミング未経験でも大丈夫？</summary><p>はい。未経験でも参加できます。プログラミングだけでなく、イラスト・映像・音楽など、興味のある制作から始められます。</p></details>
                            <details><summary>活動頻度はどのくらい？</summary><p>決まった参加頻度はありません。Discordで交流したり、来られるときに部室に来たり、自分のペースで活動できます。</p></details>
                            <details><summary>他のサークルと掛け持ちできる？</summary><p>はい、掛け持ちできます。</p></details>
                            <details><summary>お金や入部手続きは必要？</summary><p>部費も入部届も必要ありません。Discordに参加すれば、その日からメンバーです。参加後はサーバー内の案内をご確認ください。</p></details>
                        </div>
                    </section>
                    <section id="join" className="editor-section editor-join" aria-labelledby="join-title">
                        <EditorFileBar section="join" />
                        <div className="join-terminal" data-reveal>
                            <p className="join-terminal__command"><span>$</span> ./join.sh</p>
                            <p className="join-terminal__output">&gt; DCCに参加する</p>
                            <h2 id="join-title"><span className="nowrap-phrase">つくるのが好き？</span><br /><span className="nowrap-phrase">参加しよう。</span></h2>
                            <p className="join-terminal__output">&gt; 一緒に何かつくりませんか？</p>
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
