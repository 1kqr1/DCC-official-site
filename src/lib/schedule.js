// 活動カレンダーの表示用。日時は常に日本時間で表す。
const TZ = 'Asia/Tokyo';
const dateParts = new Intl.DateTimeFormat('ja-JP', { timeZone: TZ, month: 'numeric', day: 'numeric', weekday: 'short' });
const timeFormat = new Intl.DateTimeFormat('ja-JP', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false });

const part = (parts, type) => parts.find((p) => p.type === type)?.value || '';

const describeDate = (date) => {
    const parts = dateParts.formatToParts(date);
    return { date: `${part(parts, 'month')}/${part(parts, 'day')}`, weekday: part(parts, 'weekday') };
};

// 終日の予定は "YYYY-MM-DD"（終了日は翌日を指す排他的な日付）で届く。
const parseAllDay = (value) => new Date(`${value}T00:00:00+09:00`);

export function formatEventTime(event) {
    if (event.allDay) {
        const start = parseAllDay(event.start);
        const lastDay = new Date(parseAllDay(event.end || event.start).getTime() - 24 * 60 * 60 * 1000);
        const head = describeDate(start);
        if (lastDay > start) {
            const tail = describeDate(lastDay);
            return { ...head, time: `〜${tail.date}(${tail.weekday})` };
        }
        return { ...head, time: '終日' };
    }
    const start = new Date(event.start);
    const end = new Date(event.end || event.start);
    const head = describeDate(start);
    const time = end > start ? `${timeFormat.format(start)}–${timeFormat.format(end)}` : timeFormat.format(start);
    return { ...head, time };
}

// まだ終わっていない予定だけを、近い順に返す。
export function upcomingEvents(events, now = new Date(), limit = 6) {
    if (!Array.isArray(events)) return [];
    return events
        .filter((event) => {
            const end = event.allDay ? parseAllDay(event.end || event.start) : new Date(event.end || event.start);
            return !Number.isNaN(end.getTime()) && end > now;
        })
        .slice(0, limit);
}
