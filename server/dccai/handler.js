import { createDccaiProvider } from './provider.js';
import { getMockReply } from './mock.js';
import { DCCAI_SYSTEM_PROMPT } from './prompt.js';

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
});

export const handleDccaiRequest = async (request, env = {}) => {
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);

  try {
    const { message, history = [] } = await request.json();
    if (typeof message !== 'string' || !message.trim()) return json({ error: 'A message is required.' }, 400);
    if (message.length > 1000 || !Array.isArray(history)) return json({ error: 'Invalid request.' }, 400);

    const provider = createDccaiProvider({ apiUrl: env.DCCAI_API_URL, apiKey: env.DCCAI_API_KEY });
    const result = provider
      ? await provider.reply({ message: message.trim(), history: history.slice(-12), systemPrompt: DCCAI_SYSTEM_PROMPT })
      : getMockReply(message.trim());
    return json(result);
  } catch (error) {
    console.error('DCCAI request failed:', error instanceof Error ? error.message : 'unknown error');
    return json({ error: 'DCCAI connection failed.' }, 502);
  }
};
