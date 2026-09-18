import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiX, FiSend, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';

const isLocalhost = typeof window !== 'undefined' && Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

const DEFAULT_PROD_API_URL = 'https://portfolio-t16g.onrender.com';

const getApiEndpoints = () => {
  const configured = process.env.REACT_APP_API_URL;
  if (isLocalhost) {
    const list = [];
    if (configured) list.push(configured);
    if (!list.includes('http://127.0.0.1:8000')) list.push('http://127.0.0.1:8000');
    if (!list.includes('http://localhost:8000')) list.push('http://localhost:8000');
    return list;
  }
  // Production (e.g. Netlify): NEVER probe localhost or 127.0.0.1
  // This completely eliminates Chrome's "Access other apps and services on this device" prompt!
  if (configured && !configured.includes('localhost') && !configured.includes('127.0.0.1')) {
    return [configured];
  }
  return [DEFAULT_PROD_API_URL];
};

const Chatbot = ({ isChatOpen, toggleChat }) => {
  // --- STATE MANAGEMENT ---
  const [messages, setMessages] = useState([
    {
      text: "Hi! I'm Surya's Assistant. Ask me anything about his skills, projects, or experience.",
      sender: "bot",
      suggestions: [
        "Tell me about Surya's experience",
        "What are Surya's key skills?",
        "Show me Surya's best projects"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const [theme, setTheme] = useState('light'); // Theme state

  // --- REFS ---
  const messagesEndRef = useRef(null);
  const chatWindowRef = useRef(null);

  // --- EFFECTS ---
  const activeUrlRef = useRef(
    process.env.REACT_APP_API_URL || (isLocalhost ? 'http://localhost:8000' : DEFAULT_PROD_API_URL)
  );

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
      const isToggleButton = event.target.closest('.chat-toggle-button');
      if (isChatOpen && chatWindowRef.current && !chatWindowRef.current.contains(event.target) && !isToggleButton) {
        toggleChat();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isChatOpen, toggleChat]);

  // --- API & EVENT HANDLERS ---

  // Health check: safe for both local dev and production
  const warmUpBackend = useCallback(async (isUserInitiated = false) => {
    if (isUserInitiated && !isConnected) {
      setIsInitializing(true);
    }

    const endpoints = getApiEndpoints();
    if (endpoints.length === 0) {
      setIsConnected(false);
      setIsInitializing(false);
      return;
    }

    for (const url of endpoints) {
      try {
        const response = await fetch(`${url}/api/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          activeUrlRef.current = url;
          setIsConnected(true);
          setIsInitializing(false);
          return;
        }
      } catch (err) {
        // Ping triggered Render container to wake up from cold sleep
      }
    }

    if (isUserInitiated) {
      setIsConnected(false);
      setIsInitializing(false);
    }
  }, [isConnected]);

  // 1. Silently warm up backend in background immediately on page load
  useEffect(() => {
    warmUpBackend(false);
  }, [warmUpBackend]);

  // 2. If chat is opened before backend is connected, prompt warm-up check
  useEffect(() => {
    if (isChatOpen && !isConnected) {
      warmUpBackend(true);
    }
  }, [isChatOpen, isConnected, warmUpBackend]);

  // Fetches the bot's response from the backend
  const getBotResponse = async (question) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${activeUrlRef.current}/api/chat`, {
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
    } else {
      setInputValue(''); // Also clear if suggestion was clicked
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
  const handleKeyDown = (e) => {
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
              <div className="message-text">
                {msg.sender === 'bot' ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text}
              </div>
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
            onKeyDown={handleKeyDown}
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
