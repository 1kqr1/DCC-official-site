import { SHOW_HOME_MEMBERS } from '../config';

// トップページの各セクション。ここの並び順がファイル番号（index.html = 00）になり、
// タブ・見出しラベル・左のファイル一覧・ヘッダーの番号はすべてここから決まる。
export const homeSections = [
    { id: 'hero', file: 'index.html', type: 'html' },
    { id: 'about', file: 'about.md', type: 'markdown' },
    { id: 'projects', file: 'projects/', type: 'folder' },
    ...(SHOW_HOME_MEMBERS ? [{ id: 'members', file: 'members.json', type: 'json' }] : []),
    { id: 'news', file: 'news.log', type: 'log' },
    { id: 'room', file: 'workspace/', type: 'folder' },
    { id: 'faq', file: 'faq.md', type: 'markdown' },
    { id: 'join', file: 'join.sh', type: 'shell' },
];

// トップにないページは、トップのセクションの続き番号にする
const numberedIds = [
    ...homeSections.map(({ id }) => id),
    'business',
    ...(SHOW_HOME_MEMBERS ? [] : ['members']),
];

export const siteNumber = (id) => String(numberedIds.indexOf(id)).padStart(2, '0');
