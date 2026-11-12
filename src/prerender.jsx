import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Business from './pages/Business';
import Blog from './pages/Blog';
import Members from './pages/Members';

const pages = { '/': Home, '/business': Business, '/blog': Blog, '/members': Members };

// 同じページコンポーネントをHTML化。個人情報や外部APIの応答はビルドに保存しない。
export function renderPage(path) {
    const Page = pages[path];
    if (!Page) throw new Error(`Unknown prerender path: ${path}`);
    return renderToString(
        <StaticRouter location={path}>
            <div className="app-container">
                <Header />
                <main id="main-content"><Page /></main>
                <Footer />
            </div>
        </StaticRouter>,
    );
}
