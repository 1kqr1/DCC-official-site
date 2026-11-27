import knowledge from '../../src/data/dcc-knowledge.json' with { type: 'json' };
import { getSuggestedAnswer } from '../../src/data/dccaiSuggestions.js';
import { enforceReplyPolicy, getPolicyReply, sanitizeDccaiHistory } from '../../src/lib/dccaiPolicy.js';
import { DCCAI_SYSTEM_PROMPT } from '../../server/dccai/prompt.js';

// DCC Hub（app.shu-dcc.net/ai → 使用量・API → API）の Responses API。
// キーは同じ画面で発行したものを Worker Secret の DCCAI_API_KEY に入れる。
// 旧 ai.shu-dcc.net（/api/chat/completions）は使われなくなった。
const UPSTREAM_URL = 'https://responses.shu-dcc.net/v1/responses';
// 「DCC AI のいつものモデル」。使えるモデルは DCC Hub の API 画面に一覧がある。
const MODEL = 'dccai.dccai-deepseek-v4.1-flash';
const ALLOWED_ORIGINS = new Set(['https://shu-dcc.net', 'https://www.shu-dcc.net']);

const ACTIONS = {
  about: ['dcc', 'とは', '何', '初心者', '未経験', '場所', '部室', '設備', '機材'],
  projects: ['制作物', '作品', 'プロジェクト', 'ゲーム', '3d', 'ai', 'web', '開発', '活動'],
  join: ['参加', '入りたい', '入部', 'join'],
  contact: ['活動日', '日時', 'いつ', '見学', '問い合わせ'],
};

const systemPrompt = `${DCCAI_SYSTEM_PROMPT}\n\nDCC Knowledge:\n${JSON.stringify(knowledge)}`;

const corsHeaders = (origin) => ({
  'access-control-allow-origin': origin,
  'access-control-allow-methods': 'POST, OPTIONS',
  'access-control-allow-headers': 'content-type',
  vary: 'Origin',
});

const json = (body, status, origin) => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...corsHeaders(origin) },
});

const textFrom = (value) => {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map((item) => textFrom(item?.text ?? item?.content ?? item?.value)).filter(Boolean).join('');
  if (value && typeof value === 'object') return textFrom(value.text ?? value.content ?? value.value);
  return '';
};

// Responses API の答えは output の中の message → output_text に入る。
// reasoning（考えている途中の内容）は訪問者に見せないので拾わない。
const extractContent = (payload) => {
  if (typeof payload?.output_text === 'string' && payload.output_text.trim()) return payload.output_text.trim();
  if (Array.isArray(payload?.output)) {
    return payload.output
      .filter((item) => item?.type === 'message')
      .flatMap((item) => (Array.isArray(item.content) ? item.content : []))
      .filter((part) => part?.type === 'output_text' || part?.type === 'text')
      .map((part) => textFrom(part.text))
      .join('')
      .trim();
  }
  return textFrom(payload?.choices?.[0]?.message?.content).trim();
};

// Some upstream models may emit their private DSML tool-call protocol as text.
// It is never meaningful to a site visitor, so fail closed rather than exposing
// tool names, parameters, or a potentially incomplete internal result.
const visibleAnswer = (answer) => {
  if (/DSML/i.test(answer)) {
    return 'その情報はまだDCCAIに登録されていません。DCCについての活動や参加方法なら案内できます。';
  }
  return answer;
};

const actionsFor = (message) => Object.entries(ACTIONS)
  .filter(([, keywords]) => keywords.some((keyword) => message.toLowerCase().includes(keyword)))
  .map(([id]) => id)
  .slice(0, 2);

export default {
  async fetch(request, env) {
    const origin = request.headers.get('origin') || '';
    if (!ALLOWED_ORIGINS.has(origin)) return new Response('Not found.', { status: 404 });
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(origin) });
    if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405, origin);

    try {
      const body = await request.json();
      const message = typeof body?.message === 'string' ? body.message.trim() : '';
      if (!message || message.length > 1000) return json({ error: 'Invalid request.' }, 400, origin);
      const policyReply = getPolicyReply(message, body.history);
      if (policyReply) return json(policyReply, 200, origin);
      const suggestedAnswer = getSuggestedAnswer(message, knowledge);
      if (suggestedAnswer) return json(suggestedAnswer, 200, origin);
      if (!env.DCCAI_API_KEY) return json({ error: 'DCCAI connection failed.' }, 502, origin);

      const upstream = await fetch(UPSTREAM_URL, {
        method: 'POST',
        headers: { authorization: `Bearer ${env.DCCAI_API_KEY}`, 'content-type': 'application/json' },
        body: JSON.stringify({
          model: MODEL,
          instructions: systemPrompt,
          input: [...sanitizeDccaiHistory(body.history), { role: 'user', content: message }],
        }),
      });
      const payload = await upstream.json().catch(() => null);
      const answer = upstream.ok ? visibleAnswer(extractContent(payload)) : '';
      if (!answer) {
        console.error('DCCAI upstream failed', {
          status: upstream.status,
          hasPayload: Boolean(payload),
          // 原因を追えるよう、上流のエラー文だけ短く残す（質問の中身やキーは残さない）
          upstreamError: String(payload?.error?.message ?? payload?.detail ?? '').slice(0, 200),
        });
        return json({ error: 'DCCAI connection failed.' }, 502, origin);
      }
      return json(enforceReplyPolicy({ message: answer, actions: actionsFor(message) }), 200, origin);
    } catch (error) {
      console.error('DCCAI request failed', error instanceof Error ? error.message : 'unknown');
      return json({ error: 'DCCAI connection failed.' }, 502, origin);
    }
  },
};
