import { useEffect, useState } from 'react';
import { DISCORD_INVITE, EVENTS_API_URL } from '../config';
import { formatEventTime, upcomingEvents } from '../lib/schedule';
import './Schedule.css';

// トップの「活動予定」。部員ポータルで役員が更新するカレンダーから、日時・タイトル・場所だけを表示する。
function Schedule({ note }) {
    const [state, setState] = useState({ status: 'loading', events: [], googleUrl: '', icsUrl: '' });

    useEffect(() => {
        let cancelled = false;
        fetch(EVENTS_API_URL)
            .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
            .then((data) => {
                if (!cancelled) setState({ status: 'ready', events: upcomingEvents(data.events), googleUrl: data.googleUrl || '', icsUrl: data.icsUrl || '' });
            })
            .catch(() => {
                if (!cancelled) setState((prev) => ({ ...prev, status: 'error' }));
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const { status, events, googleUrl, icsUrl } = state;

    return (
        <div className="news-workspace schedule-workspace">
            <div className="news-terminal" aria-live="polite" data-reveal>
                <div className="news-terminal__bar"><span>UPCOMING</span><span>JST</span></div>
                {status === 'loading' && <p className="news-terminal__state">// Loading schedule…</p>}
                {status === 'error' && <p className="news-terminal__state">// 予定を読み込めませんでした。最新の情報はDiscordで確認できます。</p>}
                {status === 'ready' && events.length === 0 && <p className="news-terminal__state">// 公開中の予定はまだありません。最新の情報はDiscordで確認できます。</p>}
                {status === 'ready' && events.length > 0 && (
                    <ol className="schedule-list">
                        {events.map((event) => {
                            const { date, weekday, time } = formatEventTime(event);
                            return (
                                <li className="schedule-item" key={`${event.id}-${event.start}`}>
                                    <time dateTime={event.start} className="schedule-item__date">{date}<small>({weekday})</small></time>
                                    <span className="schedule-item__time">{time}</span>
                                    <span className="schedule-item__title">{event.title}</span>
                                    {event.location && <span className="schedule-item__place">@ {event.location}</span>}
                                </li>
                            );
                        })}
                    </ol>
                )}
            </div>

            <aside className="dcc-services" data-reveal style={{ '--reveal-delay': '0.1s' }}>
                <p>DETAILS ON DISCORD</p>
                <a href={DISCORD_INVITE} target="_blank" rel="noreferrer"><span>Discord</span><b>↗</b><small>詳細・連絡はこちら</small></a>
                {googleUrl && <a href={googleUrl} target="_blank" rel="noreferrer"><span>Googleカレンダー</span><b>↗</b><small>自分のカレンダーに追加</small></a>}
                {icsUrl && <a href={icsUrl} target="_blank" rel="noreferrer"><span>iCal (.ics)</span><b>↗</b><small>iPhone・Outlookで購読</small></a>}
                {note && <p className="dcc-services__note">{note}</p>}
            </aside>
        </div>
    );
}

export default Schedule;
