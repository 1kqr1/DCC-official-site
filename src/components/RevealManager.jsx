import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// [data-reveal] が付いた要素を監視し、画面に入ったら data-revealed 属性を付与する。
// ※ className ではなく data 属性を使う（React の再レンダリングで消されないため）。
// ページ遷移（pathname 変化）のたびに再スキャンする。
const RevealManager = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        const els = document.querySelectorAll('[data-reveal]:not([data-revealed])');
        if (els.length === 0) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            els.forEach((el) => el.setAttribute('data-revealed', ''));
            return;
        }

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

        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, [pathname]);

    return null;
};

export default RevealManager;
