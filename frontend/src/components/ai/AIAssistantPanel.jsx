import React, { useState, useEffect } from 'react';
import { X, Send, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { askAI } from '../../services/api';
import { useAppStore } from '../../store/useAppStore';

const AIAssistantPanel = ({ isOpen, onClose }) => {
  const { currentPhase, language } = useAppStore();
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your AI guide for voter registration. I use official ECI rules to answer your questions. What would you like to know?", sender: "ai" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.getElementById('chat-bottom')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen]);

  const phaseMap = ['intro', 'eligibility', 'residence', 'documents', 'registration', 'status', 'quiz', 'sources'];
  const phaseName = phaseMap[currentPhase] || 'general';

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = input;
    setMessages(prev => [...prev, { text: userMessage, sender: "user" }]);
    setInput('');
    setLoading(true);

    try {
      const response = await askAI(userMessage, phaseName, { language });
      
      let aiText = response.answer;
      if (response.sources && response.sources.length > 0) {
        aiText += "\n\nSources:";
        response.sources.forEach(src => {
          aiText += `\n• ${src.title}`;
        });
      }

      setMessages(prev => [...prev, { 
        text: aiText, 
        sender: "ai", 
        sources: response.sources 
      }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { 
        text: "I'm having trouble connecting to my brain. Please try again in a moment.", 
        sender: "ai" 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
          className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white dark:bg-gray-900 shadow-2xl z-50 border-l border-gray-200 dark:border-gray-800 flex flex-col sm:pt-16 lg:pt-0 lg:h-[calc(100vh-4rem)] lg:top-16"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-teal-100 dark:bg-teal-900/50 p-2 rounded-lg text-teal-600 dark:text-teal-400">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white leading-none">ECI Guide AI</h3>
                <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">Online</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors lg:hidden z-50">
              <X size={24} />
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-2xl shadow-sm max-w-[85%] text-sm whitespace-pre-wrap ${
                  msg.sender === 'user' 
                    ? 'bg-teal-600 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div id="chat-bottom"></div>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex-shrink-0 mb-4 sm:mb-0">
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about rules or documents..." 
                className="w-full bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-teal-500 focus:bg-white dark:focus:bg-gray-900 rounded-full py-3 pl-4 pr-12 text-sm text-gray-900 dark:text-white placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
              <button 
                onClick={handleSend}
                className="absolute right-2 bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-full transition-colors flex items-center justify-center h-8 w-8"
              >
                <Send size={14} />
              </button>
            </div>
            <p className="text-[10px] text-center text-gray-400 mt-2">
              AI answers based on ECI guidelines. Official decisions rest with ECI.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIAssistantPanel;
