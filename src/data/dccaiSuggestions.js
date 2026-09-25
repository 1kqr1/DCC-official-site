// These visible suggestions have verified answers even when the AI upstream is unavailable.
const entries = [
  {
    question: 'DCCって何？',
    reply: (knowledge) => ({
      message: `${knowledge.about.name}は、${knowledge.about.summary}\n\n${knowledge.activities.summary}`,
      actions: ['about'],
    }),
  },
  {
    question: '初心者でも参加できますか？',
    reply: (knowledge) => ({ message: knowledge.beginners, actions: ['about', 'join'] }),
  },
  {
    question: 'どんな制作物がありますか？',
    reply: (knowledge) => ({ message: knowledge.works.summary, actions: ['projects'] }),
  },
  {
    question: 'どんな活動をしていますか？',
    reply: (knowledge) => ({
      message: `${knowledge.activities.summary}\n\n活動分野は ${knowledge.activities.fields.join(' / ')} です。`,
      actions: ['projects'],
    }),
  },
  {
    question: 'DCCに入りたい！',
    reply: (knowledge) => ({ message: knowledge.joining.summary, actions: ['join'] }),
  },
  {
    question: 'AIに興味があります',
    reply: (knowledge) => ({ message: knowledge.interestGuidance.ai, actions: ['projects', 'join'] }),
  },
  {
    question: 'Web開発に興味があります',
    reply: (knowledge) => ({ message: knowledge.interestGuidance.web, actions: ['projects', 'join'] }),
  },
];

export const DCCAI_SUGGESTIONS = entries.map(({ question }) => question);

export const getSuggestedAnswer = (message, knowledge) => {
  const normalized = message.trim().normalize('NFKC');
  const entry = entries.find(({ question }) => question.normalize('NFKC') === normalized);
  return entry ? entry.reply(knowledge) : null;
};
