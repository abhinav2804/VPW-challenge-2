import React from 'react';
import { MessageSquareText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingAIAssistantButton = ({ onClick, isOpen }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-16 right-0 w-48 bg-white dark:bg-gray-800 text-sm p-3 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 mb-2 pointer-events-none"
          >
            <div className="text-gray-800 dark:text-gray-200 font-medium">Need help?</div>
            <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">Ask the ECI Assistant</div>
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white dark:bg-gray-800 border-b border-r border-gray-100 dark:border-gray-700 transform rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`p-4 rounded-full shadow-xl text-white transition-colors duration-300 flex items-center justify-center ${
          isOpen ? 'bg-gray-800 hover:bg-gray-700' : 'bg-teal-600 hover:bg-teal-700'
        }`}
        aria-label="Toggle AI Assistant"
      >
        {isOpen ? <X size={24} /> : <MessageSquareText size={24} />}
      </motion.button>
    </div>
  );
};

export default FloatingAIAssistantButton;
