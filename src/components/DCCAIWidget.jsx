import { useEffect, useRef, useState } from 'react';
import { askDccai, DCCAI_ACTIONS } from '../lib/dccai';
import { DCCAI_SUGGESTIONS } from '../data/dccaiSuggestions';
import './DCCAIWidget.css';

const STORAGE_KEY = 'dccai-conversation-v1';
const initialMessages = [{ role: 'assistant', text: 'DCCAI initialized...\n\nこんにちは 👋\nDCCAIです。\n\nDigital Creators Communityについて\n気になることを何でも聞いてください。' }];

const loadMessages = () => {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) && saved.length ? saved : initialMessages;
  } catch {
    return initialMessages;
  }
};

function DCCAIWidget() {
  const [isOpen, setIsOpen] = useState(() => !window.matchMedia('(max-width: 860px)').matches);
  const [messages, setMessages] = useState(loadMessages);
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const launcherRef = useRef(null);
  const transcriptRef = useRef(null);
  const requestIdRef = useRef(0);
  const focusOnOpenRef = useRef(false);
  const focusOnCloseRef = useRef(false);

  useEffect(() => {
    const compactScreen = window.matchMedia('(max-width: 860px)');
    const syncScreen = () => setIsOpen(!compactScreen.matches);
    compactScreen.addEventListener('change', syncScreen);
    return () => compactScreen.removeEventListener('change', syncScreen);
  }, []);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (!isOpen) {
      if (!focusOnCloseRef.current) return undefined;
      const frame = window.requestAnimationFrame(() => {
        launcherRef.current?.focus();
        focusOnCloseRef.current = false;
      });
      return () => window.cancelAnimationFrame(frame);
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        focusOnCloseRef.current = true;
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    const frame = focusOnOpenRef.current
      ? window.requestAnimationFrame(() => {
          inputRef.current?.focus();
          focusOnOpenRef.current = false;
        })
      : 0;
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.cancelAnimationFrame(frame);
    };
  }, [isOpen]);

  useEffect(() => {
    transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading, error]);

  const send = async (question = value) => {
    const message = question.trim();
    if (!message || isLoading) return;
    const requestId = ++requestIdRef.current;
    const nextMessages = [...messages, { role: 'user', text: message }];
    setMessages(nextMessages);
    setValue('');
    setError('');
    setIsLoading(true);
    try {
      const response = await askDccai(message, messages.map(({ role, text }) => ({ role, content: text })));
      if (requestId === requestIdRef.current) {
        setMessages((current) => [...current, { role: 'assistant', text: response.message, actions: response.actions }]);
      }
    } catch {
      if (requestId === requestIdRef.current) setError('ERROR: DCCAI connection failed.\nもう一度試してください。');
    } finally {
      if (requestId === requestIdRef.current) setIsLoading(false);
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    send();
  };

  const clearConversation = () => {
    requestIdRef.current += 1;
    sessionStorage.removeItem(STORAGE_KEY);
    setMessages(initialMessages);
    setValue('');
    setError('');
    setIsLoading(false);
  };

  const toggleOpen = () => {
    if (!isOpen) focusOnOpenRef.current = true;
    setIsOpen((current) => !current);
  };

  const closeChat = () => {
    focusOnCloseRef.current = true;
    setIsOpen(false);
  };

  return (
    <section className={`dccai-widget${isOpen ? ' is-open' : ''}`} aria-label="DCCAI アシスタント">
      {isOpen && <div className="dccai-window" role="dialog" aria-modal="false" aria-labelledby="dccai-title">
        <header className="dccai-window__header">
          <p id="dccai-title"><span aria-hidden="true">$</span> DCCAI <i className="dccai-window__status" aria-label="オンライン"></i></p>
          <div className="dccai-window__tools">
            <button type="button" className="dccai-window__clear" onClick={clearConversation}>履歴を消去</button>
            <button type="button" className="dccai-window__close" aria-label="DCCAIを閉じる" onClick={closeChat}>×</button>
          </div>
        </header>
        <div className="dccai-window__transcript" ref={transcriptRef} aria-live="polite" aria-label="DCCAIとの会話">
          {messages.map((item, index) => <div className={`dccai-message dccai-message--${item.role}`} key={`${item.role}-${index}`}>
            <p>{item.role === 'user' ? '> ' : ''}{item.text}</p>
            {item.actions?.length > 0 && <div className="dccai-message__actions">
              {item.actions.map((id) => {
                const action = DCCAI_ACTIONS[id];
                return action && <a key={id} href={action.href}>{action.label}</a>;
              })}
            </div>}
          </div>)}
          {messages.length === 1 && <div className="dccai-suggestions" aria-label="質問候補">
            <p className="dccai-suggestions__title">// SUGGESTED QUESTIONS</p>
            {DCCAI_SUGGESTIONS.map((suggestion) => <button type="button" key={suggestion} onClick={() => send(suggestion)} disabled={isLoading}>&gt; {suggestion}</button>)}
          </div>}
          {isLoading && <p className="dccai-thinking">DCCAI thinking<i>_</i></p>}
          {error && <p className="dccai-error" role="alert">{error}</p>}
        </div>
        <form className="dccai-input" onSubmit={onSubmit}>
          <label className="sr-only" htmlFor="dccai-question">DCCAIへの質問</label>
          <textarea id="dccai-question" ref={inputRef} value={value} onChange={(event) => setValue(event.target.value)} placeholder="質問を入力..." rows="1" maxLength="1000" disabled={isLoading} />
          <button type="submit" disabled={!value.trim() || isLoading}>送信 <span aria-hidden="true">↗</span></button>
        </form>
        <p className="dccai-privacy">個人情報やパスワードなどは入力しないでください</p>
      </div>}
      <button type="button" ref={launcherRef} className="dccai-launcher" aria-label={isOpen ? 'DCCAIを閉じる' : 'DCCAIを開く'} aria-expanded={isOpen} onClick={toggleOpen}>
        <span aria-hidden="true">$</span> DCCAI <i aria-hidden="true">_</i>
      </button>
    </section>
  );
}

export default DCCAIWidget;
