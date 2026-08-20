import React, { useEffect, useRef, useState } from 'react';
import './Opening.css';

// 初回アクセス時だけ流すオープニング。
// ターミナルでdev serverを起動 → 同じウィンドウのままエディタに切り替わり、
// ヒーローの文面が行番号つきで現れる、という1本の流れにしている。
//
// 「見た」記録はsessionStorageに置く。タブを閉じるまでの間は二度と出ないので、
// ブログを読んでトップに戻るたびに見せられる、という一番嫌われるパターンを避けられる。
// 日を改めて来たときはまた見られる（localStorageだと二度と出なくなってしまう）。
const SEEN_KEY = 'dcc_opening_seen';

// Opening.css のタイムラインと揃える。ここだけ変えても速くならないので注意。
const PLAY_MS = 2600;
const FADE_MS = 400;

function shouldPlay() {
    if (typeof window === 'undefined') return false;
    // トップページに来た人だけ。ブログ記事などに直接リンクで来た人に
    // トップの文面を見せても仕方ないので出さない。
    if (window.location.pathname !== '/') return false;
    // 「動きを減らす」設定の人には見せない（サイト全体の方針と揃える）
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    // /?opening を付けると何度でも再生できる（人に見せたいとき・確認したいとき用）
    if (new URLSearchParams(window.location.search).has('opening')) return true;
    try {
        if (sessionStorage.getItem(SEEN_KEY)) return false;
    } catch {
        // プライベートモードなどでsessionStorageが使えない場合は、毎回出すより出さない方が安全
        return false;
    }
    return true;
}

const Opening = () => {
    const [playing, setPlaying] = useState(shouldPlay);
    const [closing, setClosing] = useState(false);
    const timers = useRef([]);

    useEffect(() => {
        if (!playing) return;

        try {
            sessionStorage.setItem(SEEN_KEY, '1');
        } catch {
            // 保存できなくても再生自体は続ける
        }

        // 再生中は背面がスクロールしないように止める
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const close = () => {
            setClosing(true);
            timers.current.push(setTimeout(() => setPlaying(false), FADE_MS));
        };

        timers.current.push(setTimeout(close, PLAY_MS));

        // クリック・キー・スクロール・タッチ、どれでも飛ばせる
        const skip = () => close();
        window.addEventListener('pointerdown', skip);
        window.addEventListener('keydown', skip);
        window.addEventListener('wheel', skip, { passive: true });
        window.addEventListener('touchstart', skip, { passive: true });

        return () => {
            timers.current.forEach(clearTimeout);
            timers.current = [];
            document.body.style.overflow = prevOverflow;
            window.removeEventListener('pointerdown', skip);
            window.removeEventListener('keydown', skip);
            window.removeEventListener('wheel', skip);
            window.removeEventListener('touchstart', skip);
        };
    }, [playing]);

    if (!playing) return null;

    return (
        <div
            className={`opening${closing ? ' is-closing' : ''}`}
            role="presentation"
            aria-hidden="true"
        >
            <div className="opening-window">
                <div className="opening-titlebar">
                    <span className="opening-dots">
                        <span className="opening-dot opening-dot-r"></span>
                        <span className="opening-dot opening-dot-y"></span>
                        <span className="opening-dot opening-dot-g"></span>
                    </span>
                    <span className="opening-tabs">
                        <span className="opening-tab opening-tab-shell">zsh</span>
                        <span className="opening-tab opening-tab-file">
                            <span className="opening-tab-dot"></span>home.tsx
                        </span>
                    </span>
                </div>

                <div className="opening-body">
                    {/* --- 第1幕: ターミナル --- */}
                    <div className="opening-terminal">
                        <p className="opening-cmd">
                            <span className="opening-prompt">$</span>
                            <span className="opening-typed">npm run dev</span>
                            <span className="opening-caret"></span>
                        </p>
                        <p className="opening-ready">
                            <span className="opening-arrow">&gt;</span> ready in 312ms
                        </p>
                    </div>

                    {/* --- 第2幕: エディタ（ヒーローと同じ文面） --- */}
                    <div className="opening-code">
                        <p className="opening-row" style={{ '--i': 0 }}>
                            <span className="opening-ln">1</span>
                            <span className="opening-lc opening-comment">
                                // 周南公立大学発 — Discordベースのクリエイターコミュニティ
                            </span>
                        </p>
                        <p className="opening-row opening-row-blank" style={{ '--i': 1 }}>
                            <span className="opening-ln">2</span>
                            <span className="opening-lc"></span>
                        </p>
                        <p className="opening-row" style={{ '--i': 2 }}>
                            <span className="opening-ln">3</span>
                            <span className="opening-lc opening-title">
                                誰もが<span className="opening-token">クリエイター</span>に
                            </span>
                        </p>
                        <p className="opening-row" style={{ '--i': 3 }}>
                            <span className="opening-ln">4</span>
                            <span className="opening-lc opening-title">なれる場所。</span>
                        </p>
                    </div>
                </div>
            </div>

            <span className="opening-skip">
                <span className="opening-skip-pc">クリックでスキップ</span>
                <span className="opening-skip-sp">タップでスキップ</span>
            </span>
        </div>
    );
};

export default Opening;
