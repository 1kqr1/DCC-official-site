// 活動カレンダー（Google カレンダーの公開カレンダー）を、サイトで表示する最小限の形に整える。
// 役員だけが編集する「公開用」カレンダーを読む。説明文・参加者など詳細は取り込まない（詳細はDiscordで配信）。

const API_BASE = 'https://www.googleapis.com/calendar/v3/calendars';
const DAY = 24 * 60 * 60 * 1000;
export const LOOKAHEAD_DAYS = 90;
export const MAX_EVENTS = 20;

export const buildGoogleEventsUrl = ({ calendarId, apiKey, now = new Date() }) => {
  const url = new URL(`${API_BASE}/${encodeURIComponent(calendarId)}/events`);
  url.search = new URLSearchParams({
    key: apiKey,
    singleEvents: 'true', // 毎週の定例なども1回ずつ展開して返す
    orderBy: 'startTime',
    timeMin: now.toISOString(),
    timeMax: new Date(now.getTime() + LOOKAHEAD_DAYS * DAY).toISOString(),
    maxResults: String(MAX_EVENTS),
    timeZone: 'Asia/Tokyo',
    fields: 'items(id,status,summary,location,start,end)',
  }).toString();
  return url.toString();
};

const clean = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

export const normalizeEvents = (payload) => (Array.isArray(payload?.items) ? payload.items : [])
  .filter((item) => item && item.status !== 'cancelled' && (item.start?.dateTime || item.start?.date))
  .map((item) => {
    const allDay = !item.start.dateTime;
    return {
      id: clean(item.id, 200),
      title: clean(item.summary, 120) || '活動',
      location: clean(item.location, 120),
      allDay,
      start: allDay ? item.start.date : item.start.dateTime,
      end: allDay ? (item.end?.date || item.start.date) : (item.end?.dateTime || item.start.dateTime),
    };
  });

export const calendarLinks = (calendarId) => ({
  // Google カレンダーに追加（購読）
  googleUrl: `https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent(calendarId)}`,
  // iPhone・Outlook などで購読する iCal 形式
  icsUrl: `https://calendar.google.com/calendar/ical/${encodeURIComponent(calendarId)}/public/basic.ics`,
});

// ローカル開発用。Googleの設定がなくても見た目を確認できるよう、今日からの相対日付で作る。
export const mockEvents = (now = new Date()) => {
  const jstDate = (offsetDays) => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tokyo' })
    .format(new Date(now.getTime() + offsetDays * DAY));
  const at = (offsetDays, time) => `${jstDate(offsetDays)}T${time}:00+09:00`;
  return [
    { id: 'mock-1', title: 'もくもく会', location: '11号館 2F 第1実習室', allDay: false, start: at(2, '17:00'), end: at(2, '19:00') },
    { id: 'mock-2', title: 'LT会', location: 'Discord', allDay: false, start: at(6, '20:00'), end: at(6, '21:00') },
    { id: 'mock-3', title: 'もくもく会', location: '11号館 2F 第1実習室', allDay: false, start: at(9, '17:00'), end: at(9, '19:00') },
    { id: 'mock-4', title: '成果物発表会', location: '', allDay: true, start: jstDate(20), end: jstDate(21) },
  ];
};

const CACHE_MS = 5 * 60 * 1000;
let cached = null;

// env: GOOGLE_CALENDAR_ID（公開用カレンダーID）, GOOGLE_CALENDAR_API_KEY（Calendar API専用キー）
export const getCalendarEvents = async (env = {}, { now = new Date(), fetchImpl = fetch } = {}) => {
  const calendarId = env.GOOGLE_CALENDAR_ID;
  const apiKey = env.GOOGLE_CALENDAR_API_KEY;
  if (!calendarId || !apiKey) return null;
  if (cached && cached.calendarId === calendarId && now.getTime() - cached.at < CACHE_MS) return cached.body;

  const response = await fetchImpl(buildGoogleEventsUrl({ calendarId, apiKey, now }));
  if (!response.ok) throw new Error(`Google Calendar API failed (${response.status})`);
  const body = { events: normalizeEvents(await response.json()), ...calendarLinks(calendarId) };
  cached = { calendarId, at: now.getTime(), body };
  return body;
};
