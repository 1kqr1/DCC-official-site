import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Link from './NavigationLink';
import { homeSections } from '../data/siteSections';
import './EditorExplorer.css';

const icons = { html: '◉', markdown: '#', folder: '⌄', json: '{}', log: '>', shell: '$' };

function EditorExplorer() {
    const { pathname } = useLocation();
    const [activeSection, setActiveSection] = useState('hero');
    const isNews = pathname === '/blog' || pathname.startsWith('/blog/');

    useEffect(() => {
        if (pathname !== '/') return undefined;
        const sections = homeSections.map(({ id }) => document.getElementById(id)).filter(Boolean);
        const update = () => {
            const marker = window.innerHeight * 0.38;
            let current = sections[0];
            for (const section of sections) {
                if (section.getBoundingClientRect().top <= marker) current = section;
            }
            if (current) setActiveSection(current.id);
        };
        const observer = new IntersectionObserver(update, { rootMargin: '-18% 0px -62% 0px', threshold: 0 });
        sections.forEach((section) => observer.observe(section));
        window.addEventListener('resize', update);
        update();
        return () => {
            observer.disconnect();
            window.removeEventListener('resize', update);
        };
    }, [pathname]);

    return (
        <aside className="editor-explorer" aria-label="DCC Explorer">
            <div className="editor-explorer__heading"><span>EXPLORER</span><span aria-hidden="true">···</span></div>
            <nav className="editor-explorer__tree" aria-label="エクスプローラー">
                <p className="editor-explorer__root"><span aria-hidden="true">⌄</span> DCC</p>
                <div className="editor-explorer__folder-list">
                    {homeSections.map(({ id, file, type }) => {
                        const news = id === 'news';
                        const active = isNews ? news : pathname === '/' && id === activeSection;
                        const kind = news || type === 'folder' ? 'folder' : 'file';
                        return (
                            <Link key={id} to={news ? '/blog' : `/#${id}`}
                                className={`editor-explorer__entry editor-explorer__entry--${kind}${active ? ' is-active' : ''}`}
                                aria-current={active ? (isNews ? 'page' : 'location') : undefined}>
                                <span className="editor-explorer__icon" aria-hidden="true">{news ? icons.folder : icons[type]}</span>
                                <span>{news ? 'news/' : file}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
            <div className="editor-explorer__foot"><span className="editor-live-dot" aria-hidden="true"></span>DCC workspace</div>
        </aside>
    );
}

export default EditorExplorer;
