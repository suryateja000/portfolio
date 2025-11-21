import React, { useState, useRef, useEffect } from 'react';
import { FiX, FiSend, FiMaximize2, FiMinimize2} from 'react-icons/fi';

const Chatbot = ({ isChatOpen, toggleChat }) => {
  // --- STATE MANAGEMENT ---
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const [theme, setTheme] = useState('light'); // Theme state

  // --- REFS ---
  const messagesEndRef = useRef(null);
  const hasWarmedUp = useRef(false);
  const chatWindowRef = useRef(null);

  // --- EFFECTS ---

  // Effect for setting the initial theme and updating the data-theme attribute
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Effect for scrolling to the bottom of the messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Effect for handling "click outside to close"
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isChatOpen && chatWindowRef.current && !chatWindowRef.current.contains(event.target)) {
        toggleChat();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isChatOpen, toggleChat]);

  // Effect for the initial backend warm-up
  useEffect(() => {
    if (isChatOpen && !hasWarmedUp.current) {
      warmUpBackend();
      hasWarmedUp.current = true;
    }
  }, [isChatOpen]);

  // --- API & EVENT HANDLERS ---

  // Toggles the color theme
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Initial health check to the backend
  const warmUpBackend = async () => {
    setIsInitializing(true);
    setIsConnected(false);
    try {
      const response = await fetch('https://portfolio-t16g.onrender.com/api/health', {
        method: 'GET', headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        setIsConnected(true);
        setTimeout(() => {
          setMessages([{
            text: "Hi! I'm Surya's Assistant. Ask me anything about his skills, projects, or experience.",
            sender: "bot",
            suggestions: [
              "Tell me about Surya's experience",
              "What are Surya's key skills?",
              "Show me Surya's best projects"
            ]
          }]);
          setIsInitializing(false);
        }, 500);
      } else {
        throw new Error('Health check failed');
      }
    } catch (error) {
      console.error('Backend warmup failed:', error);
      setIsConnected(false);
      setIsInitializing(false);
      setMessages([{ text: "Sorry, I can't connect to the server right now. Please make sure the backend is running.", sender: "bot" }]);
    }
  };

  // Fetches the bot's response from the backend
  const getBotResponse = async (question) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://portfolio-t16g.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: question, session_id: sessionId }),
      });
      if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
      return await response.json();
    } catch (error) {
      console.error('Error fetching bot response:', error);
      setIsConnected(false);
      return { response: 'Sorry, an error occurred. Please try again.', suggestions: [] };
    } finally {
      setIsLoading(false);
    }
  };

  // Handles sending a message (both from input and suggestion clicks)
  const handleSendMessage = async (outgoingText) => {
    const text = typeof outgoingText === 'string' ? outgoingText : inputValue;
    if (text.trim() === '' || isLoading || !isConnected) return;

    // Clear suggestions from previous messages
    setMessages(prev => prev.map(msg => ({ ...msg, suggestions: [] })));

    // Add the user's message to the chat
    setMessages(prev => [...prev, { text, sender: 'user' }]);
    if (typeof outgoingText !== 'string') {
      setInputValue('');
    }

    // Get the bot's response and add it to the chat
    const data = await getBotResponse(text);
    const botMessage = {
      text: data.response,
      sender: 'bot',
      suggestions: Array.isArray(data.suggestions) ? [...new Set(data.suggestions)].slice(0, 3) : []
    };
    setMessages(prev => [...prev, botMessage]);
  };

  // Handles the 'Enter' key press in the input field
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Stops the main page from scrolling when you scroll inside the chat
  const handleWheelInChat = (e) => {
    e.stopPropagation();
  };

  // --- RENDER LOGIC ---

  if (!isChatOpen) {
    return null;
  }

  return (
    <div ref={chatWindowRef} className={`chat-window ${isMaximized ? 'maximized' : ''}`} onWheel={handleWheelInChat}>
      <div className={`chat-header ${isConnected ? 'connected' : ''}`}>
        <div className="chat-title">
          <h3>Portfolio Assistant</h3>
          <span className={`connection-indicator ${isConnected ? 'online' : 'offline'}`} title={isConnected ? 'Connected' : 'Offline'}></span>
        </div>
        <div className="chat-header-buttons">
          <button className="chat-control-btn" onClick={() => setIsMaximized(!isMaximized)} title={isMaximized ? 'Minimize' : 'Maximize'}>
            {isMaximized ? <FiMinimize2 size={16} /> : <FiMaximize2 size={16} />}
          </button>
          <button className="chat-control-btn" onClick={toggleChat} title="Close Chat">
            <FiX size={18} />
          </button>
        </div>
      </div>

      <div className="chat-messages">
        {isInitializing && (
          <div className="message bot">
            <div className="message-bubble">
              <div className="typing-indicator"><span></span><span></span><span></span></div>
            </div>
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <div className="message-bubble">
              <div className="message-text">{msg.text}</div>
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="suggestions">
                  {msg.suggestions.map((sugg, i) => (
                    <button key={i} type="button" className="suggestion-button" onClick={() => handleSendMessage(sugg)} disabled={isLoading || !isConnected}>
                      {sugg}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message bot">
            <div className="message-bubble">
              <div className="typing-indicator"><span></span><span></span><span></span></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <div className="chat-input">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isConnected ? "Ask a question..." : "Connecting..."}
            disabled={isLoading || !isConnected || isInitializing}
            className="chat-input-field"
          />
          <button className="chat-send-btn" onClick={() => handleSendMessage()} disabled={isLoading || inputValue.trim() === '' || !isConnected}>
            {isLoading ? <div className="loading-spinner"></div> : <FiSend size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
