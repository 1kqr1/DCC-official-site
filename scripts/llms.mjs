import { getMarkdownPath, pageSeo, SITE_NAME, SITE_URL } from '../src/data/seoContent.js';

// 公開案内だけを選んで生成する。知識データ全体や外部APIの応答は書き出さない。
export function createLlmFiles({ knowledge, links }) {
    const pageLink = (label, path) => `[${label}](${SITE_URL}${path})`;
    const markdownLink = (label, path) => pageLink(label, getMarkdownPath(path));
    const source = (path) => `元ページ: ${pageLink(pageSeo[path].title, path)}`;
    const files = {
        '/llms.txt': `# ${SITE_NAME}

> ${knowledge.about.summary}

このファイルはDCC公式サイトの公開案内です。参加方法・活動内容・企業との連携について、以下のMarkdown資料を参照してください。
記事、イベント、個別作品、部員プロフィールの最新情報は、それぞれの公開ページで確認してください。

## DCCについて・参加方法

- ${markdownLink('DCCの概要・活動・参加方法・FAQ', '/')}: 活動分野、部室、初心者向けの案内、Discord参加とお問い合わせ。

## 企業・団体の方へ

- ${markdownLink('企業向け案内', '/business')}: 制作依頼、共同開発、協賛、採用・インターンの相談窓口。

## 活動とメンバー

- ${markdownLink('活動ブログの案内', '/blog')}: 活動記録・イベント・公開記事への入口。
- ${markdownLink('部員紹介の案内', '/members')}: 公開プロフィール・作品への入口。
`,
        '/index.md': `# ${knowledge.about.name}

> ${knowledge.about.summary}

${source('/')}

## 活動

${knowledge.activities.summary}

活動分野: ${knowledge.activities.fields.join(' / ')}

## 参加方法

${knowledge.joining.summary}

- [Discordに参加する](${links.DISCORD_INVITE})
- [入部・見学・一般のお問い合わせ](${links.CONTACT_FORM_URL})

## よくある質問

### プログラミング未経験でも参加できますか？

${knowledge.beginners}

### 活動頻度はどのくらいですか？

${knowledge.faq.participation}

### 部費はかかりますか？

${knowledge.faq.cost}

## 活動拠点・機材

- 大学: ${knowledge.location.campus}
- 部室: ${knowledge.location.room}
- オンライン: ${knowledge.location.online}
- 機材: ${knowledge.equipment.join('、')}

## 活動記録・関連サービス

- ${pageLink('活動ブログ', '/blog')}: 公開記事・活動記録の最新情報。
- ${pageLink('部員紹介', '/members')}: 公開プロフィール・作品。
- [DCC AI](${links.DCC_AI_URL})
- [DCC Git](${links.DCC_GIT_URL})
- ${pageLink('企業・団体向け案内', '/business')}: 制作依頼・共同開発などの相談。
`,
        '/business.md': `# DCC — 企業・団体向け案内

> ${pageSeo['/business'].description}

${source('/business')}

${knowledge.about.summary}

## ご相談いただける内容

- 協賛・スポンサー: イベントや活動への支援、ロゴ掲出、コラボ企画。
- 制作依頼: アプリ・Web・3D・映像・デザイン。
- 採用・インターン: 学生との出会い、インターンや新卒採用の相談。
- 共同開発・コラボ: 共同プロジェクト、技術検証。

## お問い合わせ

- [企業・団体向けお問い合わせフォーム](${links.BUSINESS_FORM_URL}): 協賛・制作依頼・採用・共同開発の相談。
- [入部・見学・一般のお問い合わせ](${links.CONTACT_FORM_URL}): 学生の参加や見学などの相談。
`,
        '/blog.md': `# DCC — 活動ブログ

> ${pageSeo['/blog'].description}

${source('/blog')}

DCCの日々の活動、制作、イベントを公開記事で紹介します。
記事一覧と本文は公開ページで随時更新されます。この資料には記事本文や最新の一覧を収録していません。

## 公開記事を読む

- ${pageLink('活動ブログを開く', '/blog')}: 一覧から各記事の本文へ進めます。
- ${pageLink('DCC公式サイト', '/')}: 活動内容と参加方法。
`,
        '/members.md': `# DCC — 部員紹介

> ${pageSeo['/members'].description}

${source('/members')}

DCCで活動するメンバーと作品を紹介します。本人が公開設定にしたプロフィールを掲載しています。
公開プロフィールは随時更新されます。この資料には個々のプロフィールやメンバー一覧を収録していません。

## プロフィール・作品を見る

- ${pageLink('部員紹介を開く', '/members')}: 一覧から各メンバーの公開プロフィール・作品へ進めます。
- ${pageLink('DCC公式サイト', '/')}: 活動内容と参加方法。
`,
    };
    // HTML側から案内する資料が欠けていたらビルドを止める。
    for (const path of Object.keys(pageSeo)) {
        if (!files[getMarkdownPath(path)]) throw new Error(`Missing Markdown content for ${path}`);
    }
    return files;
}
