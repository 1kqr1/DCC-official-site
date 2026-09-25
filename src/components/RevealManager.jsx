import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// [data-reveal] が付いた要素を監視し、画面に入ったら data-revealed 属性を付与する。
// ※ className ではなく data 属性を使う（React の再レンダリングで消されないため）。
// ページ遷移（pathname 変化）のたびに再スキャンするのに加えて、API取得後に
// 遅れて追加される要素（部員一覧など）も MutationObserver で拾う。
const RevealManager = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const cssReveal = CSS.supports('animation-timeline: view()')
            && CSS.supports('animation-range: entry 0% entry 100%');

        if (cssReveal && !reducedMotion) return undefined;

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.setAttribute('data-revealed', '');
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );

        const observe = (el) => {
            if (reducedMotion) {
                el.setAttribute('data-revealed', '');
            } else {
                io.observe(el);
            }
        };

        document.querySelectorAll('[data-reveal]:not([data-revealed])').forEach(observe);

        // 非同期でDOMに追加される要素（fetch後に描画される部員カードなど）を検知する
        const mo = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== 1) continue;
                    if (node.matches?.('[data-reveal]:not([data-revealed])')) observe(node);
                    node.querySelectorAll?.('[data-reveal]:not([data-revealed])').forEach(observe);
                }
            }
        });
        mo.observe(document.body, { childList: true, subtree: true });

        return () => {
            io.disconnect();
            mo.disconnect();
        };
    }, [pathname]);

    return null;
};

export default RevealManager;
