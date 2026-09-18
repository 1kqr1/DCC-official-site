import React from 'react';
import './EditorRouteFrame.css';

const fileIcons = {
    html: '<>',
    json: '{}',
    log: '>',
    markdown: '#',
};

const EditorRouteFrame = ({ file, type = 'markdown', number, children }) => (
    <div className="editor-route-frame">
        <div className="editor-route-frame__titlebar" aria-hidden="true">
            <span className="editor-route-frame__dots"><i></i><i></i><i></i></span>
            <span className="editor-route-frame__workspace">DCC / {file}</span>
            <span className="editor-route-frame__state">● LIVE</span>
        </div>
        <div className="editor-route-frame__tabbar">
            <span className={`editor-route-frame__tab editor-route-frame__tab--${type}`}>
                <b>{fileIcons[type] || '#'}</b>
                {file}
            </span>
            {number && <span className="editor-route-frame__index">{number}</span>}
        </div>
        <div className="editor-route-frame__content">{children}</div>
    </div>
);

export default EditorRouteFrame;
