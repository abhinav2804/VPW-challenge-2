import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { Award, Star, ShieldCheck, Zap, Info, X } from 'lucide-react';
import confetti from 'canvas-confetti';

const levelWisdom = {
  2: {
    title: "Rising Citizen",
    fact: "Did you know? In India, the voting age was reduced from 21 to 18 in 1988 to encourage youth participation in democracy.",
    message: "You're starting to understand the power of your signature. Registration is the first step to leadership."
  },
  3: {
    title: "Guardian of Democracy",
    fact: "India is the world's largest democracy with over 900 million registered voters. Your single vote is a crucial piece of this massive puzzle.",
    message: "Consistency is key. By learning these rules, you're becoming a responsible pillar of your community."
  },
  4: {
    title: "Elite Elector",
    fact: "The 'None of the Above' (NOTA) option allows you to express your dissent officially. Even if you don't like any candidate, showing up still matters.",
    message: "You've mastered the complex forms. Now you can help your family and friends register correctly too!"
  },
  5: {
    title: "Master of Enrolment",
    fact: "Article 326 of the Constitution of India grants us 'Universal Adult Suffrage'. It is a right earned through history, use it wisely.",
    message: "You are now a Form 6 Expert. Your maturity in understanding the electoral process is truly commendable."
  }
};

const LevelUpModal = () => {
  const { level } = useAppStore();
  const [show, setShow] = useState(false);
  const [lastLevel, setLastLevel] = useState(level);

  useEffect(() => {
    if (level > lastLevel && level > 1) {
      setShow(true);
      setLastLevel(level);
      triggerCelebration();
    }
  }, [level, lastLevel]);

  const triggerCelebration = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const wisdom = levelWisdom[level] || levelWisdom[2];

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-teal-950/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl overflow-hidden border-4 border-teal-500"
          >
            {/* Top Pattern */}
            <div className="h-32 bg-gradient-to-br from-teal-600 to-indigo-700 flex items-center justify-center relative overflow-hidden">
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute opacity-10"
              >
                <Star size={200} />
              </motion.div>
              <div className="bg-white/20 backdrop-blur-xl p-4 rounded-full border border-white/30 shadow-2xl">
                <Award size={48} className="text-white" />
              </div>
            </div>

            <button 
              onClick={() => setShow(false)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
            >
              <X size={20} />
            </button>

            <div className="p-8 sm:p-10 text-center">
              <span className="inline-block px-4 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">Level Up Achieved!</span>
              <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2 italic">Level {level}: {wisdom.title}</h2>
              <p className="text-gray-500 dark:text-gray-400 font-bold mb-8">{wisdom.message}</p>

              <div className="bg-teal-50 dark:bg-teal-950/30 rounded-[2rem] p-6 border-2 border-dashed border-teal-200 dark:border-teal-800 relative text-left">
                <div className="absolute -top-3 left-6 bg-teal-600 text-white text-[10px] font-black px-3 py-1 rounded-lg flex items-center gap-2 shadow-lg">
                  <Zap size={12} fill="currentColor" /> DID YOU KNOW?
                </div>
                <p className="text-teal-900 dark:text-teal-100 text-sm font-bold leading-relaxed pt-2">
                  {wisdom.fact}
                </p>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setShow(false)}
                  className="bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-teal-500/30 active:scale-95"
                >
                  Continue Mission
                </button>
                <button 
                  className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <ShieldCheck size={16} /> Share Rank
                </button>
              </div>
            </div>
            
            {/* Background elements */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LevelUpModal;
