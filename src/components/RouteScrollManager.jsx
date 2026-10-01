import { useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// 通常遷移の位置を、DOM更新後・描画前に確定する。
// POPはブラウザ標準の scrollRestoration="auto" に任せ、戻る・進むの位置を保持する。
// 同一ページのアンカーだけsmoothにし、ページをまたぐ移動では即時に位置を確定する。
export default function RouteScrollManager() {
    const location = useLocation();
    const navigationType = useNavigationType();
    const previousLocation = useRef(null);

    useLayoutEffect(() => {
        const previous = previousLocation.current;
        previousLocation.current = location;

        if (previous && navigationType === 'POP') return;

        if (location.hash) {
            let id = location.hash.slice(1);
            try { id = decodeURIComponent(id); } catch { /* 不正なエンコードでも遷移を止めない。 */ }
            const target = document.getElementById(id);
            if (target) {
                const smooth = previous?.pathname === location.pathname
                    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                target.scrollIntoView({ block: 'start', behavior: smooth ? 'smooth' : 'instant' });
                return;
            }
        }

        if (previous || location.hash) {
            // CSSやブラウザ設定によらず、通常遷移では描画前に上部へ戻す。
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
    }, [location, navigationType]);

    return null;
}
