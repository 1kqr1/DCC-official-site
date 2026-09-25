import assert from 'node:assert/strict';
import test from 'node:test';
import knowledge from '../src/data/dcc-knowledge.json' with { type: 'json' };
import { DCCAI_SUGGESTIONS, getSuggestedAnswer } from '../src/data/dccaiSuggestions.js';
import { getMockReply } from '../server/dccai/mock.js';

const expected = new Map([
  ['DCCって何？', 'クリエイターコミュニティ'],
  ['初心者でも参加できますか？', 'プログラミング未経験でも参加できます'],
  ['どんな制作物がありますか？', 'リモート図書館'],
  ['どんな活動をしていますか？', 'Web / Game / AI'],
  ['DCCに入りたい！', 'Discordに参加すれば'],
  ['AIに興味があります', '楽曲データをAIで分析したレポート'],
  ['Web開発に興味があります', 'DCC公式サイトの制作・運用'],
]);

test('all visible suggestions have grounded answers in the shared knowledge', () => {
  assert.deepEqual(DCCAI_SUGGESTIONS, [...expected.keys()]);

  for (const [question, phrase] of expected) {
    const reply = getSuggestedAnswer(question, knowledge);
    assert.ok(reply, question);
    assert.ok(reply.message.includes(phrase), question);
    assert.ok(reply.actions.length > 0, question);
    assert.doesNotMatch(reply.message, /その情報はまだDCCAIに登録されていません|DSML/);
    assert.deepEqual(getMockReply(question), reply);
  }
});

test('other questions still use the normal answer path', () => {
  assert.equal(getSuggestedAnswer('定例活動は何曜日ですか？', knowledge), null);
});
