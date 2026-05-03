import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { Zap } from 'lucide-react';

const AchievementToaster = () => {
  const { achievements, removeAchievement } = useAppStore();

  useEffect(() => {
    if (achievements.length > 0) {
      const timer = setTimeout(() => {
        removeAchievement(achievements[achievements.length - 1].id);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [achievements, removeAchievement]);

  return (
    <div className="fixed bottom-24 left-8 z-[60] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {achievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.9 }}
            className="bg-teal-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border-2 border-white/20 backdrop-blur-md"
          >
            <div className="bg-white/20 p-1.5 rounded-lg">
              <Zap size={16} fill="currentColor" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest">{achievement.text}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default AchievementToaster;
