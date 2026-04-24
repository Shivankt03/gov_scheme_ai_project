import { useState, useRef, useEffect } from 'react';
import { chatAPI } from '../services/api';
import { useTranslation } from '../i18n/index.js';
import './Chatbot.css';

export default function Chatbot() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: t('chatbot.greeting') }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages([{ role: 'assistant', content: t('chatbot.greeting') }]);
  }, [i18n.language]);

  // Allow external components (e.g. dashboard banner) to open the chatbot
  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener('openChatbot', handler);
    return () => window.removeEventListener('openChatbot', handler);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputVal.trim() || isLoading) return;
    const userMessage = inputVal;
    setInputVal('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    try {
      const res = await chatAPI.chat(userMessage, i18n.language);
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: t('chatbot.errorMessage') }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-root">
      {/* ── Chat window ── */}
      <div className={`chatbot-window ${isOpen ? 'chatbot-window--open' : ''}`}>
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header-left">
            <div className="chatbot-avatar">🤖</div>
            <div>
              <div className="chatbot-title">{t('chatbot.title')}</div>
              <div className="chatbot-online">
                <span className="chatbot-dot" /> {t('chatbot.online')}
              </div>
            </div>
          </div>
          <button className="chatbot-close" onClick={() => setIsOpen(false)} aria-label="Close chat">✕</button>
        </div>

        {/* Messages */}
        <div className="chatbot-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chatbot-msg-row chatbot-msg-row--${msg.role}`}>
              <div className={`chatbot-bubble chatbot-bubble--${msg.role}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="chatbot-msg-row chatbot-msg-row--assistant">
              <div className="chatbot-bubble chatbot-bubble--assistant chatbot-typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form className="chatbot-form" onSubmit={sendMessage}>
          <input
            className="chatbot-input"
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder={t('chatbot.placeholder')}
            disabled={isLoading}
            autoComplete="off"
          />
          <button
            type="submit"
            className="chatbot-send"
            disabled={isLoading || !inputVal.trim()}
            aria-label="Send"
          >
            ➤
          </button>
        </form>
      </div>

      {/* ── FAB toggle button ── */}
      <button
        className={`chatbot-fab ${isOpen ? 'chatbot-fab--open' : ''}`}
        onClick={() => setIsOpen(o => !o)}
        aria-label="Toggle AI Chat"
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
}
