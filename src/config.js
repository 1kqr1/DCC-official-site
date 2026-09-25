// サイト全体で使う設定値
// トップのメンバー紹介と導線を一時停止。再掲載時は true に戻す。
export const SHOW_HOME_MEMBERS = false;

// Discord 招待リンク
export const DISCORD_INVITE = 'https://discord.gg/Gah94cTxw4';

// お問い合わせ Google フォーム
//   CONTACT_FORM_URL  … 一般（入部・見学など）
//   BUSINESS_FORM_URL … 企業向け（協賛・制作依頼・採用・コラボ）
export const CONTACT_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSew9o6Btnqyyf1_NvSGiaOzRfKoLBAz_BJmGAkZvOiGpo0HOQ/viewform?usp=dialog';
export const BUSINESS_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSe_n7f6xLXdWX4COJg7bZ_O_NuyGHDm0v8dvHQhThSoNLvMng/viewform';

// DCC Hub（app.shu-dcc.net）内の各機能
export const DCC_AI_URL = 'https://app.shu-dcc.net/ai';
export const DCC_GIT_URL = 'https://app.shu-dcc.net/git#/';

// 公開サイトから呼び出すDCCAI Worker。秘密情報はこの値に含めない。
export const DCCAI_API_URL = import.meta.env.VITE_DCCAI_API_URL || 'https://dccai-shu-dcc.s1kqr1s.workers.dev/api/dccai';

// 部員ポータル（DCC Login連携、部員が自分で編集できるアプリ。プロフィール編集・活動ブログ）
// /members と /blog はここの公開APIからデータを読み込んで表示する
export const PORTFOLIO_API_URL = 'https://dcc-portal.s1kqr1s.workers.dev';
export const PORTFOLIO_EDIT_URL = 'https://dcc-portal.s1kqr1s.workers.dev/edit';
