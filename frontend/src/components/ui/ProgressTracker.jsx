import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { motion } from 'framer-motion';

const ProgressTracker = () => {
  const { progressPercentage, currentPhase } = useAppStore();

  return (
    <div className="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3 flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            <span>Phase {currentPhase || 1}</span>
            <span>{progressPercentage}% Completed</span>
          </div>
          
          <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-teal-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
