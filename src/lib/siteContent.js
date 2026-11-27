// 部員ポータル（DCCadmin）で編集したHPの文章・リンク・画像を、リポジトリの初期値に重ねる。
// ビルド時（scripts/fetch-site-content.mjs）に使う。ブラウザでは読み込まない。
//
// 初期値（src/data/site-content.json）にある項目・型だけを受け付けるので、
// 編集側で項目名を間違えたり余計な値を送ったりしても、HPの表示は壊れない。

// 空のリンクは「リンクを出さない」の意味で受け付ける。
const SAFE_LINK = /^(?:|https?:\/\/[^\s]+|\/(?!\/)[^\s]*)$/;
const SAFE_IMAGE = /^(?:asset:[\w.-]+|https:\/\/[^\s]+)$/;
const MAX_TEXT = 5000;

const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

// リンク・画像の項目はキー名で見分ける（links.*, 〜Url, image）。
function kindOf(key, parentKey) {
    if (key === 'image') return 'image';
    if (parentKey === 'links' || /Url$/.test(key)) return 'link';
    return 'text';
}

function mergeString(fallback, value, kind) {
    if (typeof value !== 'string') return fallback;
    const text = value.replace(/\r\n?/g, '\n').slice(0, MAX_TEXT);
    if (kind === 'link') return SAFE_LINK.test(text.trim()) ? text.trim() : fallback;
    if (kind === 'image') return SAFE_IMAGE.test(text.trim()) ? text.trim() : fallback;
    return text;
}

function mergeValue(fallback, value, key, parentKey) {
    if (Array.isArray(fallback)) {
        if (!Array.isArray(value)) return fallback;
        const template = fallback[0];
        // 初期値が空配列なら形が分からないので、文字列の配列として扱う
        if (template === undefined || typeof template === 'string') {
            return value.filter((item) => typeof item === 'string').map((item) => item.slice(0, MAX_TEXT));
        }
        if (isPlainObject(template)) {
            // 行ごとに、同じ位置の初期値（なければ先頭の行の形）を土台にする。不正な画像・リンクは空にする。
            const blank = Object.fromEntries(Object.entries(template).map(([k, v]) => [k, Array.isArray(v) ? [] : typeof v === 'boolean' ? false : '']));
            return value.filter(isPlainObject).map((item) => mergeObject(blank, item, key));
        }
        return fallback;
    }
    if (isPlainObject(fallback)) return mergeObject(fallback, value, key);
    if (typeof fallback === 'boolean') return typeof value === 'boolean' ? value : fallback;
    if (typeof fallback === 'number') return Number.isFinite(value) ? value : fallback;
    if (typeof fallback === 'string') return mergeString(fallback, value, kindOf(key, parentKey));
    return fallback;
}

function mergeObject(fallback, value, parentKey) {
    if (!isPlainObject(value)) return fallback;
    const out = {};
    for (const [key, base] of Object.entries(fallback)) {
        out[key] = Object.hasOwn(value, key) ? mergeValue(base, value[key], key, parentKey) : base;
    }
    return out;
}

/** 初期値 defaults に、編集された内容 override を重ねた新しいオブジェクトを返す。 */
export function mergeSiteContent(defaults, override) {
    return mergeObject(defaults, override, '');
}
