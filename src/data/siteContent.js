// HPの文章・リンク・画像。部員ポータル（DCCadmin）の「HP編集」で変えられる。
// site-content.json はリポジトリ上の初期値で、本番ビルドでは公開済みの編集内容を重ねたものに置き換わる
// （scripts/fetch-site-content.mjs）。項目を増やすときは、ポータル側の項目定義（dcc-portfolio の src/siteSchema.ts）も足す。
import content from './site-content.json' with { type: 'json' };

export const siteContent = content;

// 画像の値は "asset:ファイル名"（src/assets の画像）か、ポータルにアップロードした画像のURL。
const bundledImages = import.meta.glob('../assets/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' });

export function imageSrc(value) {
    if (typeof value !== 'string' || !value) return null;
    if (value.startsWith('asset:')) return bundledImages[`../assets/${value.slice(6)}`] ?? null;
    return /^https:\/\//.test(value) ? value : null;
}
