import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { motion } from 'framer-motion';

const ProgressTracker = () => {
  const { progressPercentage, currentPhase, xp, level } = useAppStore();

  return (
    <div className="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest">PHASE {currentPhase || 1}</span>
              <span className="text-xs font-bold text-gray-500">{progressPercentage}% JOURNEY COMPLETE</span>
            </div>
            <div className="h-1.5 w-24 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-teal-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 bg-teal-50 dark:bg-teal-900/20 px-4 py-1.5 rounded-full border border-teal-100 dark:border-teal-800">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-teal-800 dark:text-teal-300 uppercase">LVL {level}</span>
              <div className="h-1.5 w-20 bg-teal-200 dark:bg-teal-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-teal-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${xp % 100}%` }}
                />
              </div>
            </div>
            <span className="text-[10px] font-black text-teal-800 dark:text-teal-300">{xp} XP</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
