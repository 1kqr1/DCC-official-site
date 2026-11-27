// サイト全体で使う設定値
import { siteContent } from './data/siteContent';

// ===== 部員ポータル（DCCadmin）の「HP編集」で変えられる値 =====
// トップのメンバー紹介と導線の表示。
export const SHOW_HOME_MEMBERS = siteContent.settings.showHomeMembers;
// Discord 招待リンク
export const DISCORD_INVITE = siteContent.links.discordInvite;
// お問い合わせ Google フォーム
//   CONTACT_FORM_URL  … 一般（入部・見学など）
//   BUSINESS_FORM_URL … 企業向け（協賛・制作依頼・採用・コラボ）
export const CONTACT_FORM_URL = siteContent.links.contactForm;
export const BUSINESS_FORM_URL = siteContent.links.businessForm;
// DCC Hub（app.shu-dcc.net）内の各機能
export const DCC_AI_URL = siteContent.links.dccAi;
export const DCC_GIT_URL = siteContent.links.dccGit;

// ===== ここから下はコードで管理する値 =====

// 公開サイトから呼び出すDCCAI Worker。秘密情報はこの値に含めない。
export const DCCAI_API_URL = import.meta.env.VITE_DCCAI_API_URL || 'https://dccai-shu-dcc.s1kqr1s.workers.dev/api/dccai';

// 活動カレンダー。部員ポータル（/calendar で役員が編集）の公開APIから読む。開発中はVite側のサンプルAPIを使う。
export const EVENTS_API_URL = import.meta.env.VITE_EVENTS_API_URL
    || (import.meta.env.DEV ? '/api/events' : 'https://dcc-portal.s1kqr1s.workers.dev/api/events');

// 部員ポータル（DCC Login連携、部員が自分で編集できるアプリ。プロフィール編集・活動ブログ）
// /members と /blog はここの公開APIからデータを読み込んで表示する
export const PORTFOLIO_API_URL = 'https://dcc-portal.s1kqr1s.workers.dev';
export const PORTFOLIO_EDIT_URL = 'https://dcc-portal.s1kqr1s.workers.dev/edit';
