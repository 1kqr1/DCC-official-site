export const DCCAI_ACTIONS = {
  about: { label: 'ABOUT DCC →', href: '/#about' },
  projects: { label: 'PROJECTSを見る →', href: '/#projects' },
  join: { label: 'JOIN DCC →', href: '/#join' },
  contact: { label: '見学・お問い合わせ →', href: '/#join' },
};

import { DCCAI_API_URL } from '../config';

export const askDccai = async (message, history) => {
  const response = await fetch(DCCAI_API_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ message, history }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || typeof data.message !== 'string') throw new Error(data.error || 'DCCAI connection failed.');
  return data;
};
