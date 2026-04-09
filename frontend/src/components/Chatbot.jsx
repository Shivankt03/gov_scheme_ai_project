import { useState, useRef, useEffect } from 'react';
import { chatAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Chatbot.css';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I am your AI Government Scheme Assistant. How can I help you today?' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Note: the component is now only rendered if user exists (handled in AppRoutes)
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputVal.trim() || isLoading) return;

    const userMessage = inputVal;
    setInputVal('');
    
    // Optimistically add user reply
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Create history payload for conversation
      const msgHistory = messages.map(msg => ({ role: msg.role, content: msg.content }));
      
      let res;
      // If we use conversation endpoint, it keeps history. If we use chat endpoint, it specifically routes based on keywords. 
      // The backend /chat endpoint handles problem analysis and scheme matching best.
      res = await chatAPI.chat(userMessage);

      // Add assistant reply
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I am having trouble connecting to the server. Please check your connection or try again later.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button className={`chatbot-toggle ${isOpen ? 'active' : ''}`} onClick={toggleChat} aria-label="Toggle AI Chat">
        {isOpen ? (
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        )}
      </button>

      {isOpen && (
        <div className="chatbot-window glass-card">
          <div className="chatbot-header">
            <h4>Scheme AI Assistant</h4>
            <span className="badge badge-info">Online</span>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.role}`}>
                <div className="chat-bubble">
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="chat-message assistant">
                <div className="chat-bubble typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="chatbot-input-form">
            <input 
              type="text" 
              className="form-control" 
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask me a question or tell me your problem..."
              disabled={isLoading}
            />
            <button type="submit" className="btn btn-primary" disabled={isLoading || !inputVal.trim()}>
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
