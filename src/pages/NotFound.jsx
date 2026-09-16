import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import EditorRouteFrame from '../components/EditorRouteFrame';
import { useSeo } from '../seo';
import './NotFound.css';

const NotFound = () => {
    const location = useLocation();
    useSeo({ title: 'ページが見つかりませんでした', path: location.pathname });

    return (
        <EditorRouteFrame file="404.md" type="markdown" number="ERR">
            <section className="not-found">
                <p className="not-found__command">$ dcc.open(&quot;{location.pathname}&quot;)</p>
                <p className="not-found__error">Error: FILE_NOT_FOUND</p>
                <h1>ページが見つかりませんでした。</h1>
                <p>URLをご確認いただくか、DCCのワークスペースへ戻ってください。</p>
                <Link to="/" className="not-found__action">← ./index.html に戻る</Link>
            </section>
        </EditorRouteFrame>
    );
};

export default NotFound;
