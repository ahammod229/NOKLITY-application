import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Icon } from './Icon';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

interface ChatbotProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, setIsOpen }) => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I'm your NOKLITY shopping assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const userMessage = inputValue.trim();
    if (!userMessage || isLoading) return;

    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setInputValue('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userMessage,
      });

      const botMessage = response.text;
      setMessages(prev => [...prev, { text: botMessage, sender: 'bot' }]);
    } catch (error) {
      console.error("Error communicating with Gemini API:", error);
      setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting. Please try again later.", sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Bubble Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden md:block fixed bottom-5 right-5 bg-noklity-red text-white rounded-full p-4 shadow-lg hover:bg-red-700 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-noklity-red z-50"
        aria-label="Toggle chat"
      >
        <Icon name="chat" className="w-8 h-8" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-5 w-96 max-w-[calc(100vw-2.5rem)] h-[32rem] bg-white rounded-lg shadow-2xl flex flex-col z-50 transition-transform transform origin-bottom-right">
          {/* Header */}
          <div className="bg-gray-800 text-white p-4 rounded-t-lg flex justify-between items-center flex-shrink-0">
            <h3 className="font-semibold text-lg">NOKLITY Assistant</h3>
            <button onClick={() => setIsOpen(false)} aria-label="Close chat">
              <Icon name="x" className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-800 border'
                    }`}
                  >
                    <p className="text-sm break-words">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                 <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg px-4 py-2 bg-white border">
                        <div className="flex items-center space-x-1">
                           <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
	                         <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
	                         <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></span>
                        </div>
                    </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white rounded-b-lg">
            <form onSubmit={handleSendMessage} className="flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-noklity-red"
                autoComplete="off"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="ml-3 bg-noklity-red text-white rounded-full p-3 hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                disabled={isLoading || !inputValue.trim()}
                aria-label="Send message"
              >
                 <Icon name="send" className="w-5 h-5"/>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;