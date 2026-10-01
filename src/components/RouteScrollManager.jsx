import { useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const SCROLL_STORAGE_KEY = 'dcc-route-scroll-v1';
const locationPath = ({ pathname, search, hash }) => pathname + search + hash;

function restorePosition({ top, left }) {
    const reached = () => Math.abs(window.scrollY - top) < 1 && Math.abs(window.scrollX - left) < 1;
    const restore = () => window.scrollTo({ top, left, behavior: 'instant' });
    restore();
    if (reached()) return undefined;

    // 再読み込みで本文がまだ短い場合、APIによる高さの変化を待つ。
    // 時間ではなく実際のレイアウトを基準にし、利用者が操作したら位置の強制を止める。
    const inputs = ['wheel', 'touchstart', 'pointerdown', 'keydown'];
    const stop = () => {
        observer.disconnect();
        inputs.forEach((event) => window.removeEventListener(event, stop));
    };
    const observer = new ResizeObserver(() => {
        restore();
        if (reached()) stop();
    });
    observer.observe(document.body);
    inputs.forEach((event) => window.addEventListener(event, stop, { passive: true }));
    return stop;
}

// 通常遷移の位置を、DOM更新後・描画前に確定する。
// SPAのDOM更新とブラウザの履歴復元を競合させず、POPは履歴keyごとの位置へ戻す。
// 同一ページのアンカーだけsmoothにし、ページをまたぐ移動では即時に位置を確定する。
export default function RouteScrollManager() {
    const location = useLocation();
    const navigationType = useNavigationType();
    const previousLocation = useRef(null);
    const positions = useRef(new Map());

    useLayoutEffect(() => {
        try {
            const entries = JSON.parse(sessionStorage.getItem(SCROLL_STORAGE_KEY) || '[]');
            for (const [key, value] of entries) {
                if (typeof key === 'string' && typeof value?.path === 'string'
                    && Number.isFinite(value.left) && Number.isFinite(value.top)) {
                    positions.current.set(key, value);
                }
            }
        } catch { /* 保存領域が使えなくても、このタブ内の位置は保持する。 */ }

        const previousRestoration = history.scrollRestoration;
        history.scrollRestoration = 'manual';
        const save = () => {
            const current = previousLocation.current;
            if (!current) return;
            positions.current.set(current.key, {
                path: locationPath(current), left: window.scrollX, top: window.scrollY,
            });
        };
        const persist = () => {
            save();
            try {
                sessionStorage.setItem(SCROLL_STORAGE_KEY, JSON.stringify([...positions.current]));
            } catch { /* Private browsingや容量制限でも遷移を止めない。 */ }
        };

        // clickはURL変更より先、popstateはReactのDOM更新より先に旧ページの位置を記録する。
        // scrollイベントがまだ配送されていない高速操作でも、最後の位置を取りこぼさない。
        window.addEventListener('click', save, true);
        window.addEventListener('popstate', save, true);
        window.addEventListener('scroll', save, { passive: true });
        window.addEventListener('pagehide', persist);
        return () => {
            window.removeEventListener('click', save, true);
            window.removeEventListener('popstate', save, true);
            window.removeEventListener('scroll', save);
            window.removeEventListener('pagehide', persist);
            history.scrollRestoration = previousRestoration;
        };
    }, []);

    useLayoutEffect(() => {
        const previous = previousLocation.current;
        previousLocation.current = location;

        const saved = positions.current.get(location.key);
        const documentNavigation = performance.getEntriesByType('navigation')[0]?.type;
        const restoreHistory = previous ? navigationType === 'POP'
            : documentNavigation === 'reload' || documentNavigation === 'back_forward';
        if (restoreHistory && saved?.path === locationPath(location)) {
            return restorePosition(saved);
        }

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
