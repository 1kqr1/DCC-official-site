// 活動ブログ（dcc-portfolio上のブログ管理画面）の公開APIから読み込む。
// 記事は広報担当・管理者が https://dcc-portfolio.s1kqr1s.workers.dev/blog で書いて公開したものだけが返ってくる。
import { PORTFOLIO_API_URL } from '../config';

export async function fetchPosts() {
    const res = await fetch(`${PORTFOLIO_API_URL}/api/blog`);
    if (!res.ok) throw new Error(`記事一覧の取得に失敗しました (${res.status})`);
    return res.json();
}

export async function fetchPost(slug) {
    const res = await fetch(`${PORTFOLIO_API_URL}/api/blog/${encodeURIComponent(slug)}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`記事の取得に失敗しました (${res.status})`);
    return res.json();
}
