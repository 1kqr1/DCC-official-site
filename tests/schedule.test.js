import test from 'node:test';
import assert from 'node:assert/strict';
import { buildGoogleEventsUrl, getCalendarEvents, normalizeEvents } from '../server/calendar/events.js';
import { formatEventTime, upcomingEvents } from '../src/lib/schedule.js';

const now = new Date('2026-12-01T03:00:00Z'); // 12:00 JST

test('Google APIのURLは定例を展開し、詳細欄を取得しない', () => {
    const url = new URL(buildGoogleEventsUrl({ calendarId: 'abc@group.calendar.google.com', apiKey: 'k', now }));
    assert.equal(url.pathname, '/calendar/v3/calendars/abc%40group.calendar.google.com/events');
    assert.equal(url.searchParams.get('singleEvents'), 'true');
    assert.equal(url.searchParams.get('orderBy'), 'startTime');
    assert.ok(!url.searchParams.get('fields').includes('description'));
});

test('予定は日時・タイトル・場所だけに整え、取り消しを除く', () => {
    const events = normalizeEvents({ items: [
        { id: 'a', summary: ' もくもく会 ', location: '部室', description: '秘密', start: { dateTime: '2026-12-02T17:00:00+09:00' }, end: { dateTime: '2026-12-02T19:00:00+09:00' } },
        { id: 'b', status: 'cancelled', summary: '中止', start: { dateTime: '2026-12-03T17:00:00+09:00' } },
        { id: 'c', start: { date: '2026-12-20' }, end: { date: '2026-12-21' } },
    ] });
    assert.deepEqual(events, [
        { id: 'a', title: 'もくもく会', location: '部室', allDay: false, start: '2026-12-02T17:00:00+09:00', end: '2026-12-02T19:00:00+09:00' },
        { id: 'c', title: '活動', location: '', allDay: true, start: '2026-12-20', end: '2026-12-21' },
    ]);
});

test('設定がなければnullを返し、Googleへは問い合わせない', async () => {
    let called = false;
    const result = await getCalendarEvents({}, { now, fetchImpl: () => { called = true; } });
    assert.equal(result, null);
    assert.equal(called, false);
});

test('日時は日本時間で表示する', () => {
    assert.deepEqual(
        formatEventTime({ allDay: false, start: '2026-12-02T08:00:00Z', end: '2026-12-02T10:00:00Z' }),
        { date: '12/2', weekday: '水', time: '17:00–19:00' },
    );
    assert.deepEqual(formatEventTime({ allDay: true, start: '2026-12-20', end: '2026-12-21' }), { date: '12/20', weekday: '日', time: '終日' });
    assert.deepEqual(formatEventTime({ allDay: true, start: '2026-12-26', end: '2026-12-28' }), { date: '12/26', weekday: '土', time: '〜12/27(日)' });
});

test('終わった予定は表示しない', () => {
    const events = [
        { id: 'past', allDay: false, start: '2026-12-01T09:00:00+09:00', end: '2026-12-01T11:00:00+09:00' },
        { id: 'today', allDay: true, start: '2026-12-01', end: '2026-12-02' },
        { id: 'next', allDay: false, start: '2026-12-02T17:00:00+09:00', end: '2026-12-02T19:00:00+09:00' },
    ];
    assert.deepEqual(upcomingEvents(events, now).map((event) => event.id), ['today', 'next']);
});
