import knowledge from '../../src/data/dcc-knowledge.json' with { type: 'json' };
import { getSuggestedAnswer } from '../../src/data/dccaiSuggestions.js';

const has = (message, words) => words.some((word) => message.includes(word));

export const getMockReply = (message) => {
  const suggestedAnswer = getSuggestedAnswer(message, knowledge);
  if (suggestedAnswer) return suggestedAnswer;
  const text = message.toLowerCase();
  if (has(text, ['初心者', '未経験', '経験ない'])) return { message: knowledge.beginners, actions: ['about'] };
  if (has(text, ['参加', '入りたい', '入部', 'join'])) return { message: knowledge.joining.summary, actions: ['join', 'contact'] };
  if (has(text, ['制作物', '作品', 'プロジェクト', 'ゲーム', '3d'])) return { message: knowledge.works.summary, actions: ['projects'] };
  if (has(text, ['活動日', '日時', 'いつ', '頻度'])) return { message: `${knowledge.faq.participation}\n\n決まった曜日・時間については、その情報はまだDCCAIに登録されていません。`, actions: ['contact'] };
  if (has(text, ['場所', '部室', 'どこ', '設備', '機材'])) return { message: `活動拠点は${knowledge.location.room}です。オンラインではDiscordを使い、${knowledge.equipment.join('、')}などの設備があります。`, actions: ['about'] };
  if (has(text, ['ai', 'web', '開発', '活動'])) return { message: `${knowledge.activities.summary}\n\n活動分野には ${knowledge.activities.fields.join(' / ')} があります。`, actions: ['projects'] };
  if (has(text, ['dcc', 'とは', '何'])) return { message: `${knowledge.about.summary}\n\n${knowledge.activities.summary}`, actions: ['about', 'projects'] };
  return { message: 'DCCについてなら何でも聞いてください！ 参加方法、活動、制作物、初心者の参加などを案内できます。', actions: ['about'] };
};
