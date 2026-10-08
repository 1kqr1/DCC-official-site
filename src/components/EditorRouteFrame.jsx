import React from 'react';
import './EditorRouteFrame.css';
import EditorExplorer from './EditorExplorer';

const fileIcons = {
    html: '<>',
    json: '{}',
    log: '>',
    markdown: '#',
    folder: '⌄',
};

const EditorRouteFrame = ({ file, type = 'markdown', number, children, withExplorer = false }) => (
    <div className="editor-route-frame">
        <div className="editor-route-frame__titlebar" aria-hidden="true">
            <span className="editor-route-frame__dots"><i></i><i></i><i></i></span>
            <span className="editor-route-frame__path">DCC / {file}</span>
            <span className="editor-route-frame__state">● LIVE</span>
        </div>
        <div className={withExplorer ? 'editor-route-frame__workspace' : undefined}>
            {withExplorer && <EditorExplorer />}
            <div className="editor-route-frame__canvas">
                <div className="editor-route-frame__tabbar">
                    <span className={`editor-route-frame__tab editor-route-frame__tab--${type}`}>
                        <b>{fileIcons[type] || '#'}</b>
                        <span className="editor-route-frame__filename" title={file}>{file}</span>
                    </span>
                    {number && <span className="editor-route-frame__index">{number}</span>}
                </div>
                <div className="editor-route-frame__content">{children}</div>
            </div>
        </div>
    </div>
);

export default EditorRouteFrame;
