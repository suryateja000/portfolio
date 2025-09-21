import React, { useState, useRef, useEffect } from 'react';
import { FiX, FiSend } from 'react-icons/fi';

const Chatbot = ({ isChatOpen, toggleChat }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const messagesEndRef = useRef(null);
  const chatMessagesRef = useRef(null);
  const hasWarmedUp = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Warm up the backend when chat opens for the first time
  useEffect(() => {
    if (isChatOpen && !hasWarmedUp.current) {
      warmUpBackend();
      hasWarmedUp.current = true;
    }
  }, [isChatOpen]);

  const warmUpBackend = async () => {
    setIsInitializing(true);
    setIsConnected(false);
    
    try {
      console.log('Warming up backend...');
      
      // Send a simple warm-up request
      const response = await fetch('https://chat-bot-2hrq.onrender.com/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: "warmup" }),
      });

      if (response.ok) {
        console.log('Backend warmed up successfully');
        setIsConnected(true);
        
        // Add the welcome message after successful connection
        setTimeout(() => {
          setMessages([
            { text: "Hi!", sender: "bot" }
          ]);
          setIsInitializing(false);
        }, 500);
      } else {
        throw new Error('Warmup failed');
      }
    } catch (error) {
      console.error('Backend warmup failed:', error);
      setIsConnected(false);
      setIsInitializing(false);
      
      // Show error message
      setMessages([
        { text: "Sorry, I'm having trouble connecting. Please try again in a moment.", sender: "bot" }
      ]);
    }
  };

  // Prevent wheel events from bubbling up to parent
  const handleWheelInChat = (e) => {
    e.stopPropagation();
  };

  const getBotResponse = async (question) => {
    setIsLoading(true);
    
    try {
      console.log('Making API call to:', 'https://chat-bot-2hrq.onrender.com/');
      console.log('Question being sent:', question);
      
      const response = await fetch('https://chat-bot-2hrq.onrender.com/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: question }),
      });

      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Raw response data:', data);
      
      setIsLoading(false);
      return data.result;
    } catch (error) {
      console.error('Error fetching bot response:', error);
      setIsLoading(false);
      setIsConnected(false);
      return ['Sorry, I encountered an error. Please try again.'];
    }
  };

  const handleSendMessage = async () => {
    console.log('handleSendMessage called');
    console.log('Current input value:', inputValue);
    console.log('Is loading:', isLoading);
    
    if (inputValue.trim() === '' || isLoading || !isConnected) {
      console.log('Blocked: empty input, loading state, or not connected');
      return;
    }
    
    const userMessage = { text: inputValue, sender: 'user' };
    console.log('Adding user message:', userMessage);
    
    setMessages(prev => {
      console.log('Previous messages:', prev);
      const newMessages = [...prev, userMessage];
      console.log('New messages array:', newMessages);
      return newMessages;
    });
    
    const currentInput = inputValue;
    setInputValue('');
    console.log('Cleared input, calling API with:', currentInput);

    const botResponseArray = await getBotResponse(currentInput);
    console.log('Bot response array received:', botResponseArray);
    
    const mainAnswer = botResponseArray[0] || 'No response received';
    const botMessage = { text: mainAnswer, sender: 'bot' };
    console.log('Bot message to add:', botMessage);
    
    setMessages(prev => [...prev, botMessage]);

    const suggestedQuestions = botResponseArray.slice(1);
    console.log('Suggested questions:', suggestedQuestions);
    
    if (suggestedQuestions.length > 0) {
      const suggestionsMessage = {
        text: "Here are some related questions you might ask:",
        sender: 'bot',
        suggestions: suggestedQuestions
      };
      console.log('Adding suggestions message:', suggestionsMessage);
      setMessages(prev => [...prev, suggestionsMessage]);
    }
  };

  const handleKeyPress = (e) => {
    console.log('Key pressed:', e.key);
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    console.log('Suggestion clicked:', suggestion);
    setInputValue(suggestion);
  };

  const handleInputChange = (e) => {
    console.log('Input changed to:', e.target.value);
    setInputValue(e.target.value);
  };

  console.log('Chatbot render - isChatOpen:', isChatOpen, 'messages count:', messages.length);

  if (!isChatOpen) return null;

  return (
    <div className="chat-window" onWheel={handleWheelInChat}>
      <div className="chat-header">
        <div className="chat-title">
          <h3>Portfolio Assistant</h3>
          <span className={`connection-indicator ${isConnected ? 'online' : 'offline'}`}></span>
        </div>
        <button 
          className="chat-close-btn"
          onClick={() => {
            console.log('Close button clicked');
            toggleChat();
          }}
        >
          <FiX size={20} />
        </button>
      </div>
      
      <div 
        className="chat-messages" 
        ref={chatMessagesRef}
        onWheel={handleWheelInChat}
      >
        {isInitializing && (
          <div className="message bot">
            <div className="message-bubble">
              <div className="connection-loading">
                <div className="connection-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="connection-text">Connecting to assistant...</div>
              </div>
            </div>
          </div>
        )}
        
        {messages.map((msg, index) => {
          console.log('Rendering message:', index, msg);
          return (
            <div key={index} className={`message ${msg.sender}`}>
              <div className="message-bubble">
                <div className="message-text">{msg.text}</div>
                {msg.suggestions && (
                  <div className="suggestions">
                    {msg.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        className="suggestion-button"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        {isLoading && (
          <div className="message bot">
            <div className="message-bubble">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
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
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={isConnected ? "Ask a question about Suryateja..." : "Connecting..."}
            disabled={isLoading || !isConnected || isInitializing}
            className="chat-input-field"
          />
          <button 
            className="chat-send-btn"
            onClick={() => {
              console.log('Send button clicked');
              handleSendMessage();
            }}
            disabled={isLoading || inputValue.trim() === '' || !isConnected || isInitializing}
            type="button"
          >
            {isLoading ? (
              <div className="loading-spinner"></div>
            ) : (
              <FiSend size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
