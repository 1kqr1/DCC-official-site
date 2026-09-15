import activityWebsite from '../assets/activity-hp-new.jpg';
import creation3d from '../assets/IMG_0031.jpg';
import gameDevelopment from '../assets/IMG_3169.jpg';
import digitalArt from '../assets/IMG_20260425_153752268.jpg';
import programming from '../assets/dcc-programming.jpg';
import meeting from '../assets/20260428_144619.jpg';

// ホームの表示と制作カテゴリを分離。実績を追加する際はこの配列を編集するだけでよい。
// 個別の公開ページがない活動カテゴリは、現在の活動ブログへ安全に誘導する。
export const projectCards = [
    {
        number: '01',
        file: 'dcc-website/',
        title: 'DCC WEBSITE',
        category: 'Web / React',
        description: 'DCCの活動と参加の入口になる、公式サイトの制作・運用。',
        image: activityWebsite,
        alt: 'DCC公式サイト制作の様子',
    },
    {
        number: '02',
        file: '3d-creation/',
        title: '3D CREATION',
        category: '3D Print / Design',
        description: '3Dプリンタとデジタル制作を行き来しながら、アイデアを形にする。',
        image: creation3d,
        alt: 'DCCの3D制作作品',
    },
    {
        number: '03',
        file: 'game-dev/',
        title: 'GAME DEVELOPMENT',
        category: 'Unity / C#',
        description: 'ゲームをつくりながら、技術と表現の両方を試していく。',
        image: gameDevelopment,
        alt: 'DCCのゲーム開発の様子',
    },
    {
        number: '04',
        file: 'digital-art/',
        title: 'DIGITAL ART & VIDEO',
        category: 'Art / Video / Music',
        description: 'イラスト、映像、音楽など、デジタルでの表現を広げる。',
        image: digitalArt,
        alt: 'DCCのデジタルアート制作',
    },
];

export const aboutGallery = [
    { image: programming, alt: 'DCCのプログラミング活動', label: 'PROGRAMMING' },
    { image: meeting, alt: 'DCCの定例会', label: 'MEETING' },
];

export const activityFields = [
    'Web',
    'Game',
    'AI',
    '3D',
    'Design',
    'Video',
    'Music',
    'Hardware',
    'and more...',
];
