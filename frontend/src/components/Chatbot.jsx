import { useState, useRef, useEffect } from 'react';
import { chatAPI } from '../services/api';
import { useTranslation } from '../i18n/index.js';
import './Chatbot.css';

export default function Chatbot() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: t('chatbot.greeting') }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages([{ role: 'assistant', content: t('chatbot.greeting') }]);
  }, [i18n.language]);

  // Expose a global method to open the chatbot from anywhere
  useEffect(() => {
    const handleOpen = () => {
      setShowOverlay(true);
      setTimeout(() => {
        setShowOverlay(false);
        setIsOpen(true);
      }, 3500);
    };

    window.openChatbot = handleOpen;
    
    // Fallback event listeners just in case
    window.addEventListener('openChatbot', handleOpen);
    document.addEventListener('openChatbot', handleOpen);
    return () => {
      delete window.openChatbot;
      window.removeEventListener('openChatbot', handleOpen);
      document.removeEventListener('openChatbot', handleOpen);
    };
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
            <div className="chatbot-avatar">
              <img src="/chatbot.png" alt="AI" style={{ width: '24px', height: '24px' }} />
            </div>
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
        onClick={() => {
          if (isOpen) setIsOpen(false);
          else if (window.openChatbot) window.openChatbot();
        }}
        aria-label="Toggle AI Chat"
      >
        {isOpen ? '✕' : <img src="/chatbot.png" alt="Chat with AI" style={{ width: '32px', height: '32px' }} />}
      </button>

      {/* ── Fullscreen Greeting Overlay ── */}
      <div className={`chatbot-fullscreen-overlay ${showOverlay ? 'chatbot-fullscreen-overlay--visible' : ''}`}>
        <div className="chatbot-fullscreen-content">
          <img src="/chatbot.png" alt="AI Assistant" className="chatbot-fullscreen-img" />
          <div className="chatbot-fullscreen-text">
            {t('chatbot.fullscreenGreeting')}
          </div>
        </div>
      </div>
    </div>
  );
}
