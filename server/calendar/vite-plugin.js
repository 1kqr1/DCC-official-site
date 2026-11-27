import { getCalendarEvents, mockEvents } from './events.js';

// 開発サーバーの /api/events。GOOGLE_CALENDAR_ID と GOOGLE_CALENDAR_API_KEY が未設定ならサンプル予定を返す。
export const calendarDevApi = () => ({
  name: 'calendar-dev-api',
  configureServer(server) {
    server.middlewares.use('/api/events', async (req, res) => {
      res.setHeader('content-type', 'application/json; charset=utf-8');
      try {
        const body = await getCalendarEvents(process.env)
          ?? { events: mockEvents(), googleUrl: '', icsUrl: '', mock: true };
        res.end(JSON.stringify(body));
      } catch (error) {
        console.error('Calendar dev request failed:', error instanceof Error ? error.message : 'unknown');
        res.statusCode = 502;
        res.end(JSON.stringify({ error: 'Calendar unavailable.' }));
      }
    });
  },
});
