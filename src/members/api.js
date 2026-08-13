// 部員ポータル（dcc-portal）の公開APIから読み込む。
// 部員本人が「公開する」に設定したプロフィール・作品だけが返ってくる。
import { PORTFOLIO_API_URL } from '../config';

export async function fetchMembers() {
    const res = await fetch(`${PORTFOLIO_API_URL}/api/members`);
    if (!res.ok) throw new Error(`部員一覧の取得に失敗しました (${res.status})`);
    return res.json();
}

export async function fetchMember(id) {
    const res = await fetch(`${PORTFOLIO_API_URL}/api/members/${encodeURIComponent(id)}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`プロフィールの取得に失敗しました (${res.status})`);
    return res.json();
}
